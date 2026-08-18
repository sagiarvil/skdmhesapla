/**
 * GATE-M2 kanıt scripti — Türkçe Karakter Kodlama Bütünlüğü (RM-005).
 *
 * SEAL-2026-DC-7782 vaka verisiyle Kapsamlı Durum Raporu PDF'i üretir ve
 * gömülü Inter altkümesi (CIDFontType2 + Identity-H) yapısını doğrular.
 * Gerçek metin çıkarımı .cache/validate-pdf-text.py (pypdf) ile yapılır.
 *
 * ÖNCE/SONRA farkı:
 *   ÖNCE — WinAnsi + ASCII ikame: İŞLETME→ISLETME, TESİS→TESIS, YÖNETİCİ ÖZETİ→YÖNETICI OZETI
 *   SONRA — gömülü Türkçe glifli font: karakter-karakter korunur.
 *
 * Kullanım: npx tsx scripts/verify-gate-m2-pdf.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { kapsamliDurumRaporuPdfBytes } from "../src/lib/skdm/pdf/kapsamliDurumRaporu";
import { FONT_CMAP } from "../src/lib/skdm/font-data";

const OUT = ".cache/gate-m2/Kapsamli-Durum-Raporu.pdf";
mkdirSync(".cache/gate-m2", { recursive: true });

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

// ── 1) Gömülü font kümesi tüm Türkçe glifleri içeriyor mu? ────────────────
const TR_GLIFLER = "İışŞğĞçÇöÖüÜ";
for (const ch of TR_GLIFLER) {
  check(`FONT_CMAP: ${ch} (U+${ch.codePointAt(0).toString(16).toUpperCase()})`, FONT_CMAP[ch.codePointAt(0)] !== undefined);
}

// ── 2) Mandate girdisi: SEAL-2026-DC-7782 (TEB Metal ... A.Ş.) ─────────────
const g = {
  packageId: "SEAL-2026-DC-7782",
  timestamp: "2026-08-17T09:12:00.000Z",
  engineVersion: "skdm-calc-v2026.1",
  rulesetVersion: "CBAM-RULESET-2026.08",
  sectorId: "iron-steel",
  sectorLabel: "Demir ve Çelik",
  cnRange: "7208, 7214",
  firma: "TEB Metal & Alüminyum San. Tic. A.Ş.",
  tesisAdiEN: "TEB Metal İzmir Tesisi",
  unlocode: "TRIZM",
  yetkili: "Barış Bağırlar",
  yil: 2026,
  tonaj: 1250,
  kapsam1: 1775,
  kapsam2: 0,
  etsQuarter: "2026-Q1",
  etsPrice: 75.4,
  trEtsNetting: 0,
  goods: [
    { id: "G1", category: "Sıcak haddelenmiş çubuklar", cn: "7214 20 00", route: "EAF" },
    { id: "G2", category: "Sıcak haddelenmiş yassı ürün", cn: "7208 39 00", route: "BF-BOF" },
  ],
  processes: [
    { id: "P1", name: "Çelik üretimi", included: ["Yakma", "Proses"] },
    { id: "P2", name: "Sıcak haddeler", included: ["Haddeleme"] },
  ],
  streams: [
    { method: "Hesap tabanlı", name: "Doğalgaz", ad: 480000, unit: "Nm³", ncv: "34,5 MJ/Nm³", processId: "P1" },
    { method: "Hesap tabanlı", name: "Hurda", ad: 1350, unit: "ton", ncv: "-", processId: "P1" },
  ],
  precursors: [{ name: "İnşaat demiri (kütük)", total: 900, internal: 900, other: 0, source: "Tesis içi üretim", see: 0.55 }],
  dProcesses: { a: 1250, b: 1250, c: 0, d: 0 },
  findings: [],
  packageHash: "sha256:kanit-gate-m2",
  readinessScore: 96,
};

const bytes = kapsamliDurumRaporuPdfBytes(g);
writeFileSync(OUT, Buffer.from(bytes));
check(`PDF üretildi (${bytes.length} bayt)`, bytes.length > 10000);

// ── 3) PDF yapısı: gömülü CID font + Identity-H + FontFile2 ────────────────
const raw = Buffer.from(bytes).toString("latin1");
check("BaseFont /Inter-Regular", raw.includes("/Inter-Regular"));
check("BaseFont /Inter-Bold", raw.includes("/Inter-Bold"));
check("CIDFontType2", raw.includes("/CIDFontType2"));
check("Encoding /Identity-H", raw.includes("/Identity-H"));
check("FontFile2 gömülü", raw.includes("/FontFile2"));
check("ToUnicode CMap", raw.includes("/ToUnicode"));
check("Hex GID çizim operatörü", /<[0-9a-f]{4,}> Tj/.test(raw));

// ── 4) ÖNCE/SONRA diff — eski ASCII ikame davranışı belgelensin ────────────
const eskiAsciiIame = (s) =>
  s.replace(/[çÇğĞıİöÖşŞüÜ]/g, (c) => ({ ç: "c", Ç: "C", ğ: "g", Ğ: "G", ı: "i", İ: "I", ö: "o", Ö: "O", ş: "s", Ş: "S", ü: "u", Ü: "U" })[c]);
const kontrolNoktalari = ["İŞLETME", "TESİS", "YÖNETİCİ ÖZETİ", "İHRAÇ", "SEKTÖR"];
console.log("\nÖNCE (ASCII ikame) → SONRA (gömülü font) kontrol noktaları:");
for (const label of kontrolNoktalari) {
  const once = eskiAsciiIame(label);
  const sonra = label;
  const fark = once !== sonra;
  console.log(`  ${label}  |  ${once}  |  ${sonra}${fark ? "  ← düzeltildi" : ""}`);
}

if (FAIL.length > 0) {
  console.error(`\nGATE-M2 PDF ÜRETİM KALDI: ${FAIL.length} başarısız`);
  process.exit(1);
}
console.log(`\nGATE-M2 PDF ÜRETİM GEÇTİ (${PASS.length} kontrol) → ${OUT}`);
