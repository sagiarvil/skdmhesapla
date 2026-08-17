import legalSourcesData from "../../../data/seo/legal-sources.json";

export interface LegalSourceItem {
  id: string;
  title: string;
  url: string;
  authority: string;
  documentType: string;
  number?: string;
  celex?: string;
  applicability: "TRANSITIONAL_PERIOD" | "DEFINITIVE_PERIOD" | "BOTH" | "REFERENCE_ONLY";
  status: string;
  supersededBy?: string | null;
  publicLlms: boolean;
  lastHumanReviewAt: string;
  scope: string;
  affects?: string[];
}

export const ALL_LEGAL_SOURCES: LegalSourceItem[] = legalSourcesData.sources as LegalSourceItem[];

export const PUBLIC_LEGAL_SOURCES: LegalSourceItem[] = ALL_LEGAL_SOURCES.filter(
  (s) =>
    s.publicLlms !== false &&
    s.authority !== "INTERNAL_GOVERNANCE" &&
    s.authority !== "internal-ssot" &&
    s.documentType !== "INTERNAL_MANDATE" &&
    s.documentType !== "product_mandate"
);

export function getLegalSourceById(id: string): LegalSourceItem | undefined {
  return ALL_LEGAL_SOURCES.find((s) => s.id === id);
}
