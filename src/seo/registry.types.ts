/**
 * SSOT Registry & Kanonik Gerçeklik Mimarisi
 * MANDATE-SUPER-UNIVERSAL-2026-V3 Bölüm 2.2
 */

export type PageRole =
  | 'home'
  | 'hub'
  | 'category'
  | 'product'
  | 'service'
  | 'tool'
  | 'article'
  | 'legal';

export type IndexDirective =
  | 'index, follow'
  | 'noindex, follow'
  | 'noindex, nofollow';

export interface SemanticTriple {
  readonly subject: string;   // [Marka / Varlık]
  readonly predicate: string; // [Sunar / Çözer / İçerir]
  readonly object: string;    // [Çözüm / Standart / Ürün]
}

export interface UniversalEntityRef {
  readonly id: string;
  readonly name: string;
  readonly type: 'Organization' | 'Person' | 'Product' | 'Service' | 'SoftwareApplication';
  readonly wikidataQid?: `Q${number}`;
  readonly googleMid?: string;
  readonly sameAs: readonly string[];
}

export interface UniversalPageRecord {
  readonly route: `/${string}` | '/';
  readonly locale: string; // 'tr' | 'en' | 'de' vb.
  readonly role: PageRole;
  readonly indexDirective: IndexDirective;
  readonly canonicalRoute: `/${string}` | '/';
  readonly title: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly primaryIntent: string;
  readonly primaryEntity: UniversalEntityRef;
  readonly semanticTriples: readonly SemanticTriple[];
  readonly heroAnswerEngine: string; // 29-80 kelime, ilk 100px
  readonly publishedAt: string;      // ISO 8601
  readonly modifiedAt: string;       // GERÇEK güncelleme — Asla sahte tarih yok (%15 Delta şartı)
  readonly llmSubGraphRoute?: `/llms/${string}.md`;
  readonly breadcrumbs: readonly { readonly name: string; readonly item: string }[];
}
