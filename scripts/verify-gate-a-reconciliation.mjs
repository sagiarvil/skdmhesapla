/**
 * GATE-A (RM-006) kanıt scripti — Emisyon Mutabakatı.
 *
 * SEAL-2026-DC-7782 paketini yeniden üretir ve şunları kanıtlar:
 *   1. Toplam emisyon artık sabit 1.775,00 değil; akış register'ından satır satır
 *      türetilmiş düzeltilmiş sayıdır (775,74 tCO2e).
 *   2. Emisyon-Hesaplama-Eki.pdf her akış için "faaliyet verisi × NCV × EF = tCO2e"
 *      satırı + faktör kaynağı içerir ve mutabakat notunu taşır.
 *   3. Hesaplama-Izi.json steps[] (formül + katsayı + sonuç) ve reconciliation.equals=true.
 *
 * Kullanım: npx tsx scripts/verify-gate-a-reconciliation.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { sealedFileBytes } from "../src/lib/skdm/package-seal";
import { getTestSealedPackage } from "../src/lib/skdm/test-user-packages";

const OUT = ".cache/gate-a";
mkdirSync(OUT, { recursive: true });

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

const pkg = getTestSealedPackage("SEAL-2026-DC-7782");
check("SEAL-2026-DC-7782 paketi üretilebildi", pkg !== null);

const iziFile = pkg.files.find((f) => f.filename === "Hesaplama-Izi.json");
const izi = JSON.parse(new TextDecoder().decode(sealedFileBytes(iziFile)));

// ── 1) Düzeltilmiş toplam + steps[] ────────────────────────────────────────
const oldTotal = 1775;
const newTotal = izi.outputs.totalEmissions;
check(
  `Toplam emisyon sabit 1775 değil → ${newTotal} tCO2e (eski 1.775 çarpımı: 1250 t × 1,42 varsayılanı)`,
  newTotal !== oldTotal
);
check("emissionDataQuality = doğrudan ölçüm (akışlardan türetildi)", izi.outputs.emissionDataQuality === "dogrudan-olcum");
check("steps[] ≥ 4 adım (akış + proses + öncüller)", Array.isArray(izi.steps) && izi.steps.length >= 4);
const stepSum = izi.steps.reduce((a, s) => a + s.resultTco2e, 0);
check(
  `Mutabakat: Σ(steps)=${stepSum} === total=${newTotal} (kuruşu kuruşuna)`,
  Math.abs(stepSum - newTotal) < 1e-9 && izi.reconciliation?.equals === true
);
check("Her adımda faktör kaynağı var", izi.steps.every((s) => typeof s.factorSource === "string" && s.factorSource.length > 3));

console.log("\n— SEAL-2026-DC-7782 SATIR BAZLI MUTABAKAT —");
for (const s of izi.steps) {
  console.log(`  [${s.stepNo}] ${s.kind} | ${s.stream}`);
  console.log(`       ${s.formula}  =>  ${s.resultTco2e} tCO2e`);
  console.log(`       kaynak: ${s.factorSource}`);
}
console.log(`  TOPLAM: ${newTotal} tCO2e  (Σ=${stepSum})  |  ÖNCÜL GÖMÜLÜ: ${izi.outputs.precursorEmbeddedEmissions} tCO2e\n`);

// ── 2) Emisyon-Hesaplama-Eki.pdf satır bazlı tablo + mutabakat notu ───────
const pdf2File = pkg.files.find((f) => f.filename === "Emisyon-Hesaplama-Eki.pdf");
writeFileSync(`${OUT}/Emisyon-Hesaplama-Eki.pdf`, Buffer.from(sealedFileBytes(pdf2File)));
const raw = Buffer.from(sealedFileBytes(pdf2File)).toString("latin1");
const m = raw.match(/%UTF8-BODY-START\n([\s\S]*?)%UTF8-BODY-END/);
const body = m ? Buffer.from(m[1], "latin1").toString("utf8") : "";
check("PDF gövde metni çıkarılabildi", body.length > 100);

const requiredMarkers = [
  "EMİSYON HESAPLAMA EKİ",
  "SATIR BAZLI HESAP",
  "1850 GJ × 0.0561 tCO2e/GJ = 103.79 tCO2e",
  "920 GJ × 0.1070 tCO2e/GJ = 98.44 tCO2e",
  "410 tCO2e (doğrudan ölçüm)",
  "240 GJ × 0.0561 tCO2e/GJ = 13.46 tCO2e",
  "980 t × 0.080 tCO2e/t = 78.40 tCO2e",
  "Mutabakat (GATE-A)",
  "AB ETS MRR (2018/2066)",
  "FAKTÖR KAYNAKLARI",
  "Veri kalitesi kademesi 'Doğrudan ölçüm'dür",
];
for (const marker of requiredMarkers) {
  check(`PDF'te satır: "${marker}"`, body.includes(marker));
}
check(
  `PDF mutabakat satırı toplamı taşıyor: ${newTotal}`,
  body.includes(`${newTotal} tCO2e ile kuruşu kuruşuna eşittir`)
);

// ── 3) Hesaplama-Izi.json diske yaz ───────────────────────────────────────
writeFileSync(`${OUT}/Hesaplama-Izi.json`, JSON.stringify(izi, null, 2));

if (FAIL.length > 0) {
  console.error(`\nGATE-A KANIT KALDI: ${FAIL.length} başarısız`);
  process.exit(1);
}
console.log(`\nGATE-A MUTABAKAT KANITI GEÇTİ (${PASS.length} kontrol) → ${OUT}/`);
