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
  /** Runtime/UI status; implementation state'ten otomatik türetilir. */
  productStatus: RegulatoryProductStatus;
  implementation: RegulatoryImplementation;
}

type RawRegulatoryUpdate = Omit<RegulatoryUpdate, "implementation">;

type ImplementationContract = {
  slug: string;
  status?: RegulatoryProductStatus;
  monitoringOnly?: boolean;
  calculationImpact: RegulatoryCalculationImpact;
  engineState: RegulatoryLayerState;
  uiState: RegulatoryLayerState;
  blockingGaps: string[];
  surfaces: string[];
};

const implementationBySlug = new Map<string, ImplementationContract>(
  (implementationData.contracts as ImplementationContract[]).map((contract) => [contract.slug, contract]),
);

export function deriveRegulatoryProductStatus(contract: Pick<ImplementationContract, "monitoringOnly" | "engineState" | "uiState" | "blockingGaps">): RegulatoryProductStatus {
  if (contract.monitoringOnly) return "MONITORING";
  const engineClosed = contract.engineState === "WIRED" || contract.engineState === "NOT_REQUIRED";
  const uiClosed = contract.uiState === "WIRED";
  const noBlockingGaps = contract.blockingGaps.length === 0;
  return engineClosed && uiClosed && noBlockingGaps ? "IMPLEMENTED" : "ACTION_REQUIRED";
}

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
  const fallback: ImplementationContract = {
    slug: item.slug,
    calculationImpact: "NONE",
    engineState: "PENDING",
    uiState: "PENDING",
    blockingGaps: ["Bu mevzuat kaydı için implementation contract henüz oluşturulmadı."],
    surfaces: [],
  };
  const source = contract ?? fallback;
  const derivedStatus = deriveRegulatoryProductStatus(source);
  const implementation: RegulatoryImplementation = {
    status: derivedStatus,
    calculationImpact: source.calculationImpact,
    engineState: source.engineState,
    uiState: source.uiState,
    blockingGaps: source.blockingGaps,
    surfaces: source.surfaces,
  };

  return {
    ...item,
    // Hem legacy productStatus hem contract.status gösterimde otorite değildir.
    // Status yalnız motor/UI/gap durumundan türetilir.
    productStatus: derivedStatus,
    implementation,
  };
}

/**
 * İçerik SSOT: data/seo/regulatory-updates.json
 * Uygulama sözleşmesi: data/seo/regulatory-implementation.json
 * Status bu sözleşmedeki gerçek layer state + blocking gap durumundan türetilir.
 */
export const REGULATORY_UPDATES: readonly RegulatoryUpdate[] = regulatoryData.updates
  .filter(isApprovedUpdate)
  .map(attachImplementation)
  .sort((a, b) => Date.parse(b.detectedAt) - Date.parse(a.detectedAt));

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
