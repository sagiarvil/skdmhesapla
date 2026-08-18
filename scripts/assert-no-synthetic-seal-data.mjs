#!/usr/bin/env node
/**
 * assert-no-synthetic-seal-data — Gate 7.
 * Mühürlü çıktı üreten kaynak dosyaları tarar; beş soruya cevap veremeyen
 * uydurma değerleri / doğrulama benzeri iddiaları bulur.
 *  1) Bu değer nereden geldi?  2) Hangi kullanıcı/kanıt/ruleset alanı sahibi?
 *  3) Hangi birim dönüşümü?  4) Hangi resmî/RM kuralı izin veriyor?
 *  5) Değişmez snapshot'tan yeniden üretilebilir mi?
 *
 * Tarama kapsamı: CBAM mühürlü paket oluşturucular + PDF üreticileri.
 * Negasyon cümleleri ("doğrulama görüşü vermez") izinlidir.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const TARGETS = [
  "src/lib/skdm/package-seal.ts",
  "src/lib/skdm/package-manifest.ts",
  "src/lib/skdm/pdf/kapsamliDurumRaporu.ts",
  "src/lib/skdm/pdf/tedarikciKarbonDosyasi.ts",
];

// Tam eşleşme yasakları — veri doğruluğu iddiası taşıyan kalıplar.
const BANNED_EXACT = [
  "Var (Akredite)",
  "ISO 14064 Uyumlu",
  "Fatura Destekli",
  "productionVolume * 0.5",
  "productionVolume * 1.2",
];

// Yalnız uydurma durum değeri olarak yasak (REVIEW/N/A gibi düz metin akrabaları ayrıca yasak).
const BANNED_STATUS = ["PASSED", "REVIEW"];

// Yalnız mühürlü çıktı içerik şablonlarında yasak sabit emisyon faktörleri.
const BANNED_FACTOR_IN_CONTENT = [">0.44<", "0.44 tCO2e/MWh", "0.056", "0,44", "0.40 tCO2e"];

function scanFile(file) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) {
    console.log(`[skip] bulunamadı: ${file}`);
    return [];
  }
  const src = fs.readFileSync(abs, "utf8");
  const findings = [];
  for (const pattern of BANNED_EXACT) {
    const idx = src.indexOf(pattern);
    if (idx !== -1) {
      const line = src.slice(0, idx).split("\n").length;
      findings.push({ file, line, pattern, kind: "exact" });
    }
  }
  for (const pattern of BANNED_STATUS) {
    // Durum değeri olarak kullanım — "PASSED" dizesi içerik şablonunda geçiyorsa yasak.
    if (src.includes(pattern)) {
      const line = src.split("\n").findIndex((l) => l.includes(pattern)) + 1;
      findings.push({ file, line, pattern, kind: "status" });
    }
  }
  for (const pattern of BANNED_FACTOR_IN_CONTENT) {
    if (src.includes(pattern)) {
      const line = src.split("\n").findIndex((l) => l.includes(pattern)) + 1;
      findings.push({ file, line, pattern, kind: "factor" });
    }
  }
  return findings;
}

const all = TARGETS.flatMap(scanFile);
if (all.length > 0) {
  console.error("SENTETİK MÜHÜR VERİSİ BULUNDU:");
  for (const f of all) {
    console.error(`  ${f.file}:${f.line} [${f.kind}] ${f.pattern}`);
  }
  process.exit(1);
}
console.log("assert-no-synthetic-seal-data: PASS (0 bulgu)");
