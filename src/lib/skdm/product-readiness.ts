export const CBAM_PRODUCT_READINESS = {
  version: "2026-08-25.1",
  officialDefaultValuesNumericDatasetReady: false,
  serverAuthoritativeSealReady: false,
  officialCommunicationTemplateRegressionReady: false,
  paymentToDownloadE2EReady: false,
} as const;

export const CBAM_COMMERCIAL_RELEASE_READY =
  CBAM_PRODUCT_READINESS.officialDefaultValuesNumericDatasetReady &&
  CBAM_PRODUCT_READINESS.serverAuthoritativeSealReady &&
  CBAM_PRODUCT_READINESS.officialCommunicationTemplateRegressionReady &&
  CBAM_PRODUCT_READINESS.paymentToDownloadE2EReady;

export const CBAM_COMMERCIAL_RELEASE_BLOCKERS = [
  !CBAM_PRODUCT_READINESS.officialDefaultValuesNumericDatasetReady
    ? "Resmî ülke + CN/TARIC default-value veri setinin sayısal motor entegrasyonu"
    : null,
  !CBAM_PRODUCT_READINESS.serverAuthoritativeSealReady
    ? "CBAM paketinin istemciye güvenmeden sunucuda üretilmesi ve mühürlenmesi"
    : null,
  !CBAM_PRODUCT_READINESS.officialCommunicationTemplateRegressionReady
    ? "Resmî Communication Template için binary/worksheet regresyon kapısı"
    : null,
  !CBAM_PRODUCT_READINESS.paymentToDownloadE2EReady
    ? "Gerçek ödeme → yetki → mühür → registry → ZIP → indirme uçtan uca testi"
    : null,
].filter((item): item is string => Boolean(item));
