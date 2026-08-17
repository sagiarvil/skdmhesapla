import {
  SKDM_SECTORS,
  CBAM_DECAY_SCHEDULE,
  CBAM_DE_MINIMIS_TONS_THRESHOLD,
  CBAM_QUARTERLY_HOLDING_RATIO,
  etsPriceQuarterly,
  ETS_PRICE_QUARTERLY,
  DEFAULT_ETS_QUARTER,
  DEFAULT_EU_ETS_PRICE_EUR,
  DEFAULT_EUR_TRY_RATE,
  SectorBenchmark,
  resolveTrEtsNettingEur,
} from "./config";
import { generateSkdmAuditHash, AuditRecordOutput } from "./audit";

export interface SkdmCalculationInput {
  sectorId: string;
  productionVolume: number; // Ton veya MWh
  year: number; // 2026-2034
  
  // Madde 2: Alıcı (AB İthalatçısı) Yıllık Toplam İthalat Durumu
  importerAnnualVolumeStatus?: "unknown" | "under50" | "over50";
  
  useCustomEmissions?: boolean;
  customDirectEmission?: number; // tCO2e / unit
  customIndirectEmission?: number; // tCO2e / unit

  // Madde 1: Çeyreklik ETS Fiyatı & Çeyrek Seçimi
  etsQuarter?: string; // örn: "2026-Q1"
  euEtsPriceEur?: number; // €/tCO2e (Belirtilmezse ruleset çeyreklik fiyatından okunur)
  trEtsNettingEur?: number; // €/tCO2e Türkiye'de ödenen karbon vergisi mahsubu
  eurTryRate?: number;
  hasVerificationEvidence?: boolean;
}

export interface SkdmCalculationResult {
  sector: SectorBenchmark;
  year: number;
  productionVolume: number;
  freeAllocationRatio: number;
  liableRatio: number;
  
  // Madde 1: Ruleset ETS Fiyatı
  etsQuarter: string;
  euEtsPriceEur: number;
  trEtsNettingEur: number;
  effectiveCarbonPriceEur: number;
  eurTryRate: number;
  
  // Madde 2: İthalatçı Bazlı De Minimis Muafiyeti
  importerAnnualVolumeStatus: "unknown" | "under50" | "over50";
  isDeMinimisExempt: boolean;
  deMinimisNotice: string;

  // Gerçek / Kullanıcı Girdisi Hesaplamaları
  isRealDataUsed: boolean;
  directEmissionIntensity: number;
  indirectEmissionIntensity: number;
  totalEmissionIntensity: number;
  
  scope1TotalEmissions: number;
  scope2TotalEmissions: number;
  totalEmissions: number;
  liableEmissions: number;
  
  // Madde 3: AB İthalatçısının Maliyeti & Backwards Compatibility Alias
  importerCostEur: number; // €
  importerCostTry: number; // ₺
  netFinancialCostEur: number; // alias for importerCostEur
  netFinancialCostTry: number; // alias for importerCostTry
  costPerUnitEur: number;
  costPerUnitTry: number;

  // Çeyreklik Elde Tutma Yükümlülüğü (%50 Kuralı)
  quarterlyHoldingEmissions: number;
  quarterlyHoldingCostEur: number;

  // Hazırlık Skoru (Case Readiness Score %0 - %100)
  readinessScore: number;
  readinessChecklist: {
    label: string;
    passed: boolean;
    scoreContribution: number;
  }[];

  // AB Varsayılan (Default) Değer Karşılaştırması
  defaultBenchmark: {
    directEmissionIntensity: number;
    indirectEmissionIntensity: number;
    totalEmissions: number;
    liableEmissions: number;
    importerCostEur: number;
    importerCostTry: number;
  };

  // Tasarruf & Satış Argümanı Analizi (Madde 3)
  savingsAnalysis: {
    hasAdvantage: boolean;
    savingsEur: number;
    savingsTry: number;
    savingsPercentage: number;
    salesArgumentText: string;
  };

  whatsappShareUrl: string;
  audit: AuditRecordOutput;
}

export function calculateSkdmLiability(input: SkdmCalculationInput): SkdmCalculationResult {
  const sector = SKDM_SECTORS[input.sectorId] || SKDM_SECTORS["iron-steel"];
  const year = Math.min(Math.max(input.year || 2026, 2026), 2034);
  const productionVolume = Math.max(0, input.productionVolume || 0);

  // Madde 1: ETS Fiyatı Kural Paketinden Okunur (Ruleset)
  const etsQuarter = input.etsQuarter || DEFAULT_ETS_QUARTER;
  const rulesetEtsPrice = etsPriceQuarterly[etsQuarter] ?? DEFAULT_EU_ETS_PRICE_EUR;
  const euEtsPriceEur = typeof input.euEtsPriceEur === "number" ? input.euEtsPriceEur : rulesetEtsPrice;

  // Pilot 2026–2027: TR-ETS mahsup kilitli 0 (Ek G §15)
  const trEtsNettingEur = resolveTrEtsNettingEur(year, input.trEtsNettingEur);
  const effectiveCarbonPriceEur = Math.max(0, euEtsPriceEur - trEtsNettingEur);
  const eurTryRate = input.eurTryRate ?? DEFAULT_EUR_TRY_RATE;

  // Madde 2: De Minimis Mantığı AB İthalatçısı Bazlıdır
  const importerAnnualVolumeStatus = input.importerAnnualVolumeStatus || "unknown";
  
  let isDeMinimisExempt = false;
  let deMinimisNotice = "";

  const isDeMinimisSector = sector.id !== "electricity" && sector.id !== "hydrogen";

  if (!isDeMinimisSector) {
    isDeMinimisExempt = false;
    deMinimisNotice = "Elektrik ve hidrojen ithalatı de minimis muafiyeti kapsamı dışındadır (AB 2025/2083).";
  } else if (importerAnnualVolumeStatus === "under50") {
    isDeMinimisExempt = true;
    deMinimisNotice = "Alıcınızın (AB ithalatçısının) takvim yılı içindeki toplam SKDM kapsamı ithalatı 50 tonun altında olduğu için muafiyet doğmuştur.";
  } else if (importerAnnualVolumeStatus === "over50") {
    isDeMinimisExempt = false;
    deMinimisNotice = "Alıcınızın yıllık toplam SKDM ithalatı 50 tonun üzerinde olduğu için muafiyet uygulanmaz.";
  } else {
    isDeMinimisExempt = false;
    deMinimisNotice = "Alıcınızın yıllık toplam ithalatı bilinmediği için muafiyet uygulanmamıştır. (Tüzük gereği muafiyet ihracatçının tek sevkiyatına değil, alıcının yıllık toplamına bakar).";
  }

  const freeAllocationRatio = CBAM_DECAY_SCHEDULE[year] ?? 0.0;
  const liableRatio = 1 - freeAllocationRatio;

  // Gerçek vs Varsayılan Emisyon Yoğunluğu
  const isRealDataUsed = Boolean(input.useCustomEmissions);
  const directEmissionIntensity = isRealDataUsed && typeof input.customDirectEmission === "number"
    ? Math.max(0, input.customDirectEmission)
    : sector.defaultDirectEmission;

  // Annex II only-direct: demir-çelik, alüminyum, elektrik, hidrojen → Kapsam 2 faturaya girmez
  const rawIndirect = isRealDataUsed && typeof input.customIndirectEmission === "number"
    ? Math.max(0, input.customIndirectEmission)
    : sector.defaultIndirectEmission;
  const indirectEmissionIntensity = sector.scope2DefaultApplicable ? rawIndirect : 0;

  const totalEmissionIntensity = directEmissionIntensity + indirectEmissionIntensity;

  // Emisyonlar
  const scope1TotalEmissions = productionVolume * directEmissionIntensity;
  const scope2TotalEmissions = productionVolume * indirectEmissionIntensity;
  const totalEmissions = scope1TotalEmissions + scope2TotalEmissions;

  // İthalatçı Yükümlülüğü
  const liableEmissions = isDeMinimisExempt ? 0 : totalEmissions * liableRatio;
  
  // Madde 3: Vergiyi Ödeyen AB İthalatçısıdır
  const importerCostEur = liableEmissions * effectiveCarbonPriceEur;
  const importerCostTry = importerCostEur * eurTryRate;
  const costPerUnitEur = productionVolume > 0 ? importerCostEur / productionVolume : 0;
  const costPerUnitTry = productionVolume > 0 ? importerCostTry / productionVolume : 0;

  // Çeyreklik %50 Elde Tutma
  const quarterlyHoldingEmissions = liableEmissions * CBAM_QUARTERLY_HOLDING_RATIO;
  const quarterlyHoldingCostEur = importerCostEur * CBAM_QUARTERLY_HOLDING_RATIO;

  // AB Varsayılan Hesaplama
  const defaultScope1 = productionVolume * sector.defaultDirectEmission;
  const defaultScope2 = sector.scope2DefaultApplicable
    ? productionVolume * sector.defaultIndirectEmission
    : 0;
  const defaultTotalEmissions = defaultScope1 + defaultScope2;
  const defaultLiableEmissions = isDeMinimisExempt ? 0 : defaultTotalEmissions * liableRatio;
  const defaultImporterCostEur = defaultLiableEmissions * effectiveCarbonPriceEur;
  const defaultImporterCostTry = defaultImporterCostEur * eurTryRate;

  // Tasarruf Analizi & Madde 3 Satış Argümanı
  const savingsEur = defaultImporterCostEur - importerCostEur;
  const savingsTry = defaultImporterCostTry - importerCostTry;
  const savingsPercentage = defaultImporterCostEur > 0
    ? (savingsEur / defaultImporterCostEur) * 100
    : 0;

  const hasAdvantage = savingsEur > 0;

  const salesArgumentText = "Varsayılan değerler cezai yüksektir. Gerçek tesis verilerinizle bu maliyet düşer — mühürlü Denetime Hazırlık Dosyası ile alıcınıza kanıt sunabilirsiniz.";

  // Hazırlık Skoru
  const checklist = [
    { label: "Sektör ve GTİP/CN Kod Doğrulaması", passed: Boolean(sector.id), scoreContribution: 25 },
    { label: "Sevkiyat Hacmi Girildi", passed: productionVolume > 0, scoreContribution: 25 },
    { label: "Gerçek Tesis Emisyon Beyanı", passed: isRealDataUsed, scoreContribution: 25 },
    { label: "Akredite Doğrulama / ISO 14064 Kanıtı", passed: Boolean(input.hasVerificationEvidence), scoreContribution: 25 },
  ];
  const readinessScore = checklist.reduce((acc, item) => acc + (item.passed ? item.scoreContribution : 0), 0);

  // WhatsApp Paylaşım Metni
  const shareText = encodeURIComponent(
    `AB SKDM Sertifika Maliyeti Projeksiyonu:\nSektör: ${sector.name}\nSevkiyat: ${productionVolume} ${sector.unit}\nAB İthalatçısının Üstleneceği Maliyet: €${importerCostEur.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}\nDetay: https://skdmhesapla.com/skdm-karbon-vergisi-maliyeti`
  );
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  // Audit Hash (Madde 1 audit şartı: kullanılan ETS fiyatı ve çeyreği kayıtlıdır)
  const audit = generateSkdmAuditHash({
    sectorId: sector.id,
    year,
    volume: productionVolume,
    customDirectEmission: input.customDirectEmission,
    customIndirectEmission: input.customIndirectEmission,
    euEtsPrice: euEtsPriceEur,
    etsQuarter,
    trEtsPrice: trEtsNettingEur,
    scope1Emissions: scope1TotalEmissions,
    scope2Emissions: scope2TotalEmissions,
    grossLiabilityEmissions: liableEmissions,
    netFinancialCostEur: importerCostEur,
    importerAnnualVolumeStatus,
  });

  return {
    sector,
    year,
    productionVolume,
    freeAllocationRatio,
    liableRatio,
    etsQuarter,
    euEtsPriceEur,
    trEtsNettingEur,
    effectiveCarbonPriceEur,
    eurTryRate,
    importerAnnualVolumeStatus,
    isDeMinimisExempt,
    deMinimisNotice,
    isRealDataUsed,
    directEmissionIntensity,
    indirectEmissionIntensity,
    totalEmissionIntensity,
    scope1TotalEmissions,
    scope2TotalEmissions,
    totalEmissions,
    liableEmissions,
    importerCostEur,
    importerCostTry,
    netFinancialCostEur: importerCostEur,
    netFinancialCostTry: importerCostTry,
    costPerUnitEur,
    costPerUnitTry,
    quarterlyHoldingEmissions,
    quarterlyHoldingCostEur,
    readinessScore,
    readinessChecklist: checklist,
    defaultBenchmark: {
      directEmissionIntensity: sector.defaultDirectEmission,
      indirectEmissionIntensity: sector.defaultIndirectEmission,
      totalEmissions: defaultTotalEmissions,
      liableEmissions: defaultLiableEmissions,
      importerCostEur: defaultImporterCostEur,
      importerCostTry: defaultImporterCostTry,
    },
    savingsAnalysis: {
      hasAdvantage,
      savingsEur,
      savingsTry,
      savingsPercentage,
      salesArgumentText,
    },
    whatsappShareUrl,
    audit,
  };
}
