/**
 * CBAM Yasama Radarı ve Bekleyen Düzenlemeler (Pending Legislation Layer)
 *
 * Resmî Kaynak: European Parliament Research Service (EPRS) — 10 Eylül 2026 Brifingi
 *
 * HUKUKİ DEMİR KURAL:
 * Kesin mevzuat EUR-Lex / AB Resmî Gazetesi'nde (Official Journal) yayımlanmadan
 * skdmhesapla.com üretim motorundaki 569 doğrulanmış 8 haneli CN kodu kapsamı
 * OTOMATİK DEĞİŞTİRİLMEZ.
 *
 * YASAMA BORU HATTI (PIPELINE):
 * COM proposal (180) → ENVI position (457) → Parliament vote → trilogue → final OJ regulation → production CN update
 */

export const PENDING_LEGISLATION_VERSION = "2026-09-10.1";

export type LegislativeStage =
  | "COM_PROPOSAL"
  | "ENVI_POSITION"
  | "PARLIAMENT_VOTE"
  | "TRILOGUE"
  | "FINAL_OJ_REGULATION"
  | "PRODUCTION_CN_UPDATE";

export interface LegislativePipelineStep {
  stage: LegislativeStage;
  labelTr: string;
  countProducts?: number;
  status: "COMPLETED" | "CURRENT" | "PENDING";
  descriptionTr: string;
}

export interface PendingLegislationTrack {
  id: string;
  source: string;
  sourceDate: string;
  titleTr: string;
  summaryTr: string;
  currentStage: LegislativeStage;
  pipeline: LegislativePipelineStep[];
  calculationImpact: "NONE";
  productionEngineStatus: "569_CN_UNCHANGED";
  benchmarkTracking: {
    etsBenchmarkAlignmentTarget: "2026";
    defaultValuesRevisionTarget: "2027_OR_2028_EARLY";
    priority: "HIGH";
    descriptionTr: string;
  };
  exporterAdvisoryTr: string[];
}

export const CBAM_PENDING_DOWNSTREAM_SCOPE: PendingLegislationTrack = {
  id: "cbam-downstream-scope-extension-2026",
  source: "European Parliament Research Service (EPRS)",
  sourceDate: "2026-09-10",
  titleTr: "Avrupa Parlamentosu ENVI Komitesi 457 Downstream Ürün Kapsam Genişlemesi",
  summaryTr:
    "Avrupa Komisyonu'nun CBAM kapsamına 180 downstream ürün ekleme teklifine karşı, AP Çevre (ENVI) Komitesi kapsamı 457 downstream ürüne çıkarmayı önerdi. Eylül plenary oylaması Parlamento pozisyonunu kesinleştirecek.",
  currentStage: "ENVI_POSITION",
  pipeline: [
    {
      stage: "COM_PROPOSAL",
      labelTr: "Komisyon Teklifi",
      countProducts: 180,
      status: "COMPLETED",
      descriptionTr: "Avrupa Komisyonu ilk etapta 180 çelik ve alüminyum ağırlıklı nihai ürün önerdi.",
    },
    {
      stage: "ENVI_POSITION",
      labelTr: "ENVI Komitesi Raporu",
      countProducts: 457,
      status: "CURRENT",
      descriptionTr: "Avrupa Parlamentosu Çevre (ENVI) Komitesi kapsamı 457 downstream ürüne çıkarma pozisyonunu benimsedi.",
    },
    {
      stage: "PARLIAMENT_VOTE",
      labelTr: "Parlamento Genel Kurul Oylaması",
      status: "PENDING",
      descriptionTr: "Eylül 2026 plenary oturumunda oylama yapılarak Parlamento resmi müzakere yetkisi belirlenecek.",
    },
    {
      stage: "TRILOGUE",
      labelTr: "Konsey & Parlamento Trilog Müzakereleri",
      status: "PENDING",
      descriptionTr: "AB Konseyi ve Parlamento arasında uzlaşma metni oluşturulacak.",
    },
    {
      stage: "FINAL_OJ_REGULATION",
      labelTr: "AB Resmî Gazetesi Yayını (EUR-Lex)",
      status: "PENDING",
      descriptionTr: "Nihai tüzük Resmi Gazete'de yayımlanarak yürürlük tarihi ve kesin CN listesi resmileşecek.",
    },
    {
      stage: "PRODUCTION_CN_UPDATE",
      labelTr: "Üretim Motoru CN Güncellemesi",
      status: "PENDING",
      descriptionTr: "Resmi Gazete yayını sonrasında skdmhesapla.com üretim CN motoruna yeni kodlar bağlanacak.",
    },
  ],
  calculationImpact: "NONE",
  productionEngineStatus: "569_CN_UNCHANGED",
  benchmarkTracking: {
    etsBenchmarkAlignmentTarget: "2026",
    defaultValuesRevisionTarget: "2027_OR_2028_EARLY",
    priority: "HIGH",
    descriptionTr:
      "Komisyon resmi CBAM incelemesi; CBAM benchmark'larının 2026 içinde yeni ETS benchmark'larına uyarlanacağını, varsayılan değerler (default values) revizyonunun ise yeterli veri birikimi sonrasında 2027 veya 2028 başında yapılacağını doğrulamaktadır.",
  },
  exporterAdvisoryTr: [
    "Demir-çelik ve alüminyum kullanan downstream nihai ürün üreticileri girdi emisyonlarını şimdiden kayıt altına almalıdır.",
    "Bu resmi sinyal henüz yürürlükte mevzuat değildir; mevcut 569 CN kodu kapsamı EUR-Lex yayınına kadar korunmaktadır.",
    "2026 içinde gerçekleşecek ETS benchmark güncellemeleri ve 2027/2028 varsayılan değer revizyonları yakından izlenmelidir.",
  ],
};
