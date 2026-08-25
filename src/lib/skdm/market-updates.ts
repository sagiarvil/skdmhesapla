import marketData from "../../../data/seo/market-updates.json";

export type MarketPriority = "P0" | "P1" | "P2";
export type MarketPublicationState = "CANDIDATE" | "APPROVED" | "REJECTED";

export interface MarketSupportingSource {
  label: string;
  url: string;
}

export interface MarketUpdate {
  slug: string;
  publicationState: MarketPublicationState;
  humanReviewedAt: string;
  detectedAt: string;
  officialPublishedAt: string;
  priority: MarketPriority;
  sourceType: "MARKET_SIGNAL";
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
  supportingSources?: MarketSupportingSource[];
  authorityNote: string;
  productStatus: "IMPLEMENTED" | "ACTION_REQUIRED" | "MONITORING";
}

function isApproved(value: unknown): value is MarketUpdate {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<MarketUpdate>;
  return item.publicationState === "APPROVED" && Boolean(item.humanReviewedAt) && Boolean(item.slug) && Boolean(item.sourceUrl);
}

export const MARKET_UPDATES: readonly MarketUpdate[] = (marketData.updates as unknown[])
  .filter(isApproved)
  .sort((a, b) => Date.parse(b.detectedAt) - Date.parse(a.detectedAt));

export const LATEST_MARKET_UPDATE: MarketUpdate | undefined = MARKET_UPDATES[0];
