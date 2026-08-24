import regulatoryData from "../../../data/seo/regulatory-updates.json";
import implementationData from "../../../data/seo/regulatory-implementation.json";

export type RegulatoryPriority = "P0" | "P1" | "P2";
export type RegulatorySourceType =
  | "BINDING_ACT"
  | "OFFICIAL_DATASET"
  | "OFFICIAL_GUIDANCE"
  | "OPERATIONAL_MANUAL";
export type RegulatoryProductStatus = "IMPLEMENTED" | "ACTION_REQUIRED" | "MONITORING";
export type RegulatoryPublicationState = "CANDIDATE" | "APPROVED" | "REJECTED";
export type RegulatoryCalculationImpact =
  | "NONE"
  | "WORKFLOW_ONLY"
  | "REFERENCE_DATA"
  | "METHODOLOGY_REVIEW";
export type RegulatoryLayerState = "WIRED" | "PARTIAL" | "NOT_REQUIRED" | "PENDING";

export interface RegulatoryImplementation {
  status: RegulatoryProductStatus;
  calculationImpact: RegulatoryCalculationImpact;
  engineState: RegulatoryLayerState;
  uiState: RegulatoryLayerState;
  blockingGaps: readonly string[];
  surfaces: readonly string[];
}

export interface RegulatoryUpdate {
  slug: string;
  publicationState: RegulatoryPublicationState;
  humanReviewedAt: string;
  detectedAt: string;
  officialPublishedAt: string;
  priority: RegulatoryPriority;
  sourceType: RegulatorySourceType;
  sourceTypeLabel: string;
  title: string;
  shortTitle: string;
  summary: string;
  relevantPeriod: string;
  exporterImpact: string;
  userActions: string[];
  affectedModules: string[];
  requiredActions: string[];
  sourceLabel: string;
  sourceUrl: string;
  legalBasis?: string;
  authorityNote: string;
  /** Runtime/UI status. Tek otorite regulatory-implementation.json sözleşmesidir. */
  productStatus: RegulatoryProductStatus;
  implementation: RegulatoryImplementation;
}

type RawRegulatoryUpdate = Omit<RegulatoryUpdate, "implementation">;

type ImplementationContract = {
  slug: string;
  status: RegulatoryProductStatus;
  calculationImpact: RegulatoryCalculationImpact;
  engineState: RegulatoryLayerState;
  uiState: RegulatoryLayerState;
  blockingGaps: string[];
  surfaces: string[];
};

const implementationBySlug = new Map<string, ImplementationContract>(
  (implementationData.contracts as ImplementationContract[]).map((contract) => [contract.slug, contract]),
);

function isApprovedUpdate(value: unknown): value is RawRegulatoryUpdate {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<RawRegulatoryUpdate>;
  return (
    item.publicationState === "APPROVED" &&
    typeof item.slug === "string" &&
    typeof item.humanReviewedAt === "string" &&
    item.humanReviewedAt.length > 0 &&
    typeof item.detectedAt === "string" &&
    typeof item.officialPublishedAt === "string" &&
    typeof item.title === "string" &&
    typeof item.sourceUrl === "string"
  );
}

function attachImplementation(item: RawRegulatoryUpdate): RegulatoryUpdate {
  const contract = implementationBySlug.get(item.slug);
  const implementation: RegulatoryImplementation = contract
    ? {
        status: contract.status,
        calculationImpact: contract.calculationImpact,
        engineState: contract.engineState,
        uiState: contract.uiState,
        blockingGaps: contract.blockingGaps,
        surfaces: contract.surfaces,
      }
    : {
        status: "ACTION_REQUIRED",
        calculationImpact: "NONE",
        engineState: "PENDING",
        uiState: "PENDING",
        blockingGaps: ["Bu mevzuat kaydı için implementation contract henüz oluşturulmadı."],
        surfaces: [],
      };

  return {
    ...item,
    // data/seo/regulatory-updates.json içindeki legacy productStatus gösterimde kullanılmaz.
    // Böylece içerik kaydı ile gerçek uygulama durumu birbirinden kopamaz.
    productStatus: implementation.status,
    implementation,
  };
}

/**
 * İçerik SSOT: data/seo/regulatory-updates.json
 * Uygulama/status SSOT: data/seo/regulatory-implementation.json
 * CANDIDATE kayıtlar UI, sitemap, llms ve markdown çıktısına kesinlikle girmez.
 */
export const REGULATORY_UPDATES: readonly RegulatoryUpdate[] = regulatoryData.updates
  .filter(isApprovedUpdate)
  .map(attachImplementation)
  .sort((a, b) => Date.parse(b.detectedAt) - Date.parse(a.detectedAt));

/**
 * Mevzuat detay URL'sinin tek üreticisi. Güncellemeler ayrı SSG sayfalardır;
 * eski /mevzuat-guncellemeleri/#slug anchor modeli kullanılmaz.
 */
export function regulatoryUpdatePath(slug: string): string {
  const normalized = slug.trim().replace(/^\/+|\/+$/g, "");
  return `/mevzuat-guncellemeleri/${normalized}/`;
}

export function latestRegulatoryUpdates(limit = 3): readonly RegulatoryUpdate[] {
  return REGULATORY_UPDATES.slice(0, Math.max(0, limit));
}

export function getRegulatoryUpdate(slug: string): RegulatoryUpdate | undefined {
  return REGULATORY_UPDATES.find((item) => item.slug === slug);
}
