export type RegulatoryPriority = "P0" | "P1" | "P2";
export type RegulatorySourceType =
  | "BINDING_ACT"
  | "OFFICIAL_DATASET"
  | "OFFICIAL_GUIDANCE"
  | "OPERATIONAL_MANUAL";
export type RegulatoryProductStatus = "IMPLEMENTED" | "ACTION_REQUIRED" | "MONITORING";

export interface RegulatoryUpdate {
  slug: string;
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

/**
 * detectedAt = SKDMHesapla mevzuat izleme kaydının kullanıcıya bildirildiği zaman.
 * officialPublishedAt = resmi kaynağın kendi yayın tarihi.
 * Bu iki tarih hukuki etki tarihi olarak birbirinin yerine kullanılmaz.
 */
export const REGULATORY_UPDATES: readonly RegulatoryUpdate[] = [
  {
    slug: "cbam-registry-declarants-portal-21-agustos-2026",
    detectedAt: "2026-08-22T18:08:00+03:00",
    officialPublishedAt: "2026-08-21",
    priority: "P1",
    sourceType: "OPERATIONAL_MANUAL",
    sourceTypeLabel: "Komisyon operasyon kılavuzu",
    title: "CBAM Registry Declarants Portal kullanıcı kılavuzu güncellendi",
    shortTitle: "Registry / Declarants Portal",
    summary:
      "Avrupa Komisyonu, CBAM Registry'nin Declarants Portal kullanımına ilişkin güncel kullanıcı kılavuzunu 21 Ağustos 2026 tarihinde yayımladı. Bu belge mevzuatın kendisi değil; Registry'nin operasyonel kullanımını açıklayan resmi teknik dokümandır.",
    relevantPeriod: "2026 kesin dönem Registry işlemleri",
    exporterImpact:
      "Türkiye'deki üretici portalın asıl beyan sahibi değildir; ancak AB'deki ithalatçı veya yetkili CBAM beyan sahibi sizden tesis ve üretici kimliğini Registry kayıtlarıyla tutarlı biçimde isteyebilir. Bu nedenle alıcıya verilen tesis adı, şirket kayıt numarası ve varsa O3CI/installation bilgileri tekilleştirilmelidir.",
    userActions: [
      "AB alıcınıza verdiğiniz tesis adı ve şirket kayıt bilgilerinin tüm çalışma dosyalarında aynı yazıldığını kontrol edin.",
      "Alıcınız O3CI veya installation identifier talep ediyorsa bunu serbest metin yerine doğrulanmış tesis kimliğiyle eşleştirin.",
      "Bu güncelleme tek başına emisyon hesabınızı değiştirmez; etkisi Registry/veri aktarımı ve kimlik tutarlılığı üzerindedir.",
    ],
    affectedModules: ["O3CI / Installation Registry", "Importer Pack", "Dossier export", "2027 certificate coverage UI"],
    requiredActions: [
      "O3CI installation ID ve operator corporate register number alanlarını tesis kimliğine bağla.",
      "Importer-facing kayıtları yıl, sektör, CN, menşe, miktar, birim ve gömülü emisyon ekseninde normalize et.",
      "%50 certificate coverage bilgisini 2027-01-01 tarih kontrollü feature flag ile göster.",
    ],
    sourceLabel: "European Commission — CBAM Registry",
    sourceUrl: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-registry_en",
    authorityNote:
      "Operasyon kılavuzu bağlayıcı mevzuatın yerine geçmez. Hukuki yükümlülükler CBAM temel tüzüğü ve ilgili ikincil düzenlemelerden doğar.",
    productStatus: "IMPLEMENTED",
  },
  {
    slug: "definitive-period-rehberleri-14-agustos-2026",
    detectedAt: "2026-08-19T18:14:00+03:00",
    officialPublishedAt: "2026-08-14",
    priority: "P0",
    sourceType: "OFFICIAL_GUIDANCE",
    sourceTypeLabel: "Komisyon resmi rehberi",
    title: "Komisyon 2026 kesin dönem için 10 yeni CBAM rehberi yayımladı",
    shortTitle: "14 Ağustos kesin dönem rehberleri",
    summary:
      "Avrupa Komisyonu, AB dışındaki tesis operatörlerinin 2026 kesin dönem CBAM uygulamasına hazırlanması için dört genel ve altı sektör bazlı olmak üzere on rehber yayımladı. Rehberler actual values, monitoring plan, gömülü emisyon hesabı, varsayılan değerler ve free allocation adjustment uygulamasını açıklıyor.",
    relevantPeriod: "1 Ocak 2026'dan başlayan kesin dönem",
    exporterImpact:
      "2026 ithalatlarında gerçek emisyon değerlerinin kullanılabilmesi için tesis verisinin kesin dönem metodolojisine göre izlenmesi ve doğrulamaya hazırlanması gerekir. Geçiş dönemindeki eski çalışma alışkanlıklarının aynen sürdürülmesi, özellikle sistem sınırı, precursor ve monitoring plan alanlarında dosya uyumsuzluğu yaratabilir.",
    userActions: [
      "2026 monitoring planınızı ve hesaplama yöntemini kesin dönem rehberleriyle karşılaştırın.",
      "Sektörünüze ait 5a–5f rehberini ayrıca kontrol edin; yalnız genel rehberle yetinmeyin.",
      "Geçiş döneminden kalan varsayımları otomatik olarak 2026'ya taşımayın; her kuralı kesin dönem kaynağına bağlayın.",
    ],
    affectedModules: ["Production Process", "Precursor Engine", "Embedded Emissions", "Functional Unit", "Monitoring Plan"],
    requiredActions: [
      "Production-process, precursor, system-boundary ve functional-unit kurallarını kesin dönem rehberleriyle yeniden uzlaştır.",
      "Actual-value kullanımında verifier evidence ve monitoring-plan kontrollerini güçlendir.",
      "Geçiş dönemine ait legacy eşik ve varsayımların kesin dönem motoruna sızmasını engelle.",
    ],
    sourceLabel: "European Commission — CBAM legislation and guidance",
    sourceUrl: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en",
    authorityNote:
      "Rehberler resmi Komisyon açıklamasıdır ancak uygulama tüzüklerinin yerini almaz. Çelişki halinde bağlayıcı AB mevzuatı esas alınır.",
    productStatus: "ACTION_REQUIRED",
  },
  {
    slug: "duzeltilmis-varsayilan-degerler-10-agustos-2026",
    detectedAt: "2026-08-18T18:16:00+03:00",
    officialPublishedAt: "2026-08-10",
    priority: "P0",
    sourceType: "OFFICIAL_DATASET",
    sourceTypeLabel: "Komisyon resmi veri seti",
    title: "2026 kesin dönem varsayılan değer veri seti düzeltildi",
    shortTitle: "Düzeltilmiş default values",
    summary:
      "Avrupa Komisyonu, Implementing Regulation (EU) 2026/1740 ile yapılan hedefli düzeltmeleri yansıtan kesin dönem default values Excel dosyasını 10 Ağustos 2026 tarihinde yeniledi. Excel dosyası bilgilendirme amaçlıdır; bağlayıcı değerler ilgili uygulama tüzüklerindedir.",
    relevantPeriod: "2026 kesin dönem ve sonraki ilgili yıllar",
    exporterImpact:
      "Dosyanızda Komisyon varsayılan değerleri kullanılıyorsa eski Excel sürümüyle yapılan hesapların yeniden kontrol edilmesi gerekir. Yalnız gerçek/actual emisyon değerleriyle çalışan dosyalarda bu güncelleme tek başına otomatik bir yeniden hesaplama nedeni değildir.",
    userActions: [
      "Default value kullandıysanız veri seti sürümünüzün 10 Ağustos 2026 güncel dosyasıyla eşleştiğini kontrol edin.",
      "Eski/arsivlenmiş default-value dosyasına bağlı açık çalışmalar için yeniden hesaplama kontrolü uygulayın.",
      "Actual values kullanıyorsanız değişikliğin size etkisini varsaymayın; kullanılan veri kaynağını önce sınıflandırın.",
    ],
    affectedModules: ["Default Values Engine", "Precursor fallback", "Ruleset versioning", "Seal validation"],
    requiredActions: [
      "Eski default-value datasetini production source olarak devre dışı bırak.",
      "Corrected dataset version bilgisini hesap izi ve dossier manifestine yaz.",
      "Eski veri setiyle default value kullanan açık dosyalarda recalculation kontrolü üret.",
    ],
    sourceLabel: "European Commission — CBAM legislation and guidance",
    sourceUrl: "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en",
    legalBasis: "Commission Implementing Regulation (EU) 2025/2621, corrected by (EU) 2026/1740",
    authorityNote:
      "Komisyonun Excel dosyası kullanım kolaylığı için yayımlanmıştır. Hukuken bağlayıcı değerler 2025/2621 ve onu düzelten 2026/1740 metinleridir.",
    productStatus: "ACTION_REQUIRED",
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
