/**
 * GATE-P (RM-006) kanıt scripti — Hazırlık skoru Doluluk + Tutarlılık; uyarı üretilebilirliği.
 *
 * 1. Skor iki bileşendir: Doluluk (alanlar girildi mi) ve Tutarlılık (mutabakat
 *    kontrolleri). Tutarlılık başarısızsa doluluk %100 olsa bile skor %100 olamaz
 *    (INV-7).
 * 2. "Uyarı" sayısı gerçek QC uyarılarını sayar — sistemin uyarı üretebildiği
 *    senaryo ayrıca kanıtlanır (INTENSITY_OUTLIER).
 * 3. Rapor da aynı QC bileşimini kullanır (buildKapsamliRaporGirdisi).
 *
 * Kullanım: npx tsx scripts/verify-gate-p-readiness-two-axis.mjs
 */
import { calculateSkdmLiability } from "../src/lib/skdm/calculator";
import { computeConsistencyScore, countQcSeverities, runFullQc } from "../src/lib/skdm/qc";
import { buildReadinessViewWithFields } from "../src/lib/skdm/readiness";
import { buildKapsamliRaporGirdisi } from "../src/lib/skdm/pdf/kapsamliDurumRaporu";

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

const tamGirdi = {
  sectorId: "iron-steel",
  productionVolume: 1250,
  year: 2026,
  importerAnnualVolumeStatus: "over50",
  useCustomEmissions: true,
  customDirectEmission: 1.42,
  customIndirectEmission: 0,
  hasVerificationEvidence: true,
};

// ── Senaryo 1: a ≠ b+c+d → tutarlılık başarısız, doluluk tam olsa bile skor < 100 ──
{
  const result = calculateSkdmLiability(tamGirdi);
  const findings = runFullQc({
    result: { productionVolume: result.productionVolume, totalEmissionIntensity: result.totalEmissionIntensity, sectorId: result.sector.id },
    registers: { dProcesses: { a: 100, b: 60, c: 25, d: 5 } }, // 90 ≠ 100
  });
  const coverage = result.readinessScore;
  const consistency = computeConsistencyScore(findings);
  const display = Math.min(coverage, consistency);
  const counts = countQcSeverities(findings);

  check("Senaryo 1: doluluk %100", coverage === 100);
  check("Senaryo 1: D_Processes denklik bulgusu üretildi", findings.some((f) => f.code === "D_PROCESSES_BALANCE"));
  check("Senaryo 1: tutarlılık bileşeni düşük (blocking → 40)", consistency === 40);
  check("Senaryo 1: gösterilen skor %100'ün altında", display < 100);
  check("Senaryo 1: engelleyici bulgu sayısı ≥ 1", counts.blocking >= 1);
}

// ── Senaryo 2: uyarı üretilebilirliği (INTENSITY_OUTLIER) ──
{
  const result = calculateSkdmLiability({ ...tamGirdi, customDirectEmission: 25 });
  const findings = runFullQc({
    result: { productionVolume: result.productionVolume, totalEmissionIntensity: result.totalEmissionIntensity, sectorId: result.sector.id },
    registers: {
      goodsCount: 1,
      processes: [{ id: "p1", name: "Haddeleme", included: ["g1"] }],
      streams: [{ method: "Process", name: "Proses emisyonu", ad: 500, ncv: "" }],
      precs: [{ total: 100, internal: 60, other: 40 }],
      dProcesses: { a: 100, b: 60, c: 40, d: 0 },
    },
  });
  const coverage = result.readinessScore;
  const consistency = computeConsistencyScore(findings);
  const display = Math.min(coverage, consistency);
  const counts = countQcSeverities(findings);

  check("Senaryo 2: yoğunluk sektör aralığı dışında (25 > 20)", result.totalEmissionIntensity > 20);
  check("Senaryo 2: INTENSITY_OUTLIER uyarısı üretildi", findings.some((f) => f.code === "INTENSITY_OUTLIER" && f.severity === "warning"));
  check("Senaryo 2: gerçek uyarı sayısı ≥ 1 (Uyarı: N gerçek veri)", counts.warning >= 1);
  check("Senaryo 2: doluluk tam ama tutarlılık uyarı yüzünden %100 değil", coverage === 100 && display < 100);
  check("Senaryo 2: tutarlılık = 90 (yalnız uyarı)", consistency === 90);
}

// ── ReadinessView iki bileşeni döndürür ──
{
  const result = calculateSkdmLiability(tamGirdi);
  const view = buildReadinessViewWithFields(result, { vFirma: "CimetricaOne A.Ş.", vkn: "1000036109" });
  check("ReadinessView: coverageScore/consistencyScore/warningCount alanları var", "coverageScore" in view && "consistencyScore" in view && "warningCount" in view);
  check("ReadinessView: skor = min(doluluk, tutarlılık)", view.score === Math.min(view.coverageScore, view.consistencyScore));
}

// ── Rapor aynı QC bileşimini kullanır ──
{
  const result = calculateSkdmLiability({ ...tamGirdi, customDirectEmission: 25 });
  const girdi = buildKapsamliRaporGirdisi(
    result,
    {
      dProcesses: { a: 100, b: 60, c: 25, d: 5 },
      goods: [{ id: "g1", category: "İnşaat demiri", cn: "72142000", route: "Direct" }],
      processes: [{ id: "p1", name: "Haddeleme", included: ["g1"] }],
      streams: [],
      precs: [],
      fieldValues: { vFirma: "CimetricaOne A.Ş.", vkn: "1000036109" },
    },
    { packageId: "SEAL-TEST", timestamp: "2026-08-18T00:00:00Z", engineVersion: "v", rulesetVersion: "r", packageHash: "h" }
  );
  check("Rapor: qcEngel sayısı gerçek QC'den (D_Processes engelleyici)", girdi.qcEngel >= 1);
  check("Rapor: qcUyari sayısı gerçek QC'den (INTENSITY_OUTLIER)", girdi.qcUyari >= 1);
  check("Rapor: gösterilen hazırlık skoru %100'ün altında (tutarsız veri)", girdi.readinessScore < 100);
}

console.log(`\n${"-".repeat(60)}`);
console.log("Skor modeli: Doluluk %100 + Tutarlılık %40 (engel) → gösterilen skor %40.");
console.log("Uyarı modeli: INTENSITY_OUTLIER gerçek bir warning üretir → Tutarlılık %90.");
console.log(`${"-".repeat(60)}`);

if (FAIL.length === 0) {
  console.log(`\nGATE-P KANIT GEÇTİ (${PASS.length} kontrol)`);
} else {
  console.log(`\nGATE-P KANIT KALDI: ${FAIL.length} başarısız`);
  process.exitCode = 1;
}
