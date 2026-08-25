export const CBAM_PRODUCT_READINESS = {
  version: "2026-08-25.2",

  // Tam ürün kabiliyeti — ücretli actual-data-only teslimin ön koşulu değildir.
  // Resmî country + CN/TARIC default-value sayısal veri seti tamamlanana kadar
  // fallback yalnız ön izleme/karşılaştırma katmanında kalır ve mühürlenmez.
  officialDefaultValuesNumericDatasetReady: false,
  officialDefaultValueFallbackSealable: false,

  // Ücretli ürünün fiili teslim kapıları.
  actualDataOnlyPaidSealPolicy: true,
  communicationDataMappingRegressionReady: true,
  serverAuthoritativeSealReady: false,
  paymentToDownloadE2EReady: false,
} as const;

export const CBAM_COMMERCIAL_RELEASE_READY =
  CBAM_PRODUCT_READINESS.actualDataOnlyPaidSealPolicy &&
  CBAM_PRODUCT_READINESS.communicationDataMappingRegressionReady &&
  CBAM_PRODUCT_READINESS.serverAuthoritativeSealReady &&
  CBAM_PRODUCT_READINESS.paymentToDownloadE2EReady;

export const CBAM_COMMERCIAL_RELEASE_BLOCKERS = [
  !CBAM_PRODUCT_READINESS.actualDataOnlyPaidSealPolicy
    ? "Ücretli CBAM paketinde yalnız gerçek tesis / kaynak akışı verisi kullanılmasını zorunlu kılan fail-closed politika"
    : null,
  !CBAM_PRODUCT_READINESS.communicationDataMappingRegressionReady
    ? "Communication Template veri eşleme özeti için paket regresyon kapısı"
    : null,
  !CBAM_PRODUCT_READINESS.serverAuthoritativeSealReady
    ? "CBAM paketinin istemciye güvenmeden sunucuda yeniden hesaplanması, üretilmesi ve mühürlenmesi"
    : null,
  !CBAM_PRODUCT_READINESS.paymentToDownloadE2EReady
    ? "Gerçek ödeme → yetki → sunucu mühürleme → private ZIP → indirme uçtan uca kabul testi"
    : null,
].filter((item): item is string => Boolean(item));

export const CBAM_CAPABILITY_LIMITATIONS = [
  !CBAM_PRODUCT_READINESS.officialDefaultValuesNumericDatasetReady
    ? "Resmî ülke + CN/TARIC default-value sayısal veri seti henüz tam motor kabiliyeti değildir; sektör fallback değerleri Commission official default value olarak sunulmaz ve ücretli pakette kullanılamaz."
    : null,
].filter((item): item is string => Boolean(item));
