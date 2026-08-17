import type {
  PcfActivityUnit,
  PcfFactorRecord,
  PcfReviewStatus,
} from "./types";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function assertPcfFactorRecord(value: unknown): asserts value is PcfFactorRecord {
  if (!value || typeof value !== "object") throw new Error("PCF factor kaydı nesne olmalıdır.");
  const f = value as Partial<PcfFactorRecord>;
  if (!f.id || typeof f.id !== "string") throw new Error("PCF factor id zorunlu.");
  if (!f.labelTr || !f.labelEn) throw new Error(`${f.id}: TR/EN etiket zorunlu.`);
  if (!Array.isArray(f.materialIds) || f.materialIds.length === 0) {
    throw new Error(`${f.id}: materialIds boş olamaz.`);
  }
  if (!Array.isArray(f.geographies) || f.geographies.length === 0) {
    throw new Error(`${f.id}: geographies boş olamaz.`);
  }
  if (!Number.isFinite(f.kgCo2ePerActivityUnit) || Number(f.kgCo2ePerActivityUnit) < 0) {
    throw new Error(`${f.id}: kgCo2ePerActivityUnit >= 0 olmalıdır.`);
  }
  if (!f.activityUnit) throw new Error(`${f.id}: activityUnit zorunlu.`);
  if (!f.boundary) throw new Error(`${f.id}: boundary zorunlu.`);
  if (!f.gwpBasis) throw new Error(`${f.id}: gwpBasis zorunlu.`);
  if (!f.quality) throw new Error(`${f.id}: quality zorunlu.`);
  if (!f.reviewStatus) throw new Error(`${f.id}: reviewStatus zorunlu.`);
  if (typeof f.buyerReadyEligible !== "boolean") {
    throw new Error(`${f.id}: buyerReadyEligible boolean olmalıdır.`);
  }
  if (!f.source) throw new Error(`${f.id}: source zorunlu.`);
  if (!f.source.publisher || !f.source.title || !f.source.version || !f.source.sourceUrl) {
    throw new Error(`${f.id}: kaynak künyesi eksik.`);
  }
  if (!f.source.licence) throw new Error(`${f.id}: source.licence zorunlu.`);
  if (!ISO_DATE.test(f.source.reviewedAt)) throw new Error(`${f.id}: source.reviewedAt ISO tarih olmalıdır.`);
  if (f.source.nextReviewAt && !ISO_DATE.test(f.source.nextReviewAt)) {
    throw new Error(`${f.id}: source.nextReviewAt ISO tarih olmalıdır.`);
  }
  if (!Array.isArray(f.limitations)) throw new Error(`${f.id}: limitations dizi olmalıdır.`);
}

export function validateFactorRegistry(records: readonly unknown[]): readonly PcfFactorRecord[] {
  const ids = new Set<string>();
  for (const record of records) {
    assertPcfFactorRecord(record);
    if (ids.has(record.id)) throw new Error(`Tekrarlanan PCF factor id: ${record.id}`);
    ids.add(record.id);
  }
  return records as readonly PcfFactorRecord[];
}

export function isReviewExpired(factor: PcfFactorRecord, asOfIso: string): boolean {
  if (!factor.source.nextReviewAt) return false;
  return factor.source.nextReviewAt < asOfIso.slice(0, 10);
}

export function isFactorValidAt(factor: PcfFactorRecord, asOfIso: string): boolean {
  const day = asOfIso.slice(0, 10);
  if (factor.validFrom && factor.validFrom > day) return false;
  if (factor.validTo && factor.validTo < day) return false;
  return !isReviewExpired(factor, asOfIso);
}

export function isReviewStatusUsable(status: PcfReviewStatus, allowEstimate: boolean): boolean {
  if (status === "approved") return true;
  return allowEstimate && status === "estimate_only";
}

export function unitMatches(a: PcfActivityUnit, b: PcfActivityUnit): boolean {
  return a === b;
}
