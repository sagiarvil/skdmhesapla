import type { RegistryEntry } from "./types";

export const EXTRA_REGISTRY_ENTRIES = [
  {
    route: "/mevzuat-guncellemeleri/",
    role: "hub",
    state: "PUBLISHED_INDEXABLE",
    canonicalRoute: "/mevzuat-guncellemeleri/",
    title: "AB SKDM Mevzuat Güncellemeleri — SKDMHesapla",
    metaDescription:
      "AB CBAM/SKDM mevzuatı, uygulama tüzükleri, varsayılan değerler, rehberler, doğrulama ve Registry değişikliklerini ürün etkisiyle takip edin.",
    h1: "AB SKDM mevzuat güncellemeleri",
    primaryIntent: "skdm-regulatory-updates",
    intentOwner: true,
    schemaTypes: ["CollectionPage", "ItemList", "WebPage"],
    sourceRefs: ["eu-2023-956", "ec-cbam-portal"],
    legalClaims: true,
    humanReviewedAt: "2026-08-22",
    modifiedAt: "2026-08-22",
    limitations:
      "Güncelleme özetleri bilgilendirme ve ürün etki analizi içindir; bağlayıcı kaynak EUR-Lex ve Avrupa Komisyonu resmi metinleridir.",
    uniqueValueTypes: ["regulatory-change-log", "module-impact", "implementation-status"],
    decisionEnabled: true,
    uniqueDecisionFields: ["priority", "effective-date", "affected-module", "required-action"],
    conversionEvent: "organic_scope_check_started",
    parentHub: "/rehber/",
    relatedRoutes: ["/mevzuat/", "/metodoloji/", "/rehber/", "/basla/"],
    internalInLinks: ["/", "/rehber/"],
    programmatic: false,
    crawlable: true,
  },
] as unknown as RegistryEntry[];
