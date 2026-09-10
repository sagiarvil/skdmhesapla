/**
 * SSOT: Denizcilik Sade Türkçe & Teknik Terim Eşleme Sözlüğü
 * 
 * Kural: Müşteri arayüzünde "Türkçe açıklama (teknik terim parantez içinde)" standardı uygulanır.
 * Asla "klas onayı / IACS klas hazır" gibi yanıltıcı ifadeler kullanılmaz; doğrulama yetkisi
 * ISO 14065 / EU MRV akreditasyonuna sahip "Akredite Doğrulayıcı"dadır (Accredited Verifier).
 * Mevzuat adı: Tüzük (AB) 2023/957 (MRV) ve Direktif (AB) 2023/959 (ETS).
 */

export interface MaritimeTermDefinition {
  id: string;
  plainTr: string;
  technicalTerm: string;
  combinedLabel: string;
  shortDescription: string;
  statutoryReference: string;
  forbiddenAliases: string[];
}

export const MARITIME_LANGUAGE_MAP: Record<string, MaritimeTermDefinition> = {
  euEts: {
    id: "euEts",
    plainTr: "Avrupa Karbon Piyasası Emisyon Tahsisat Sistemi",
    technicalTerm: "EU ETS Maritime",
    combinedLabel: "Avrupa Karbon Piyasası Emisyon Tahsisat Sistemi (EU ETS Maritime)",
    shortDescription:
      "5.000 GT ve üzeri gemilerin AB limanlarına uğraklarında saldıkları sera gazı miktarı kadar karbon tahsisatı (EUA) satın alıp teslim etme zorunluluğudur.",
    statutoryReference: "Direktif 2003/87/EC (Direktif (AB) 2023/959 ile değiştirilen)",
    forbiddenAliases: ["gemi karbon vergisi kanunu", "gemi gümrük vergisi"],
  },
  euMrv: {
    id: "euMrv",
    plainTr: "Gemi Emisyon Takip, Raporlama ve Doğrulama Sistemi",
    technicalTerm: "EU MRV",
    combinedLabel: "Gemi Emisyon Takip, Raporlama ve Doğrulama Sistemi (EU MRV)",
    shortDescription:
      "AB limanlarına sefer yapan 5.000 GT üzeri yük/yolcu ve 2025'ten itibaren 400-4.999 GT genel kargo/offshore gemilerin yakıt tüketimi ve sefer verilerini izleme mekanizmasıdır.",
    statutoryReference: "Tüzük (AB) 2015/757 (Tüzük (AB) 2023/957 ile tadil edilen)",
    forbiddenAliases: ["Direktif (AB) 2023/957", "THETIS-MRV v2"],
  },
  fuelEu: {
    id: "fuelEu",
    plainTr: "Denizcilik Yakıtı Sera Gazı Yoğunluğu Standardı",
    technicalTerm: "FuelEU Maritime",
    combinedLabel: "Denizcilik Yakıtı Sera Gazı Yoğunluğu Standardı (FuelEU Maritime)",
    shortDescription:
      "Gemide kullanılan enerjinin kuyu-pervane (Well-to-Wake) sera gazı yoğunluğunun kademeli düşürülmesini zorunlu kılan, uyumsuzlukta ceza tahakkuk ettiren AB tüzüğüdür.",
    statutoryReference: "Tüzük (AB) 2023/1805",
    forbiddenAliases: ["FuelEU direktifi", "FuelEU karbon vergisi"],
  },
  accreditedVerifier: {
    id: "accreditedVerifier",
    plainTr: "Bağımsız Akredite Doğrulayıcı Kuruluş",
    technicalTerm: "Accredited Verifier",
    combinedLabel: "Bağımsız Akredite Doğrulayıcı Kuruluş (Accredited Verifier)",
    shortDescription:
      "AB MRV ve FuelEU kapsamında denetim yapmaya ulusal akreditasyon kurumu veya EMSA tarafından yetkilendirilmiş tüzel denetim organıdır.",
    statutoryReference: "Tüzük (AB) 2015/757 Madde 3 & Tüzük (AB) 2023/1805 Madde 13",
    forbiddenAliases: ["IACS klas onayı", "klas kuruluşu onayı", "klas denetimi garantisi"],
  },
  thetisMrv: {
    id: "thetisMrv",
    plainTr: "Avrupa Deniz Emniyeti Ajansı Emisyon Bilgi Portalı",
    technicalTerm: "THETIS-MRV",
    combinedLabel: "Avrupa Deniz Emniyeti Ajansı Emisyon Portalı (THETIS-MRV)",
    shortDescription:
      "EMSA tarafından işletilen, yıllık emisyon raporlarının ve izleme planlarının yüklendiği ve doğrulayıcı onayının yürütüldüğü merkezi AB portalıdır.",
    statutoryReference: "EMSA THETIS-MRV Teknik Portalı",
    forbiddenAliases: ["THETIS-MRV v2", "THETIS v2"],
  },
  complianceBalance: {
    id: "complianceBalance",
    plainTr: "Yıllık Yakıt Uyum Dengesi",
    technicalTerm: "Compliance Balance (CB)",
    combinedLabel: "Yıllık Yakıt Uyum Dengesi (Compliance Balance - gCO₂eq)",
    shortDescription:
      "Geminin kullandığı yakıtın hedef sera gazı yoğunluğuna kıyasla fazlalık (artı) veya eksiklik (eksi uyum açığı) miktarının gram CO₂ eşdeğeri cinsinden ifadesidir.",
    statutoryReference: "Tüzük (AB) 2023/1805 Ek IV",
    forbiddenAliases: ["uyum yüzdesi", "ceza katsayısı"],
  },
  bunkerDeliveryNote: {
    id: "bunkerDeliveryNote",
    plainTr: "Yakıt Teslim Belgesi",
    technicalTerm: "Bunker Delivery Note (BDN)",
    combinedLabel: "Yakıt Teslim Belgesi (Bunker Delivery Note - BDN)",
    shortDescription:
      "Gemiye ikmal edilen yakıtın miktar, yoğunluk, viskozite ve kükürt değerlerini teyit eden birincil fiziksel ikmal makbuzudur.",
    statutoryReference: "MARPOL Ek VI Kural 18 & Tüzük (AB) 2015/757 Ek I",
    forbiddenAliases: ["bunker faturası", "yakıt fişi"],
  },
  euaSurrender: {
    id: "euaSurrender",
    plainTr: "Karbon Tahsisatı Teslim Yükümlülüğü",
    technicalTerm: "EUA Surrender Obligation",
    combinedLabel: "Karbon Tahsisatı Teslim Yükümlülüğü (EUA Surrender)",
    shortDescription:
      "Raporlama yılı sonrasında doğrulanmış emisyon payı karşılığında Union Registry hesabından AB otoritesine teslim edilmesi gereken tahsisat (EUA) adedidir.",
    statutoryReference: "Direktif 2003/87/EC Madde 12(3)",
    forbiddenAliases: ["karbon vergisini ödeme", "vergi yatırma"],
  },
  freightSurcharge: {
    id: "freightSurcharge",
    plainTr: "Navlun Karbon Payı",
    technicalTerm: "ETS Freight Surcharge",
    combinedLabel: "Navlun Karbon Payı (ETS Freight Surcharge)",
    shortDescription:
      "Armatörlerin AB ETS kapsamındaki tahsisat maliyetlerini konteyner başına navlun faturasına 'ETS ek ücreti' olarak yansıtmasıdır; CBAM gömülü emisyonuna eklenemez.",
    statutoryReference: "Ticari Navlun Uygulaması & CBAM Tüzüğü (AB) 2023/956 Sınırı",
    forbiddenAliases: ["CBAM navlun vergisi", "navlun CBAM harcı"],
  },
  ismCompany: {
    id: "ismCompany",
    plainTr: "Kayıtlı Gemi İşletmecisi",
    technicalTerm: "Document of Compliance (DoC) / ISM Company",
    combinedLabel: "Kayıtlı Gemi İşletmecisi (ISM Company)",
    shortDescription:
      "Gemi emniyetli yönetim belgesine (DoC) sahip ve AB idaresine karşı ETS ve FuelEU yasal sorumluluğunu üstlenen yetkili tüzel işletmeci şirkettir.",
    statutoryReference: "Tüzük (AB) 2015/757 Madde 3(d) & Tüzük (AB) 2023/1805 Madde 3(13)",
    forbiddenAliases: ["acente", "yük komisyoncusu"],
  },
};

/**
 * Yardımcı terim formatlayıcı
 */
export function formatPlainWithTechnical(key: keyof typeof MARITIME_LANGUAGE_MAP): string {
  return MARITIME_LANGUAGE_MAP[key]?.combinedLabel || key;
}
