import type { SkdmCalculationResult } from "./calculator";
import { hasBlockingQc, runSkdmQc, type QcFinding } from "./qc";

export interface ReadinessView {
  score: number;
  checklist: SkdmCalculationResult["readinessChecklist"];
  qcFindings: QcFinding[];
  canSeal: boolean;
}

/** Denetime Hazırlık Skoru + QC birleşimi (Plan 4). */
export function buildReadinessView(result: SkdmCalculationResult): ReadinessView {
  const qcFindings = runSkdmQc({
    productionVolume: result.productionVolume,
    totalEmissionIntensity: result.totalEmissionIntensity,
    sectorId: result.sector.id,
  });
  const canSeal = result.readinessScore === 100 && !hasBlockingQc(qcFindings);
  return {
    score: result.readinessScore,
    checklist: result.readinessChecklist,
    qcFindings,
    canSeal,
  };
}
