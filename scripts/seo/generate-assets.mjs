#!/usr/bin/env node
/**
 * Registry SSOT → public/sitemap.xml, public/robots.txt, public/llms.txt
 * lastmod = git içerik zamanı (sitemap-core). Build saati YASAK.
 * Markdown önce üretilir; llms.txt yalnız mevcut .md (veya resmi dış URL) işaret eder.
 * llms-full.txt üretilmez. /llm.txt yazılmaz (Firebase 301 → /llms.txt).
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadSeo, canonicalUrl, sourceById } from "./load.mjs";
import { generateSitemap } from "./sitemap-core.mjs";
import { generateMarkdown } from "./generate-markdown.mjs";
import { markdownPathForRoute, publicSource } from "./ai-paths.mjs";

const bundle = loadSeo();
const { config, legalSources, registry, aiPolicy, aiResources } = bundle;
const host = config.canonicalHost.replace(/\/$/, "");

const ROBOTS_ORDER = [
  { ua: "Googlebot", group: "search" },
  { ua: "Bingbot", group: "search" },
  { ua: "OAI-SearchBot", group: "search" },
  { ua: "ChatGPT-User", group: "search" },
  { ua: "GPTBot", group: "training" },
  { ua: "Claude-SearchBot", group: "search" },
  { ua: "Claude-User", group: "search" },
  { ua: "ClaudeBot", group: "training" },
  { ua: "PerplexityBot", group: "search" },
  { ua: "Google-Extended", group: "training" },
];

function normalizedPrivateDisallow(policy) {
  const entries = policy.privateDisallow ?? [];
  if (!Array.isArray(entries)) throw new Error("ai-policy.privateDisallow dizi olmalı");
  return entries.map((route) => {
    if (typeof route !== "string" || !route.startsWith("/")) {
      throw new Error(`ai-policy geçersiz private route: ${String(route)}`);
    }
    return route;
  });
}

export function buildRobotsTxt(policy) {
  const lines = [
    "# SKDMHesapla crawler policy — generated from data/seo/ai-policy.json",
    "# Search/retrieval açık; training ayrı. robots güvenlik duvarı değildir.",
    "# _next/ Disallow edilmez (render CSS/JS).",
    "# Kişisel veri / hesap / ödeme auth ile korunur; aşağıdaki kurallar ek crawl sınırıdır.",
    "",
  ];
  const privateDisallow = normalizedPrivateDisallow(policy);
  for (const row of ROBOTS_ORDER) {
    const action = row.group === "search" ? policy.search[row.ua] : policy.training[row.ua];
    if (!action) throw new Error(`ai-policy eksik: ${row.group}.${row.ua}`);
    lines.push(`User-agent: ${row.ua}`);
    if (action === "allow") {
      lines.push("Allow: /");
      for (const route of privateDisallow) lines.push(`Disallow: ${route}`);
    } else {
      lines.push("Disallow: /");
    }
    lines.push("");
  }
  lines.push("User-agent: *", "Allow: /");
  for (const route of privateDisallow) lines.push(`Disallow: ${route}`);
  lines.push("");
  lines.push(`Sitemap: ${host}/sitemap.xml`, "");
  return lines.join("\n");
}

function writeRobots() {
  if (!aiPolicy) throw new Error("data/seo/ai-policy.json zorunlu");
  fs.writeFileSync(path.join(ROOT, "public/robots.txt"), buildRobotsTxt(aiPolicy));
}

function resourceUrl(res, srcMap) {
  if (res.sourceId) {
    const s = srcMap.get(res.sourceId);
    if (!s) throw new Error(`llms official source yok: ${res.sourceId}`);
    if (!publicSource(s)) throw new Error(`llms internal source sızıntısı: ${res.sourceId}`);
    return s.url;
  }
  if (!res.route) throw new Error("llms resource route/sourceId yok");
  if (res.markdownEnabled) return `${host}${markdownPathForRoute(res.route)}`;
  return canonicalUrl(config, res.route);
}

function eligibleForLlms(res, byRoute) {
  if (!res.llmsInclude) return false;
  if (res.sourceId) return true;
  const e = byRoute.get(res.route);
  if (!e) throw new Error(`llms: registry'de yok ${res.route}`);
  if (e.state !== "PUBLISHED_INDEXABLE") return false;
  if (e.role === "application") return false;
  const privateNeed = ["/giris/", "/kayit/", "/hesabim/", "/admin/", "/v/"];
  if (privateNeed.includes(e.route)) return false;
  if (res.llmsSection !== "optional") {
    if (!e.intentOwner) return false;
    if (e.legalClaims && !e.humanReviewedAt) return false;
  }
  return true;
}

function platformCapabilitiesBlock() {
  const capabilityPath = path.join(ROOT, "data/seo/platform-capabilities.json");
  if (!fs.existsSync(capabilityPath)) return [];
  const capabilities = JSON.parse(fs.readFileSync(capabilityPath, "utf8"));
  if (!capabilities.heading || !capabilities.summary || !Array.isArray(capabilities.items)) {
    throw new Error("platform-capabilities.json geçersiz");
  }
  const route = capabilities.route || "/platform-kabiliyetleri/";
  const capabilityUrl = canonicalUrl(config, route);
  const lines = [
    `## ${capabilities.heading}`,
    "",
    capabilities.summary,
    "",
    `- [Platform kabiliyetlerini ayrıntılı incele](${capabilityUrl}): GTİP/CN kapsam kontrolünden precursor ve tedarikçi verisine, hesaplama izinden denetime hazırlık paketine kadar uçtan uca ürün kabiliyetleri.`,
    "",
  ];
  for (const item of capabilities.items) {
    if (!item.title || !item.description) throw new Error("platform capability title/description zorunlu");
    lines.push(`${item.title}: ${item.description}`);
  }
  if (capabilities.verificationUpdate) lines.push("", `Güncel doğrulama çerçevesi: ${capabilities.verificationUpdate}`);
  if (capabilities.limitations) lines.push("", `Sınır: ${capabilities.limitations}`);
  lines.push("");
  return lines;
}

export function buildLlmsTxt() {
  const srcMap = sourceById(legalSources);
  const byRoute = new Map(registry.entries.map((e) => [e.route, e]));
  const included = aiResources.resources
    .filter((r) => eligibleForLlms(r, byRoute))
    .sort((a, b) => a.llmsPriority - b.llmsPriority);

  const bySection = new Map();
  for (const sec of aiResources.sections) bySection.set(sec.id, []);
  for (const res of included) {
    const list = bySection.get(res.llmsSection);
    if (!list) throw new Error(`llms unknown section ${res.llmsSection}`);
    const url = resourceUrl(res, srcMap);
    if (res.markdownEnabled) {
      const mdPath = path.join(ROOT, "public", markdownPathForRoute(res.route));
      if (!fs.existsSync(mdPath)) {
        throw new Error(`llms markdown yok (önce generate-markdown): ${res.route}`);
      }
    }
    list.push(`- [${res.llmsTitle}](${url}): ${res.llmsDescription}`);
  }

  const parts = [
    `# ${aiResources.siteName}`,
    "",
    `> ${aiResources.siteSummary}`,
    "",
    aiResources.intro.join("\n\n"),
    "",
    ...platformCapabilitiesBlock(),
  ];
  for (const sec of aiResources.sections) {
    const items = bySection.get(sec.id) || [];
    if (items.length === 0) continue;
    parts.push(`## ${sec.heading}`, "", ...items, "");
  }
  let txt = parts.join("\n");
  if (!txt.endsWith("\n")) txt += "\n";
  if (txt.charCodeAt(0) === 0xfeff) txt = txt.slice(1);
  return txt;
}

function writeLlms() {
  if (aiPolicy && aiPolicy.llms?.enabled === false) return;
  fs.writeFileSync(path.join(ROOT, "public/llms.txt"), buildLlmsTxt());

  const pointer = path.join(ROOT, "public/llm.txt");
  if (fs.existsSync(pointer)) fs.unlinkSync(pointer);

  const fullPath = path.join(ROOT, "public/llms-full.txt");
  if (fs.existsSync(fullPath)) {
    if (config.llmsFullEnabled) {
      throw new Error("llms-full.txt üretimi V8'de KAPALI");
    }
    fs.unlinkSync(fullPath);
  }
}

const md = generateMarkdown(bundle);
const sm = generateSitemap(config, registry);
writeRobots();
writeLlms();
for (const w of sm.warnings) console.warn("WARN", w);
console.log(
  `seo assets: sitemap ${sm.count} URL, markdown ${md.count}, robots, llms.txt, hash ${sm.report.status} ${sm.report.sha256.slice(0, 12)}`,
);
