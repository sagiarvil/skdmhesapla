#!/usr/bin/env node
/**
 * audit-public-contract-v8 — Gate 5/8.
 * Derlenmiş SSR HTML'de: tek main landmark, tek H1, canonical, substantive içerik.
 * HTML yoksa (henüz build edilmemişse) açıkça atlar; varsa zorunlu doğrular.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const candidates = [
  path.join(root, ".next/server/app/karbon-raporu.html"),
  path.join(root, ".next/server/app/karbon-raporu/index.html"),
];

const htmlPath = candidates.find((p) => fs.existsSync(p));
if (!htmlPath) {
  console.log("audit-public-contract-v8: SKIP (derlenmiş HTML yok — önce build)");
  process.exit(0);
}

const html = fs.readFileSync(htmlPath, "utf8");
const errors = [];

const mainCount = (html.match(/<main/g) || []).length;
if (mainCount !== 1) errors.push(`main landmark sayısı: ${mainCount} (beklenen 1)`);

const h1Count = (html.match(/<h1[ >]/g) || []).length;
if (h1Count !== 1) errors.push(`h1 sayısı: ${h1Count} (beklenen 1)`);

const canonicalCount = (html.match(/<link rel="canonical"/g) || []).length;
if (canonicalCount !== 1) errors.push(`canonical: ${canonicalCount} (beklenen 1)`);

const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
if (text.length < 400) errors.push(`anlamlı metin kısa (${text.length} karakter)`);

if (errors.length > 0) {
  console.error("audit-public-contract-v8: FAIL");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`audit-public-contract-v8: PASS (main=1 h1=1 canonical=1 text=${text.length})`);
