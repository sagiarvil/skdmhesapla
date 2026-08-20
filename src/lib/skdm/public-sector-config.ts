/**
 * BROWSER-SAFE sektör metadata'sı — otomatik üretildi.
 * SIZMA DÜZELTMESİ: private benchmark alanları (defaultDirectEmission vb.)
 * buraya asla eklenmez — yalnızca src/lib/skdm/config.ts'te kalır.
 */
export const PUBLIC_SKDM_SECTORS = {
  "iron-steel": {
    "id": "iron-steel",
    "name": "Demir & Çelik",
    "tier": "A",
    "cnCodes": [
      "7201-7203",
      "7205-7229",
      "7301-7311",
      "7318",
      "7326",
      "2601 12 00"
    ],
    "unit": "ton",
    "description": "Ham çelik, inşaat demiri, filmaşin, boru ve profil imalatı. Ek II (Annex II): yalnızca doğrudan emisyonlar fiyatlanır; elektrik (Kapsam 2) SKDM sertifika maliyetine girmez.",
    "scope2DefaultApplicable": false,
    "applicableRegulation": "(AB) 2023/956 & 2025/2083 (SKDM)"
  },
  "aluminum": {
    "id": "aluminum",
    "name": "Alüminyum Sanayi",
    "tier": "A",
    "cnCodes": [
      "7601",
      "7603-7614",
      "7616"
    ],
    "unit": "ton",
    "description": "Alüminyum biyel, külçe, levha, folyo ve ekstrüzyon profiller. Ek II (Annex II) kapsamında yalnızca doğrudan emisyonlar fiyatlandırılır; elektrik tüketimi SKDM sertifika maliyetine girmez.",
    "scope2DefaultApplicable": false,
    "applicableRegulation": "(AB) 2023/956 & 2025/2083 (SKDM)"
  },
  "cement": {
    "id": "cement",
    "name": "Çimento Sanayi",
    "tier": "A",
    "cnCodes": [
      "2523 10 00",
      "2523 29 00"
    ],
    "unit": "ton",
    "description": "Klinker ve çimento üretimi. Proses emisyonu (kireçtaşı kalsinasyonu) nedeniyle Kapsam 1 yükü yüksektir. Doğrudan + dolaylı emisyonlar fiyatlanır.",
    "scope2DefaultApplicable": true,
    "applicableRegulation": "(AB) 2023/956 & 2025/2083 (SKDM)"
  },
  "fertilizer": {
    "id": "fertilizer",
    "name": "Gübre Sanayi (Azotlu)",
    "tier": "A",
    "cnCodes": [
      "3102",
      "2808 00 00",
      "2814",
      "2834 21 00",
      "3105 (3105 60 00 hariç)"
    ],
    "unit": "ton",
    "description": "Amonyak, nitrik asit, üre ve NPK gübreleri. Nitrik asit N2O emisyonu yüksek N2O GWP çarpanına sahiptir.",
    "scope2DefaultApplicable": true,
    "applicableRegulation": "(AB) 2023/956 & 2025/2083 (SKDM)"
  },
  "hydrogen": {
    "id": "hydrogen",
    "name": "Hidrojen Üretimi",
    "tier": "A",
    "cnCodes": [
      "2804 10 00"
    ],
    "unit": "ton",
    "description": "Sanayi ve enerji tipi hidrojen. SMR gri hidrojen 8.9t CO2 yükü getirirken yeşil hidrojen alıcıya sıfır maliyet sağlar.",
    "scope2DefaultApplicable": false,
    "applicableRegulation": "(AB) 2023/956 & 2025/2083 (SKDM)"
  },
  "electricity": {
    "id": "electricity",
    "name": "Elektrik Enerjisi",
    "tier": "A",
    "cnCodes": [
      "2716 00 00"
    ],
    "unit": "MWh",
    "description": "Sınır ötesi elektrik ihracatı. Yeşil sertifikalı ve YEK-G / I-REC belgeli elektrik alıcı için sıfır maliyet sağlar.",
    "scope2DefaultApplicable": false,
    "applicableRegulation": "(AB) 2023/956 & 2025/2083 (SKDM)"
  },
  "battery": {
    "id": "battery",
    "name": "Batarya ve Pil",
    "tier": "B",
    "cnCodes": [
      "8506",
      "8507"
    ],
    "unit": "kWh",
    "description": "AB Batarya Tüzüğü (AB) 2023/1542: EV ve endüstriyel bataryalarda model bazında Karbon Ayak İzi Beyanı & Batarya Pasaportu.",
    "scope2DefaultApplicable": true,
    "applicableRegulation": "(AB) 2023/1542 (Batarya Tüzüğü)"
  },
  "packaging": {
    "id": "packaging",
    "name": "Ambalaj Sanayi",
    "tier": "B",
    "cnCodes": [
      "3923",
      "4819"
    ],
    "unit": "ton",
    "description": "PPWR (AB) 2025/40 Ambalaj ve Ambalaj Atıkları Tüzüğü: AB Uygunluk Beyanı (DoC), teknik dosya ve geri dönüşüm hedefleri.",
    "scope2DefaultApplicable": true,
    "applicableRegulation": "(AB) 2025/40 (PPWR)"
  },
  "food": {
    "id": "food",
    "name": "Gıda & Tarım (EUDR)",
    "tier": "B",
    "cnCodes": [
      "1801-1806",
      "0901",
      "1201"
    ],
    "unit": "ton",
    "description": "EUDR (AB) 2023/1115 Ormansızlaşma Tüzüğü: Kakao, kahve, soya ve kauçukta coğrafi konum + Durum Tespiti Beyanı (DDS).",
    "scope2DefaultApplicable": false,
    "applicableRegulation": "(AB) 2023/1115 (EUDR)"
  },
  "logistics": {
    "id": "logistics",
    "name": "Uluslararası Lojistik",
    "tier": "B",
    "cnCodes": [
      "9901-9904"
    ],
    "unit": "tkm",
    "description": "CSRD/VSME Kapsam-3 taşımacılık emisyon verisi (GLEC / ISO 14083 karayolu, deniz ve demiryolu taşıma emisyonu).",
    "scope2DefaultApplicable": true,
    "applicableRegulation": "ISO 14083 / CSRD Scope-3"
  },
  "plastics": {
    "id": "plastics",
    "name": "Plastik ve Polimerler",
    "tier": "C",
    "cnCodes": [
      "3901-3914"
    ],
    "unit": "ton",
    "description": "Tedarik zinciri CSRD Kapsam-3 ve PCF (Ürün Karbon Ayak İzi) talepleri. Geri dönüştürülmüş polimer kullanımı emisyonu düşürür.",
    "scope2DefaultApplicable": true,
    "applicableRegulation": "CSRD & PCF (ISO 14067)"
  },
  "chemicals": {
    "id": "chemicals",
    "name": "Kimya Sanayi",
    "tier": "C",
    "cnCodes": [
      "2801-2853",
      "2901-2942"
    ],
    "unit": "ton",
    "description": "Temel organik ve inorganik kimyasallar. İlerleyen SKDM genişleme paketinde doğrudan kapsama girmesi beklenmektedir.",
    "scope2DefaultApplicable": true,
    "applicableRegulation": "CSRD & PCF (ISO 14067)"
  },
  "glass": {
    "id": "glass",
    "name": "Cam Sanayi",
    "tier": "C",
    "cnCodes": [
      "7001-7020"
    ],
    "unit": "ton",
    "description": "Düz cam, ambalaj camı ve züccaciye. Harman geri cam (cullet) kullanımı eritme fırını emisyonunu azaltır.",
    "scope2DefaultApplicable": true,
    "applicableRegulation": "CSRD & PCF (ISO 14067)"
  },
  "textile": {
    "id": "textile",
    "name": "Tekstil ve Konfeksiyon",
    "tier": "C",
    "cnCodes": [
      "5001-6310"
    ],
    "unit": "ton",
    "description": "AB Dijital Ürün Pasaportu (DPP) ve Eko-tasarım (ESPR) uyarınca kumaş, iplik ve konfeksiyon ürün karbon ve su ayak izi.",
    "scope2DefaultApplicable": true,
    "applicableRegulation": "AB ESPR & DPP (Dijital Pasaport)"
  },
  "machinery": {
    "id": "machinery",
    "name": "Makine ve Ekipman",
    "tier": "C",
    "cnCodes": [
      "8401-8487"
    ],
    "unit": "ton",
    "description": "Çelik ve alüminyum girdi kullanan makine imalatçıları. AB müşterilerine gömülü çelik emisyon verisi sağlama modülü.",
    "scope2DefaultApplicable": true,
    "applicableRegulation": "CSRD Scope-3 & SKDM Downstream"
  },
  "automotive": {
    "id": "automotive",
    "name": "Otomotiv Yan Sanayi",
    "tier": "C",
    "cnCodes": [
      "8708"
    ],
    "unit": "ton",
    "description": "OEM ana sanayi (VW, Mercedes, Renault) tedarikçileri için Cat-1 satın alınan mal emisyonu beyan formatı.",
    "scope2DefaultApplicable": true,
    "applicableRegulation": "ISO 14067 / Cat-1 Scope 3"
  },
  "electronics": {
    "id": "electronics",
    "name": "Elektronik & Elektrikli Cihaz",
    "tier": "C",
    "cnCodes": [
      "8501-8548"
    ],
    "unit": "ton",
    "description": "Kablo, trafo, motor ve beyaz eşya parçaları. AB ESPR eko-tasarım ve geri dönüştürülmüş metal beyanı.",
    "scope2DefaultApplicable": true,
    "applicableRegulation": "AB ESPR & CSRD"
  },
  "furniture": {
    "id": "furniture",
    "name": "Mobilya Sanayi",
    "tier": "C",
    "cnCodes": [
      "9401-9404"
    ],
    "unit": "ton",
    "description": "Ahşap ve metal mobilya. EUDR ahşap kaynağı doğrulaması ve PCF ürün karbon ayak izi.",
    "scope2DefaultApplicable": true,
    "applicableRegulation": "EUDR & CSRD Scope-3"
  },
  "paper": {
    "id": "paper",
    "name": "Kağıt ve Oluklu Mukavva",
    "tier": "C",
    "cnCodes": [
      "4801-4811"
    ],
    "unit": "ton",
    "description": "Selüloz, kağıt ve koli üretimi. Biyokütle kazanı ve geri dönüştürülmüş hurda kağıt kullanımı emisyonu düşürür.",
    "scope2DefaultApplicable": true,
    "applicableRegulation": "EUDR & CSRD"
  },
  "construction": {
    "id": "construction",
    "name": "Yapı Malzemeleri",
    "tier": "C",
    "cnCodes": [
      "6801-6815",
      "6901-6914"
    ],
    "unit": "ton",
    "description": "Tuğla, kiremit, gazbeton, seramik karo ve izole yapı gereçleri EPD (Çevresel Ürün Beyanı) ve PCF hesabı.",
    "scope2DefaultApplicable": true,
    "applicableRegulation": "AB CPR & EPD"
  }
} as const;
