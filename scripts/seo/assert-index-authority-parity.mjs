#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT, loadSeo, canonicalUrl, isIndexable } from "./load.mjs";
import { markdownPathForRoute } from "./ai-paths.mjs";

function fail(message) {
  console.error(`INDEX-AUTHORITY-PARITY: FAIL — ${message}`);
  process.exit(1);
}
function sameSet(label, actual, expected) {
  const a = new Set(actual), e = new Set(expected);
  const missing = [...e].filter((x) => !a.has(x));
  const extra = [...a].filter((x) => !e.has(x));
  if (missing.length || extra.length) {
    if (missing.length) console.error(`${label} missing:\n  ${missing.join("\n  ")}`);
    if (extra.length) console.error(`${label} extra:\n  ${extra.join("\n  ")}`);
    fail(`${label} registry ile birebir eşleşmiyor`);
  }
}

execFileSync(process.execPath, ["scripts/seo/generate-assets.mjs"], { cwd: ROOT, stdio: "inherit" });
const { config, registry, aiResources, regulatoryUpdates = [] } = loadSeo();
const host = config.canonicalHost.replace(/\/$/, "");
const sitemap = fs.readFileSync(path.join(ROOT, "public/sitemap.xml"), "utf8");
const llms = fs.readFileSync(path.join(ROOT, "public/llms.txt"), "utf8");
const llm = fs.readFileSync(path.join(ROOT, "public/llm.txt"), "utf8");

const expectedUrls = registry.entries
  .filter((e) => isIndexable(e) && e.canonicalRoute === e.route && e.crawlable !== false)
  .map((e) => canonicalUrl(config, e.route)).sort();
const actualUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
sameSet("sitemap", actualUrls, expectedUrls);
const expectedSet = new Set(expectedUrls);
const byRoute = new Map(registry.entries.map((e) => [e.route, e]));

const requiredRoutes = new Set([
  "/cbam-hesaplama/", "/cbam-dogrulama/", "/cbam-50-ton-muafiyeti/",
  "/sss/", "/platform-kabiliyetleri/", "/mevzuat-guncellemeleri/",
]);
for (const item of regulatoryUpdates) requiredRoutes.add(`/mevzuat-guncellemeleri/${item.slug}/`);
for (const resource of aiResources.resources || []) {
  if (!resource.llmsInclude || !resource.route) continue;
  const entry = byRoute.get(resource.route);
  if (entry && isIndexable(entry) && entry.role !== "application") requiredRoutes.add(resource.route);
}
for (const route of requiredRoutes) {
  const entry = byRoute.get(route);
  if (!entry || !isIndexable(entry) || entry.role === "application") continue;
  const canonical = canonicalUrl(config, route);
  const markdown = `${host}${markdownPathForRoute(route)}`;
  if (!llms.includes(canonical) && !llms.includes(markdown)) fail(`kritik AI authority route llms.txt içinde yok: ${route}`);
}

const localLinks = [...llms.matchAll(/https:\/\/skdmhesapla\.com\/[^\s)]+/g)].map((m) => m[0].replace(/[.,;]+$/, ""));
for (const url of localLinks) {
  const u = new URL(url);
  if (u.search || u.hash) fail(`llms local URL parametre/hash içeriyor: ${url}`);
  if (u.pathname.endsWith(".md")) {
    const rel = u.pathname.replace(/^\//, "");
    if (!fs.existsSync(path.join(ROOT, "public", rel))) fail(`llms markdown dosyası yok: ${u.pathname}`);
    const route = u.pathname === "/index.md" ? "/" : u.pathname.replace(/\/index\.md$/, "/");
    if (!expectedSet.has(`${host}${route}`)) fail(`llms markdown registry dışında: ${u.pathname}`);
  } else if (!expectedSet.has(`${host}${u.pathname}`)) fail(`llms local HTML URL sitemap/registry dışında: ${u.pathname}`);
}

for (const required of [
  `${host}/llms.txt`, `${host}/sitemap.xml`, `${host}/metodoloji/`,
  `${host}/mevzuat-guncellemeleri/`, `${host}/cbam-hesaplama/`, `${host}/cbam-dogrulama/`,
]) if (!llm.includes(required)) fail(`llm.txt compact authority referansı eksik: ${required}`);

const robots = fs.readFileSync(path.join(ROOT, "public/robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${host}/sitemap.xml`)) fail("robots sitemap canonical bildirimi eksik");
for (const bot of ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot"])
  if (!robots.includes(`User-agent: ${bot}`)) fail(`arama/retrieval bot politikası eksik: ${bot}`);

if (process.env.SEO_PARITY_SKIP_GIT_DIFF !== "1") {
  try {
    execFileSync("git", ["diff", "--exit-code", "--", "public", "data/seo/sitemap-baseline.json", "data/seo/markdown-manifest.json"], { cwd: ROOT, stdio: "inherit" });
  } catch {
    fail("generated SEO/AI assets HEAD ile eşleşmiyor — npm run ai:generate çalıştırıp çıktıları commit edin");
  }
}
console.log(`INDEX-AUTHORITY-PARITY: PASS — ${expectedUrls.length} index URL, ${requiredRoutes.size} AI authority route`);
