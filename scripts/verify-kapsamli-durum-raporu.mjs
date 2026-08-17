/**
 * Kapsamlı Durum Raporu — hesapla() regresyonu (SEAL-2026-DC-7782 senaryosu).
 * Kullanım: npx tsx scripts/verify-kapsamli-durum-raporu.mjs
 */
import {
  hesapla,
  kapsamliDurumRaporuPdfBytes,
} from "../src/lib/skdm/pdf/kapsamliDurumRaporu";

/** @type {import("../src/lib/skdm/pdf/kapsamliDurumRaporu").KapsamliRaporGirdisi} */
const girdi = {
  packageId: "SEAL-2026-DC-7782",
  timestamp: "2026-08-16T14:30:00.000Z",
  engineVersion: "skdm-calc-v2026.1",
  rulesetVersion: "2026.1-Omnibus1",
  sectorId: "iron-steel",
  sectorLabel: "Demir & Çelik",
  cnRange: "7201–7229",
  firma: "TEB Metal & Alüminyum San. Tic. A.Ş.",
  tesisAdiEN: "TEB Metal Iron & Steel Works — Gebze",
  unlocode: "TRGEB",
  yetkili: "Ahmet Yılmaz",
  yil: 2026,
  tonaj: 1250,
  kapsam1: 1775,
  kapsam2: 475,
  etsQuarter: "2026-Q1",
  etsPrice: 75.4,
  trEtsNetting: 22,
  goods: [
    { id: "g1", category: "Yassı çelik / sac", cn: "7208 39 00", route: "BF-BOF" },
    { id: "g2", category: "İnşaat demiri (nervürlü)", cn: "7214 20 00", route: "EAF" },
  ],
  processes: [
    { id: "p1", name: "Sinter / yükleme", included: ["sinter", "hammadde"] },
    { id: "p2", name: "BF-BOF sıcak hadde", included: ["yüksek fırın", "konvertör", "hadde"] },
    { id: "p3", name: "EAF ergitme", included: ["ark fırını", "döküm"] },
  ],
  streams: [
    { method: "Combustion", name: "Doğalgaz", ad: 1850, unit: "GJ", ncv: "48,5", processId: "p2" },
    { method: "Combustion", name: "Kok / kömür", ad: 920, unit: "GJ", ncv: "28,2", processId: "p2" },
    { method: "MassBalance", name: "Proses CO2 (konvertör)", ad: 410, unit: "tCO2e", ncv: "-", processId: "p2" },
    { method: "Combustion", name: "Doğalgaz (EAF yardımcı)", ad: 240, unit: "GJ", ncv: "48,5", processId: "p3" },
  ],
  precursors: [
    { name: "Demir cevheri pelet", total: 980, internal: 0, other: 980, source: "Dış tedarikçi", see: 0.08 },
    { name: "Hurda çelik", total: 420, internal: 120, other: 300, source: "Karma", see: 0.02 },
    { name: "Ferroalyaj", total: 55, internal: 0, other: 55, source: "Dış tedarikçi", see: 1.15 },
  ],
  dProcesses: { a: 1250, b: 1100, c: 100, d: 50 },
  findings: [
    { seviye: "BILGI", metin: "Annex II — Kapsam 2 fatura dışı." },
    { seviye: "BILGI", metin: "TR ETS mahsup 0." },
  ],
  packageHash: "sha256:b28f6f2520d4121bdf8398f7953875a2e3e31ec18962df3398bb7358841bcc27",
  readinessScore: 100,
};

const r = hesapla(girdi);
const checks = [
  ["sadeceDirekt", r.sadeceDirekt === true],
  ["faturaEdilen", Math.abs(r.faturaEdilenEmisyon - 1775) < 0.01],
  ["yukumlu", Math.abs(r.yukumluEmisyon - 44.375) < 0.001],
  ["mahsupSifir", r.mahsupSifirlandi === true],
  ["etkinMahsup", r.etkinMahsup === 0],
  ["maliyet", Math.abs(r.maliyetEur - 3345.88) < 0.01],
  ["denklik", r.denklikSaglandi === true],
];

console.log("=== KAPSAMLI DURUM RAPORU — HESAPLA ===");
console.log("sadeceDirekt:", r.sadeceDirekt);
console.log("faturaEdilen:", r.faturaEdilenEmisyon);
console.log("yukumlu:", r.yukumluEmisyon);
console.log("mahsupSifirlandi:", r.mahsupSifirlandi);
console.log("etkinMahsup:", r.etkinMahsup);
console.log("maliyetEur:", r.maliyetEur);
console.log("denklik:", r.denklikSaglandi);
for (const [name, ok] of checks) {
  if (!ok) {
    console.error(`❌ ${name} FAILED`);
    process.exit(1);
  }
  console.log(`✅ ${name}`);
}

const pdf = kapsamliDurumRaporuPdfBytes(girdi);
if (pdf[0] !== 0x25 || pdf[1] !== 0x50) {
  console.error("❌ PDF magic yok");
  process.exit(1);
}
const utf = Buffer.from(pdf).toString("utf8");
if (!utf.includes("KAPSAMLI DURUM RAPORU") || !utf.includes("Annex II")) {
  console.error("❌ PDF gövdesinde beklenen metin yok");
  process.exit(1);
}
console.log(`✅ PDF üretildi (${pdf.length} B)`);
console.log("🎉 KAPSAMLI DURUM RAPORU TEST PASSED");
