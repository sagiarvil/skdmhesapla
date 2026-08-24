import regulatoryData from "../../../data/seo/regulatory-updates.json";

export type RegulatoryPriority = "P0" | "P1" | "P2";
export type RegulatorySourceType =
  | "BINDING_ACT"
  | "OFFICIAL_DATASET"
  | "OFFICIAL_GUIDANCE"
  | "OPERATIONAL_MANUAL";
export type RegulatoryProductStatus = "IMPLEMENTED" | "ACTION_REQUIRED" | "MONITORING";
export type RegulatoryPublicationState = "CANDIDATE" | "APPROVED" | "REJECTED";

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
  productStatus: RegulatoryProductStatus;
}

function isApprovedUpdate(value: unknown): value is RegulatoryUpdate {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<RegulatoryUpdate>;
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

/**
 * Tek production otoritesi data/seo/regulatory-updates.json'dır.
 * CANDIDATE kayıtlar UI, sitemap, llms ve markdown çıktısına kesinlikle girmez.
 */
export const REGULATORY_UPDATES: readonly RegulatoryUpdate[] = regulatoryData.updates
  .filter(isApprovedUpdate)
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
