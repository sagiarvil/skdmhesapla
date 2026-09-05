/**
 * EU Denizcilik Karbon Uyumu — Resmî Mevzuat Sabitleri
 *
 * Dayanak Mevzuat:
 * 1. EU MRV: Regulation (EU) 2015/757 as amended by Regulation (EU) 2023/957
 * 2. EU ETS: Directive 2003/87/EC as amended by Directive (EU) 2023/957
 * 3. FuelEU Maritime: Regulation (EU) 2023/1805 (Annex I, II, IV)
 * 4. Komşu Konteyner Aktarma Limanları: Commission Implementing Decision (EU) 2023/2297
 */

import type { FuelType, PortInfo } from "./types";

/**
 * FuelEU Maritime Referans Sera Gazı Yoğunluğu (Annex I)
 * Temel Değer: 91.16 gCO2eq/MJ
 */
export const FUELEU_BASELINE_GHG_INTENSITY = 91.16; // gCO2eq/MJ

/**
 * FuelEU Maritime Hedef İndirim Oranları (Madde 4(2))
 */
export const FUELEU_TARGETS = {
  2024: 91.16, // Henüz zorunlu değil
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
 * FuelEU Ceza Sabitleri (Madde 23(2))
 * 2.400 EUR / VLSFO-eşdeğeri metrik ton
 * Standart VLSFO Alt Isıl Değeri (LCV): 41.0 MJ/kg
 */
export const FUELEU_PENALTY_EUR_PER_TON_VLSFO = 2400;
export const VLSFO_REFERENCE_LCV_MJ_PER_KG = 41.0;

/**
 * RFNBO 2x Ödül Çarpanı Bitiş Tarihi (Madde 5(3))
 */
export const RFNBO_REWARD_MULTIPLIER = 2.0;
export const RFNBO_EXPIRY_YEAR = 2033;

/**
 * EU ETS Maritime Kapsam Oranları (Direktif 2003/87/EC Madde 3gb)
 */
export const ETS_PHASE_IN = {
  2024: 0.4, // %40
  2025: 0.7, // %70
  2026: 1.0, // %100
} as const;

/**
 * EU ETS Referans EUA Karbon Fiyatı Benchmark (€ / tCO2e)
 */
export const DEFAULT_EUA_PRICE_EUR = 75.0;

/**
 * Yakıt Spesifikasyonları (FuelEU Annex I & II / IMO MEPC Default Values)
 */
export interface FuelSpec {
  nameTr: string;
  lcvMjPerKg: number; // Alt Isıl Değeri (MJ/kg)
  co2FactorTtW: number; // Tank-to-Wake CO2 (tCO2 / tFuel)
  ghgIntensityWtW: number; // Well-to-Wake Sera Gazı Yoğunluğu (gCO2eq / MJ)
  isRfnboEligible: boolean;
}

export const FUEL_SPECS: Record<FuelType, FuelSpec> = {
  VLSFO: {
    nameTr: "VLSFO (%0.50 Sülfür Çok Düşük Sülfürlü Fuel Oil)",
    lcvMjPerKg: 41.0,
    co2FactorTtW: 3.114,
    ghgIntensityWtW: 91.4,
    isRfnboEligible: false,
  },
  LSMGO: {
    nameTr: "LSMGO (%0.10 Sülfür Düşük Sülfürlü Gaz Yağı)",
    lcvMjPerKg: 42.7,
    co2FactorTtW: 3.206,
    ghgIntensityWtW: 90.8,
    isRfnboEligible: false,
  },
  HFO: {
    nameTr: "HFO (Ağır Yakıt - Scrubber Donanımlı)",
    lcvMjPerKg: 40.5,
    co2FactorTtW: 3.114,
    ghgIntensityWtW: 92.3,
    isRfnboEligible: false,
  },
  LNG_OTTO_MEDIUM_SPEED: {
    nameTr: "LNG (Sıvılaştırılmış Doğal Gaz - Otto Medium Speed)",
    lcvMjPerKg: 49.1,
    co2FactorTtW: 2.75,
    ghgIntensityWtW: 73.5, // Metan kaçağı (slip) dahil
    isRfnboEligible: false,
  },
  LNG_DIESEL: {
    nameTr: "LNG (Diesel Cycle - Düşük Metan Kaçağı)",
    lcvMjPerKg: 49.1,
    co2FactorTtW: 2.75,
    ghgIntensityWtW: 66.8,
    isRfnboEligible: false,
  },
  BIO_DIESEL: {
    nameTr: "Sürdürülebilir Biyodizel (FAME / HVO Atık Bazlı)",
    lcvMjPerKg: 37.2,
    co2FactorTtW: 0.0, // Biyojenik sıfır sayılır
    ghgIntensityWtW: 15.0, // RED II sertifikalı WtT ayak izi
    isRfnboEligible: false,
  },
  BIO_LNG: {
    nameTr: "Biyo-LNG (Organik Atık Gazı)",
    lcvMjPerKg: 49.1,
    co2FactorTtW: 0.0,
    ghgIntensityWtW: 18.0,
    isRfnboEligible: false,
  },
  E_METHANOL: {
    nameTr: "E-Metanol (RFNBO Yenilenebilir Sentetik Yakıt)",
    lcvMjPerKg: 19.9,
    co2FactorTtW: 0.0,
    ghgIntensityWtW: 4.0,
    isRfnboEligible: true,
  },
  E_AMMONIA: {
    nameTr: "E-Amonyak (Yeşil Sıfır Karbon Yakıt)",
    lcvMjPerKg: 18.6,
    co2FactorTtW: 0.0,
    ghgIntensityWtW: 3.5,
    isRfnboEligible: true,
  },
  HYDROGEN: {
    nameTr: "Sıvı / Sıkıştırılmış Yeşil Hidrojen",
    lcvMjPerKg: 120.0,
    co2FactorTtW: 0.0,
    ghgIntensityWtW: 2.0,
    isRfnboEligible: true,
  },
  OPS: {
    nameTr: "OPS (Kıyı Elektriği / Onshore Power Supply)",
    lcvMjPerKg: 0.0,
    co2FactorTtW: 0.0,
    ghgIntensityWtW: 0.0, // Gemi üzeri emisyon sıfır
    isRfnboEligible: false,
  },
};

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
