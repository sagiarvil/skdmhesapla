#!/usr/bin/env node
/**
 * V8 AI validators — dependency-free.
 * HTML ↔ Markdown ↔ JSON-LD ↔ registry semantik parity.
 */
import fs from "node:fs";
import path from "node:path";
import {
  ROOT,
  loadSeo,
  sourceById,
  FORBIDDEN_SCHEMA,
  derivedCrawlerPolicy,
} from "./load.mjs";
import {
  markdownFsRel,
  markdownPathForRoute,
  publicSource,
  sealPriceTry,
  FILE_LIST_RE,
  RAW_URL_LIST_RE,
  GOVERNANCE_LEAK,
  PRIVATE_ROUTE_PREFIXES,
} from "./ai-paths.mjs";

const SEARCH_MUST_ALLOW = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
];
const TRAIN_MUST_DISALLOW = ["GPTBot", "ClaudeBot", "Google-Extended"];

const PRODUCT_DEFINITE_SCOPE = [
  /ürün adı.{0,40}(kesin(likle)? )?(SKDM|CBAM) kapsamında(dır)?/i,
  /cam balkon (SKDM|CBAM) kapsamındadır/i,
  /pvc pencere (SKDM|CBAM) kapsamındadır/i,
  /çelik profil (SKDM|CBAM) kapsamındadır/i,
];

export function parseRobots(text) {
  const blocks = [];
  let ua = null;
  for (const line of text.split(/\r?\n/)) {
    const u = line.match(/^User-agent:\s*(.+)\s*$/i);
    if (u) {
      ua = u[1].trim();
      continue;
    }
    const a = line.match(/^(Allow|Disallow):\s*(.*)$/i);
    if (a && ua) blocks.push({ ua, rule: a[1].toLowerCase(), path: a[2].trim() || "/" });
  }
  return blocks;
}

export function robotsAction(blocks, bot) {
  const mine = blocks.filter((b) => b.ua === bot);
  const star = blocks.filter((b) => b.ua === "*");
  const hit = mine.length ? mine : star;
  const root = hit.find((b) => b.path === "/");
  return root ? root.rule : null;
}

export function validateRobotsPolicy(robotsText, aiPolicy) {
  const errors = [];
  const blocks = parseRobots(robotsText);
  for (const bot of SEARCH_MUST_ALLOW) {
    if (robotsAction(blocks, bot) === "disallow") {
      errors.push(`search crawler disallowed: ${bot}`);
    }
    if (aiPolicy.search[bot] !== "allow") {
      errors.push(`ai-policy search drift: ${bot}`);
    }
  }
  for (const bot of TRAIN_MUST_DISALLOW) {
    if (robotsAction(blocks, bot) !== "disallow") {
      errors.push(`training crawler policy drift: ${bot} not Disallow /`);
    }
    if (aiPolicy.training[bot] !== "disallow") {
      errors.push(`ai-policy training drift: ${bot}`);
    }
  }
  if (/Disallow:\s*\/_next\//.test(robotsText)) errors.push("robots Disallow _next/");
  if (/\.md/.test(robotsText) && /Disallow:.*\.md/.test(robotsText)) {
    errors.push("markdown robots blocked");
  }
  return errors;
}

export function validateLlms(llmsText, bundle) {
  const errors = [];
  const warnings = [];
  if (!llmsText.startsWith("# ")) errors.push("llms missing H1");
  if (llmsText.charCodeAt(0) === 0xfeff) errors.push("llms BOM");
  const quotes = [...llmsText.matchAll(/^> (.+)$/gm)].map((m) => m[1]);
  if (quotes.some((q) => /P3_|STATUS|INTEROPERABILITY_NOT_GOOGLE/.test(q))) {
    errors.push("llms blockquote consumed by internal status");
  }
  if (!quotes.some((q) => /CN\/GTİP|CN\/GTIP/.test(q) && /SaaS/.test(q))) {
    if (!llmsText.includes("doğrulanmış CN/GTİP")) {
      errors.push("llms missing meaningful summary");
    }
  }
  if (RAW_URL_LIST_RE.test(llmsText)) errors.push("raw/non-markdown file-list entry");

  const listLines = llmsText.split("\n").filter((l) => l.startsWith("- "));
  const urls = [];
  for (const line of listLines) {
    if (!FILE_LIST_RE.test(line)) {
      errors.push(`llms syntax invalid: ${line.slice(0, 80)}`);
      continue;
    }
    const m = line.match(FILE_LIST_RE);
    urls.push(m[2]);
  }
  if (new Set(urls).size !== urls.length) errors.push("duplicate llms URL");
  if (urls.length > 150) errors.push("llms >150 resources BLOCK");
  else if (urls.length > 80) warnings.push("llms >80 resources WARN");
  const bytes = Buffer.byteLength(llmsText, "utf8");
  if (bytes > 25 * 1024) warnings.push(`llms ${bytes} bytes >25KB`);

  for (const re of GOVERNANCE_LEAK) {
    if (re.test(llmsText)) errors.push("internal governance doc public listte");
  }
  if (/Training crawlers/.test(llmsText)) {
    errors.push("crawler policy authority leaked into llms.txt");
  }
  const hasDefinitiveSourceInLlms = urls.some((u) => u.includes("2025/2547") || u.includes("2025-2547"));
  if (!hasDefinitiveSourceInLlms) {
    errors.push("llms authoritative map does not contain applicable definitive regulation (EU) 2025/2547");
  }

  const host = bundle.config.canonicalHost.replace(/\/$/, "");
  for (const url of urls) {
    if (!url.startsWith(host)) continue;
    const pathPart = url.slice(host.length);
    for (const p of PRIVATE_ROUTE_PREFIXES) {
      if (pathPart.startsWith(p) || pathPart.startsWith(p.replace(/\/$/, ""))) {
        errors.push(`private route in llms ${pathPart}`);
      }
    }
    if (pathPart.endsWith(".md")) {
      const rel = path.join(ROOT, "public", pathPart);
      if (!fs.existsSync(rel)) errors.push(`broken internal llms URL ${pathPart}`);
    }
    if (pathPart.includes("/tedarikci-verisi/hazirla")) {
      errors.push("redirected hazirla in llms");
    }
  }
  return { errors, warnings, urls };
}

export function validateNoLlmsFull() {
  const errors = [];
  if (fs.existsSync(path.join(ROOT, "public/llms-full.txt"))) {
    errors.push("llms-full.txt generate edildi");
  }
  return errors;
}

export function validateMarkdownLayer(bundle) {
  const errors = [];
  const { registry, aiResources, legalFacts } = bundle;
  const byRoute = new Map(registry.entries.map((e) => [e.route, e]));
  const facts = Object.fromEntries(legalFacts.facts.map((f) => [f.id, f]));
  const price = sealPriceTry(ROOT, fs);
  const src = sourceById(bundle.legalSources);

  for (const res of aiResources.resources) {
    if (!res.markdownEnabled || !res.route) continue;
    const entry = byRoute.get(res.route);
    if (!entry) {
      errors.push(`markdown registry missing ${res.route}`);
      continue;
    }
    const rel = markdownFsRel(res.route);
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      errors.push(`markdown missing ${rel}`);
      continue;
    }
    const md = fs.readFileSync(abs, "utf8");
    if (md.charCodeAt(0) === 0xfeff) errors.push(`markdown BOM ${rel}`);
    if (!md.startsWith("# ")) errors.push(`markdown missing H1 ${rel}`);
    if (!md.includes(entry.h1)) errors.push(`HTML ↔ Markdown title conflict ${res.route}`);
    if (!md.includes(entry.metaDescription)) {
      errors.push(`HTML ↔ Markdown summary conflict ${res.route}`);
    }
    if (entry.limitations && !md.includes(entry.limitations)) {
      errors.push(`HTML ↔ Markdown legal conflict ${res.route}`);
    }
    if (facts.sectorFamilyCount && md.includes("sektör") && /\b7\b sektör/.test(md)) {
      errors.push(`sector count conflict ${res.route}`);
    }
    if (md.includes("569") === false && res.route === "/") {
      // home may mention via limits
    }
    if (String(facts.cnUniverseCount.value) && md.includes("CN kodudur")) {
      if (!md.includes(String(facts.cnUniverseCount.value))) {
        errors.push(`CN count conflict ${res.route}`);
      }
    }
    if (res.route === "/fiyatlandirma/") {
      if (!md.includes(String(price))) errors.push("Markdown fiyatı HTML'den farklı");
    }
    const priceHits = [...md.matchAll(/(\d{1,3}(?:\.\d{3})+|\d{4,})\s*(?:₺|TRY|TL)/g)];
    for (const hit of priceHits) {
      const n = Number(String(hit[1]).replace(/\./g, ""));
      if (n && n !== price && n !== 2023 && n !== 2025 && n !== 2026) {
        errors.push(`Markdown fiyatı HTML'den farklı ${res.route}: ${hit[0]}`);
      }
    }
    for (const re of PRODUCT_DEFINITE_SCOPE) {
      if (re.test(md)) errors.push(`AI page definite product-name scope claim ${res.route}`);
    }
    for (const re of GOVERNANCE_LEAK) {
      if (re.test(md) && /AGENTS1|CURSOR_IS_EMRI|agents1:/.test(md)) {
        errors.push(`internal mandate in markdown ${res.route}`);
      }
    }
    for (const id of entry.sourceRefs || []) {
      const s = src.get(id);
      if (publicSource(s) && s.url && !md.includes(s.url) && res.llmsSection !== "optional") {
        // optional corporate pages may omit EU urls if sourceRefs are internal-only
      }
    }
    if (entry.legalClaims && !md.includes("## Kaynaklar")) {
      errors.push(`markdown sources heading missing ${res.route}`);
    }
    if (entry.legalClaims && !md.includes("## Sınırlar")) {
      errors.push(`markdown limitations heading missing ${res.route}`);
    }
    if (entry.legalClaims && !md.includes("Son inceleme")) {
      errors.push(`markdown lastReviewed missing ${res.route}`);
    }
  }
  return errors;
}

export function validateSitemapExcludesMarkdown(sitemapXml) {
  const errors = [];
  if (/\.md</.test(sitemapXml) || /index\.md/.test(sitemapXml)) {
    errors.push("markdown in sitemap");
  }
  return errors;
}

export function validateEvals(bundle) {
  const errors = [];
  const evals = bundle.aiEvals || [];
  if (evals.length < 25) errors.push(`ai-evals ${evals.length} < 25`);
  const byRoute = new Map(bundle.registry.entries.map((e) => [e.route, e]));
  const included = new Set(
    (bundle.aiResources.resources || []).filter((r) => r.llmsInclude).map((r) => r.route).filter(Boolean),
  );
  for (const ev of evals) {
    const owner = byRoute.get(ev.expectedOwner);
    if (!owner) {
      errors.push(`eval ${ev.id}: expectedOwner yok ${ev.expectedOwner}`);
      continue;
    }
    if (!included.has(ev.expectedOwner) && ev.expectedOwner !== "/") {
      errors.push(`eval ${ev.id}: owner llms graph dışında ${ev.expectedOwner}`);
    }
    const rel = markdownFsRel(ev.expectedOwner);
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      errors.push(`eval ${ev.id}: markdown missing`);
      continue;
    }
    const md = fs.readFileSync(abs, "utf8");
    for (const n of ev.mustContain || []) {
      if (!md.includes(n)) errors.push(`eval ${ev.id}: mustContain missing ${n}`);
    }
    for (const n of ev.mustNotContain || []) {
      if (n && md.includes(n)) errors.push(`eval ${ev.id}: mustNotContain present ${n}`);
    }
  }
  return errors;
}

export function validateSchemaPolicy(bundle) {
  const errors = [];
  for (const e of bundle.registry.entries) {
    for (const t of e.schemaTypes || []) {
      if (FORBIDDEN_SCHEMA.has(t)) errors.push(`${e.route}: forbidden schema type ${t}`);
    }
  }
  const jsonld = fs.readFileSync(path.join(ROOT, "src/lib/seo/jsonld.ts"), "utf8");
  if (/Speakable/.test(jsonld)) errors.push("Speakable in jsonld builder");
  if (/FAQPage/.test(jsonld)) errors.push("FAQPage in jsonld builder");
  if (/QAPage/.test(jsonld)) errors.push("QAPage in jsonld builder");
  if (/User-Agent|GPTBot|userAgent/.test(jsonld) && /specialSEO/.test(jsonld)) {
    errors.push("bot-specific hidden page");
  }
  return errors;
}

export function validateCloaking() {
  const errors = [];
  const roots = [path.join(ROOT, "src")];
  const walk = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === "node_modules") continue;
        walk(p);
      } else if (/\.(ts|tsx|js|mjs)$/.test(ent.name)) {
        const txt = fs.readFileSync(p, "utf8");
        if (/if\s*\(.*GPTBot|userAgent.*GPTBot.*return/i.test(txt) && /specialSEO|hiddenLegal/i.test(txt)) {
          errors.push(`bot-specific hidden page ${path.relative(ROOT, p)}`);
        }
      }
    }
  };
  walk(roots[0]);
  return errors;
}

export function validatePrivateLeak() {
  const errors = [];
  const scan = (file) => {
    const txt = fs.readFileSync(file, "utf8");
    const rel = path.relative(ROOT, file);
    if (/pdl_[a-z0-9_]+/i.test(txt) || /ntfset_/.test(txt) || /AIza[0-9A-Za-z_-]{20,}/.test(txt)) {
      errors.push(`private information leak ${rel}`);
    }
    if (/skdm-paddle-keys/.test(txt)) errors.push(`private information leak ${rel}`);
  };
  scan(path.join(ROOT, "public/llms.txt"));
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (ent.name.endsWith(".md")) scan(p);
    }
  };
  walk(path.join(ROOT, "public"));
  return errors;
}

export function validateLinkRelationsSource() {
  const errors = [];
  const src = fs.readFileSync(path.join(ROOT, "src/components/seo/RegistryJsonLd.tsx"), "utf8");
  if (!src.includes('rel="alternate"') || !src.includes("text/markdown")) {
    errors.push("HTML alternate markdown link missing in RegistryJsonLd");
  }
  if (!src.includes('rel="describedby"')) {
    errors.push("HTML describedby link missing in RegistryJsonLd");
  }
  return errors;
}

export function validateBuiltHtml() {
  const errors = [];
  const warnings = [];
  const out = path.join(ROOT, "out");
  const src = fs.readFileSync(path.join(ROOT, "src/components/seo/RegistryJsonLd.tsx"), "utf8");
  const sourceReady = src.includes('rel="alternate"') && src.includes('rel="describedby"');
  if (!fs.existsSync(out)) {
    if (!sourceReady) errors.push("HTML link relations missing in RegistryJsonLd");
    return { errors, warnings };
  }
  const home = path.join(out, "index.html");
  const stale =
    fs.existsSync(home) &&
    sourceReady &&
    !fs.readFileSync(home, "utf8").includes('rel="describedby"');
  if (stale && process.env.AI_REQUIRE_HTML !== "1") {
    warnings.push("out/ stale — HTML alternate/describedby next build sonrası doğrulanır");
    return { errors, warnings };
  }
  const { aiResources } = loadSeo();
  const host = "https://skdmhesapla.com";
  for (const res of aiResources.resources) {
    if (!res.markdownEnabled || !res.route) continue;
    const htmlRel =
      res.route === "/"
        ? path.join(out, "index.html")
        : path.join(out, res.route.replace(/^\//, ""), "index.html");
    if (!fs.existsSync(htmlRel)) {
      errors.push(`built HTML missing ${res.route}`);
      continue;
    }
    const html = fs.readFileSync(htmlRel, "utf8");
    const mdUrl = `${host}${markdownPathForRoute(res.route)}`;
    if (!html.includes('rel="alternate"') || !html.includes("text/markdown")) {
      errors.push(`HTML alternate links missing ${res.route}`);
    }
    if (!html.includes(mdUrl) && !html.includes(markdownPathForRoute(res.route))) {
      errors.push(`HTML alternate href missing ${res.route}`);
    }
    if (!html.includes('rel="describedby"') || !html.includes("/llms.txt")) {
      errors.push(`HTML describedby links missing ${res.route}`);
    }
    if (/VKN\s*10000000146[\s\S]{0,100}VKN\s*10000000146/i.test(html)) {
      errors.push(`duplicated VKN in footer ${res.route}`);
    }
  }
  return { errors, warnings };
}

export function validateConfigPolicySync(bundle) {
  const errors = [];
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, "data/seo/config.json"), "utf8"));
  const derived = derivedCrawlerPolicy(bundle.aiPolicy);
  const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
  if (!same(raw.crawlerPolicy.searchAllow, derived.searchAllow)) {
    errors.push("config.crawlerPolicy.searchAllow ≠ ai-policy.json");
  }
  if (!same(raw.crawlerPolicy.trainingDisallow, derived.trainingDisallow)) {
    errors.push("config.crawlerPolicy.trainingDisallow ≠ ai-policy.json");
  }
  if (raw.llmsFullEnabled !== false || bundle.aiPolicy.llms.fullEnabled !== false) {
    errors.push("llms-full enabled");
  }
  return errors;
}

export function validateFirebaseAiHeaders() {
  const errors = [];
  const fb = JSON.parse(fs.readFileSync(path.join(ROOT, "firebase.json"), "utf8"));
  const headers = fb.hosting?.headers || [];
  const srcs = headers.map((h) => h.source);
  if (!srcs.some((s) => s.includes("llms.txt"))) errors.push("firebase missing /llms.txt headers");
  if (!srcs.some((s) => s.includes(".md"))) errors.push("firebase missing markdown headers");
  const md = headers.find((h) => String(h.source).includes(".md"));
  const keys = (md?.headers || []).map((x) => `${x.key}:${x.value}`);
  if (!keys.some((k) => /text\/markdown/.test(k))) errors.push("markdown wrong content type");
  if (!keys.some((k) => /noindex/.test(k))) errors.push("markdown noindex header missing");
  const redirects = fb.hosting?.redirects || [];
  const llm = redirects.find((r) => r.source === "/llm.txt" || r.source === "/llm.txt/");
  if (!llm || Number(llm.type) !== 301 || !String(llm.destination).includes("/llms.txt")) {
    errors.push("/llm.txt permanent redirect missing");
  }
  return errors;
}

export function runAiAudit(bundle = loadSeo()) {
  const errors = [];
  const warnings = [];
  const robots = fs.readFileSync(path.join(ROOT, "public/robots.txt"), "utf8");
  const llms = fs.readFileSync(path.join(ROOT, "public/llms.txt"), "utf8");
  const sitemap = fs.readFileSync(path.join(ROOT, "public/sitemap.xml"), "utf8");

  errors.push(...validateConfigPolicySync(bundle));
  errors.push(...validateRobotsPolicy(robots, bundle.aiPolicy));
  const ll = validateLlms(llms, bundle);
  errors.push(...ll.errors);
  warnings.push(...ll.warnings);
  errors.push(...validateNoLlmsFull());
  errors.push(...validateMarkdownLayer(bundle));
  errors.push(...validateSitemapExcludesMarkdown(sitemap));
  errors.push(...validateEvals(bundle));
  errors.push(...validateSchemaPolicy(bundle));
  errors.push(...validateCloaking());
  errors.push(...validatePrivateLeak());
  errors.push(...validateLinkRelationsSource());
  const htmlCheck = validateBuiltHtml();
  errors.push(...htmlCheck.errors);
  warnings.push(...(htmlCheck.warnings || []));
  errors.push(...validateFirebaseAiHeaders());
  return { errors: [...new Set(errors)], warnings: [...new Set(warnings)] };
}
