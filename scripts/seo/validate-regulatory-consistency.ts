import fs from "node:fs";
import path from "node:path";
import { REGULATORY_SOURCES } from "../../src/seo/regulatory-sources";

const ROOT = process.cwd();
const APP_ROOT = path.join(ROOT, "src", "app");
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

  if (/2025\/2547[\s\S]{0,500}2025-06-30|2025-06-30[\s\S]{0,500}2025\/2547/.test(text)) {
    fail(`${rel}: 2025/2547 ile yanlış 2025-06-30 tarihi birlikte kullanılıyor`);
  }

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
