export type RegulatorySourceRole =
  | "primary-regulation"
  | "definitive-methodology"
  | "simplification"
  | "transitional-historical"
  | "guidance"
  | "standard";

export interface RegulatorySource {
  readonly id: string;
  readonly title: string;
  readonly shortLabel: string;
  readonly regulationNumber?: string;
  readonly role: RegulatorySourceRole;
  readonly adoptedAt?: string;
  readonly publishedAt?: string;
  readonly effectiveAt?: string;
  readonly sourceUrl: string;
  readonly lastHumanReviewAt: string;
  readonly context: string;
}

/**
 * Public SEO/GEO source SSOT.
 *
 * IMPORTANT: This registry describes source identity/provenance only. It must
 * never override RM-001…004 calculation or legal rules. Calculation logic must
 * continue to cite the authoritative RM documents.
 */
export const REGULATORY_SOURCES = {
  cbamRegulation: {
    id: "eu-2023-956",
    title: "Regulation (EU) 2023/956",
    shortLabel: "(EU) 2023/956",
    regulationNumber: "2023/956",
    role: "primary-regulation",
    sourceUrl: "https://eur-lex.europa.eu/eli/reg/2023/956/oj",
    lastHumanReviewAt: "2026-08-20",
    context: "CBAM ana hukuki dayanağı.",
  },
  definitiveSimplification: {
    id: "eu-2025-2083",
    title: "Regulation (EU) 2025/2083",
    shortLabel: "(EU) 2025/2083",
    regulationNumber: "2025/2083",
    role: "simplification",
    sourceUrl: "https://eur-lex.europa.eu/eli/reg/2025/2083/oj",
    lastHumanReviewAt: "2026-08-20",
    context: "Kesin dönem CBAM sadeleştirme ve değişiklik düzenlemesi.",
  },
  definitiveMethodology: {
    id: "eu-2025-2547",
    title: "Commission Implementing Regulation (EU) 2025/2547",
    shortLabel: "(EU) 2025/2547",
    regulationNumber: "2025/2547",
    role: "definitive-methodology",
    adoptedAt: "2025-12-10",
    publishedAt: "2025-12-22",
    sourceUrl: "https://eur-lex.europa.eu/eli/reg_impl/2025/2547/oj",
    lastHumanReviewAt: "2026-08-20",
    context: "2026+ kesin dönem gömülü emisyon hesaplama metodolojisi.",
  },
  transitionalMethodology: {
    id: "eu-2023-1773",
    title: "Commission Implementing Regulation (EU) 2023/1773",
    shortLabel: "(EU) 2023/1773",
    regulationNumber: "2023/1773",
    role: "transitional-historical",
    sourceUrl: "https://eur-lex.europa.eu/eli/reg_impl/2023/1773/oj",
    lastHumanReviewAt: "2026-08-20",
    context: "Yalnızca 2023–2025 geçiş dönemi için tarihsel referans; 2026+ kesin dönem metodolojisinin ana kaynağı değildir.",
  },
} as const satisfies Record<string, RegulatorySource>;

export const DEFINITIVE_PERIOD_SOURCES: readonly RegulatorySource[] = [
  REGULATORY_SOURCES.cbamRegulation,
  REGULATORY_SOURCES.definitiveSimplification,
  REGULATORY_SOURCES.definitiveMethodology,
  REGULATORY_SOURCES.transitionalMethodology,
];

export function findRegulatorySourceByTitle(title: string): RegulatorySource | undefined {
  return Object.values(REGULATORY_SOURCES).find((source) => source.title === title);
}
