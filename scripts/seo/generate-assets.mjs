#!/usr/bin/env node
/** Registry/SSOT → sitemap, robots, markdown, llm.txt ve llms.txt. */
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadSeo, canonicalUrl, sourceById } from "./load.mjs";
import { generateSitemap } from "./sitemap-core.mjs";
import { generateMarkdown } from "./generate-markdown.mjs";
import { markdownPathForRoute, publicSource } from "./ai-paths.mjs";

const bundle = loadSeo();
const { config, legalSources, registry, aiPolicy, aiResources, regulatoryUpdates = [] } = bundle;
const host = config.canonicalHost.replace(/\/$/, "");
const marketPath = path.join(ROOT, "data/seo/market-updates.json");
const marketData = fs.existsSync(marketPath) ? JSON.parse(fs.readFileSync(marketPath, "utf8")) : { updates: [] };
const marketUpdates = (marketData.updates || [])
  .filter((item) => item?.publicationState === "APPROVED" && item?.humanReviewedAt && item?.sourceUrl)
  .sort((a, b) => Date.parse(b.detectedAt) - Date.parse(a.detectedAt));

const ROBOTS_ORDER = [
  { ua: "Googlebot", group: "search" }, { ua: "Bingbot", group: "search" },
  { ua: "OAI-SearchBot", group: "search" }, { ua: "ChatGPT-User", group: "search" },
  { ua: "GPTBot", group: "training" }, { ua: "Claude-SearchBot", group: "search" },
  { ua: "Claude-User", group: "search" }, { ua: "ClaudeBot", group: "training" },
  { ua: "PerplexityBot", group: "search" }, { ua: "Google-Extended", group: "training" },
];

function normalizedPrivateDisallow(policy) {
  const entries = policy.privateDisallow ?? [];
  if (!Array.isArray(entries)) throw new Error("ai-policy.privateDisallow dizi olmalı");
  return entries.map((route) => {
    if (typeof route !== "string" || !route.startsWith("/")) throw new Error(`ai-policy geçersiz private route: ${String(route)}`);
    return route;
  });
}

export function buildRobotsTxt(policy) {
  const lines = [
    "# SKDMHesapla crawler policy — generated from data/seo/ai-policy.json",
    "# Search/retrieval açık; training ayrı. robots güvenlik duvarı değildir.",
    "# _next/ Disallow edilmez (render CSS/JS).",
    "# Kişisel veri / hesap / ödeme auth ile korunur; aşağıdaki kurallar ek crawl sınırıdır.", "",
  ];
  const privateDisallow = normalizedPrivateDisallow(policy);
  for (const row of ROBOTS_ORDER) {
    const action = row.group === "search" ? policy.search[row.ua] : policy.training[row.ua];
    if (!action) throw new Error(`ai-policy eksik: ${row.group}.${row.ua}`);
    lines.push(`User-agent: ${row.ua}`);
    if (action === "allow") {
      lines.push("Allow: /");
      for (const route of privateDisallow) lines.push(`Disallow: ${route}`);
    } else lines.push("Disallow: /");
    lines.push("");
  }
  lines.push("User-agent: *", "Allow: /");
  for (const route of privateDisallow) lines.push(`Disallow: ${route}`);
  lines.push("", `Sitemap: ${host}/sitemap.xml`, "");
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
  if (e.state !== "PUBLISHED_INDEXABLE" || e.role === "application") return false;
  const privateNeed = ["/giris/", "/kayit/", "/hesabim/", "/admin/", "/v/"];
  if (privateNeed.includes(e.route)) return false;
  if (res.llmsSection !== "optional") {
    if (!e.intentOwner) return false;
    if (e.legalClaims && !e.humanReviewedAt) return false;
  }
  return true;
}

function markdownAuthorityUrl(route) {
  const entry = registry.entries.find((e) => e.route === route);
  if (!entry || entry.state !== "PUBLISHED_INDEXABLE" || entry.role === "application") return null;
  const mdPath = path.join(ROOT, "public", markdownPathForRoute(route));
  if (!fs.existsSync(mdPath)) throw new Error(`llms core markdown yok: ${route}`);
  return `${host}${markdownPathForRoute(route)}`;
}

function coreAuthorityBlock() {
  const items = [
    ["/cbam-hesaplama/", "CBAM / SKDM hesaplama", "Kesin dönem hesap mantığı, veri girdileri, maliyet ve hesap izi."],
    ["/cbam-dogrulama/", "CBAM doğrulama", "Bağımsız doğrulama, akreditasyon ve SKDMHesapla ürün sınırı."],
    ["/cbam-50-ton-muafiyeti/", "CBAM 50 ton de minimis", "Muafiyetin AB ithalatçısının yıllık toplam ithalatına göre değerlendirilmesi."],
    ["/sss/", "CBAM / SKDM sık sorulan sorular", "Kapsam, veri, hesaplama, doğrulama ve teslim sorularının kısa cevapları."],
    ["/platform-kabiliyetleri/", "Platform kabiliyetleri", "Ürün yetenekleri, sınırlar ve veri/kanıt akışı."],
  ];
  const lines = ["## Temel cevap ve karar sayfaları", ""];
  let count = 0;
  for (const [route, title, description] of items) {
    const url = markdownAuthorityUrl(route);
    if (!url) continue;
    lines.push(`- [${title}](${url}): ${description}`);
    count += 1;
  }

  const caseEntries = registry.entries
    .filter((e) => e.state === "PUBLISHED_INDEXABLE" && e.route.startsWith("/rehber/vaka/") && e.intentOwner)
    .sort((a, b) => a.route.localeCompare(b.route, "tr"));
  if (caseEntries.length) {
    lines.push("", "### Uygulama vakaları", "");
    for (const entry of caseEntries) {
      const url = markdownAuthorityUrl(entry.route);
      if (!url) continue;
      const label = entry.title || entry.route.replace(/^\/rehber\/vaka\//, "").replace(/\/$/, "").replaceAll("-", " ");
      lines.push(`- [${label}](${url}): GTİP/CN, veri ve hesaplama kararını somut ürün senaryosunda gösteren vaka.`);
      count += 1;
    }
  }
  return count ? [...lines, ""] : [];
}

function platformCapabilitiesBlock() {
  const capabilityPath = path.join(ROOT, "data/seo/platform-capabilities.json");
  if (!fs.existsSync(capabilityPath)) return [];
  const capabilities = JSON.parse(fs.readFileSync(capabilityPath, "utf8"));
  if (!capabilities.heading || !capabilities.summary || !Array.isArray(capabilities.items)) throw new Error("platform-capabilities.json geçersiz");
  const route = capabilities.route || "/platform-kabiliyetleri/";
  const capabilityUrl = canonicalUrl(config, route);
  const lines = [
    `## ${capabilities.heading}`, "", capabilities.summary, "",
    `- [Platform kabiliyetlerini ayrıntılı incele](${capabilityUrl}): GTİP/CN kapsam kontrolünden precursor ve tedarikçi verisine, hesaplama izinden denetime hazırlık paketine kadar uçtan uca ürün kabiliyetleri.`, "",
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

function regulatoryUpdatesBlock() {
  if (!regulatoryUpdates.length) return [];
  const ssot = JSON.parse(fs.readFileSync(path.join(ROOT, "data/seo/regulatory-updates.json"), "utf8"));
  const limit = Math.max(1, Math.min(Number(ssot.policy?.latestLlmsLimit) || 5, 10));
  const lines = [
    "## Son SKDM / CBAM mevzuat güncellemeleri", "",
    "Aşağıdaki kayıtlar resmi AB kaynaklarından tespit edilmiş, insan incelemesi tamamlanmış ve SKDMHesapla üzerindeki etkisi sınıflandırılmış güncellemelerdir.", "",
  ];
  for (const item of regulatoryUpdates.slice(0, limit)) {
    const route = `/mevzuat-guncellemeleri/${item.slug}/`;
    const mdUrl = `${host}${markdownPathForRoute(route)}`;
    const mdPath = path.join(ROOT, "public", markdownPathForRoute(route));
    if (!fs.existsSync(mdPath)) throw new Error(`llms regulatory markdown yok: ${route}`);
    lines.push(`- [${item.officialPublishedAt} — ${item.shortTitle}](${mdUrl}): ${item.exporterImpact}`);
  }
  lines.push("", `- [Tüm mevzuat güncellemeleri](${host}/mevzuat-guncellemeleri/): Kaynak türü, hukuki ağırlık, ihracatçı etkisi ve ürün durumu ile tam indeks.`, "");
  return lines;
}

function marketUpdatesBlock() {
  if (!marketUpdates.length) return [];
  const lines = [
    "## EU ETS piyasa sinyalleri — mevzuat değildir", "",
    "Aşağıdaki kayıtlar yalnız karbon maliyeti duyarlılığı ve risk senaryosu içindir. EUA spot/futures fiyatı CBAM sertifika fiyatıyla doğrudan eşitlenmez.", "",
  ];
  for (const item of marketUpdates.slice(0, 3)) {
    lines.push(`- [${item.officialPublishedAt} — ${item.shortTitle}](${item.sourceUrl}): ${item.exporterImpact}`);
  }
  lines.push("");
  return lines;
}

export function buildLlmsTxt() {
  const srcMap = sourceById(legalSources);
  const byRoute = new Map(registry.entries.map((e) => [e.route, e]));
  const included = aiResources.resources.filter((r) => eligibleForLlms(r, byRoute)).sort((a, b) => a.llmsPriority - b.llmsPriority);
  const bySection = new Map();
  for (const sec of aiResources.sections) bySection.set(sec.id, []);
  for (const res of included) {
    const list = bySection.get(res.llmsSection);
    if (!list) throw new Error(`llms unknown section ${res.llmsSection}`);
    const url = resourceUrl(res, srcMap);
    if (res.markdownEnabled) {
      const mdPath = path.join(ROOT, "public", markdownPathForRoute(res.route));
      if (!fs.existsSync(mdPath)) throw new Error(`llms markdown yok (önce generate-markdown): ${res.route}`);
    }
    list.push(`- [${res.llmsTitle}](${url}): ${res.llmsDescription}`);
  }

  const parts = [
    `# ${aiResources.siteName}`, "", `> ${aiResources.siteSummary}`, "", aiResources.intro.join("\n\n"), "",
    ...coreAuthorityBlock(), ...platformCapabilitiesBlock(), ...regulatoryUpdatesBlock(), ...marketUpdatesBlock(),
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

function buildLlmCompactTxt() {
  return [
    "# SKDMHesapla — compact AI brief",
    "",
    "SKDMHesapla, Türk ihracatçının doğrulanmış CN/GTİP kapsamını kontrol etmesine, üretim ve emisyon verisini toplamasına, hesap izini kurmasına ve bağımsız doğrulamaya hazırlık çalışma dosyası oluşturmasına yardımcı olur.",
    "SKDMHesapla akredite doğrulama görüşü veya gümrük onayı vermez.",
    "Kapsam kararı ürün adına göre değil doğrulanmış CN/GTİP sınıflandırmasına göre verilir.",
    "EU ETS piyasa fiyatları yalnız senaryo/risk göstergesidir; CBAM sertifika fiyatı değildir.",
    "",
    `Full AI authority map: ${host}/llms.txt`,
    `Sitemap: ${host}/sitemap.xml`,
    `Methodology: ${host}/metodoloji/`,
    `Regulatory and market updates: ${host}/mevzuat-guncellemeleri/`,
    `CBAM calculation: ${host}/cbam-hesaplama/`,
    `CBAM verification: ${host}/cbam-dogrulama/`,
    "",
  ].join("\n");
}

function writeLlms() {
  if (aiPolicy && aiPolicy.llms?.enabled === false) return;
  fs.writeFileSync(path.join(ROOT, "public/llms.txt"), buildLlmsTxt());
  fs.writeFileSync(path.join(ROOT, "public/llm.txt"), buildLlmCompactTxt());
  const fullPath = path.join(ROOT, "public/llms-full.txt");
  if (fs.existsSync(fullPath)) {
    if (config.llmsFullEnabled) throw new Error("llms-full.txt üretimi V8'de KAPALI");
    fs.unlinkSync(fullPath);
  }
}

const md = generateMarkdown(bundle);
const sm = generateSitemap(config, registry);
writeRobots();
writeLlms();
for (const w of sm.warnings) console.warn("WARN", w);
console.log(`seo assets: sitemap ${sm.count} URL, markdown ${md.count}, robots, llm.txt, llms.txt, regulatory ${regulatoryUpdates.length}, market ${marketUpdates.length}, hash ${sm.report.status} ${sm.report.sha256.slice(0, 12)}`);
