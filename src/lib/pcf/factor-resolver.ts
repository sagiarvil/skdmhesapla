import type {
  PcfFactorKind,
  PcfFactorRecord,
  PcfResolvedFactor,
  PcfSupplierFactor,
} from "./types";
import { isFactorValidAt, isReviewStatusUsable } from "./factor-registry";

export interface ResolvePcfFactorRequest {
  readonly kind: PcfFactorKind;
  readonly materialId: string;
  readonly geography: string;
  readonly asOfIso: string;
  readonly allowEstimate: boolean;
  readonly connectionType?: "distribution" | "transmission" | "unknown";
  readonly supplierFactor?: PcfSupplierFactor;
}

export type ResolvePcfFactorResult =
  | { readonly ok: true; readonly factor: PcfResolvedFactor }
  | { readonly ok: false; readonly code: string; readonly messageTr: string };

function supplierFactorToResolved(
  req: ResolvePcfFactorRequest,
  sf: PcfSupplierFactor,
): ResolvePcfFactorResult {
  if (!Number.isFinite(sf.valueKgCo2ePerKg) || sf.valueKgCo2ePerKg < 0) {
    return { ok: false, code: "PCF_SUPPLIER_FACTOR_VALUE", messageTr: "Tedarikçi karbon verisinin sayısal değeri gözden geçirilmelidir." };
  }
  if (!sf.evidenceRef.trim() || !sf.sourceDocumentId.trim() || !sf.sourceTitle.trim()) {
    return { ok: false, code: "PCF_SUPPLIER_FACTOR_EVIDENCE", messageTr: "Tedarikçi karbon verisi kaynak belgesi olmadan kullanılamaz." };
  }
  if (sf.validUntil && sf.validUntil < req.asOfIso.slice(0, 10)) {
    return { ok: false, code: "PCF_SUPPLIER_FACTOR_EXPIRED", messageTr: "Tedarikçi karbon verisinin geçerlilik tarihi dolmuş görünüyor." };
  }
  return {
    ok: true,
    factor: {
      factorId: `supplier:${sf.sourceDocumentId}`,
      factorLabel: sf.sourceTitle,
      kgCo2ePerActivityUnit: sf.valueKgCo2ePerKg,
      activityUnit: "kg",
      boundary: sf.boundary,
      quality: sf.thirdPartyVerified ? "supplier_specific_verified" : "supplier_specific_declared",
      reviewStatus: sf.thirdPartyVerified ? "approved" : "estimate_only",
      buyerReadyEligible: sf.thirdPartyVerified,
      source: {
        publisher: "Supplier",
        title: sf.sourceTitle,
        version: sf.sourceDocumentId,
        referenceYear: Number(sf.issuedAt.slice(0, 4)) || new Date(req.asOfIso).getUTCFullYear(),
        publishedAt: sf.issuedAt,
        reviewedAt: req.asOfIso.slice(0, 10),
        sourceUrl: sf.evidenceRef,
        licence: "Supplier-provided evidence; redistribution terms must be respected",
        sourceType: "supplier",
      },
      isProxy: false,
      limitations: sf.thirdPartyVerified
        ? []
        : ["Tedarikçi tarafından beyan edilmiştir; bağımsız üçüncü taraf doğrulaması belirtilmemiştir."],
    },
  };
}

function qualityRank(q: PcfFactorRecord["quality"]): number {
  switch (q) {
    case "supplier_specific_verified": return 60;
    case "epd_verified": return 50;
    case "official_generic": return 40;
    case "sector_generic": return 30;
    case "supplier_specific_declared": return 20;
    case "proxy": return 10;
  }
}

function geographyRank(f: PcfFactorRecord, geography: string): number {
  if (f.geographies.includes(geography)) return 30;
  if (f.geographies.includes("GLOBAL")) return 20;
  if (f.geographies.includes("GLOBAL_PROXY")) return 10;
  return 0;
}

function connectionMatches(f: PcfFactorRecord, connectionType: ResolvePcfFactorRequest["connectionType"]): boolean {
  if (f.kind !== "electricity") return true;
  if (connectionType !== "distribution" && connectionType !== "transmission") return false;
  if (f.connectionType) return f.connectionType === connectionType;
  const hay = `${f.id} ${f.labelEn} ${f.labelTr}`.toLowerCase();
  return connectionType === "distribution"
    ? hay.includes("distribution") || hay.includes("dağıtım")
    : hay.includes("transmission") || hay.includes("iletim");
}

export function resolvePcfFactor(
  request: ResolvePcfFactorRequest,
  registry: readonly PcfFactorRecord[],
): ResolvePcfFactorResult {
  if (request.supplierFactor) return supplierFactorToResolved(request, request.supplierFactor);

  if (
    request.kind === "electricity" &&
    request.connectionType !== "distribution" &&
    request.connectionType !== "transmission"
  ) {
    return {
      ok: false,
      code: "PCF_ELECTRICITY_CONNECTION_UNKNOWN",
      messageTr:
        "Elektrik bağlantı tipi belirtilmeden şebeke faktörü seçilmez; dağıtım hattı varsayılmadı.",
    };
  }

  const candidates = registry.filter((f) => {
    if (f.kind !== request.kind) return false;
    const direct = f.materialIds.includes(request.materialId);
    const proxy = f.proxyForMaterialIds?.includes(request.materialId) ?? false;
    if (!direct && !proxy) return false;
    if (!isReviewStatusUsable(f.reviewStatus, request.allowEstimate)) return false;
    if (!isFactorValidAt(f, request.asOfIso)) return false;
    if (!connectionMatches(f, request.connectionType)) return false;
    if (geographyRank(f, request.geography) === 0) return false;
    return true;
  });

  candidates.sort((a, b) => {
    const scoreA = qualityRank(a.quality) + geographyRank(a, request.geography) + a.source.referenceYear / 10000;
    const scoreB = qualityRank(b.quality) + geographyRank(b, request.geography) + b.source.referenceYear / 10000;
    return scoreB - scoreA || a.id.localeCompare(b.id);
  });

  const selected = candidates[0];
  if (!selected) {
    return {
      ok: false,
      code: "PCF_FACTOR_NOT_RESOLVED",
      messageTr: `${request.materialId} için güncel, kapsamı tanımlı ve kullanılabilir emisyon faktörü bulunamadı. Sayı uydurulmadı.`,
    };
  }

  return {
    ok: true,
    factor: {
      factorId: selected.id,
      factorLabel: selected.labelTr,
      kgCo2ePerActivityUnit: selected.kgCo2ePerActivityUnit,
      activityUnit: selected.activityUnit,
      boundary: selected.boundary,
      quality: selected.quality,
      reviewStatus: selected.reviewStatus,
      buyerReadyEligible: selected.buyerReadyEligible,
      source: selected.source,
      isProxy: selected.quality === "proxy" || !selected.materialIds.includes(request.materialId),
      limitations: selected.limitations,
    },
  };
}
