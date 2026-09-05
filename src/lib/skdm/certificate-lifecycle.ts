/**
 * CBAM Sertifikaları Satış, Geri Alım ve Hesap Yaşam Döngüsü (Certificate Lifecycle)
 *
 * Yasal Kaynak: EUR-Lex Draft Commission Delegated Regulation supplementing
 * Regulation (EU) 2023/956 as regards the sale and repurchase of CBAM certificates.
 *
 * MİMARİ İLKELER & HUKUKİ KORUMA:
 * 1. DRAFT / NOT YET IN FORCE: Bu düzenleme taslak halindedir; kesinleşip AB Resmî
 *    Gazetesi'nde yayımlanana kadar yürürlükte bir mevzuat gibi uygulanamaz.
 * 2. Üretim hesaplama motoru (calculateSkdmLiability) fiyat formülü DEĞİŞTİRİLMEZ;
 *    sertifika fiyatı yasal kurallara (haftalık EU ETS ihale ortalaması) bağlı kalır.
 * 3. Platform işlem/aracılık ücreti sertifika birim fiyatına GÖMÜLMEZ; certificate price
 *    ve transaction/platform fee kalemleri ayrı hesaplanır ve izlenir.
 * 4. Çift platform yapısı: Satış ve geri alım işlemleri CBAM Registry'den ayrı bir
 *    "common central platform" (ortak merkezi platform) üzerinden yürütülür;
 *    hesaplar, geri alım talepleri ve onay durumu Registry'de takip edilir.
 * 5. Uygulama takvimi: Ana hükümler 1 Şubat 2027 tarihinden itibaren geçerlidir.
 */

export const CBAM_CERTIFICATE_LIFECYCLE_VERSION = "2026-09-05.1" as const;
export const CBAM_CERTIFICATE_SALE_EFFECTIVE_FROM = "2027-02-01" as const;
export const CBAM_DELEGATED_REGULATION_DRAFT_STATUS = "DRAFT_NOT_YET_IN_FORCE" as const;

export type CertificateLifecyclePhase =
  | "PURCHASE_ORDER"
  | "PAYMENT_CLEARANCE"
  | "REGISTRY_CREATION"
  | "HOLDING_REQUIREMENT"
  | "SURRENDER"
  | "REPURCHASE_REQUEST"
  | "REPURCHASE_SETTLEMENT";

export interface PlatformArchitectureDefinition {
  commonCentralPlatform: {
    name: string;
    role: string;
    responsibilities: readonly string[];
  };
  cbamRegistry: {
    name: string;
    role: string;
    responsibilities: readonly string[];
  };
}

export const CBAM_PLATFORM_ARCHITECTURE: PlatformArchitectureDefinition = {
  commonCentralPlatform: {
    name: "Common Central Platform (Ortak Merkezi Platform)",
    role: "Finansal ve takas işlem platformu (Registry'den bağımsız)",
    responsibilities: [
      "Yetkili CBAM beyan sahiplerinden sertifika alım emirlerini kabul etme",
      "Sertifika geri alım (repurchase) emirlerinin takas ve ödeme işlemlerini yürütme",
      "Ödeme mutabakatı ve onay bildirimini CBAM Registry'ye iletme",
      "Platform işlem ve aracılık ücretlerinin (platform/transaction fees) tahsili",
    ],
  },
  cbamRegistry: {
    name: "CBAM Registry (Merkezi Sicil)",
    role: "Sicil, hesap yönetimi ve uyum denetim altyapısı",
    responsibilities: [
      "Yetkili beyan sahibi (declarant) hesaplarının yönetimi",
      "Ödeme onayı teyit edilen sertifikaların hesapta oluşturulması ve bakiyede gösterilmesi",
      "Çeyreklik %50 bulundurma zorunluluğunun izlenmesi",
      "Yıllık emisyon beyanına karşılık sertifika teslimi (surrender) kabulü",
      "Geri alım taleplerinin başlatılması, güncel geri alım fiyatı ve talep durumunun gösterilmesi",
    ],
  },
} as const;

export const CBAM_CERTIFICATE_LIFECYCLE_STEPS = [
  {
    phase: "PURCHASE_ORDER",
    platform: "common central platform",
    labelTr: "Satın alma emri",
    descriptionTr:
      "Yetkili CBAM beyan sahibi, ihtiyacı olan sertifika miktarını ortak merkezi platform üzerinden sipariş eder. Fiyat haftalık EU ETS ihale fiyat ortalamasına dayanır.",
  },
  {
    phase: "PAYMENT_CLEARANCE",
    platform: "common central platform",
    labelTr: "Ödeme onayı ve ücret tahsili",
    descriptionTr:
      "Sertifika bedeli ve platform işlem ücreti ödenir. İşlem ücreti sertifika fiyatına gömülmez, ayrı tahakkuk ettirilir.",
  },
  {
    phase: "REGISTRY_CREATION",
    platform: "cbamRegistry",
    labelTr: "Sertifikaların hesaba tanımlanması",
    descriptionTr:
      "Ödeme onayı sonrasında sertifikalar beyan sahibinin CBAM Registry hesabına fiziki/dijital olarak aktarılır.",
  },
  {
    phase: "HOLDING_REQUIREMENT",
    platform: "cbamRegistry",
    labelTr: "Çeyreklik bulundurma (%50)",
    descriptionTr:
      "2027'den itibaren her çeyrek sonu itibarıyla yıl içi ithalata tekabül eden emisyonun en az %50'si hesapta tutulur.",
  },
  {
    phase: "SURRENDER",
    platform: "cbamRegistry",
    labelTr: "Yıllık teslim (surrender)",
    descriptionTr:
      "Yıllık beyanla birlikte fiili gömülü emisyona denk düşen sertifikalar sistemde itfa edilir.",
  },
  {
    phase: "REPURCHASE_REQUEST",
    platform: "cbamRegistry",
    labelTr: "Geri alım talebi",
    descriptionTr:
      "Fazla kalan sertifikalar için geri alım talebi CBAM Registry üzerinden başlatılır; güncel fiyat ve talep durumu Registry'de gösterilir.",
  },
  {
    phase: "REPURCHASE_SETTLEMENT",
    platform: "common central platform",
    labelTr: "Geri alım takası",
    descriptionTr:
      "Geri alım emri ortak merkezi platform aracılığıyla alış fiyatından ve mevzuat sınırları (Md. 23) dahilinde nakde çevrilir.",
  },
] as const;

/**
 * 2027 Maliyet Projeksiyon Parametreleri (Platform Ücreti Ayrılmış)
 *
 * MİMARİ ŞART:
 * Platform/işlem ücretleri kesinlikle CBAM sertifika fiyatının içine gömülmez.
 * Bağımsız bir işlem maliyeti parametresi olarak projeksiyonlarda modelenir.
 */
export interface CertificateProjectionInput {
  /** Beyana tabi net gömülü emisyon (tCO₂e) */
  liableEmissionsTco2: number;
  /** Haftalık / çeyreklik ETS gösterge fiyatı (€/tCO₂e) */
  certificatePriceEur: number;
  /** Sertifika başına öngörülen platform işlem ücreti (€/sertifika) — Taslak uyarınca */
  platformFeeEurPerCert?: number;
  /** İşlem başına sabit platform takas ücreti (€/sipariş) */
  platformTransactionFlatFeeEur?: number;
}

export interface CertificateProjectionResult {
  version: string;
  legalStatus: typeof CBAM_DELEGATED_REGULATION_DRAFT_STATUS;
  effectiveFrom: typeof CBAM_CERTIFICATE_SALE_EFFECTIVE_FROM;
  certificateUnitsRequired: number;
  certificatePriceEur: number;
  /** Yalnız sertifika maliyeti: birim fiyat x sertifika adedi */
  pureCertificateCostEur: number;
  /** Ayrı hesaplanan platform ve takas işlem ücretleri */
  estimatedPlatformFeesEur: number;
  /** Toplam finansal yükümlülük = sertifika maliyeti + platform ücretleri */
  totalFinancialCommitmentEur: number;
  architectureSeparation: {
    executionPlatform: string;
    registrySystem: string;
    note: string;
  };
}

export function calculateCertificateProjectionWithFees(
  input: CertificateProjectionInput,
): CertificateProjectionResult {
  const units = Math.max(0, Math.ceil(input.liableEmissionsTco2 || 0));
  const certPrice = Math.max(0, input.certificatePriceEur || 0);
  const pureCost = units * certPrice;

  const perCertFee = Math.max(0, input.platformFeeEurPerCert || 0);
  const flatFee = Math.max(0, input.platformTransactionFlatFeeEur || 0);
  const totalPlatformFees = units * perCertFee + (units > 0 ? flatFee : 0);

  return {
    version: CBAM_CERTIFICATE_LIFECYCLE_VERSION,
    legalStatus: CBAM_DELEGATED_REGULATION_DRAFT_STATUS,
    effectiveFrom: CBAM_CERTIFICATE_SALE_EFFECTIVE_FROM,
    certificateUnitsRequired: units,
    certificatePriceEur: certPrice,
    pureCertificateCostEur: pureCost,
    estimatedPlatformFeesEur: totalPlatformFees,
    totalFinancialCommitmentEur: pureCost + totalPlatformFees,
    architectureSeparation: {
      executionPlatform: CBAM_PLATFORM_ARCHITECTURE.commonCentralPlatform.name,
      registrySystem: CBAM_PLATFORM_ARCHITECTURE.cbamRegistry.name,
      note: "Taslak Delegated Regulation gereğince satın alma ve geri alım ortak merkezi platformda (common central platform), hesap yönetimi ve geri alım talepleri Registry üzerinde yürütülür. Platform ücreti sertifika fiyatına gömülmez.",
    },
  };
}
