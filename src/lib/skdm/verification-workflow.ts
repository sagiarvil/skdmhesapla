export const CBAM_VERIFICATION_WORKFLOW = {
  version: "2026-09-01.1",
  sourcePublishedAt: "2026-08-24",
  procedurePublishedAt: "2026-08-28",
  stateOfPlayPublishedAt: "2026-09-01",
  guidanceSourceUrl:
    "https://taxation-customs.ec.europa.eu/news/european-commission-publishes-guidance-cbam-verifiers-and-accreditation-bodies-2026-08-24_en",
  registrySourceUrl:
    "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-registry_en",
  declarantsManualPublishedAt: "2026-08-21",
  registryAccessFrom: "2026-09-01",
  verifierRegistrationDeadlineRule:
    "CBAM akreditasyonundan itibaren iki ay içinde; ancak 1 Eylül 2026'dan önce olmamak üzere",
  verificationReportsFrom: "2027-01",
  flow: [
    "NAB akreditasyonu (Ulusal Akreditasyon Kuruluşu)",
    "Akredite doğrulayıcıların O3CI portalından NCA'ya kayıt başvurusu yapması",
    "NCA akreditasyon kontrolü ve erişim onayı (Ulusal Yetkili Makam)",
    "Doğrulayıcıların operator verilerini ve belgeleri inceleyip verification report oluşturması",
  ],
  roles: {
    verifier: "Bağımsız akredite doğrulayıcı (operatör verilerini/belgelerini inceler, verification report oluşturur)",
    nab: "National Accreditation Body (akreditasyon verir)",
    commission: "European Commission / DG TAXUD (Registry altyapısı, akredite doğrulayıcı listesini yayımlar)",
    nca: "National Competent Authority (akreditasyon kontrolü ve erişim onayı)",
  },
  calculationImpact: "NONE",
  calculationImpactNote:
    "24/28 Ağustos ve 1 Eylül 2026 (State-of-play) verification/accreditation güncellemeleri gömülü emisyon formülünü, default values veri setini, benchmark değerlerini veya ETS maliyet hesabını değiştirmez.",
  defaultValuesStatus:
    "Bu güncellemede yeni default-value değişikliği yoktur; 10 Ağustos 2026 corrected default values veri seti yürürlükteki son operasyonel referanstır.",
  productBoundary:
    "SKDMHesapla akredite doğrulayıcı değildir; hesaplama ve veri/kanıt hazırlığı yapar, bağımsız verification report üretmez.",
} as const;

export type CbamVerificationWorkflow = typeof CBAM_VERIFICATION_WORKFLOW;
