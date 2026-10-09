export type PageRole = 'home' | 'hub' | 'category' | 'service' | 'product' | 'tool' | 'article' | 'legal';
export type IndexDirective = 'index, follow' | 'noindex, follow' | 'noindex, nofollow';
export type MobilePrimaryAction = 'call' | 'navigate' | 'buy' | 'form' | 'scan' | 'chat';

export interface SemanticTriple {
  readonly subject: string;
  readonly predicate: string;
  readonly object: string;
}

export interface SeoEntityRef {
  readonly id: string;
  readonly name: string;
  readonly type: 'Organization' | 'Person' | 'Product' | 'Service' | 'SoftwareApplication';
  readonly sameAs: readonly string[];
  readonly wikidataQid?: `Q${number}`;
  readonly googleKgMid?: `/m/${string}` | `/g/${string}`;
}

export interface MobileConfig {
  readonly viewport: string;
  readonly primaryAction: MobilePrimaryAction;
  readonly bottomNavEnabled: boolean;
  readonly thumbZonePosition: 'bottom-center' | 'bottom-right';
  readonly touchTargetsValidated: boolean;
  readonly horizontalScrollFree: boolean;
  readonly thumbSafeHeroAnswer: boolean;
  readonly voiceQueryPatterns: readonly string[];
  readonly speakableSelectors: readonly string[];
  readonly pwaInstallable: boolean;
}

export interface MobileCwvBudget {
  readonly lcpMs: number;  // Max 2000
  readonly inpMs: number;  // Max 150
  readonly cls: number;    // Max 0.05
  readonly ttfbMs: number; // Max 300
  readonly htmlKb: number; // Max 60
}

export interface SeoPageRecord {
  readonly route: `/${string}` | '/';
  readonly locale: string;
  readonly role: PageRole;
  readonly indexDirective: IndexDirective;
  readonly canonicalRoute: `/${string}` | '/';
  readonly title: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly primaryIntent: string;
  readonly primaryEntity: SeoEntityRef;
  readonly semanticTriples: readonly SemanticTriple[];
  readonly heroAnswerEngine: string;
  readonly publishedAt: string;
  readonly modifiedAt: string;
  readonly bodyContentHash: string; // SHA-256 (Semantic Delta Check için)
  readonly llmSubGraphRoute: `/llms/pages/${string}.md`;
  readonly mobileSubGraphRoute: `/llms/mobile/${string}.md`;
  readonly breadcrumbs: readonly { readonly name: string; readonly item: string }[];
  readonly mobile: MobileConfig;
  readonly mobileCwvBudget: MobileCwvBudget;
}
