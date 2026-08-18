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
import {
  isDirectEmissionStream,
  isElectricityStream,
  resolveStreamEmission,
} from "./fuel-emission-factors";

/** GATE-A: akış satırı — register B_EmInst ile yapısal olarak aynı. */
export type StreamInput = {
  method?: string;
  name: string;
  ad: number;
  unit: string;
  ncv: string;
  processId?: string;
};

/** GATE-A: satır bazlı emisyon adımı (steps[]). */
export type EmissionStep = {
  kind: "combustion" | "process" | "electricity" | "precursor" | "benchmark";
  label: string;
  formula: string;
  factorSource: string;
  emissions: number;
};

export type EmissionDataQuality = "dogrudan-olcum" | "varsayilan-deger";

export interface SkdmCalculationInput {
  sectorId: string;
  productionVolume: number; // Ton veya MWh
  year: number; // 2026-2034
  
  // Madde 2: Alıcı (AB İthalatçısı) Yıllık Toplam İthalat Durumu
  importerAnnualVolumeStatus?: "unknown" | "under50" | "over50";
  
  useCustomEmissions?: boolean;
  customDirectEmission?: number; // tCO2e / unit
  customIndirectEmission?: number; // tCO2e / unit

  // GATE-A: satır bazlı türetme girdileri. Streams verildiğinde ve çözümlenebilir
  // satır bulunduğunda Kapsam 1/2 buradan türetilir; aksi hâlde fallback (varsayılan).
  streams?: StreamInput[];
  precursors?: { name: string; total: number; see: number }[];

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
  precursorEmbeddedEmissions: number;
  totalEmissions: number;
  liableEmissions: number;

  // GATE-A: satır bazlı mutabakat izi (Σ steps === totalEmissions garantisi).
  emissionSteps: EmissionStep[];
  emissionDataQuality: EmissionDataQuality;
  
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

  // Gerçek vs Varsayılan Emisyon Yoğunluğu (fallback; streams verildiğinde aşılar)
  const isRealDataUsed = Boolean(input.useCustomEmissions);
  const fallbackDirect = isRealDataUsed && typeof input.customDirectEmission === "number"
    ? Math.max(0, input.customDirectEmission)
    : sector.defaultDirectEmission;

  // Annex II only-direct: demir-çelik, alüminyum, elektrik, hidrojen → Kapsam 2 faturaya girmez
  const fallbackRawIndirect = isRealDataUsed && typeof input.customIndirectEmission === "number"
    ? Math.max(0, input.customIndirectEmission)
    : sector.defaultIndirectEmission;
  const fallbackIndirect = sector.scope2DefaultApplicable ? fallbackRawIndirect : 0;

  // --- GATE-A: akış register'ından satır bazlı emisyon türetimi ---
  const r2 = (n: number) => Math.round(n * 100) / 100;
  const streamResults = (input.streams || [])
    .map((s) => ({ s, r: resolveStreamEmission(s) }))
    .filter((x): x is { s: StreamInput; r: NonNullable<ReturnType<typeof resolveStreamEmission>> } => x.r !== null);
  const nonElectricResults = streamResults.filter(({ s }) => !isElectricityStream(s));
  const electricResults = streamResults.filter(({ s }) => isElectricityStream(s));
  const scope2Applicable = sector.scope2DefaultApplicable;

  const precursorRows = (input.precursors || [])
    .filter((p) => Number.isFinite(p.total) && p.total > 0 && Number.isFinite(p.see))
    .map((p) => ({ p, emissions: r2(p.total * p.see) }));
  const precursorEmbeddedEmissions = r2(precursorRows.reduce((a, x) => a + x.emissions, 0));

  // Toplam, satır bazlı (yuvarlanmış) adımların toplamına eşittir — kuruş farkı imkânsız.
  const scope1TotalEmissions = nonElectricResults.length > 0
    ? r2(nonElectricResults.reduce((a, x) => a + x.r.emissions, 0))
    : r2(productionVolume * fallbackDirect);
  const scope2TotalEmissions = scope2Applicable && electricResults.length > 0
    ? r2(electricResults.reduce((a, x) => a + x.r.emissions, 0))
    : r2(productionVolume * fallbackIndirect);
  const totalEmissions = r2(scope1TotalEmissions + scope2TotalEmissions + precursorEmbeddedEmissions);

  // Satır bazlı steps[] — her parça ya türetilmiş ya benchmark olarak temsil edilir
  // (Annex II elektriği toplama girmediği için adım üretmez).
  const emissionSteps: EmissionStep[] = [];
  if (nonElectricResults.length > 0) {
    for (const { s, r } of nonElectricResults) {
      emissionSteps.push({
        kind: isDirectEmissionStream(s) ? "process" : "combustion",
        label: s.name,
        formula: r.formula,
        factorSource: r.sourceRef,
        emissions: r.emissions,
      });
    }
  } else if (scope1TotalEmissions > 0) {
    emissionSteps.push({
      kind: "benchmark",
      label: "Sektör varsayılan doğrudan yoğunluğu",
      formula: productionVolume > 0
        ? `${productionVolume} ${sector.unit} × ${fallbackDirect.toFixed(3)} tCO2e/${sector.unit} = ${scope1TotalEmissions.toFixed(2)} tCO2e`
        : "Üretim hacmi 0 — emisyon 0",
      factorSource: sector.applicableRegulation,
      emissions: scope1TotalEmissions,
    });
  }
  if (scope2Applicable && electricResults.length > 0) {
    for (const { s, r } of electricResults) {
      emissionSteps.push({
        kind: "electricity",
        label: s.name,
        formula: r.formula,
        factorSource: r.sourceRef,
        emissions: r.emissions,
      });
    }
  } else if (scope2TotalEmissions > 0) {
    emissionSteps.push({
      kind: "benchmark",
      label: "Sektör varsayılan dolaylı yoğunluğu (elektrik)",
      formula: productionVolume > 0
        ? `${productionVolume} ${sector.unit} × ${fallbackIndirect.toFixed(3)} tCO2e/${sector.unit} = ${scope2TotalEmissions.toFixed(2)} tCO2e`
        : "Üretim hacmi 0 — emisyon 0",
      factorSource: sector.applicableRegulation,
      emissions: scope2TotalEmissions,
    });
  }
  for (const row of precursorRows) {
    emissionSteps.push({
      kind: "precursor",
      label: row.p.name,
      formula: `${row.p.total.toFixed(0)} t × ${row.p.see.toFixed(3)} tCO2e/t = ${row.emissions.toFixed(2)} tCO2e`,
      factorSource: "Öncül madde tedarikçi beyanı (SEE — upstream gömülü emisyon)",
      emissions: row.emissions,
    });
  }
  const derivedStepCount = nonElectricResults.length + (scope2Applicable ? electricResults.length : 0);
  const emissionDataQuality: EmissionDataQuality = derivedStepCount > 0
    ? "dogrudan-olcum"
    : "varsayilan-deger";

  // Yoğunluklar — türetilmiş toplamlardan geri hesaplanır.
  const directEmissionIntensity = productionVolume > 0 ? scope1TotalEmissions / productionVolume : 0;
  const indirectEmissionIntensity = productionVolume > 0 ? scope2TotalEmissions / productionVolume : 0;
  const totalEmissionIntensity = productionVolume > 0 ? totalEmissions / productionVolume : 0;

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

  // Hazırlık Skoru — 5 alan × 20 puan = 100.
  // GATE-D (RM-006): alıcının yıllık toplam ithalatı "Bilmiyorum" ise de minimis
  // hükmü verilemez; bu bir eksikliktir ve skoru düşürür.
  const importerVolumeKnown = importerAnnualVolumeStatus !== "unknown" || !isDeMinimisSector;
  const checklist = [
    { label: "Sektör ve GTİP/CN Kod Doğrulaması", passed: Boolean(sector.id), scoreContribution: 20 },
    { label: "Sevkiyat Hacmi Girildi", passed: productionVolume > 0, scoreContribution: 20 },
    { label: "Gerçek Tesis Emisyon Beyanı", passed: isRealDataUsed, scoreContribution: 20 },
    // GATE-B (RM-006): hazırlık kontrol listesi akredite doğrulama hükmü
    // iddia edemez — bu sistem doğrulama görüşü üretmez. Kontrol yalnızca
    // "doğrulama süreci bilgisi girildi mi"yi ölçer.
    { label: "Doğrulama Süreci Bilgisi (görüş bu sistemden alınmaz)", passed: Boolean(input.hasVerificationEvidence), scoreContribution: 20 },
    { label: "Alıcı Yıllık İthalat Hacmi Beyanı (de minimis)", passed: importerVolumeKnown, scoreContribution: 20 },
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
    precursorEmbeddedEmissions,
    totalEmissions,
    emissionSteps,
    emissionDataQuality,
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

/**
 * GATE-D (RM-006): de minimis hükmü — tek doğruluk kaynağı (INV-5).
 *
 * Karşılaştırma ekseni alıcının (AB ithalatçısının) yıllık toplam ithalatıdır;
 * tesisin üretim/ihraç tonajı değil. Kullanıcı "Bilmiyorum" dediyse MUAF/TABİ
 * hükmü üretilmez; durum "Belirlenemedi — alıcıdan teyit alınmalı" olur.
 */
export function deMinimisVerdictFor(result: {
  sector: { id: string };
  importerAnnualVolumeStatus: "unknown" | "under50" | "over50";
  isDeMinimisExempt: boolean;
}): { label: string; status: string; importerVolume: string; detail: string } {
  const isDeMinimisSector = result.sector.id !== "electricity" && result.sector.id !== "hydrogen";
  if (!isDeMinimisSector) {
    return {
      label: "TABİ",
      status: "TABİ",
      importerVolume: "Uygulanmaz",
      detail: "Elektrik ve hidrojen ithalatı de minimis muafiyeti kapsamı dışındadır (AB 2025/2083).",
    };
  }
  if (result.importerAnnualVolumeStatus === "under50") {
    return {
      label: "MUAF",
      status: "MUAF",
      importerVolume: "50 ton altı",
      detail:
        "MUAF — alıcınızın (AB ithalatçısının) takvim yılı içindeki toplam SKDM kapsamı ithalatı 50 tonun altında; sertifika maliyeti 0 EUR.",
    };
  }
  if (result.importerAnnualVolumeStatus === "over50") {
    return {
      label: "TABİ",
      status: "TABİ",
      importerVolume: "50 ton üstü",
      detail:
        "TABİ — alıcınızın yıllık toplam SKDM ithalatı 50 tonun üzerinde; normal SKDM maliyetlendirmesi uygulanır.",
    };
  }
  return {
    label: "BELİRLENEMEDİ — alıcıdan teyit alınmalı",
    status: "BELİRLENEMEDİ",
    importerVolume: "Bilinmiyor",
    detail:
      "Belirlenemedi — bu sistemde hüküm üretilmez. Alıcınızın yıllık toplam ithalatı teyit edilmeden MUAF/TABİ kararı verilmemelidir.",
  };
}
