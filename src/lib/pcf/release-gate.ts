import { isReviewExpired } from "./factor-registry";
import type { PcfFactorRecord } from "./types";

/**
 * SKDMHesapla'nın "faktörü sistem bulur" vaadini açıkça verdiği malzemeler.
 * Bu listedeki bir malzeme için güncel, incelenmiş bir generic factor yoksa
 * premium otomatik-faktör lansmanı tamamlanmış sayılmaz.
 *
 * Supplier-specific EPD/PCF yükleme yolu ayrı bir fallback'tir; bu listeyi
 * otomatik olarak karşılanmış saymaz.
 */
export const PREMIUM_AUTO_FACTOR_MATERIAL_IDS = [
  "aluminium",
  "stainless-steel",
  "copper",
  "brass",
  "zinc",
  "lead",
  "glass",
  "ceramic-tile",
  "sanitary-ceramic",
  "marble",
  "travertine",
  "granite",
  "pvc",
  "mdf",
  "particleboard",
  "plywood",
  "textile",
  "carpet",
  "leather",
  "cement-product",
  "paint",
  "chemical-generic",
] as const;

export interface PcfCoverageGap {
  readonly materialId: string;
  readonly reason: "missing" | "stale" | "not-approved" | "not-buyer-ready";
}

export function pcfPremiumCoverageGaps(
  registry: readonly PcfFactorRecord[],
  asOfIso: string,
): readonly PcfCoverageGap[] {
  const gaps: PcfCoverageGap[] = [];
  for (const materialId of PREMIUM_AUTO_FACTOR_MATERIAL_IDS) {
    const candidates = registry.filter((f) => f.kind === "material" && f.materialIds.includes(materialId));
    if (candidates.length === 0) {
      gaps.push({ materialId, reason: "missing" });
      continue;
    }
    const fresh = candidates.filter((f) => !isReviewExpired(f, asOfIso));
    if (fresh.length === 0) {
      gaps.push({ materialId, reason: "stale" });
      continue;
    }
    const approved = fresh.filter((f) => f.reviewStatus === "approved");
    if (approved.length === 0) {
      gaps.push({ materialId, reason: "not-approved" });
      continue;
    }
    if (!approved.some((f) => f.buyerReadyEligible && f.quality !== "proxy")) {
      gaps.push({ materialId, reason: "not-buyer-ready" });
    }
  }
  return gaps;
}

export function assertPcfPremiumReleaseCoverage(
  registry: readonly PcfFactorRecord[],
  asOfIso: string,
): void {
  const gaps = pcfPremiumCoverageGaps(registry, asOfIso);
  if (gaps.length === 0) return;
  const summary = gaps.map((g) => `${g.materialId}:${g.reason}`).join(", ");
  throw new Error(`PCF premium factor coverage tamamlanmadı: ${summary}`);
}
