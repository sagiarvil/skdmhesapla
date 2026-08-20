import fs from "node:fs";
import path from "node:path";
import { REGULATORY_SOURCES } from "../../src/seo/regulatory-sources";

const ROOT = process.cwd();
const APP_ROOT = path.join(ROOT, "src", "app");
const OUT_ROOT = path.join(ROOT, "out");
const failures: string[] = [];

function fail(message: string) {
  failures.push(message);
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(target);
    return /\.(tsx?|mdx?)$/.test(entry.name) ? [target] : [];
  });
}

function visibleText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

const primary = REGULATORY_SOURCES.cbamRegulation;
const simplification = REGULATORY_SOURCES.definitiveSimplification;
const definitive = REGULATORY_SOURCES.definitiveMethodology;
const transitional = REGULATORY_SOURCES.transitionalMethodology;

if (primary.role !== "primary-regulation") fail("2023/956 primary-regulation olmalı");
if (simplification.role !== "simplification") fail("2025/2083 simplification olmalı");
if (definitive.role !== "definitive-methodology") fail("2025/2547 definitive-methodology olmalı");
if (transitional.role !== "transitional-historical") fail("2023/1773 transitional-historical olmalı");

if (definitive.adoptedAt !== "2025-12-10") fail("2025/2547 kabul tarihi 2025-12-10 olmalı");
if (definitive.publishedAt !== "2025-12-22") fail("2025/2547 yayın tarihi 2025-12-22 olmalı");
if (!transitional.context.toLocaleLowerCase("tr-TR").includes("geçiş")) {
  fail("2023/1773 context açık biçimde geçiş dönemi demeli");
}
if (!transitional.context.toLocaleLowerCase("tr-TR").includes("tarihsel")) {
  fail("2023/1773 context açık biçimde tarihsel referans demeli");
}

if (definitive.adoptedAt && definitive.publishedAt && definitive.adoptedAt > definitive.publishedAt) {
  fail("2025/2547 tarih kronolojisi bozuk: adoptedAt > publishedAt");
}

for (const file of walk(APP_ROOT)) {
  const rel = path.relative(ROOT, file);
  const text = fs.readFileSync(file, "utf8");

  let offset = 0;
  while ((offset = text.indexOf("2023/1773", offset)) !== -1) {
    const context = text
      .slice(Math.max(0, offset - 220), Math.min(text.length, offset + 320))
      .toLocaleLowerCase("tr-TR");
    if (!context.includes("geçiş") && !context.includes("tarihsel")) {
      fail(`${rel}: 2023/1773 kullanımı geçiş/tarihsel bağlamla etiketlenmemiş`);
    }
    offset += "2023/1773".length;
  }
}

const renderedMethodology = path.join(OUT_ROOT, "metodoloji", "index.html");
if (!fs.existsSync(renderedMethodology)) {
  fail("out/metodoloji/index.html yok; production build sonrası regulatory audit zorunlu");
} else {
  const rendered = visibleText(fs.readFileSync(renderedMethodology, "utf8"));
  if (rendered.includes("30.06.2025") || rendered.includes("2025-06-30")) {
    fail("rendered /metodoloji/: 2025/2547 için yanlış 2025-06-30 tarihi görünür durumda");
  }
  if (!rendered.includes("10.12.2025")) {
    fail("rendered /metodoloji/: 2025/2547 kabul tarihi görünür değil");
  }
  if (!rendered.includes("22.12.2025")) {
    fail("rendered /metodoloji/: 2025/2547 Resmi Gazete yayın tarihi görünür değil");
  }
}

if (failures.length > 0) {
  console.error("REGULATORY CONSISTENCY FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("REGULATORY CONSISTENCY PASS");
console.log("- 2023/956: primary regulation");
console.log("- 2025/2083: definitive-period simplification/amendment");
console.log("- 2025/2547: definitive methodology; adopted 2025-12-10, published 2025-12-22");
console.log("- 2023/1773: transitional/historical only");
console.log("- rendered /metodoloji/ provenance dates: PASS");
