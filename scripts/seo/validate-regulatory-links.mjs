#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOTS = ["src", "data", "public", "scripts"];
const TEXT_EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".md", ".txt", ".html"]);
const SELF = path.normalize("scripts/seo/validate-regulatory-links.mjs");
// Tokenları parçalı kuruyoruz; guard kendi kaynak kodunu yanlış pozitif olarak yakalamaz.
const forbidden = [
  "/mevzuat-guncellemeleri/" + "#",
  "mevzuat-guncellemeleri/" + "#${",
];

const hits = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", "out", ".git"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!TEXT_EXT.has(path.extname(entry.name))) continue;
    if (path.normalize(full) === SELF) continue;
    const text = fs.readFileSync(full, "utf8");
    for (const token of forbidden) {
      if (text.includes(token)) hits.push(`${full}: legacy regulatory anchor '${token}'`);
    }
  }
}

for (const root of ROOTS) walk(root);

if (hits.length) {
  console.error("REGULATORY LINK GATE FAIL");
  for (const hit of hits) console.error(`- ${hit}`);
  console.error("Her güncelleme /mevzuat-guncellemeleri/<slug>/ detay sayfasına gitmelidir.");
  process.exit(1);
}

console.log("REGULATORY LINK GATE PASS — legacy #slug bağlantısı yok.");
