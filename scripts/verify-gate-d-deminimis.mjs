/**
 * GATE-D (RM-006) kanıt scripti — De minimis testinin kavramsal düzeltmesi.
 *
 * Üç senaryo (alıcı yıllık 50t altı / üstü / bilinmiyor) çalıştırılır:
 *   1. under50 → MUAF hükmü; PDF karşılaştırmayı alıcı hacmi üzerinden kurar,
 *      tesis tonajı ayrı bilgi satırıdır.
 *   2. over50  → TABİ hükmü; aynı eksen.
 *   3. unknown → "Belirlenemedi — alıcıdan teyit alınmalı"; MUAF/TABİ hükmü
 *      üretilmez, hazırlık skorunda eksiklik olarak işlenir (%100 olamaz,
 *      mühürleme fail-closed).
 *
 * Üç PDF de aynı tek üretim noktasından (deMinimisPdfBytes) üretilir (INV-5).
 *
 * Kullanım: npx tsx scripts/verify-gate-d-deminimis.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { calculateSkdmLiability } from "../src/lib/skdm/calculator";
import { createSealedAuditPackage, deMinimisPdfBytes } from "../src/lib/skdm/package-seal";
import { getTestSealedPackage } from "../src/lib/skdm/test-user-packages";

const OUT = ".cache/gate-d";
mkdirSync(OUT, { recursive: true });

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

// PDF gövde metnini %UTF8-BODY yorumundan çıkar (latin1 → utf8 dönüşümüyle).
function pdfBodyText(pdfBytes) {
  const raw = Buffer.from(pdfBytes).toString("latin1");
  const m = raw.match(/%UTF8-BODY-START\n([\s\S]*?)%UTF8-BODY-END/);
  return m ? Buffer.from(m[1], "latin1").toString("utf8") : "";
}

const baseInput = {
  sectorId: "iron-steel",
  productionVolume: 1250,
  year: 2026,
  etsQuarter: "2026-Q1",
  useCustomEmissions: false,
  hasVerificationEvidence: true,
  streams: [
    { method: "Combustion", name: "Doğalgaz", ad: 1850, unit: "GJ", ncv: "48.5", processId: "p2" },
    { method: "MassBalance", name: "Proses CO2 (konverter)", ad: 410, unit: "tCO2e", ncv: "-", processId: "p2" },
  ],
};

function scenario(input, tag) {
  const result = calculateSkdmLiability(input);
  const footer = `SEAL-${tag} | skdmhesapla.com/dogrula/`;
  const pdf = deMinimisPdfBytes(result, `SEAL-${tag}`, footer);
  const body = pdfBodyText(pdf);
  writeFileSync(`${OUT}/de-minimis-${tag}.pdf`, Buffer.from(pdf));
  return { result, body };
}

console.log("— SENARYO 1: alıcı yıllık 50t altı (under50) —");
const s1 = scenario({ ...baseInput, importerAnnualVolumeStatus: "under50" }, "S1");
check("under50 → MUAF hükmü", s1.body.includes("MUAF") && !s1.body.includes("TABİ (alıcı"));
check("PDF kriter ekseni: alıcı yıllık toplam ithalatı (< 50 ton)", s1.body.includes("Alıcının yıllık toplam SKDM ithalatı < 50 ton"));
check("Alıcı hacmi satırı: '50 ton altı'", s1.body.includes("50 ton altı"));
check("Tesis tonajı bilgi satırı olarak, eşik yanında değil", s1.body.includes("Tesis beyan tonajı (bilgi)"));
check("Kriter başlığı alıcı bazlı", s1.body.includes("KRİTER — ALICI (AB İTHALATÇISI) BAZLI"));

console.log("\n— SENARYO 2: alıcı yıllık 50t üstü (over50) —");
const s2 = scenario({ ...baseInput, importerAnnualVolumeStatus: "over50" }, "S2");
check("over50 → TABİ hükmü", s2.body.includes("TABİ") && !s2.body.includes("MUAF —"));
check("Alıcı hacmi satırı: '50 ton üstü'", s2.body.includes("50 ton üstü"));

console.log("\n— SENARYO 3: bilinmiyor (unknown) —");
const s3 = scenario({ ...baseInput, importerAnnualVolumeStatus: "unknown" }, "S3");
check("unknown → 'De minimis durumu' satırında MUAF/TABİ hükmü yok", !s3.body.includes("De minimis durumu: MUAF") && !s3.body.includes("De minimis durumu: TABİ"));
check("unknown → 'Belirlenemedi' + teyit zorunluluğu", s3.body.includes("Belirlenemedi") && s3.body.includes("teyit edilmeden"));
check("unknown → 'bu sistemde hüküm üretilmez' notu", s3.body.includes("hüküm üretilmez"));
check("unknown → hazırlık skorunda eksiklik (%100 değil)", s3.result.readinessScore < 100);
check(
  `unknown → kontrol listesinde eksik madde görünür (skor %${s3.result.readinessScore})`,
  s3.result.readinessChecklist.some((i) => i.label.includes("Alıcı Yıllık İthalat Hacmi") && !i.passed)
);

console.log("\n— Fail-closed: unknown senaryo mühürlenemez —");
let sealRejected = false;
try {
  createSealedAuditPackage(s3.result, {});
} catch (e) {
  sealRejected = /Hazırlık skoru %100 olmadan/.test(String(e?.message || e));
}
check("unknown → createSealedAuditPackage fail-closed reddeder (INV-1 zinciri)", sealRejected);
check("Sanity: SEAL-2026-DC-7782 (over50) yine de üretilebiliyor", getTestSealedPackage("SEAL-2026-DC-7782") !== null);

console.log(`\n${"-".repeat(50)}`);
console.log("KANIT — üretilen PDF'ler:");
for (const f of ["de-minimis-S1.pdf", "de-minimis-S2.pdf", "de-minimis-S3.pdf"]) {
  console.log(`  ${OUT}/${f}`);
}
console.log(`${"-".repeat(50)}`);

if (FAIL.length === 0) {
  console.log(`\nGATE-D KANIT GEÇTİ (${PASS.length} kontrol) → ${OUT}/`);
} else {
  console.log(`\nGATE-D KANIT KALDI: ${FAIL.length} başarısız`);
  process.exitCode = 1;
}
