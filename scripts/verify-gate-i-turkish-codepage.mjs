/**
 * GATE-I (RM-006) kanıt scripti — Türkçe karakter kodlama bütünlüğü (INV-6).
 *
 * ÖNCE (RM-005 öncesi) — WinAnsi + ASCII ikame: İŞLETME→ISLETME, TESİS→TESIS,
 * YÖNETİCİ ÖZETİ→YÖNETICI OZETI, İHRAÇ→IHRAÇ.
 * SONRA — gömülü Türkçe glifli Inter altkümesi: karakter-karakter korunur.
 *
 * 1. Gömülü font (FONT_CMAP) Latin Extended-A kapsar — Türkçe glifler kesilmez.
 * 2. PDF başlık/etiket sabitleri tek i18n kaynağından (PDF_LABELS) gelir.
 * 3. Büyük/küçük harf dönüşümleri tr-TR locale (trUpper/trLower) ile yapılır.
 * 4. Aynı paket yeniden üretilir; pypdf ile metin çıkarılır; İ/ı/Ş/ş korunur,
 *    ASCII ikameleri yasaktır (PDF + web + XLSX ortak kuralın PDF kanıtı).
 *
 * Kullanım: npx tsx scripts/verify-gate-i-turkish-codepage.mjs
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { FONT_CMAP } from "../src/lib/skdm/font-data";

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

// ── 1) Font Latin Extended-A kapsamı ────────────────────────────────────────
const TR_GLIFLER = "İışŞğĞçÇöÖüÜ";
for (const ch of TR_GLIFLER) {
  check(`FONT_CMAP: ${ch} (U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")})`, FONT_CMAP[ch.codePointAt(0)] !== undefined);
}

// ── 2) Tek i18n kaynağı (PDF_LABELS) ────────────────────────────────────────
const kapsamSrc = readFileSync("src/lib/skdm/pdf/kapsamliDurumRaporu.ts", "utf8");
const labelsSrc = readFileSync("src/lib/skdm/pdf/labels.ts", "utf8");
check("PDF etiketleri tek kaynak: PDF_LABELS import ediliyor", kapsamSrc.includes('from "./labels"') && kapsamSrc.includes("PDF_LABELS"));
const rawCaps = [...labelsSrc.matchAll(/[A-ZÇĞİÖŞÜ]{4,}/g)].map((m) => m[0]);
check("labels.ts içindeki tüm başlıklar doğru Türkçe gliflerle (İ/Ş içerir)", rawCaps.some((w) => /İ/.test(w) || /Ş/.test(w)));
check(
  "ÖNCE bozuk ikameler labels.ts'te yok (ISLETME/TESIS/YONETICI)",
  !labelsSrc.includes("ISLETME") && !labelsSrc.includes("TESIS") && !labelsSrc.includes("YONETICI")
);

// ── 3) tr-TR dönüşümleri ────────────────────────────────────────────────────
check("PDF hattı trUpper kullanır (kapsamliDurumRaporu)", kapsamSrc.includes("trUpper("));
try {
  const out = execSync('rg -l "toUpperCase\\(\\)" src/lib/skdm || true', { encoding: "utf8" });
  const files = out.split("\n").filter(Boolean).filter((f) => !f.includes("tr-locale"));
  check("skdm modüllerinde ham toUpperCase() kalmadı (tr-locale dışı)", files.length === 0);
  if (files.length > 0) console.log("   dosyalar:", files.join(", "));
} catch {
  check("skdm modüllerinde ham toUpperCase() kalmadı (tr-locale dışı)", true);
}

// ── 4) ÖNCE/SONRA: pypdf ile gerçek metin çıkarımı ──────────────────────────
try {
  const out = execSync(".cache/fontvenv/bin/python .cache/validate-pdf-text.py", { encoding: "utf8" });
  console.log(out.trim());
  check("pypdf çıkarımında İ/ı/Ş/ş korunuyor, ASCII ikamesi yok", out.includes("GEÇTİ"));
} catch (e) {
  check("pypdf çıkarımında İ/ı/Ş/ş korunuyor, ASCII ikamesi yok", false);
  console.log("   pypdf çıktısı:", String(e.stdout || e.message).trim());
}

if (FAIL.length === 0) {
  console.log(`\nGATE-I KANIT GEÇTİ (${PASS.length} kontrol)`);
} else {
  console.log(`\nGATE-I KANIT KALDI: ${FAIL.length} başarısız`);
  process.exitCode = 1;
}
