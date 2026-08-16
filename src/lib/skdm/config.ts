export interface SectorBenchmark {
  id: string;
  name: string;
  tier: "A" | "B" | "C";
  cnCodes: string[];
  unit: string;
  defaultDirectEmission: number;
  defaultIndirectEmission: number;
  typicalRealDirectMin: number;
  typicalRealDirectMax: number;
  description: string;
  scope2DefaultApplicable: boolean;
  applicableRegulation: string;
}

export const SKDM_RULESET_VERSION = "2026.1-Omnibus1";

// Çeyreklik AB ETS Karbon Fiyatı Ruleset Şeması (Madde 1)
export const etsPriceQuarterly: Record<string, number> = {
  "2026-Q1": 75.4, // Q1 2026 AB ETS Çeyreklik Ortalama Fiyatı (75.4 €/tCO2e)
  "2026-Q2": 78.0,
  "2026-Q3": 80.0,
  "2026-Q4": 82.5,
};
export const ETS_PRICE_QUARTERLY = etsPriceQuarterly;

export const DEFAULT_ETS_QUARTER = "2026-Q1";
export const DEFAULT_EU_ETS_PRICE_EUR = etsPriceQuarterly[DEFAULT_ETS_QUARTER]; // 75.4 €/tCO2e
export const DEFAULT_TR_ETS_PRICE_EUR = 22.0; // €/ton CO2e
export const DEFAULT_EUR_TRY_RATE = 38.5; // € / ₺ paritesi

// CBAM Ücretsiz Tahsisat Azalım Takvimi (Free Allocation Decay Factor - EU 2023/956 & 2025/2083)
export const CBAM_DECAY_SCHEDULE: Record<number, number> = {
  2026: 0.975, // %97.5 ücretsiz (%2.5 vergi yükümlülüğü)
  2027: 0.950, // %95.0 ücretsiz (%5.0 vergi yükümlülüğü)
  2028: 0.900, // %90.0 ücretsiz (%10.0 vergi yükümlülüğü)
  2029: 0.775, // %77.5 ücretsiz (%22.5 vergi yükümlülüğü)
  2030: 0.515, // %51.5 ücretsiz (%48.5 vergi yükümlülüğü)
  2031: 0.390, // %39.0 ücretsiz (%61.0 vergi yükümlülüğü)
  2032: 0.265, // %26.5 ücretsiz (%73.5 vergi yükümlülüğü)
  2033: 0.140, // %14.0 ücretsiz (%86.0 vergi yükümlülüğü)
  2034: 0.000, // %0.0 ücretsiz (%100.0 tam vergi yükümlülüğü)
};

// 2026 AB SKDM Güncel Mevzuat Sabitleri (Omnibus-I AB 2025/2083)
export const CBAM_DE_MINIMIS_TONS_THRESHOLD = 50; // Yıllık 50 ton altı de minimis muafiyeti
export const CBAM_QUARTERLY_HOLDING_RATIO = 0.50; // Çeyreklik hesapta bulundurma oranı (%50)
export const CBAM_CERTIFICATE_SALES_START_DATE = "2027-02-01"; // Sertifika satış başlangıcı
export const CBAM_ANNUAL_DECLARATION_DEADLINE = "30 Eylül"; // Yıllık beyan tarihi (ertesi yıl 30 Eylül)

export const PADDLE_SEAL_PRICE_TRY = 9900;
/** Dahili sabit — Ek F: arayüzde gösterilmez (tek fiyat 9.900 ₺). */
export const PADDLE_RESEAL_PRICE_TRY = 2400;

export const SKDM_SECTORS: Record<string, SectorBenchmark> = {
  // --- KADEME A: DOĞRUDAN SKDM (TÜZÜK 2023/956 & 2025/2083 OMNIBUS-I) ---
  "iron-steel": {
    id: "iron-steel",
    name: "Demir & Çelik",
    tier: "A",
    cnCodes: ["7201-7229", "7301-7326"],
    unit: "ton",
    defaultDirectEmission: 1.80,
    defaultIndirectEmission: 0.50,
    typicalRealDirectMin: 0.35,
    typicalRealDirectMax: 2.20,
    description: "Ham çelik, inşaat demiri, filmaşin, boru ve profil imalatı. EAF (ark fırını) tesisleri düşük emisyon avantajı sağlar.",
    scope2DefaultApplicable: true,
    applicableRegulation: "(AB) 2023/956 & 2025/2083 (SKDM)",
  },
  aluminum: {
    id: "aluminum",
    name: "Alüminyum Sanayi",
    tier: "A",
    cnCodes: ["7601-7616"],
    unit: "ton",
    defaultDirectEmission: 1.65,
    defaultIndirectEmission: 6.80,
    typicalRealDirectMin: 0.40,
    typicalRealDirectMax: 2.10,
    description: "Alüminyum biyel, külçe, levha, folyo ve ekstrüzyon profiller. Elektrik tüketimi (Kapsam 2) maliyetin ana belirleyicisidir.",
    scope2DefaultApplicable: true,
    applicableRegulation: "(AB) 2023/956 & 2025/2083 (SKDM)",
  },
  cement: {
    id: "cement",
    name: "Çimento Sanayi",
    tier: "A",
    cnCodes: ["2523 10 00", "2523 29 00"],
    unit: "ton",
    defaultDirectEmission: 0.72,
    defaultIndirectEmission: 0.08,
    typicalRealDirectMin: 0.52,
    typicalRealDirectMax: 0.85,
    description: "Klinker ve çimento üretimi. Proses emisyonu (kireçtaşı kalsinasyonu) nedeniyle Kapsam 1 yükü yüksektir.",
    scope2DefaultApplicable: false,
    applicableRegulation: "(AB) 2023/956 & 2025/2083 (SKDM)",
  },
  fertilizer: {
    id: "fertilizer",
    name: "Gübre Sanayi (Azotlu)",
    tier: "A",
    cnCodes: ["2808 00 00", "2814", "3102", "3105"],
    unit: "ton",
    defaultDirectEmission: 2.90,
    defaultIndirectEmission: 0.40,
    typicalRealDirectMin: 1.10,
    typicalRealDirectMax: 3.80,
    description: "Amonyak, nitrik asit, üre ve NPK gübreleri. Nitrik asit N2O emisyonu yüksek N2O GWP çarpanına sahiptir.",
    scope2DefaultApplicable: true,
    applicableRegulation: "(AB) 2023/956 & 2025/2083 (SKDM)",
  },
  hydrogen: {
    id: "hydrogen",
    name: "Hidrojen Üretimi",
    tier: "A",
    cnCodes: ["2804 10 00"],
    unit: "ton",
    defaultDirectEmission: 8.90,
    defaultIndirectEmission: 0.00,
    typicalRealDirectMin: 0.10,
    typicalRealDirectMax: 9.30,
    description: "Sanayi ve enerji tipi hidrojen. SMR gri hidrojen 8.9t CO2 yükü getirirken yeşil hidrojen alıcıya sıfır maliyet sağlar.",
    scope2DefaultApplicable: false,
    applicableRegulation: "(AB) 2023/956 & 2025/2083 (SKDM)",
  },
  electricity: {
    id: "electricity",
    name: "Elektrik Enerjisi",
    tier: "A",
    cnCodes: ["2716 00 00"],
    unit: "MWh",
    defaultDirectEmission: 0.44,
    defaultIndirectEmission: 0.0,
    typicalRealDirectMin: 0.0,
    typicalRealDirectMax: 0.75,
    description: "Sınır ötesi elektrik ihracatı. Yeşil sertifikalı ve YEK-G / I-REC belgeli elektrik alıcı için sıfır maliyet sağlar.",
    scope2DefaultApplicable: false,
    applicableRegulation: "(AB) 2023/956 & 2025/2083 (SKDM)",
  },

  // --- KADEME B: AB KOMŞU SÜRDÜRÜLEBİLİRLİK REGÜLASYONLARI ---
  battery: {
    id: "battery",
    name: "Batarya ve Pil",
    tier: "B",
    cnCodes: ["8506", "8507"],
    unit: "kWh",
    defaultDirectEmission: 0.08,
    defaultIndirectEmission: 0.04,
    typicalRealDirectMin: 0.02,
    typicalRealDirectMax: 0.12,
    description: "AB Batarya Tüzüğü (AB) 2023/1542: EV ve endüstriyel bataryalarda model bazında Karbon Ayak İzi Beyanı & Batarya Pasaportu.",
    scope2DefaultApplicable: true,
    applicableRegulation: "(AB) 2023/1542 (Batarya Tüzüğü)",
  },
  packaging: {
    id: "packaging",
    name: "Ambalaj Sanayi",
    tier: "B",
    cnCodes: ["3923", "4819"],
    unit: "ton",
    defaultDirectEmission: 1.40,
    defaultIndirectEmission: 0.30,
    typicalRealDirectMin: 0.60,
    typicalRealDirectMax: 1.80,
    description: "PPWR (AB) 2025/40 Ambalaj ve Ambalaj Atıkları Tüzüğü: AB Uygunluk Beyanı (DoC), teknik dosya ve geri dönüşüm hedefleri.",
    scope2DefaultApplicable: true,
    applicableRegulation: "(AB) 2025/40 (PPWR)",
  },
  food: {
    id: "food",
    name: "Gıda & Tarım (EUDR)",
    tier: "B",
    cnCodes: ["1801-1806", "0901", "1201"],
    unit: "ton",
    defaultDirectEmission: 2.50,
    defaultIndirectEmission: 0.20,
    typicalRealDirectMin: 0.80,
    typicalRealDirectMax: 3.20,
    description: "EUDR (AB) 2023/1115 Ormansızlaşma Tüzüğü: Kakao, kahve, soya ve kauçukta coğrafi konum + Durum Tespiti Beyanı (DDS).",
    scope2DefaultApplicable: false,
    applicableRegulation: "(AB) 2023/1115 (EUDR)",
  },
  logistics: {
    id: "logistics",
    name: "Uluslararası Lojistik",
    tier: "B",
    cnCodes: ["9901-9904"],
    unit: "tkm",
    defaultDirectEmission: 0.00008,
    defaultIndirectEmission: 0.00002,
    typicalRealDirectMin: 0.00003,
    typicalRealDirectMax: 0.00015,
    description: "CSRD/VSME Kapsam-3 taşımacılık emisyon verisi (GLEC / ISO 14083 karayolu, deniz ve demiryolu taşıma emisyonu).",
    scope2DefaultApplicable: true,
    applicableRegulation: "ISO 14083 / CSRD Scope-3",
  },

  // --- KADEME C: DOLAYLI SKDM & ÜRÜN KARBON AYAK İZİ (PCF) ---
  plastics: {
    id: "plastics",
    name: "Plastik ve Polimerler",
    tier: "C",
    cnCodes: ["3901-3914"],
    unit: "ton",
    defaultDirectEmission: 1.95,
    defaultIndirectEmission: 0.40,
    typicalRealDirectMin: 0.90,
    typicalRealDirectMax: 2.30,
    description: "Tedarik zinciri CSRD Kapsam-3 ve PCF (Ürün Karbon Ayak İzi) talepleri. Geri dönüştürülmüş polimer kullanımı emisyonu düşürür.",
    scope2DefaultApplicable: true,
    applicableRegulation: "CSRD & PCF (ISO 14067)",
  },
  chemicals: {
    id: "chemicals",
    name: "Kimya Sanayi",
    tier: "C",
    cnCodes: ["2801-2853", "2901-2942"],
    unit: "ton",
    defaultDirectEmission: 2.20,
    defaultIndirectEmission: 0.50,
    typicalRealDirectMin: 1.10,
    typicalRealDirectMax: 2.80,
    description: "Temel organik ve inorganik kimyasallar. İlerleyen SKDM genişleme paketinde doğrudan kapsama girmesi beklenmektedir.",
    scope2DefaultApplicable: true,
    applicableRegulation: "CSRD & PCF (ISO 14067)",
  },
  glass: {
    id: "glass",
    name: "Cam Sanayi",
    tier: "C",
    cnCodes: ["7001-7020"],
    unit: "ton",
    defaultDirectEmission: 0.95,
    defaultIndirectEmission: 0.25,
    typicalRealDirectMin: 0.55,
    typicalRealDirectMax: 1.20,
    description: "Düz cam, ambalaj camı ve züccaciye. Harman geri cam (cullet) kullanımı eritme fırını emisyonunu azaltır.",
    scope2DefaultApplicable: true,
    applicableRegulation: "CSRD & PCF (ISO 14067)",
  },
  textile: {
    id: "textile",
    name: "Tekstil ve Konfeksiyon",
    tier: "C",
    cnCodes: ["5001-6310"],
    unit: "ton",
    defaultDirectEmission: 3.10,
    defaultIndirectEmission: 1.20,
    typicalRealDirectMin: 1.20,
    typicalRealDirectMax: 4.50,
    description: "AB Dijital Ürün Pasaportu (DPP) ve Eko-tasarım (ESPR) uyarınca kumaş, iplik ve konfeksiyon ürün karbon ve su ayak izi.",
    scope2DefaultApplicable: true,
    applicableRegulation: "AB ESPR & DPP (Dijital Pasaport)",
  },
  machinery: {
    id: "machinery",
    name: "Makine ve Ekipman",
    tier: "C",
    cnCodes: ["8401-8487"],
    unit: "ton",
    defaultDirectEmission: 2.10,
    defaultIndirectEmission: 0.60,
    typicalRealDirectMin: 0.90,
    typicalRealDirectMax: 2.50,
    description: "Çelik ve alüminyum girdi kullanan makine imalatçıları. AB müşterilerine gömülü çelik emisyon verisi sağlama modülü.",
    scope2DefaultApplicable: true,
    applicableRegulation: "CSRD Scope-3 & SKDM Downstream",
  },
  automotive: {
    id: "automotive",
    name: "Otomotiv Yan Sanayi",
    tier: "C",
    cnCodes: ["8708"],
    unit: "ton",
    defaultDirectEmission: 2.30,
    defaultIndirectEmission: 0.70,
    typicalRealDirectMin: 0.85,
    typicalRealDirectMax: 2.70,
    description: "OEM ana sanayi (VW, Mercedes, Renault) tedarikçileri için Cat-1 satın alınan mal emisyonu beyan formatı.",
    scope2DefaultApplicable: true,
    applicableRegulation: "ISO 14067 / Cat-1 Scope 3",
  },
  electronics: {
    id: "electronics",
    name: "Elektronik & Elektrikli Cihaz",
    tier: "C",
    cnCodes: ["8501-8548"],
    unit: "ton",
    defaultDirectEmission: 1.80,
    defaultIndirectEmission: 0.90,
    typicalRealDirectMin: 0.70,
    typicalRealDirectMax: 2.40,
    description: "Kablo, trafo, motor ve beyaz eşya parçaları. AB ESPR eko-tasarım ve geri dönüştürülmüş metal beyanı.",
    scope2DefaultApplicable: true,
    applicableRegulation: "AB ESPR & CSRD",
  },
  furniture: {
    id: "furniture",
    name: "Mobilya Sanayi",
    tier: "C",
    cnCodes: ["9401-9404"],
    unit: "ton",
    defaultDirectEmission: 0.85,
    defaultIndirectEmission: 0.30,
    typicalRealDirectMin: 0.30,
    typicalRealDirectMax: 1.10,
    description: "Ahşap ve metal mobilya. EUDR ahşap kaynağı doğrulaması ve PCF ürün karbon ayak izi.",
    scope2DefaultApplicable: true,
    applicableRegulation: "EUDR & CSRD Scope-3",
  },
  paper: {
    id: "paper",
    name: "Kağıt ve Oluklu Mukavva",
    tier: "C",
    cnCodes: ["4801-4811"],
    unit: "ton",
    defaultDirectEmission: 0.75,
    defaultIndirectEmission: 0.35,
    typicalRealDirectMin: 0.30,
    typicalRealDirectMax: 1.05,
    description: "Selüloz, kağıt ve koli üretimi. Biyokütle kazanı ve geri dönüştürülmüş hurda kağıt kullanımı emisyonu düşürür.",
    scope2DefaultApplicable: true,
    applicableRegulation: "EUDR & CSRD",
  },
  construction: {
    id: "construction",
    name: "Yapı Malzemeleri",
    tier: "C",
    cnCodes: ["6801-6815", "6901-6914"],
    unit: "ton",
    defaultDirectEmission: 0.88,
    defaultIndirectEmission: 0.22,
    typicalRealDirectMin: 0.40,
    typicalRealDirectMax: 1.15,
    description: "Tuğla, kiremit, gazbeton, seramik karo ve izole yapı gereçleri EPD (Çevresel Ürün Beyanı) ve PCF hesabı.",
    scope2DefaultApplicable: true,
    applicableRegulation: "AB CPR & EPD",
  },
};
