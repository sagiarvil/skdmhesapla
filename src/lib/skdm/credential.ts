/**
 * SKDMHesapla — Credential & Methodology Trust Layer
 * Single Source of Truth for Professional Training Credentials and Versioned Calculation Methodology.
 */

export type CredentialItem = {
  id: string;
  holder: {
    name: string;
    role: string;
    profileUrl: string;
  };
  credential: {
    name: string;
    officialTitle?: string;
    standard: string;
    credentialType: string;
    issuingOrganization: string;
    issuerDetails?: string;
    issueDate: string | null;
    trainingDates?: string;
    instructor?: string;
    signatory?: string;
    credentialId: string | null;
    verificationUrl: string;
    certificateAsset: string;
  };
  status: "active" | "archived" | "superseded";
  scope: string[];
  disclaimer: string;
};

export const primaryCredential: CredentialItem = {
  id: "cred-bb-iso14064-1",
  holder: {
    name: "Barış Bağırlar",
    role: "Ürün ve Karbon Hesaplama Metodolojisi Sorumlusu",
    profileUrl: "/uzmanlik/baris-bagirlar",
  },
  credential: {
    name: "ISO 14064-1 Sera Gazı Emisyon Hesaplama Eğitimi",
    officialTitle: "TS EN ISO 14064-1 Sera Gazı Salınımlarının ve Uzaklaştırmalarının Kuruluş Seviyesinde Hesaplanması ve Raporlanması Eğitimi",
    standard: "ISO 14064-1",
    credentialType: "Professional Training / Calculation Competency",
    issuingOrganization: "Gaziantep Üniversitesi / GSO-MEM",
    issuerDetails: "Gaziantep Sanayi Odası Mesleki Eğitim Merkezi (GSO-MEM)",
    issueDate: "2024-11-23",
    trainingDates: "21/11/2024 - 23/11/2024",
    instructor: "Dr. Fatih BALCI (Eğitmen)",
    signatory: "İbrahim ÇALI (Gaziantep Sanayi Odası Genel Sekreter Yardımcısı)",
    credentialId: "GSO-MEM-14064-2024-089",
    verificationUrl: "/uzmanlik/baris-bagirlar#credential",
    certificateAsset: "/assets/credentials/iso-14064-1-baris-bagirlar.webp",
  },
  status: "active",
  scope: [
    "Sera gazı emisyon hesaplama",
    "TS EN ISO 14064-1 standardı prensipleri",
    "Kapsam 1 emisyonları",
    "Kapsam 2 emisyonları",
    "Kapsam 3 metodolojisi",
    "Karbon hesaplama ve raporlama yaklaşımı",
  ],
  disclaimer:
    "Bu eğitim belgesi SKDMHesapla yazılımının ISO tarafından sertifikalandırıldığı, CBAM doğrulaması yaptığı veya akredite doğrulama görüşü sunduğu anlamına gelmez.",
};

/** Extensible list of credentials (§45 failure mode mitigation) */
export const credentials: CredentialItem[] = [primaryCredential];

export const credential = primaryCredential;

export const methodology = {
  version: "CBAM-2026.08.1",
  effectiveFrom: "2026-08-01",
  regulatorySnapshot: "2026-08-01",
  calculationEngineVersion: "3.4.0",
  owner: "Barış Bağırlar",
  credentialRef: primaryCredential.id,
  title: "SKDMHesapla CBAM Hesaplama Metodolojisi",
  canonicalUrl: "/metodoloji",
  reviewDate: "2026-08-17",
};

export const GROUND_TRUTH_CLAIM =
  "SKDMHesapla'nın karbon hesaplama metodolojisi, ISO 14064-1 kapsamında sera gazı emisyon hesaplama eğitimi sahibi ürün sorumlusunun metodolojik gözetiminde geliştirilmektedir.";

export const SCOPE_DISCLAIMER =
  "Kapsam notu: SKDMHesapla hesaplama, veri hazırlama ve doğrulama öncesi çalışma altyapısı sağlar. Bu doküman akredite doğrulayıcı görüşü, resmi CBAM beyanı, gümrük kararı veya kamu otoritesi onayı değildir.";
