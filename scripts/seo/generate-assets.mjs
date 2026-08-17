#!/usr/bin/env node
/**
 * Registry SSOT → public/sitemap.xml, public/robots.txt, public/llms.txt
 * lastmod = git içerik zamanı (sitemap-core). Build saati YASAK.
 * llms-full.txt üretilmez (varsayılan KAPALI)
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadSeo, isIndexable, canonicalUrl } from "./load.mjs";
import { generateSitemap } from "./sitemap-core.mjs";

const { config, legalSources, registry } = loadSeo();
const host = config.canonicalHost.replace(/\/$/, "");

function writeRobots() {
  const lines = [
    "# SKDMHesapla crawler policy — generated from data/seo/config.json",
    "# Search/retrieval açık; training ayrı ve varsayılan kapalı.",
    "# _next/ Disallow edilmez (render CSS/JS).",
    "# Kişisel veri / hesap / ödeme robots ile gizlenmez; auth ile korunur.",
    "",
    "User-agent: *",
    "Allow: /",
    "",
  ];
  for (const bot of config.crawlerPolicy.searchAllow) {
    lines.push(`User-agent: ${bot}`, "Allow: /", "");
  }
  for (const bot of config.crawlerPolicy.trainingDisallow) {
    lines.push(`User-agent: ${bot}`, "Disallow: /", "");
  }
  lines.push(`Sitemap: ${host}/sitemap.xml`, "");
  fs.writeFileSync(path.join(ROOT, "public/robots.txt"), lines.join("\n"));
}

function writeLlms() {
  const indexable = registry.entries
    .filter((e) => isIndexable(e))
    .sort((a, b) => a.route.localeCompare(b.route));
  const sources = legalSources.sources
    .filter((s) => s.status === "active")
    .map((s) => `- ${s.id}: ${s.title} — ${s.url}`)
    .join("\n");
  const resources = indexable
    .filter((e) =>
      ["home", "hub", "glossaryHub", "article", "toolLanding", "profile"].includes(e.role),
    )
    .map((e) => `- ${canonicalUrl(config, e.route)} — ${e.title}`)
    .join("\n");

  const txt = `# skdmhesapla.com

> Status: ${config.llmsStatus}
> llms.txt is an interoperability / canonical resource map. It is not a Google ranking signal.

## Purpose
SKDMHesapla produces verification-ready CBAM/SKDM working files for Turkish exporters.
The legal scope is the six CBAM sector families. Scope is decided by verified CN/GTİP, not by product marketing names.
The system does not issue an accredited verification opinion or customs approval.

## Canonical public resources
${resources}

## Authoritative source map
${sources}

## Method and legal limits
- LCA emission factors are not accepted as calculator inputs.
- Default values cannot be sealed without justification.
- Out-of-scope CN codes are not sent into the SKDM calculation engine.
- Training crawlers (GPTBot, ClaudeBot, Google-Extended) are disallowed; search crawlers remain allowed.
- llms-full.txt is not published.

## Sitemap
${host}/sitemap.xml
`;
  fs.writeFileSync(path.join(ROOT, "public/llms.txt"), txt);

  const pointer = `# skdmhesapla.com — short agent pointer
# Canonical map: ${host}/llms.txt
# Status: P3_INTEROPERABILITY_NOT_GOOGLE_RANKING
# Do not treat this file as a second copy of the site.

Site: ${host}
Product: Self-serve SKDM/CBAM working-file SaaS for Turkish exporters.
Scope decision: verified CN/GTİP (not product name).
Limits: no accredited verification opinion; no customs approval.
Sitemap: ${host}/sitemap.xml
`;
  fs.writeFileSync(path.join(ROOT, "public/llm.txt"), pointer);

  const fullPath = path.join(ROOT, "public/llms-full.txt");
  if (!config.llmsFullEnabled && fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

const sm = generateSitemap(config, registry);
writeRobots();
writeLlms();
for (const w of sm.warnings) console.warn("WARN", w);
console.log(
  `seo assets: sitemap ${sm.count} URL, robots, llms.txt, hash ${sm.report.status} ${sm.report.sha256.slice(0, 12)}`,
);
