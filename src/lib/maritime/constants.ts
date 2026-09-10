/**
 * EU Denizcilik Karbon Uyumu — Resmî Mevzuat Sabitleri ve Kural Kütüğü
 *
 * Birincil Mevzuat Kaynakları (Zero-Fabrication / Primary Statutory Sources):
 * 1. EU MRV Maritime: Regulation (EU) 2015/757 as amended by Regulation (EU) 2023/957
 * 2. EU MRV Uygulama Şablonları: Commission Implementing Regulation (EU) 2023/2449 (Annex II Part A–E & Annex IV)
 * 3. EU MRV Doğrulama ve Akreditasyon: Commission Delegated Regulation (EU) 2023/2917
 * 4. EU ETS Maritime: Directive 2003/87/EC as amended by Directive (EU) 2023/959
 * 5. FuelEU Maritime: Regulation (EU) 2023/1805 (Annex I, II, IV)
 * 6. FuelEU İzleme Planı Şablonları: Commission Implementing Regulation (EU) 2024/2031
 * 7. FuelEU Doğrulama Kuralları: Commission Implementing Regulation (EU) 2024/2027
 * 8. FuelEU Akreditasyon: Commission Delegated Regulation (EU) 2025/192
 * 9. Union Registry / MOHA: Commission Delegated Regulation (EU) 2019/1122
 * 10. Yenilenebilir Yakıt Sürdürülebilirlik (RED II): Directive (EU) 2018/2001
 * 11. Komşu Konteyner Aktarma Limanları: Commission Implementing Decision (EU) 2023/2297
 */

import type { FuelType, PortInfo } from "./types";

/**
 * FuelEU Maritime Referans Sera Gazı Yoğunluğu (Regulation (EU) 2023/1805 Annex I)
 * Temel Değer: 91.16 gCO2eq/MJ
 */
export const FUELEU_BASELINE_GHG_INTENSITY = 91.16; // gCO2eq/MJ

/**
 * FuelEU Maritime Yıllık Azaltım Hedefleri (Madde 4(2))
 * 2025-2029: -%2 (89.3368 gCO2eq/MJ)
 * 2030-2034: -%6 (85.6904 gCO2eq/MJ)
 * 2035-2039: -%14.5 (77.9418 gCO2eq/MJ)
 * 2040-2044: -%31 (62.9004 gCO2eq/MJ)
 * 2045-2049: -%62 (34.6408 gCO2eq/MJ)
 * 2050+:     -%80 (18.2320 gCO2eq/MJ)
 */
export const FUELEU_TARGETS = {
  2024: 91.16,
  2025: 91.16 * (1 - 0.02), // 89.3368 (-%2)
  2026: 91.16 * (1 - 0.02), // 89.3368 (-%2)
  2027: 91.16 * (1 - 0.02), // 89.3368 (-%2)
  2028: 91.16 * (1 - 0.02), // 89.3368 (-%2)
  2029: 91.16 * (1 - 0.02), // 89.3368 (-%2)
  2030: 91.16 * (1 - 0.06), // 85.6904 (-%6)
  2035: 91.16 * (1 - 0.145), // 77.9418 (-%14.5)
  2040: 91.16 * (1 - 0.31), // 62.9004 (-%31)
  2045: 91.16 * (1 - 0.62), // 34.6408 (-%62)
  2050: 91.16 * (1 - 0.80), // 18.2320 (-%80)
} as const;

/**
 * FuelEU Uyum Bakiyesi Statüleri ve Birimi
 * Hukuki Birim: gCO2eq (Regulation (EU) 2023/1805 Annex IV)
 * MJ kullanımı YASAKTIR.
 */
export const FUELEU_COMPLIANCE_BALANCE_UNIT = "gCO2eq" as const;

/**
 * FuelEU Ceza Sabitleri (Madde 23(2))
 * 2.400 EUR / VLSFO-eşdeğeri metrik ton
 * Standart VLSFO Alt Isıl Değeri (LCV): 41.0 MJ/kg
 */
export const FUELEU_PENALTY_EUR_PER_TON_VLSFO = 2400;
export const VLSFO_REFERENCE_LCV_MJ_PER_KG = 41.0;

/**
 * FuelEU Borrowing Sınırları (Madde 20 & 21)
 * Azami Borçlanma: İlgili dönem hedef yoğunluk × enerji tüketimi × %2 [gCO2eq]
 * Sonraki Dönem Geri Ödeme Çarpanı: 1.10
 */
export const FUELEU_BORROWING_MAX_RATIO = 0.02; // %2
export const FUELEU_BORROWING_PENALTY_MULTIPLIER = 1.1;

/**
 * RFNBO 2x Ödül Çarpanı (Madde 5(3))
 * 2025-2033 arası yürürlüktedir.
 */
export const RFNBO_REWARD_MULTIPLIER = 2.0;
export const RFNBO_EXPIRY_YEAR = 2033;

/**
 * EU ETS Maritime Kapsam Oranları (Direktif 2003/87/EC Madde 3gb)
 * 2024: %40 phase-in
 * 2025: %70 phase-in
 * 2026+: %100 phase-in
 *
 * KRİTİK KURAL: 2025 yılı ETS surrender yükümlülüğü YALNIZCA CO2 gazını kapsar.
 * CH4 ve N2O gazları 2024-2025 MRV kapsamında fiziken raporlanır, ancak ETS teslim
 * yükümlülüğüne 2026 emisyonlarından itibaren dahil edilir.
 */
export const ETS_PHASE_IN = {
  2024: 0.4,
  2025: 0.7,
  2026: 1.0,
} as const;

/**
 * Finansal Hassasiyet Referansı (Piyasa Göstergesi — Statutory Compliance Borcu Değildir)
 */
export const FINANCIAL_BENCHMARK_EUA_EUR = {
  source: "EEX EUA Spot Benchmark (Informative Sensitivity)",
  priceEur: 75.0,
  currency: "EUR",
  disclaimer:
    "EUA piyasa fiyatı yasal uyum borcu değildir; yalnız finansal maliyet senaryosu projeksiyonudur.",
} as const;

export const DEFAULT_EUA_PRICE_EUR = 75.0;

/**
 * ÜÇ AYRI HESAPLAMA BAĞLAMI (CALCULATION CONTEXTS)
 * 1. MRV_PHYSICAL: Fiziksel CO2, CH4, N2O emisyonları
 * 2. ETS_LIABLE: 2025 yılı için yalnız CO2 teslim yükümlülüğü
 * 3. FUELEU_WTW: Well-to-Wake Sera Gazı Yoğunluğu (gCO2eq/MJ)
 */

export interface MrvPhysicalFactor {
  co2FactorTtW: number; // tCO2 / tFuel
  ch4FactorTtW: number; // tCH4 / tFuel
  n2oFactorTtW: number; // tN2O / tFuel
  gwpCh4: number; // IPCC AR6 GWP100 = 28
  gwpN2o: number; // IPCC AR6 GWP100 = 265
}

export interface EtsLiableFactor {
  appliesIn2025: boolean;
  co2LiableFactor: number; // tCO2 / tFuel
  ch4LiableFactor2025: number; // 0.0 in 2025
  n2oLiableFactor2025: number; // 0.0 in 2025
}

export interface FuelEuWtwFactor {
  lcvMjPerKg: number;
  wttGhgIntensity: number; // gCO2eq/MJ
  ttwCo2Default: number; // gCO2/gFuel (Annex II Table 1)
  ttwCh4Default: number; // gCH4/gFuel
  ttwN2oDefault: number; // gN2O/gFuel
  isBiofuel: boolean;
  isRfnboEligible: boolean;
  requiresProofOfSustainability: boolean;
}

export interface ComprehensiveFuelSpec {
  fuelId: FuelType;
  nameTr: string;
  nameEn: string;
  mrvPhysical: MrvPhysicalFactor;
  etsLiable: EtsLiableFactor;
  fuelEuWtw: FuelEuWtwFactor;
}

/**
 * Resmî Yakıt Katsayı Kütüğü (Regulation (EU) 2023/1805 Annex II & IMO MEPC)
 */
export const STATUTORY_FUEL_REGISTRY: Record<FuelType, ComprehensiveFuelSpec> = {
  VLSFO: {
    fuelId: "VLSFO",
    nameTr: "VLSFO (%0.50 Sülfür Çok Düşük Sülfürlü Fuel Oil)",
    nameEn: "VLSFO (Very Low Sulphur Fuel Oil 0.50% S)",
    mrvPhysical: {
      co2FactorTtW: 3.114,
      ch4FactorTtW: 0.00005,
      n2oFactorTtW: 0.00018,
      gwpCh4: 28,
      gwpN2o: 265,
    },
    etsLiable: {
      appliesIn2025: true,
      co2LiableFactor: 3.114,
      ch4LiableFactor2025: 0.0, // 2026'ya kadar ETS surrender dışı
      n2oLiableFactor2025: 0.0,
    },
    fuelEuWtw: {
      lcvMjPerKg: 41.0,
      wttGhgIntensity: 13.5, // gCO2eq/MJ
      ttwCo2Default: 3.114, // gCO2/gFuel
      ttwCh4Default: 0.00005,
      ttwN2oDefault: 0.00018,
      isBiofuel: false,
      isRfnboEligible: false,
      requiresProofOfSustainability: false,
    },
  },
  LSMGO: {
    fuelId: "LSMGO",
    nameTr: "LSMGO (%0.10 Sülfür Düşük Sülfürlü Gaz Yağı)",
    nameEn: "LSMGO (Low Sulphur Marine Gas Oil 0.10% S)",
    mrvPhysical: {
      co2FactorTtW: 3.206,
      ch4FactorTtW: 0.00005,
      n2oFactorTtW: 0.00018,
      gwpCh4: 28,
      gwpN2o: 265,
    },
    etsLiable: {
      appliesIn2025: true,
      co2LiableFactor: 3.206,
      ch4LiableFactor2025: 0.0,
      n2oLiableFactor2025: 0.0,
    },
    fuelEuWtw: {
      lcvMjPerKg: 42.7,
      wttGhgIntensity: 14.4,
      ttwCo2Default: 3.206,
      ttwCh4Default: 0.00005,
      ttwN2oDefault: 0.00018,
      isBiofuel: false,
      isRfnboEligible: false,
      requiresProofOfSustainability: false,
    },
  },
  HFO: {
    fuelId: "HFO",
    nameTr: "HFO (Ağır Yakıt - Scrubber Donanımlı)",
    nameEn: "HFO (Heavy Fuel Oil - Scrubber Fitted)",
    mrvPhysical: {
      co2FactorTtW: 3.114,
      ch4FactorTtW: 0.00005,
      n2oFactorTtW: 0.00018,
      gwpCh4: 28,
      gwpN2o: 265,
    },
    etsLiable: {
      appliesIn2025: true,
      co2LiableFactor: 3.114,
      ch4LiableFactor2025: 0.0,
      n2oLiableFactor2025: 0.0,
    },
    fuelEuWtw: {
      lcvMjPerKg: 40.5,
      wttGhgIntensity: 13.5,
      ttwCo2Default: 3.114,
      ttwCh4Default: 0.00005,
      ttwN2oDefault: 0.00018,
      isBiofuel: false,
      isRfnboEligible: false,
      requiresProofOfSustainability: false,
    },
  },
  LNG_OTTO_MEDIUM_SPEED: {
    fuelId: "LNG_OTTO_MEDIUM_SPEED",
    nameTr: "LNG (Sıvılaştırılmış Doğal Gaz - Otto Medium Speed)",
    nameEn: "LNG (Otto Cycle Medium Speed)",
    mrvPhysical: {
      co2FactorTtW: 2.75,
      ch4FactorTtW: 0.055, // Slip payı
      n2oFactorTtW: 0.00011,
      gwpCh4: 28,
      gwpN2o: 265,
    },
    etsLiable: {
      appliesIn2025: true,
      co2LiableFactor: 2.75,
      ch4LiableFactor2025: 0.0,
      n2oLiableFactor2025: 0.0,
    },
    fuelEuWtw: {
      lcvMjPerKg: 49.1,
      wttGhgIntensity: 18.5,
      ttwCo2Default: 2.75,
      ttwCh4Default: 0.055,
      ttwN2oDefault: 0.00011,
      isBiofuel: false,
      isRfnboEligible: false,
      requiresProofOfSustainability: false,
    },
  },
  LNG_DIESEL: {
    fuelId: "LNG_DIESEL",
    nameTr: "LNG (Diesel Cycle - Düşük Metan Kaçağı)",
    nameEn: "LNG (Diesel Cycle Low Slip)",
    mrvPhysical: {
      co2FactorTtW: 2.75,
      ch4FactorTtW: 0.002,
      n2oFactorTtW: 0.00011,
      gwpCh4: 28,
      gwpN2o: 265,
    },
    etsLiable: {
      appliesIn2025: true,
      co2LiableFactor: 2.75,
      ch4LiableFactor2025: 0.0,
      n2oLiableFactor2025: 0.0,
    },
    fuelEuWtw: {
      lcvMjPerKg: 49.1,
      wttGhgIntensity: 18.5,
      ttwCo2Default: 2.75,
      ttwCh4Default: 0.002,
      ttwN2oDefault: 0.00011,
      isBiofuel: false,
      isRfnboEligible: false,
      requiresProofOfSustainability: false,
    },
  },
  BIO_DIESEL: {
    fuelId: "BIO_DIESEL",
    nameTr: "Biyodizel (FAME / HVO Atık Bazlı)",
    nameEn: "Biodiesel (FAME / HVO Waste-based)",
    mrvPhysical: {
      co2FactorTtW: 2.834, // FuelEU Annex II default TtW CO2 factor
      ch4FactorTtW: 0.00005,
      n2oFactorTtW: 0.00018,
      gwpCh4: 28,
      gwpN2o: 265,
    },
    etsLiable: {
      appliesIn2025: true,
      co2LiableFactor: 0.0, // ETS altında RED II uyumlu biyokütle için sıfır katsayı
      ch4LiableFactor2025: 0.0,
      n2oLiableFactor2025: 0.0,
    },
    fuelEuWtw: {
      lcvMjPerKg: 37.2,
      wttGhgIntensity: 15.0, // Sertifikalı WtT ayak izi
      ttwCo2Default: 2.834, // Regulation (EU) 2023/1805 Annex II default: 2.834 gCO2/gFuel
      ttwCh4Default: 0.00005,
      ttwN2oDefault: 0.00018,
      isBiofuel: true,
      isRfnboEligible: false,
      requiresProofOfSustainability: true,
    },
  },
  BIO_LNG: {
    fuelId: "BIO_LNG",
    nameTr: "Biyo-LNG (Organik Atık Gazı)",
    nameEn: "Bio-LNG (Biomethane)",
    mrvPhysical: {
      co2FactorTtW: 2.75,
      ch4FactorTtW: 0.002,
      n2oFactorTtW: 0.00011,
      gwpCh4: 28,
      gwpN2o: 265,
    },
    etsLiable: {
      appliesIn2025: true,
      co2LiableFactor: 0.0,
      ch4LiableFactor2025: 0.0,
      n2oLiableFactor2025: 0.0,
    },
    fuelEuWtw: {
      lcvMjPerKg: 49.1,
      wttGhgIntensity: 18.0,
      ttwCo2Default: 2.75,
      ttwCh4Default: 0.002,
      ttwN2oDefault: 0.00011,
      isBiofuel: true,
      isRfnboEligible: false,
      requiresProofOfSustainability: true,
    },
  },
  E_METHANOL: {
    fuelId: "E_METHANOL",
    nameTr: "E-Metanol (RFNBO Yenilenebilir Sentetik Yakıt)",
    nameEn: "E-Methanol (RFNBO Synthetic)",
    mrvPhysical: {
      co2FactorTtW: 1.375,
      ch4FactorTtW: 0.0,
      n2oFactorTtW: 0.0,
      gwpCh4: 28,
      gwpN2o: 265,
    },
    etsLiable: {
      appliesIn2025: true,
      co2LiableFactor: 0.0,
      ch4LiableFactor2025: 0.0,
      n2oLiableFactor2025: 0.0,
    },
    fuelEuWtw: {
      lcvMjPerKg: 19.9,
      wttGhgIntensity: 4.0,
      ttwCo2Default: 1.375,
      ttwCh4Default: 0.0,
      ttwN2oDefault: 0.0,
      isBiofuel: false,
      isRfnboEligible: true,
      requiresProofOfSustainability: true,
    },
  },
  E_AMMONIA: {
    fuelId: "E_AMMONIA",
    nameTr: "E-Amonyak (Yeşil Sıfır Karbon Yakıt)",
    nameEn: "E-Ammonia (Green Ammonia)",
    mrvPhysical: {
      co2FactorTtW: 0.0,
      ch4FactorTtW: 0.0,
      n2oFactorTtW: 0.0005,
      gwpCh4: 28,
      gwpN2o: 265,
    },
    etsLiable: {
      appliesIn2025: true,
      co2LiableFactor: 0.0,
      ch4LiableFactor2025: 0.0,
      n2oLiableFactor2025: 0.0,
    },
    fuelEuWtw: {
      lcvMjPerKg: 18.6,
      wttGhgIntensity: 3.5,
      ttwCo2Default: 0.0,
      ttwCh4Default: 0.0,
      ttwN2oDefault: 0.0005,
      isBiofuel: false,
      isRfnboEligible: true,
      requiresProofOfSustainability: true,
    },
  },
  HYDROGEN: {
    fuelId: "HYDROGEN",
    nameTr: "Sıvı / Sıkıştırılmış Yeşil Hidrojen",
    nameEn: "Liquid / Compressed Green Hydrogen",
    mrvPhysical: {
      co2FactorTtW: 0.0,
      ch4FactorTtW: 0.0,
      n2oFactorTtW: 0.0,
      gwpCh4: 28,
      gwpN2o: 265,
    },
    etsLiable: {
      appliesIn2025: true,
      co2LiableFactor: 0.0,
      ch4LiableFactor2025: 0.0,
      n2oLiableFactor2025: 0.0,
    },
    fuelEuWtw: {
      lcvMjPerKg: 120.0,
      wttGhgIntensity: 2.0,
      ttwCo2Default: 0.0,
      ttwCh4Default: 0.0,
      ttwN2oDefault: 0.0,
      isBiofuel: false,
      isRfnboEligible: true,
      requiresProofOfSustainability: true,
    },
  },
  OPS: {
    fuelId: "OPS",
    nameTr: "OPS (Kıyı Elektriği / Onshore Power Supply)",
    nameEn: "OPS (Onshore Power Supply)",
    mrvPhysical: {
      co2FactorTtW: 0.0,
      ch4FactorTtW: 0.0,
      n2oFactorTtW: 0.0,
      gwpCh4: 28,
      gwpN2o: 265,
    },
    etsLiable: {
      appliesIn2025: true,
      co2LiableFactor: 0.0,
      ch4LiableFactor2025: 0.0,
      n2oLiableFactor2025: 0.0,
    },
    fuelEuWtw: {
      lcvMjPerKg: 0.0,
      wttGhgIntensity: 0.0,
      ttwCo2Default: 0.0,
      ttwCh4Default: 0.0,
      ttwN2oDefault: 0.0,
      isBiofuel: false,
      isRfnboEligible: false,
      requiresProofOfSustainability: false,
    },
  },
};

/**
 * Geriye dönük uyumluluk için eski FUEL_SPECS sarmalayıcısı
 */
export const FUEL_SPECS: Record<
  FuelType,
  {
    nameTr: string;
    lcvMjPerKg: number;
    co2FactorTtW: number;
    ghgIntensityWtW: number;
    isRfnboEligible: boolean;
  }
> = Object.fromEntries(
  Object.entries(STATUTORY_FUEL_REGISTRY).map(([key, spec]) => [
    key,
    {
      nameTr: spec.nameTr,
      lcvMjPerKg: spec.fuelEuWtw.lcvMjPerKg,
      co2FactorTtW: spec.mrvPhysical.co2FactorTtW,
      ghgIntensityWtW: spec.fuelEuWtw.wttGhgIntensity + (spec.fuelEuWtw.ttwCo2Default / (spec.fuelEuWtw.lcvMjPerKg || 1)) * 1000,
      isRfnboEligible: spec.fuelEuWtw.isRfnboEligible,
    },
  ])
) as any;

/**
 * Komşu Konteyner Aktarma Limanları Listesi
 * Commission Implementing Decision (EU) 2023/2297 (AB Limanına 300 mil mesafede ve konteyner payı > %65)
 */
export const NEIGHBOURING_CONTAINER_TRANSSHIPMENT_PORTS: PortInfo[] = [
  {
    code: "MATNG",
    name: "Tanger Med",
    country: "MA",
    isEuEea: false,
    isNeighbouringContainerTransshipment: true,
  },
  {
    code: "EGPSD",
    name: "Port Said / East Port Said",
    country: "EG",
    isEuEea: false,
    isNeighbouringContainerTransshipment: true,
  },
];
