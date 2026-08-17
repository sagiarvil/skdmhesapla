#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

let errors = [];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(process.cwd(), filePath);

  // Kural 1: "7 adımlık" kalıntısı yasak
  if (content.includes("7 adımlık") || content.includes("7 adım")) {
    errors.push(`[7 ADIM KALINTISI] ${relPath} dosyasında "7 adım" ifadesi bulundu.`);
  }

  // Kural 2: UI ve LLM dosyalarında 2.400 / 2400 reseal fiyatı gösterilemez (Ek F tek fiyat)
  if (
    (relPath.startsWith("src/app/") ||
      relPath.startsWith("public/llm") ||
      relPath.endsWith(".md")) &&
    (content.includes("2.400 ₺") || content.includes("2.400 TL") || content.includes("2400 ₺"))
  ) {
    errors.push(`[RESEAL FİYAT GÖSTERİMİ] ${relPath} dosyasında 2.400 ₺ fiyat gösterimi bulundu.`);
  }

  // Kural 3: eski paket sayısı hard-code (Case Manager §42)
  if (
    (relPath.startsWith("src/app/") || relPath.startsWith("src/components/")) &&
    (content.includes("6 dosyalık") ||
      content.includes("11 Dosyalı") ||
      content.includes("11 parçalı") ||
      /\b11 dosya\b/i.test(content))
  ) {
    errors.push(
      `[PAKET SAYISI DRIFT] ${relPath}: eski 6/11 dosya ifadesi — package-manifest / PLATFORM_STATS kullanın.`
    );
  }

  // Kural 4: mühür ekranı sessiz tonaj / kapısız Euro (PATCH_VERISIZ_MALIYET)
  if (relPath.replaceAll("\\", "/").endsWith("components/wizard/SkdmWizard.tsx")) {
    if (/\|\|\s*1000/.test(content) || /Math\.max\(\s*1\s*,\s*Number\(fieldValues\.tonaj\)/.test(content)) {
      errors.push(`[SESSİZ TONAJ] ${relPath}: varsayılan 1000 / max(1) yasak — estimateCertificateCost kapısı.`);
    }
    if (!content.includes("EstimatedCostCard")) {
      errors.push(`[MALİYET KARTI] ${relPath}: EstimatedCostCard zorunlu.`);
    }
    if (/fmt\(result\.importerCostEur\)/.test(content)) {
      errors.push(`[KAPISIZ MALİYET] ${relPath}: importerCostEur mühürde doğrudan basılamaz.`);
    }
  }
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next" && entry.name !== "out") {
        scanDir(fullPath);
      }
    } else if (/\.(tsx|ts|js|mjs|txt)$/.test(entry.name)) {
      checkFile(fullPath);
    }
  }
}

console.log("\x1b[1;34m▶ CI Linter çalıştırılıyor (Plan 22 / Ek F & G kuralları)...\x1b[0m");

scanDir("src/app");
scanDir("src/components");
if (fs.existsSync("public/llms.txt")) checkFile("public/llms.txt");
if (fs.existsSync("public/llm.txt")) checkFile("public/llm.txt");
function scanMarkdown(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) scanMarkdown(fullPath);
    else if (entry.name.endsWith(".md")) checkFile(fullPath);
  }
}
scanMarkdown("public");

if (errors.length > 0) {
  console.error("\x1b[1;31m✖ CI Linter Hataları Bulundu:\x1b[0m");
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log("\x1b[1;32m✔ CI Linter: 0 hata! Tüm kurallar temiz.\x1b[0m");
}
