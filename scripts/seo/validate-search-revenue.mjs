#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const json = (p) => JSON.parse(read(p));
const fail = (msg) => { console.error(`SEARCH REVENUE FAIL: ${msg}`); process.exitCode = 1; };
const normRoute = (r) => r === "/" ? "/" : String(r).replace(/\/$/, "");

const registry = json("data/seo/registry.json");
const extra = json("data/seo/registry-extra.json");
const allEntries = [...(registry.entries ?? []), ...(extra.entries ?? [])];
const routes = new Set(allEntries.filter((e) => e.state === "PUBLISHED_INDEXABLE").map((e) => normRoute(e.route)));
const querySource = read("src/seo/query-ownership.ts");
const faqSource = read("src/lib/skdm/search-faq.ts");
const constantsSource = read("src/lib/skdm/constants.ts");
const homepageSource = read("src/app/page.tsx");

const queryRows = [...querySource.matchAll(/query:\s*"([^"]+)"\s*,\s*ownerUrl:\s*"([^"]+)"\s*,\s*intentType:\s*"([^"]+)"/g)]
  .map((m) => ({ query: m[1], owner: normRoute(m[2]), intent: m[3] }));
if (queryRows.length < 25) fail(`query ownership coverage too low: ${queryRows.length}`);

const owners = new Map();
for (const row of queryRows) {
  const key = row.query.trim().toLocaleLowerCase("tr-TR");
  if (owners.has(key) && owners.get(key) !== row.owner) fail(`query collision: ${row.query} -> ${owners.get(key)} AND ${row.owner}`);
  owners.set(key, row.owner);
  if (!routes.has(row.owner)) fail(`query owner is not indexable registry route: ${row.query} -> ${row.owner}`);
}

for (const required of [
  ["CBAM hesaplama", "/cbam-hesaplama"],
  ["SKDM hesaplama", "/cbam-hesaplama"],
  ["CBAM raporu", "/cbam-hesaplama"],
  ["CBAM 50 ton", "/cbam-50-ton-muafiyeti"],
  ["CBAM doğrulama", "/cbam-dogrulama"],
]) {
  const key = required[0].toLocaleLowerCase("tr-TR");
  if (owners.get(key) !== required[1]) fail(`critical query owner mismatch: ${required[0]}`);
}

const faqCount = (faqSource.match(/question:\s*"[^"]+"/g) ?? []).length;
if (faqCount < 20) fail(`FAQ coverage must be >=20; got ${faqCount}`);
for (const phrase of ["cbam raporu", "cbam hesaplama", "cbam 50 ton", "communication template", "cbam doğrulama", "karbon vergisi"]) {
  if (!faqSource.toLocaleLowerCase("tr-TR").includes(phrase)) fail(`FAQ intent missing: ${phrase}`);
}

for (const p of [
  "src/app/cbam-hesaplama/page.tsx",
  "src/app/cbam-50-ton-muafiyeti/page.tsx",
  "src/app/cbam-dogrulama/page.tsx",
  "src/app/sss/page.tsx",
]) {
  if (!fs.existsSync(path.join(root, p))) fail(`owner page missing: ${p}`);
}

for (const route of ["/cbam-hesaplama/", "/cbam-50-ton-muafiyeti/", "/cbam-dogrulama/", "/sss/"]) {
  if (!constantsSource.includes(`href: "${route}"`)) fail(`sitewide navigation/footer link missing: ${route}`);
}

// Google FAQ rich result 7 Mayıs 2026 itibarıyla kaldırıldı; commercial site FAQPage şemasına bağımlılık kurulmaz.
for (const p of ["src/app/sss/page.tsx", "src/app/cbam-hesaplama/page.tsx"]) {
  if (read(p).includes('"@type": "FAQPage"')) fail(`deprecated FAQPage strategy found: ${p}`);
}

// Public product contract must match package-manifest SSOT. Hard-coded legacy "6 parçalı" copy is a release blocker.
if (/6\s+parçalı/i.test(homepageSource)) fail("homepage still contains legacy 6-parçalı package copy; manifest SSOT is 12 files");

const moneyPage = read("src/app/cbam-hesaplama/page.tsx");
for (const phrase of ["GTİP", "Communication Template", "Doğrulama", "Ücretsiz", "PLATFORM_STATS.fileCount"]) {
  if (!moneyPage.includes(phrase)) fail(`commercial owner missing conversion/evidence phrase: ${phrase}`);
}

if (process.exitCode) process.exit(process.exitCode);
console.log(`SEARCH REVENUE PASS: ${queryRows.length} owned queries, ${faqCount} FAQ questions, 4 indexable owner/hub pages.`);
