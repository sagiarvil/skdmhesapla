export type CbamAccreditationStatus =
  | "ACCREDITED"
  | "APPLICATION_SUBMITTED"
  | "UNDER_ASSESSMENT"
  | "NOT_ACCREDITED"
  | "SUSPENDED";

export type CbamVerificationStatus =
  | "NOT_STARTED"
  | "UNDER_DOCUMENT_REVIEW"
  | "SITE_VISIT_SCHEDULED"
  | "SITE_VISIT_COMPLETED"
  | "VERIFICATION_REPORT_PENDING_REGISTRY"
  | "VERIFIED_AND_SUBMITTED";

export type CbamRegistryTransmissionStatus =
  | "NOT_TRANSMITTED"
  | "PREPARED_FOR_EXPORT"
  | "TRANSMITTED"
  | "ACCEPTED_BY_REGISTRY"
  | "REJECTED_NEEDS_REVISION";

export interface CbamVerifierRecord {
  verifierId?: string;
  verifierNameLatin: string;
  nationalAccreditationBody: string; // NAB (Ulusal Akreditasyon Kuruluşu)
  accreditationCertificateNumber: string;
  accreditationScope: readonly string[]; // Sektör ve faaliyet kapsamı
  accreditationStatus: CbamAccreditationStatus;
  registryOnboardingStatus: "NOT_STARTED" | "O3CI_APPLIED" | "NCA_APPROVED" | "REJECTED";
  ncaApprovalDate?: string;
}

export interface CbamVerificationReportRecord {
  reportId?: string;
  verifierId?: string;
  verificationStatus: CbamVerificationStatus;
  siteVisitDate?: string;
  siteVisitLocation?: string;
  documentReviewCompletedAt?: string;
  registryReportReference?: string; // Ocak 2027'den itibaren Registry üzerinden düzenlenecek resmî referans
  registryReportIssuanceAvailableFrom: "2027-01";
  verifiedAt?: string;
  verifiedEmissionsTco2e?: number; // Akredite doğrulayıcı tarafından doğrulanmış değer (hesaplanan değerden KESİN AYRI)
  verificationOpinion?: "UNQUALIFIED" | "QUALIFIED" | "ADVERSE" | "DISCLAIMER";
}

export interface CbamEmissionsDisambiguation {
  /** SKDMHesapla motorunun formül ve katsayılarla hesapladığı değer */
  calculatedEmissions: {
    totalTco2e: number;
    directTco2e: number;
    indirectTco2e: number;
    precursorTco2e: number;
    calculatedAt: string;
    isVerifiedByAccreditedBody: false;
  };
  /** Yalnızca akredite bağımsız CBAM doğrulayıcısı tarafından doğrulandığında doldurulan değer */
  verifiedEmissions: {
    totalTco2e: number;
    directTco2e: number;
    indirectTco2e: number;
    precursorTco2e: number;
    verifiedAt: string;
    verifierNameLatin: string;
    accreditationNumber: string;
    verificationReportReference?: string;
    isVerifiedByAccreditedBody: true;
  } | null;
}

export const CBAM_VERIFICATION_WORKFLOW = {
  version: "2026-09-01.2",
  priority: "P2",
  operationalStageStarted: true,
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
  operationalTimeline: {
    registryOnboardingStart: "2026-09-01",
    documentReviewAndSiteVisitsStart: "2026-09-01",
    verificationReportsViaRegistryStart: "2027-01",
    currentStatusDescription:
      "Doğrulama süreci fiilen başlamıştır: Akredite doğrulayıcılar 1 Eylül 2026 itibarıyla Registry'ye kayıt olmakta, doküman incelemesi ve saha/tesis ziyaretlerini başlatabilmektedir. Resmî verification report'ların Registry üzerinden düzenlenmesi Ocak 2027'den itibaren aktif olacaktır.",
  },
  accessChain: [
    "1. Ulusal Akreditasyon Kuruluşu (NAB) akreditasyonu: Doğrulayıcı önce yetkili NAB tarafından ilgili faaliyet grubunda akredite olur.",
    "2. O3CI Registry erişim başvurusu: Akredite doğrulayıcı O3CI portalından CBAM Registry erişimi için başvurur.",
    "3. Ulusal Yetkili Makam (NCA) erişim onayı: İlgili NCA akreditasyon durumunu teyit ederek erişimi onaylar.",
    "4. Doğrulama çalışması: Doğrulayıcı operatörün verilerini, izleme planını, hesap izini ve kanıtlarını inceler; saha/tesis ziyareti gerçekleştirir.",
    "5. Registry Verification Report düzenlenmesi: 2026 kesin dönem emisyonları için ilk verification report'lar Ocak 2027'den itibaren Registry üzerinden düzenlenir.",
  ],
  flow: [
    "NAB akreditasyonu (Ulusal Akreditasyon Kuruluşu)",
    "Akredite doğrulayıcıların O3CI portalından NCA'ya kayıt başvurusu yapması",
    "NCA akreditasyon kontrolü ve erişim onayı (Ulusal Yetkili Makam)",
    "Doğrulayıcıların doküman incelemesi ve tesis ziyaretiyle doğrulama çalışmalarını yürütmesi",
    "Doğrulayıcıların Ocak 2027'den itibaren CBAM Registry üzerinden verification report oluşturması",
  ],
  roles: {
    verifier: "Bağımsız akredite doğrulayıcı (operatör verilerini/belgelerini inceler, tesis ziyareti yapar, verification report oluşturur)",
    nab: "National Accreditation Body (akreditasyon verir)",
    commission: "European Commission / DG TAXUD (Registry altyapısı, akredite doğrulayıcı listesini yayımlar)",
    nca: "National Competent Authority (akreditasyon kontrolü ve erişim onayı)",
  },
  calculationImpact: "NONE",
  calculationImpactNote:
    "1 Eylül 2026 CBAM verification ve Registry operasyonel aşaması gömülü emisyon formülünü, default values veri setini, benchmark değerlerini veya ETS maliyet hesabını değiştirmez. Gelişme hesaplama motorunda değil, doğrulama ve Registry altyapısındadır.",
  defaultValuesStatus:
    "Bu güncellemede yeni default-value değişikliği yoktur; 10 Ağustos 2026 corrected default values veri seti yürürlükteki son operasyonel referanstır.",
  productBoundary:
    "SKDMHesapla akredite doğrulayıcı değildir; hesaplama ve veri/kanıt hazırlığı yapar, bağımsız verification report üretmez. Müşteri çıktılarında 'hesaplanan değer' ile 'akredite doğrulanmış değer' kesin olarak ayrılır.",
} as const;

export type CbamVerificationWorkflow = typeof CBAM_VERIFICATION_WORKFLOW;
