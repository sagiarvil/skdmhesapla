export type PcfReportStatus = "buyer_ready" | "estimated" | "blocked";

export type PcfFactorKind = "material" | "packaging" | "electricity" | "fuel";

export type PcfActivityUnit = "kg" | "kWh" | "Nm3" | "litre" | "kg_fuel";

export type PcfBoundary =
  | "cradle-to-gate"
  | "material-production-only"
  | "scope2-location-based"
  | "combustion-only";

export type PcfFactorQuality =
  | "supplier_specific_verified"
  | "supplier_specific_declared"
  | "epd_verified"
  | "official_generic"
  | "sector_generic"
  | "proxy";

export type PcfReviewStatus = "approved" | "estimate_only" | "pending_review" | "deprecated" | "blocked";

export type PcfElectricityConnection = "distribution" | "transmission" | "unknown";

export interface PcfSourceRef {
  readonly publisher: string;
  readonly title: string;
  readonly version: string;
  readonly referenceYear: number;
  readonly publishedAt?: string;
  readonly reviewedAt: string;
  readonly nextReviewAt?: string;
  readonly sourceUrl: string;
  readonly licence: string;
  readonly sourceType: "official" | "standard" | "epd" | "supplier" | "other";
  readonly notes?: string;
}

export interface PcfFactorRecord {
  readonly id: string;
  readonly kind: PcfFactorKind;
  readonly labelTr: string;
  readonly labelEn: string;
  readonly materialIds: readonly string[];
  readonly aliases: readonly string[];
  readonly geographies: readonly string[];
  readonly activityUnit: PcfActivityUnit;
  readonly kgCo2ePerActivityUnit: number;
  readonly boundary: PcfBoundary;
  readonly gwpBasis: string;
  readonly quality: PcfFactorQuality;
  readonly reviewStatus: PcfReviewStatus;
  readonly buyerReadyEligible: boolean;
  readonly validFrom?: string;
  readonly validTo?: string;
  /** Elektrik kayıtları için iletim/dağıtım ayrımı; etiket string eşlemesine güvenilmez. */
  readonly connectionType?: Exclude<PcfElectricityConnection, "unknown">;
  readonly source: PcfSourceRef;
  readonly proxyForMaterialIds?: readonly string[];
  readonly limitations: readonly string[];
}

export interface PcfSupplierFactor {
  readonly valueKgCo2ePerKg: number;
  readonly sourceTitle: string;
  readonly sourceDocumentId: string;
  readonly issuedAt: string;
  readonly validUntil?: string;
  readonly thirdPartyVerified: boolean;
  readonly boundary: "cradle-to-gate";
  readonly evidenceRef: string;
}

export interface PcfEvidenceFlags {
  readonly productionRecord: boolean;
  readonly electricityInvoice: boolean;
  readonly fuelInvoice: boolean;
  readonly materialEvidenceCount: number;
}

export interface PcfMaterialInput {
  readonly id: string;
  readonly materialId: string;
  readonly label: string;
  /** Functional unit başına fiziksel malzeme miktarı. */
  readonly quantityKgPerFunctionalUnit: number;
  readonly origin: "primary" | "recycled" | "unknown";
  readonly supplierFactor?: PcfSupplierFactor;
}

export interface PcfPackagingInput {
  readonly id: string;
  readonly materialId: string;
  readonly label: string;
  readonly quantityKgPerFunctionalUnit: number;
  readonly origin: "primary" | "recycled" | "unknown";
  readonly supplierFactor?: PcfSupplierFactor;
}

export interface PcfElectricityInput {
  readonly consumptionKwhForPeriod: number;
  readonly connectionType: PcfElectricityConnection;
  readonly geography: string;
}

export interface PcfFuelInput {
  readonly id: string;
  readonly fuelId: string;
  readonly label: string;
  readonly quantityForPeriod: number;
  readonly activityUnit: Exclude<PcfActivityUnit, "kg" | "kWh">;
  readonly geography: string;
}

export interface PcfInput {
  readonly reportId: string;
  readonly createdAt: string;
  readonly companyName: string;
  readonly facilityName: string;
  readonly country: string;
  readonly buyerName?: string;
  readonly productName: string;
  readonly cnCode?: string;
  readonly reportingPeriodStart: string;
  readonly reportingPeriodEnd: string;
  readonly functionalUnit: string;
  readonly productionQuantityForPeriod: number;
  readonly allocationShare: number;
  readonly allocationMethod: string;
  readonly materials: readonly PcfMaterialInput[];
  readonly packaging: readonly PcfPackagingInput[];
  readonly electricity?: PcfElectricityInput;
  readonly fuels: readonly PcfFuelInput[];
  readonly evidence: PcfEvidenceFlags;
}

export type PcfContributionCategory = "scope1" | "scope2" | "upstream_material" | "packaging";

export interface PcfResolvedFactor {
  readonly factorId: string;
  readonly factorLabel: string;
  readonly kgCo2ePerActivityUnit: number;
  readonly activityUnit: PcfActivityUnit;
  readonly boundary: PcfBoundary;
  readonly quality: PcfFactorQuality;
  readonly reviewStatus: PcfReviewStatus;
  readonly buyerReadyEligible: boolean;
  readonly source: PcfSourceRef;
  readonly isProxy: boolean;
  readonly limitations: readonly string[];
}

export interface PcfContribution {
  readonly id: string;
  readonly label: string;
  readonly category: PcfContributionCategory;
  readonly activityQuantity: number;
  readonly activityUnit: PcfActivityUnit;
  readonly kgCo2ePerFunctionalUnit: number;
  readonly factor: PcfResolvedFactor;
}

export interface PcfFinding {
  readonly code: string;
  readonly severity: "blocking" | "warning" | "note";
  readonly messageTr: string;
  readonly fieldRef?: string;
}

export interface PcfQualitySummary {
  readonly grade: "DQ1" | "DQ2" | "DQ3" | "DQ4";
  readonly factorProvenanceCoverage: number;
  readonly proxyContributionRatio: number;
  readonly genericContributionRatio: number;
  readonly verifiedSupplierContributionRatio: number;
  readonly evidenceComplete: boolean;
}

export interface PcfResult {
  readonly engineVersion: string;
  readonly methodologyVersion: string;
  readonly status: PcfReportStatus;
  readonly totalKgCo2ePerFunctionalUnit: number;
  readonly scope1KgCo2ePerFunctionalUnit: number;
  readonly scope2KgCo2ePerFunctionalUnit: number;
  readonly upstreamMaterialKgCo2ePerFunctionalUnit: number;
  readonly packagingKgCo2ePerFunctionalUnit: number;
  readonly contributions: readonly PcfContribution[];
  readonly findings: readonly PcfFinding[];
  readonly quality: PcfQualitySummary;
  readonly methodologyStatement: string;
}
