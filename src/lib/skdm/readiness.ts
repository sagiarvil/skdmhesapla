import type { SkdmCalculationResult } from "./calculator";
import {
  checkTaxIdField,
  hasBlockingQc,
  runSkdmQc,
  type QcFinding,
} from "./qc";

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
  // INV-1: engelleyici QC varsa gösterilebilir skor %100 altına iner.
  const canSeal = result.readinessScore === 100 && !hasBlockingQc(qcFindings);
  return {
    score: hasBlockingQc(qcFindings) ? Math.min(result.readinessScore, 99) : result.readinessScore,
    checklist: result.readinessChecklist,
    qcFindings,
    canSeal,
  };
}

/** Firma + VKN alanlarını QC'ye ekleyen görünüm (mühürleme öncesi). */
export function buildReadinessViewWithFields(
  result: SkdmCalculationResult,
  fields: { vFirma?: string; vkn?: string }
): ReadinessView {
  const view = buildReadinessView(result);
  const taxIdFindings = checkTaxIdField(fields.vFirma, fields.vkn);
  const qcFindings = [...view.qcFindings, ...taxIdFindings];
  return {
    ...view,
    qcFindings,
    score: hasBlockingQc(qcFindings) ? Math.min(view.score, 99) : view.score,
    canSeal: result.readinessScore === 100 && !hasBlockingQc(qcFindings),
  };
}
