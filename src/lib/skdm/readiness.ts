import type { SkdmCalculationResult } from "./calculator";
import {
  checkTaxIdField,
  computeConsistencyScore,
  countQcSeverities,
  hasBlockingQc,
  runSkdmQc,
  type QcFinding,
} from "./qc";

export interface ReadinessView {
  /** Gösterilen skor = min(Doluluk, Tutarlılık) — GATE-P (RM-006). */
  score: number;
  /** Doluluk — alanlar girildi mi (0–100). */
  coverageScore: number;
  /** Tutarlılık — mutabakat/QC kontrolleri (100/90/40). */
  consistencyScore: number;
  /** Gerçek uyarı sayısı (severity=warning) — "Uyarı: 0" yalnızca gerçekten sıfırsa. */
  warningCount: number;
  blockingCount: number;
  checklist: SkdmCalculationResult["readinessChecklist"];
  qcFindings: QcFinding[];
  canSeal: boolean;
}

/** Denetime Hazırlık Skoru + QC birleşimi (Plan 4; GATE-P). */
export function buildReadinessView(result: SkdmCalculationResult): ReadinessView {
  const qcFindings = runSkdmQc({
    productionVolume: result.productionVolume,
    totalEmissionIntensity: result.totalEmissionIntensity,
    sectorId: result.sector.id,
  });
  return assembleReadinessView(result, qcFindings);
}

/** Firma + VKN alanlarını QC'ye ekleyen görünüm (mühürleme öncesi). */
export function buildReadinessViewWithFields(
  result: SkdmCalculationResult,
  fields: { tesisAdiTR?: string; vFirma?: string; vkn?: string }
): ReadinessView {
  const qcFindings = [
    ...runSkdmQc({
      productionVolume: result.productionVolume,
      totalEmissionIntensity: result.totalEmissionIntensity,
      sectorId: result.sector.id,
    }),
    ...checkTaxIdField(fields.tesisAdiTR || fields.vFirma, fields.vkn),
  ];
  return assembleReadinessView(result, qcFindings);
}

function assembleReadinessView(
  result: SkdmCalculationResult,
  qcFindings: QcFinding[]
): ReadinessView {
  const counts = countQcSeverities(qcFindings);
  const coverageScore = result.readinessScore;
  const consistencyScore = computeConsistencyScore(qcFindings);
  return {
    // INV-7/GATE-P: tutarlılık başarısızsa doluluk %100 olsa bile skor %100 olamaz.
    score: Math.min(coverageScore, consistencyScore),
    coverageScore,
    consistencyScore,
    warningCount: counts.warning,
    blockingCount: counts.blocking,
    checklist: result.readinessChecklist,
    qcFindings,
    canSeal: result.readinessScore === 100 && !hasBlockingQc(qcFindings),
  };
}
