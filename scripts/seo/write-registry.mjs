#!/usr/bin/env node
/**
 * One-shot authoring helper. SSOT is data/seo/registry.json after write.
 * CI validates the JSON; it does not regenerate it.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const REVIEW = "2026-08-17";
const MOD = "2026-08-17";
const HOST = "https://skdmhesapla.com";

const SRC = ["eu-2023-956", "ec-cbam-portal", "agents1"];
const SRC_OMNI = ["eu-2023-956", "eu-2025-2083", "agents1"];

function e(partial) {
  const route = partial.route;
  const self = `${HOST}${route}`;
  return {
    route,
    role: partial.role,
    state: partial.state,
    canonicalRoute: partial.canonicalRoute || route,
    title: partial.title,
    metaDescription: partial.metaDescription,
    h1: partial.h1,
    primaryIntent: partial.primaryIntent,
    intentOwner: partial.intentOwner ?? true,
    schemaTypes: partial.schemaTypes,
    sourceRefs: partial.sourceRefs || SRC,
    legalClaims: partial.legalClaims || false,
    humanReviewedAt: partial.humanReviewedAt || REVIEW,
    modifiedAt: partial.modifiedAt || MOD,
    limitations: partial.limitations,
    uniqueValueTypes: partial.uniqueValueTypes,
    decisionEnabled: partial.decisionEnabled ?? false,
    uniqueDecisionFields: partial.uniqueDecisionFields || [],
    conversionEvent: partial.conversionEvent,
    parentHub: partial.parentHub || null,
    relatedRoutes: partial.relatedRoutes || [],
    internalInLinks: partial.internalInLinks || ["/"],
    programmatic: partial.programmatic ?? false,
    crawlable: partial.crawlable ?? true,
  };
}

const LIMIT_NO_OPINION =
  "Sistem akredite doğrulama görüşü veya gümrük onayı vermez. Kapsam kararı doğrulanmış CN/GTİP sınıflandırmasına bağlıdır.";
const LIMIT_APP =
  "Uygulama/oturum yüzeyi. Kimlik doğrulama ile korunur; robots ile gizlenmez.";
const LIMIT_TIER_B =
  "SKDM Kademe A kapsamı dışıdır. Bu URL SKDM hesap motoruna ticari hüküm olarak bağlanamaz.";

const relatedCore = ["/rehber/", "/sozluk/", "/basla/", "/nasil-calisir/"];

const entries = [
  e({
    route: "/",
    role: "home",
    state: "PUBLISHED_INDEXABLE",
    title: "SKDMHesapla — AB SKDM çalışma dosyası",
    metaDescription:
      "Türk ihracatçılar için SKDM/CBAM doğrulamaya-hazır çalışma dosyası. GTİP ile kapsam kontrolü, 10 katmanlı şablon ve mühürlü paket.",
    h1: "AB'ye ihracat yapıyorsanız, SKDM dosyanızı kendiniz hazırlayın",
    primaryIntent: "skdm-hesapla-home",
    schemaTypes: ["Organization", "WebSite", "WebPage", "SoftwareApplication"],
    uniqueValueTypes: ["product-purpose", "scope-entry", "cta-basla"],
    conversionEvent: "organic_scope_check_started",
    relatedRoutes: ["/basla/", "/rehber/", "/sektor/demir-celik/", "/metodoloji/"],
    limitations: LIMIT_NO_OPINION,
    legalClaims: true,
  }),
  e({
    route: "/basla/",
    role: "toolLanding",
    state: "PUBLISHED_INDEXABLE",
    title: "Başla — GTİP / CN ile SKDM kapsam kontrolü",
    metaDescription:
      "Ürün adı hukuki kapsam kararı değildir. GTİP veya CN kodunuzu girin; Kademe A evreninde olup olmadığınızı kontrol edin.",
    h1: "Kapsam kararı GTİP / CN kodundan başlar",
    primaryIntent: "cn-gtip-scope-check",
    schemaTypes: ["WebPage", "SoftwareApplication"],
    uniqueValueTypes: ["cn-input", "sector-triage", "inv-01"],
    decisionEnabled: true,
    uniqueDecisionFields: ["cn-or-gtip", "sector-family", "tier-a-vs-out"],
    conversionEvent: "organic_scope_check_started",
    relatedRoutes: ["/rehber/", "/sozluk/", "/metodoloji/"],
    limitations: LIMIT_NO_OPINION,
    legalClaims: true,
    sourceRefs: SRC_OMNI,
  }),
  e({
    route: "/nasil-calisir/",
    role: "article",
    state: "PUBLISHED_INDEXABLE",
    title: "Nasıl çalışır — triyaj, 10 katman ve mühür",
    metaDescription:
      "SKDMHesapla akışı: GTİP triyajı, resmi şablon katmanları, kalite kontrol ve mühürlü paket. Akredite görüş değildir.",
    h1: "SKDM çalışma dosyası nasıl üretilir",
    primaryIntent: "how-skdmhesapla-works",
    schemaTypes: ["Article", "WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["flow", "layer-count", "seal-boundary"],
    conversionEvent: "wizard_started",
    parentHub: "/",
    relatedRoutes: ["/basla/", "/rehber/", "/metodoloji/"],
    limitations: LIMIT_NO_OPINION,
    legalClaims: true,
  }),
  e({
    route: "/rehber/",
    role: "hub",
    state: "PUBLISHED_INDEXABLE",
    title: "SKDM rehberi — karar ağacı ve uygulama",
    metaDescription:
      "SKDM nedir, kimler kapsamda, de minimis, varsayılan değerler, TR-ETS mahsup ve 2026 kesin dönem takvimi.",
    h1: "SKDM rehberi",
    primaryIntent: "skdm-rehber-hub",
    schemaTypes: ["CollectionPage", "WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["decision-tree", "calendar", "de-minimis"],
    conversionEvent: "organic_scope_check_started",
    relatedRoutes: ["/sozluk/", "/basla/", "/mevzuat/", "/metodoloji/", "/rehber/gtip-bulma/"],
    limitations: LIMIT_NO_OPINION,
    legalClaims: true,
    sourceRefs: SRC_OMNI,
  }),
  e({
    route: "/rehber/gtip-bulma/",
    role: "article",
    state: "PUBLISHED_INDEXABLE",
    title: "GTİP / CN kodunu nerede bulursunuz",
    metaDescription:
      "Kapsam kararı için en az 4 haneli GTİP. Gümrük beyannamesi kutu 33, fatura ve gümrük müşaviri. Gümrük kararı değildir.",
    h1: "GTİP / CN kodunu nerede bulursunuz",
    primaryIntent: "gtip-find-guide",
    schemaTypes: ["Article", "WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["gtip-box-33", "cn-lookup"],
    conversionEvent: "organic_scope_check_started",
    parentHub: "/rehber/",
    relatedRoutes: ["/basla/", "/rehber/", "/tedarikci-verisi/hazirla/"],
    limitations: LIMIT_NO_OPINION,
    legalClaims: true,
    sourceRefs: SRC_OMNI,
  }),
  e({
    route: "/sozluk/",
    role: "glossaryHub",
    state: "PUBLISHED_INDEXABLE",
    title: "SKDM sözlüğü — terimler ve kanıt düğümleri",
    metaDescription:
      "SEE, CN/GTİP, de minimis, Annex II, doğrulayıcı ve TR-ETS terimleri. Hub, leaf sayfalarının tam metnini kopyalamaz.",
    h1: "SKDM sözlüğü",
    primaryIntent: "skdm-sozluk-hub",
    schemaTypes: ["CollectionPage", "WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["term-index", "evidence-nodes"],
    conversionEvent: "organic_scope_check_started",
    relatedRoutes: ["/rehber/", "/sozluk/cbam/", "/sozluk/de-minimis/"],
    limitations: LIMIT_NO_OPINION,
    legalClaims: true,
    sourceRefs: SRC_OMNI,
  }),
  e({
    route: "/fiyatlandirma/",
    role: "article",
    state: "PUBLISHED_INDEXABLE",
    title: "Fiyatlandırma — mühürlü paket",
    metaDescription:
      "SKDMHesapla mühür fiyatı ve nelerin dahil olduğu. Danışmanlık veya garantili uyum satılmaz.",
    h1: "Mühürlü paket fiyatı",
    primaryIntent: "pricing-seal",
    schemaTypes: ["WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["price-visible", "what-is-included"],
    conversionEvent: "seal_intent",
    relatedRoutes: ["/nasil-calisir/", "/basla/"],
    limitations: "Fiyat görünür içerikle aynıdır. Sahte rating/review yok.",
    legalClaims: false,
    sourceRefs: ["cursor-is-emri"],
  }),
  e({
    route: "/kullanim-kosullari/",
    role: "article",
    state: "PUBLISHED_INDEXABLE",
    title: "Kullanım koşulları",
    metaDescription: "SKDMHesapla hizmet koşulları, sorumluluk sınırı ve mühür kapsamı.",
    h1: "Kullanım koşulları",
    primaryIntent: "terms-of-use",
    schemaTypes: ["WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["legal-terms"],
    conversionEvent: "organic_scope_check_started",
    relatedRoutes: ["/kvkk-aydinlatma/", "/iade-politikasi/"],
    limitations: LIMIT_NO_OPINION,
  }),
  e({
    route: "/kvkk-aydinlatma/",
    role: "article",
    state: "PUBLISHED_INDEXABLE",
    title: "KVKK aydınlatma metni",
    metaDescription: "Kişisel verilerin işlenmesi, saklama ve haklar — SKDMHesapla.",
    h1: "KVKK aydınlatma metni",
    primaryIntent: "privacy-kvkk",
    schemaTypes: ["WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["privacy"],
    conversionEvent: "organic_scope_check_started",
    relatedRoutes: ["/kullanim-kosullari/"],
    limitations: "Kişisel veri robots ile korunmaz; yetkilendirme ile korunur.",
  }),
  e({
    route: "/iade-politikasi/",
    role: "article",
    state: "PUBLISHED_INDEXABLE",
    title: "İade politikası",
    metaDescription: "Dijital mühürlü paket için iade ve cayma koşulları.",
    h1: "İade politikası",
    primaryIntent: "refund-policy",
    schemaTypes: ["WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["refund-rules"],
    conversionEvent: "purchase",
    relatedRoutes: ["/fiyatlandirma/", "/kullanim-kosullari/"],
    limitations: "Dijital teslimat kuralları kullanım koşullarıyla birlikte okunur.",
  }),
  e({
    route: "/iletisim/",
    role: "article",
    state: "PUBLISHED_INDEXABLE",
    title: "İletişim",
    metaDescription: "SKDMHesapla iletişim — CimetricaOne, e-posta ve yasal bildirim.",
    h1: "İletişim",
    primaryIntent: "contact",
    schemaTypes: ["WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["contact-entity"],
    conversionEvent: "organic_scope_check_started",
    relatedRoutes: ["/hakkinda/", "/uzmanlik/baris-bagirlar/"],
    limitations: LIMIT_NO_OPINION,
    sourceRefs: ["cursor-is-emri"],
  }),
  e({
    route: "/hakkinda/",
    role: "article",
    state: "PUBLISHED_INDEXABLE",
    title: "Hakkında — SKDMHesapla ve CimetricaOne",
    metaDescription: "Ürün sınırı, işletmeci kimliği ve akredite görüş vermeme taahhüdü.",
    h1: "Hakkında",
    primaryIntent: "about-company",
    schemaTypes: ["WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["entity", "product-boundary"],
    conversionEvent: "organic_scope_check_started",
    relatedRoutes: ["/uzmanlik/baris-bagirlar/", "/kaynak-politikasi/"],
    limitations: LIMIT_NO_OPINION,
    sourceRefs: ["cursor-is-emri", "agents1"],
  }),
  e({
    route: "/dogrula/",
    role: "toolLanding",
    state: "PUBLISHED_INDEXABLE",
    title: "Mühür doğrula",
    metaDescription: "Mühürlü SKDM paketinin SHA-256 ve kayıt doğrulaması.",
    h1: "Mühürlü paketi doğrulayın",
    primaryIntent: "verify-seal",
    schemaTypes: ["WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["hash-verify"],
    conversionEvent: "seal_intent",
    relatedRoutes: ["/nasil-calisir/", "/fiyatlandirma/"],
    limitations: "Doğrulama, akredite doğrulama görüşü değildir.",
  }),
  e({
    route: "/tedarikci-verisi/",
    role: "hub",
    state: "PUBLISHED_INDEXABLE",
    title: "Tedarikçi karbon veri dosyası",
    metaDescription:
      "SKDM Kademe A dışındaki alıcı talepleri için ISO 14067 tedarikçi veri dosyası. SKDM kapsam hükmü değildir.",
    h1: "Tedarikçi karbon verisi",
    primaryIntent: "supplier-carbon-file-hub",
    schemaTypes: ["CollectionPage", "WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["tier-b-boundary", "iso-14067"],
    conversionEvent: "wizard_started",
    relatedRoutes: ["/basla/", "/rehber/", "/tedarikci-verisi/hazirla/"],
    limitations: LIMIT_TIER_B,
    legalClaims: true,
    sourceRefs: ["agents1"],
  }),
  e({
    route: "/tedarikci-verisi/hazirla/",
    role: "toolLanding",
    state: "PUBLISHED_INDEXABLE",
    title: "Tedarikçi karbon dosyası hazırla",
    metaDescription:
      "SKDM Kademe A dışındaki alıcı talepleri için ISO 14067 tedarikçi veri dosyası. SKDM kapsam hükmü değildir.",
    h1: "Tedarikçi karbon dosyası",
    primaryIntent: "supplier-data-prepare",
    schemaTypes: ["WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["tier-b-entry", "material-bridge"],
    conversionEvent: "wizard_started",
    parentHub: "/tedarikci-verisi/",
    relatedRoutes: ["/tedarikci-verisi/", "/basla/", "/kapsam-disi-beyani/"],
    limitations: LIMIT_TIER_B,
    legalClaims: true,
    sourceRefs: ["agents1"],
  }),
  e({
    route: "/kapsam-disi-beyani/",
    role: "toolLanding",
    state: "PUBLISHED_INDEXABLE",
    title: "Kapsam dışı beyan notu",
    metaDescription:
      "SKDM kapsamı dışında görünen ürün için alıcıya iletilecek kısa not. Gümrük kararı veya akredite görüş değildir.",
    h1: "Kapsam dışı beyan notu",
    primaryIntent: "out-of-scope-declaration",
    schemaTypes: ["WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["out-of-scope-note"],
    conversionEvent: "organic_scope_check_started",
    relatedRoutes: ["/tedarikci-verisi/hazirla/", "/basla/"],
    limitations: LIMIT_NO_OPINION,
    legalClaims: true,
    sourceRefs: SRC,
  }),
  e({
    route: "/tedarikci-verisi/csrd-kapsam-3/",
    role: "article",
    state: "PUBLISHED_INDEXABLE",
    title: "CSRD / Kapsam 3 tedarikçi verisi",
    metaDescription: "CSRD Kapsam 3 talebi SKDM kapsam kararı değildir. Veri dosyası sınırı.",
    h1: "CSRD ve Kapsam 3",
    primaryIntent: "csrd-scope3-supplier",
    schemaTypes: ["Article", "WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["csrd-boundary"],
    conversionEvent: "wizard_started",
    parentHub: "/tedarikci-verisi/",
    relatedRoutes: ["/tedarikci-verisi/", "/basla/"],
    limitations: LIMIT_TIER_B,
    legalClaims: true,
  }),
  e({
    route: "/tedarikci-verisi/ppwr-ambalaj/",
    role: "article",
    state: "PUBLISHED_INDEXABLE",
    title: "PPWR ambalaj tedarikçi verisi",
    metaDescription: "PPWR talebi SKDM Kademe A hükmü değildir. Ambalaj veri dosyası sınırı.",
    h1: "PPWR ambalaj",
    primaryIntent: "ppwr-packaging-supplier",
    schemaTypes: ["Article", "WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["ppwr-boundary"],
    conversionEvent: "wizard_started",
    parentHub: "/tedarikci-verisi/",
    relatedRoutes: ["/tedarikci-verisi/", "/basla/"],
    limitations: LIMIT_TIER_B,
    legalClaims: true,
  }),
  e({
    route: "/tedarikci-verisi/pil-tuzugu/",
    role: "article",
    state: "PUBLISHED_INDEXABLE",
    title: "Pil tüzüğü tedarikçi verisi",
    metaDescription: "AB pil tüzüğü talebi SKDM kapsam kararı değildir.",
    h1: "Pil tüzüğü",
    primaryIntent: "battery-regulation-supplier",
    schemaTypes: ["Article", "WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["battery-boundary"],
    conversionEvent: "wizard_started",
    parentHub: "/tedarikci-verisi/",
    relatedRoutes: ["/tedarikci-verisi/", "/basla/"],
    limitations: LIMIT_TIER_B,
    legalClaims: true,
  }),
  e({
    route: "/tedarikci-verisi/eudr-ormansizlasma/",
    role: "article",
    state: "PUBLISHED_INDEXABLE",
    title: "EUDR ormansızlaşma tedarikçi verisi",
    metaDescription: "EUDR talebi SKDM Kademe A hükmü değildir.",
    h1: "EUDR ormansızlaşma",
    primaryIntent: "eudr-supplier",
    schemaTypes: ["Article", "WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["eudr-boundary"],
    conversionEvent: "wizard_started",
    parentHub: "/tedarikci-verisi/",
    relatedRoutes: ["/tedarikci-verisi/", "/basla/"],
    limitations: LIMIT_TIER_B,
    legalClaims: true,
  }),
  e({
    route: "/metodoloji/",
    role: "article",
    state: "PUBLISHED_INDEXABLE",
    title: "Metodoloji — hesap ve kanıt sınırı",
    metaDescription:
      "SKDMHesapla hesap motorunun yasal dayanağı, varsayılan değer mührü ve LCA reddi. Google ranking dosyası değildir.",
    h1: "Hesaplama metodolojisi ve sınırlar",
    primaryIntent: "methodology-owner",
    schemaTypes: ["Article", "WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["method", "lca-reject", "default-value-seal"],
    conversionEvent: "wizard_started",
    relatedRoutes: ["/kaynak-politikasi/", "/mevzuat/", "/basla/"],
    limitations: LIMIT_NO_OPINION,
    legalClaims: true,
    sourceRefs: SRC_OMNI,
  }),
  e({
    route: "/kaynak-politikasi/",
    role: "article",
    state: "PUBLISHED_INDEXABLE",
    title: "Kaynak politikası — resmi metin tazeliği",
    metaDescription:
      "Resmi AB kaynakları, 90 gün insan incelemesi ve superseded kaynakların indexable sayfada kullanılamaması.",
    h1: "Kaynak ve tazelik politikası",
    primaryIntent: "source-policy-owner",
    schemaTypes: ["Article", "WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["freshness-sla", "source-hierarchy"],
    conversionEvent: "organic_scope_check_started",
    relatedRoutes: ["/mevzuat/", "/metodoloji/"],
    limitations: LIMIT_NO_OPINION,
    legalClaims: true,
    sourceRefs: ["eu-2023-956", "eu-2025-2083", "ec-cbam-portal", "agents1"],
  }),
  e({
    route: "/mevzuat/",
    role: "article",
    state: "PUBLISHED_INDEXABLE",
    title: "Mevzuat — SKDM resmi kaynak haritası",
    metaDescription:
      "(AB) 2023/956, Omnibus 2025/2083 ve Komisyon CBAM portalı. SEO katmanı ayrı bir CBAM doğrusu üretmez.",
    h1: "SKDM mevzuat kaynakları",
    primaryIntent: "legislation-map",
    schemaTypes: ["Article", "WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["eur-lex", "omnibus", "commission-portal"],
    conversionEvent: "organic_scope_check_started",
    relatedRoutes: ["/kaynak-politikasi/", "/rehber/", "/sozluk/cbam/"],
    limitations: LIMIT_NO_OPINION,
    legalClaims: true,
    sourceRefs: SRC_OMNI.concat(["ec-cbam-portal"]),
  }),
  e({
    route: "/uzmanlik/baris-bagirlar/",
    role: "profile",
    state: "PUBLISHED_INDEXABLE",
    title: "Barış Bağırlar — metodoloji sorumlusu",
    metaDescription:
      "Gerçek işletmeci kimliği. Sahte yazar veya sahte uzman yok. Akredite doğrulayıcı değildir.",
    h1: "Karbon hesaplama metodolojisi sorumluluğu",
    primaryIntent: "experts-profile",
    schemaTypes: ["ProfilePage", "Person", "WebPage", "BreadcrumbList"],
    uniqueValueTypes: ["real-person", "no-fake-author"],
    conversionEvent: "organic_scope_check_started",
    relatedRoutes: ["/hakkinda/", "/metodoloji/", "/iletisim/"],
    limitations: "Kişi akredite SKDM doğrulayıcısı olarak sunulmaz.",
    sourceRefs: ["cursor-is-emri"],
  }),
  e({
    route: "/uzmanlar/",
    role: "profile",
    state: "REDIRECTED",
    canonicalRoute: "/uzmanlik/baris-bagirlar/",
    title: "Uzmanlar",
    metaDescription: "Kalıcı yönlendirme: metodoloji sorumlusu profili.",
    h1: "Uzmanlar",
    primaryIntent: "experts-profile-redirect",
    intentOwner: false,
    schemaTypes: ["WebPage"],
    uniqueValueTypes: ["redirect"],
    conversionEvent: "organic_scope_check_started",
    relatedRoutes: ["/uzmanlik/baris-bagirlar/"],
    limitations: "Tek hop 301. Indexable owner /uzmanlik/baris-bagirlar/ adresidir.",
    sourceRefs: ["cursor-is-emri"],
  }),
];

const SECTORS = [
  {
    slug: "demir-celik",
    name: "Demir ve çelik",
    annex2: true,
    intent: "sektor-demir-celik-owner",
    calc: "/hesapla/demir-celik/",
  },
  {
    slug: "aluminyum",
    name: "Alüminyum",
    annex2: true,
    intent: "sektor-aluminyum-owner",
    calc: "/hesapla/aluminyum/",
  },
  {
    slug: "cimento",
    name: "Çimento",
    annex2: false,
    intent: "sektor-cimento-owner",
    calc: "/hesapla/cimento/",
  },
  {
    slug: "gubre",
    name: "Gübre",
    annex2: false,
    intent: "sektor-gubre-owner",
    calc: "/hesapla/gubre/",
  },
  {
    slug: "elektrik",
    name: "Elektrik",
    annex2: true,
    intent: "sektor-elektrik-owner",
    calc: "/hesapla/elektrik/",
  },
  {
    slug: "hidrojen",
    name: "Hidrojen",
    annex2: true,
    intent: "sektor-hidrojen-owner",
    calc: "/hesapla/hidrojen/",
  },
];

for (const s of SECTORS) {
  entries.push(
    e({
      route: `/sektor/${s.slug}/`,
      role: "article",
      state: "PUBLISHED_INDEXABLE",
      title: `${s.name} SKDM kapsamı — CN/GTİP kararı`,
      metaDescription: `${s.name} sektör ailesi SKDM Kademe A'dadır; hukuki kapsam tek bir CN/GTİP doğrulamasına bağlıdır. Ürün adı yeterli değildir.`,
      h1: `${s.name}: sektör ailesi ve CN kararı`,
      primaryIntent: s.intent,
      schemaTypes: ["Article", "WebPage", "BreadcrumbList"],
      uniqueValueTypes: ["sector-family", "cn-gate", "annex-ii"],
      decisionEnabled: true,
      uniqueDecisionFields: ["sector-family", "cn-gtip", "annex-ii-direct-only", "de-minimis-eligibility"],
      conversionEvent: "candidate_cn_selected",
      parentHub: "/",
      relatedRoutes: ["/basla/", s.calc, "/rehber/", "/metodoloji/"],
      limitations: `${LIMIT_NO_OPINION} Annex II yalnız-direkt: ${s.annex2 ? "evet" : "hayır (dolaylı emisyon faturaya girebilir)"}.`,
      legalClaims: true,
      sourceRefs: SRC_OMNI,
      programmatic: true,
    }),
  );
  entries.push(
    e({
      route: `/hesapla/${s.slug}/`,
      role: "application",
      state: "PUBLISHED_NOINDEX",
      title: `${s.name} SKDM sihirbazı`,
      metaDescription: `${s.name} için uygulama sihirbazı. SEO owner URL /sektor/${s.slug}/ adresidir.`,
      h1: `${s.name} sihirbazı`,
      primaryIntent: `wizard-${s.slug}`,
      intentOwner: true,
      schemaTypes: ["WebPage"],
      uniqueValueTypes: ["wizard-state"],
      conversionEvent: "wizard_started",
      relatedRoutes: [`/sektor/${s.slug}/`, "/basla/"],
      limitations: "Transaction/application katmanı. Landing ile aynı URL olamaz. noindex/follow; robots ile engellenmez.",
      legalClaims: false,
      crawlable: true,
    }),
  );
}

const TIER_B = [
  "batarya",
  "ambalaj",
  "gida",
  "lojistik",
  "plastik",
  "kimya",
  "cam",
  "tekstil",
  "makine",
  "otomotiv",
  "elektronik",
  "mobilya",
  "kagit",
  "yapi",
];
for (const slug of TIER_B) {
  entries.push(
    e({
      route: `/hesapla/${slug}/`,
      role: "application",
      state: "PUBLISHED_NOINDEX",
      title: `Tedarikçi veri sihirbazı — ${slug}`,
      metaDescription: "SKDM Kademe A dışıdır. SKDM hesap motoruna hüküm olarak bağlanmaz.",
      h1: "Tedarikçi veri sihirbazı",
      primaryIntent: `wizard-tierb-${slug}`,
      schemaTypes: ["WebPage"],
      uniqueValueTypes: ["tier-b-wizard"],
      conversionEvent: "wizard_started",
      relatedRoutes: ["/tedarikci-verisi/", "/basla/"],
      limitations: LIMIT_TIER_B,
      legalClaims: true,
      sourceRefs: ["agents1"],
    }),
  );
}

const GLOSSARY = [
  {
    id: "cbam",
    title: "CBAM / SKDM nedir",
    h1: "CBAM (SKDM)",
    intent: "glossary-cbam",
    desc: "CBAM teknik/hukuki ad, SKDM kullanıcıya dönük addır. Vergi değildir.",
  },
  {
    id: "de-minimis",
    title: "De minimis 50 ton eşiği",
    h1: "De minimis eşiği",
    intent: "glossary-de-minimis",
    desc: "İthalatçı bazlı 50 ton eşiği. Elektrik ve hidrojen hariç. İhracatçı eşiği değildir.",
  },
  {
    id: "embedded-emissions",
    title: "Gömülü emisyonlar (SEE)",
    h1: "Gömülü emisyonlar",
    intent: "glossary-see",
    desc: "SEE: spesifik gömülü emisyon. LCA faktörü girdi olarak kabul edilmez.",
  },
  {
    id: "direct-emissions",
    title: "Doğrudan emisyonlar",
    h1: "Doğrudan emisyonlar",
    intent: "glossary-direct-emissions",
    desc: "Tesis içi yakıt ve süreç emisyonları. Annex II sektörlerinde faturanın omurgası.",
  },
  {
    id: "omnibus",
    title: "Omnibus sadeleştirme paketi",
    h1: "Omnibus (AB) 2025/2083",
    intent: "glossary-omnibus",
    desc: "50 ton eşiği ve takvim sadeleştirmesi. SEO ayrı bir kural uydurmaz.",
  },
];
for (const g of GLOSSARY) {
  entries.push(
    e({
      route: `/sozluk/${g.id}/`,
      role: "article",
      state: "PUBLISHED_INDEXABLE",
      title: `${g.title} — SKDM sözlük`,
      metaDescription: g.desc,
      h1: g.h1,
      primaryIntent: g.intent,
      schemaTypes: ["Article", "WebPage", "BreadcrumbList"],
      uniqueValueTypes: ["glossary-leaf", "legal-term"],
      conversionEvent: "organic_scope_check_started",
      parentHub: "/sozluk/",
      relatedRoutes: ["/sozluk/", "/rehber/", "/mevzuat/"],
      limitations: LIMIT_NO_OPINION,
      legalClaims: true,
      sourceRefs: SRC_OMNI,
      programmatic: true,
    }),
  );
}

const PRODUCTS = [
  {
    slug: "cam-balkon-skdm-kapsaminda-mi",
    title: "Cam balkon SKDM kapsamında mı?",
    h1: "Cam balkon: ürün adı kapsam kararı değildir",
    intent: "product-cam-balkon",
    fields: ["tasiyici-malzeme", "fatura-gtip", "cam-vs-metal-cn", "tesis-sureci"],
  },
  {
    slug: "celik-profil-skdm-kapsaminda-mi",
    title: "Çelik profil SKDM kapsamında mı?",
    h1: "Çelik profil: CN/GTİP olmadan hüküm yok",
    intent: "product-celik-profil",
    fields: ["cn-73xx-aday", "uretim-sureci", "kaplama-alaşım", "fatura-tanimi"],
  },
  {
    slug: "pvc-pencere-skdm-kapsaminda-mi",
    title: "PVC pencere SKDM kapsamında mı?",
    h1: "PVC pencere: plastik taşıyıcı SKDM ailesinde değildir",
    intent: "product-pvc-pencere",
    fields: ["profil-malzeme", "cam-unit-ayrimi", "fatura-kalemleri", "cn-39-vs-76"],
  },
];
for (const p of PRODUCTS) {
  entries.push(
    e({
      route: `/urun/${p.slug}/`,
      role: "article",
      state: "PUBLISHED_INDEXABLE",
      title: p.title,
      metaDescription: `${p.title} Ürün adından kesin hukuki hüküm çıkmaz. Kararı değiştiren nitelikler ve CN veri ihtiyacı.`,
      h1: p.h1,
      primaryIntent: p.intent,
      schemaTypes: ["Article", "WebPage", "BreadcrumbList"],
      uniqueValueTypes: ["product-decision", "cn-boundary", "limitations"],
      decisionEnabled: true,
      uniqueDecisionFields: p.fields,
      conversionEvent: "organic_scope_check_started",
      parentHub: "/",
      relatedRoutes: ["/basla/", "/rehber/", "/sozluk/cbam/"],
      limitations:
        "Ürün adıyla kesin kapsam hükmü yasaktır. CTA yalnız kapsam kontrolüne (/basla/) gider; kapsam dışı sonuç hesap motoruna sokulmaz.",
      legalClaims: true,
      sourceRefs: SRC.concat(["agents1"]),
      programmatic: true,
    }),
  );
}

const PRIVATE = [
  ["/giris/", "login", "Giriş"],
  ["/kayit/", "signup", "Kayıt"],
  ["/hesabim/", "account", "Hesabım"],
  ["/admin/", "admin", "Yönetim"],
  ["/v/", "doc-verify", "Doküman doğrulama"],
];
for (const [route, intent, title] of PRIVATE) {
  entries.push(
    e({
      route,
      role: "application",
      state: "PUBLISHED_NOINDEX",
      title,
      metaDescription: `${title} — oturum yüzeyi.`,
      h1: title,
      primaryIntent: `app-${intent}`,
      schemaTypes: ["WebPage"],
      uniqueValueTypes: ["auth"],
      conversionEvent: "purchase",
      relatedRoutes: ["/"],
      limitations: LIMIT_APP,
      legalClaims: false,
      sourceRefs: ["cursor-is-emri"],
    }),
  );
}

const routes = new Set();
const intents = new Set();
for (const row of entries) {
  if (routes.has(row.route)) throw new Error(`duplicate route ${row.route}`);
  routes.add(row.route);
  if (row.intentOwner && row.state === "PUBLISHED_INDEXABLE") {
    if (intents.has(row.primaryIntent)) throw new Error(`dup intent ${row.primaryIntent}`);
    intents.add(row.primaryIntent);
  }
}

const out = {
  version: "7.0-SKDM",
  generatedNote: "Authored 2026-08-17. modifiedAt is content/legal review, not build time.",
  entries,
};

const dest = path.join(ROOT, "data/seo/registry.json");
fs.writeFileSync(dest, JSON.stringify(out, null, 2) + "\n");
console.log(`wrote ${entries.length} routes → ${dest}`);
console.log(
  `indexable=${entries.filter((x) => x.state === "PUBLISHED_INDEXABLE").length} noindex=${entries.filter((x) => x.state === "PUBLISHED_NOINDEX").length}`,
);
