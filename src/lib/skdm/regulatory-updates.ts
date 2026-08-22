export type RegulatoryPriority = "P0" | "P1" | "P2";

export interface RegulatoryUpdate {
  slug: string;
  detectedAt: string;
  officialPublishedAt: string;
  effectiveFrom: string;
  priority: RegulatoryPriority;
  title: string;
  shortTitle: string;
  summary: string;
  affectedModules: string[];
  requiredActions: string[];
  sourceLabel: string;
  sourceUrl: string;
  legalBasis?: string;
  status: "IMPLEMENTED" | "ACTION_REQUIRED" | "MONITORING";
}

/**
 * detectedAt = SKDMHesapla mevzuat izleme kaydının kullanıcıya bildirildiği zaman.
 * officialPublishedAt = resmi kaynağın yayın tarihi. İkisi bilinçli olarak ayrıdır.
 */
export const REGULATORY_UPDATES: readonly RegulatoryUpdate[] = [
  {
    slug: "cbam-registry-declarants-portal-21-agustos-2026",
    detectedAt: "2026-08-22T18:08:00+03:00",
    officialPublishedAt: "2026-08-21",
    effectiveFrom: "2026-08-21",
    priority: "P1",
    title: "CBAM Registry Declarants Portal kılavuzu güncellendi",
    shortTitle: "Registry / O3CI kimlik eşleşmesi",
    summary:
      "Yeni Declarants Portal manuali; tesis kimliği, mallar-emisyon kayıt şeması ve 2027'de devreye girecek %50 sertifika bulundurma görünümünü operasyonel olarak netleştirdi.",
    affectedModules: ["O3CI / Installation Registry", "Importer Pack", "Dossier export", "2027 certificate coverage UI"],
    requiredActions: [
      "O3CI installation ID ve operator corporate register number alanlarını tesis kimliğine bağla.",
      "Importer-facing kayıtları yıl, sektör, CN, menşe, miktar, birim ve gömülü emisyon ekseninde normalize et.",
      "%50 certificate coverage bilgisini 2027-01-01 tarih kontrollü feature flag ile göster.",
    ],
    sourceLabel: "European Commission — CBAM Registry / Declarants portal user manual",
    sourceUrl: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-registry_en",
    status: "IMPLEMENTED",
  },
  {
    slug: "definitive-period-rehberleri-14-agustos-2026",
    detectedAt: "2026-08-19T18:14:00+03:00",
    officialPublishedAt: "2026-08-14",
    effectiveFrom: "2026-01-01",
    priority: "P0",
    title: "Definitive-period CBAM rehber seti yayımlandı",
    shortTitle: "14 Ağustos definitive rehberleri",
    summary:
      "Komisyonun yatay ve sektör bazlı kesin dönem rehberleri; production-process gruplama, precursor weighted-average, Annex II indirect-emissions mantığı, functional unit ve monitoring-plan uygulamasını ayrıntılandırdı.",
    affectedModules: ["Production Process", "Precursor Engine", "Embedded Emissions", "Functional Unit", "Monitoring Plan"],
    requiredActions: [
      "CN code ile production process kimliğini bire bir bağlayan legacy varsayımı kaldır.",
      "Aynı precursor tipi için tedarikçi/period bazlı weighted-average ve verifier evidence kontrollerini uygula.",
      "Legacy %5 material threshold kuralını kaldır; ruleset-driven system boundary kullan.",
      "Çimento/gübre functional-unit alanlarını ürün kompozisyonuna göre dinamikleştir.",
    ],
    sourceLabel: "European Commission — CBAM sectors / definitive-period guidance",
    sourceUrl: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-sectors_en",
    status: "ACTION_REQUIRED",
  },
  {
    slug: "duzeltilmis-varsayilan-degerler-10-agustos-2026",
    detectedAt: "2026-08-18T18:16:00+03:00",
    officialPublishedAt: "2026-08-10",
    effectiveFrom: "2026-01-01",
    priority: "P0",
    title: "2026 definitive-period varsayılan değerleri düzeltildi",
    shortTitle: "Düzeltilmiş default values dataset",
    summary:
      "Komisyon, 2026/1740 düzeltmesini yansıtan definitive-period default values Excel veri setini 10 Ağustos'ta yeniledi. Bağlayıcı hukuki temel 2025/2621 ve 2026/1740'dır.",
    affectedModules: ["Default Values Engine", "Precursor fallback", "Ruleset versioning", "Seal validation"],
    requiredActions: [
      "Eski default-value datasetini production source olarak devre dışı bırak.",
      "Corrected dataset version bilgisini hesap izi ve dossier manifestine yaz.",
      "Eski veri setiyle default value kullanan açık dosyalarda recalculation zorunluluğu üret.",
    ],
    sourceLabel: "European Commission — CBAM legislation and guidance",
    sourceUrl: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en",
    legalBasis: "Commission Implementing Regulation (EU) 2025/2621 + (EU) 2026/1740",
    status: "ACTION_REQUIRED",
  },
] as const;

export function latestRegulatoryUpdates(limit = 3): readonly RegulatoryUpdate[] {
  return [...REGULATORY_UPDATES]
    .sort((a, b) => Date.parse(b.detectedAt) - Date.parse(a.detectedAt))
    .slice(0, Math.max(0, limit));
}

export function getRegulatoryUpdate(slug: string): RegulatoryUpdate | undefined {
  return REGULATORY_UPDATES.find((item) => item.slug === slug);
}
