/**
 * teb232@gmail.com test kullanıcısı — Denizcilik Karbon Uyumu (EU ETS & FuelEU)
 * Gerçekçi Türk armatör & konteyner gemisi verileriyle eksiksiz mühürlü dosya seti.
 *
 * Gemi: M/V MEDKON IZMIR (IMO: 9437892 — matematiksel kontrol basamağı doğrulanmış)
 * İşletmeci: Medkon Hat İşletmeciliği Denizcilik ve Tic. A.Ş. (IMO Co: 5421987)
 * Rota: Ambarlı (TR) ↔ Cenova (IT) · 24 Sefer/Yıl · %50 ETS Kapsamı
 * Doğrulayıcı: DNV GL SE (DAkkS D-VS-14065-01-00)
 * Durum: 599 USD Ödendi · Mühürlendi · Denetime Hazır (Readiness: 100/100)
 */

import { buildMaritimeDossier, type DossierBuilderInput } from "./dossier/builder";
import {
  createSealedMaritimePackage,
  downloadMaritimePackageFile,
  downloadMaritimePackageZip,
  type SealedMaritimePackageOutput,
} from "./package-seal";
import type { MaritimeComplianceDossier } from "./dossier/schema";

export const TEST_USER_EMAIL = "teb232@gmail.com";

export interface TestMaritimeSeedHistoryItem {
  packageId: string;
  reportingYear: number;
  shipName: string;
  imoNumber: string;
  companyName: string;
  grossTonnage: number;
  flagState: string;
  routeSummary: string;
  annualVoyages: number;
  administeringAuthority: string;
  verifierName: string;
  surrenderEua: number;
  estimatedEtsCostEur: number;
  actualGhgIntensity: number;
  fuelEuTargetIntensity: number;
  isFuelEuCompliant: boolean;
  masterHash: string;
  zipFilename: string;
  sealedAt: string;
  paidAmountUsd: number;
  readinessScore: number;
  status: "PAID_AND_SEALED" | "VERIFIER_AUDIT_READY";
}

interface MaritimeFixture {
  packageId: string;
  sealedAt: string;
  input: DossierBuilderInput;
}

const FIXTURES: MaritimeFixture[] = [
  {
    packageId: "MAR-2026-MEDKON-9437892",
    sealedAt: "2026-08-16T15:00:00.000Z",
    input: {
      reportingYear: 2025,
      companyTitle: "Medkon Hat İşletmeciliği Denizcilik ve Tic. A.Ş.",
      imoCompanyNumber: "5421987",
      role: "ism-yoneticisi",
      registeredOwnerName: "Medkon Lines Shipping Ltd.",
      registeredOwnerImoNumber: "5421987",
      country: "Türkiye",
      countryCode: "TR",
      address: "Rıhtım Caddesi No: 42, Kadıköy, İstanbul, Türkiye",
      contactName: "Ahmet Yılmaz",
      contactEmail: TEST_USER_EMAIL,
      telephone: "+90 216 555 0199",
      administeringAuthorityName: "İtalya Ulusal Denizcilik İdaresi (MASE)",
      administeringCountryCode: "IT",
      formalMandateReference: "MANDATE-MEDKON-2025-01",

      // Gemi Bilgileri (Resmi IMO 9437892)
      shipName: "M/V MEDKON IZMIR",
      imoNumber: "9437892",
      portOfRegistry: "İstanbul",
      homePort: "Ambarlı",
      flagState: "TR - Türkiye",
      grossTonnage: 14200,
      deadweightTonnes: 18500,
      shipType: "container",
      officialCategory: "Container ship",
      classificationSociety: "DNV",
      iceClass: "none",

      // Akredite Doğrulayıcı
      verifierName: "DNV GL SE",
      accreditationNumber: "DAkkS D-VS-14065-01-00",
      accreditationBody: "DAkkS (Almanya)",
      leadAuditor: "Capt. Markus Vance",
      verificationStatus: "VERIFIED_AS_SATISFACTORY",

      // İzleme Planları
      mrvPlanAssessed: true,
      mrvPlanApproved: true,
      fuelEuPlanAssessed: true,

      // Sefer & Yakıt (Ambarlı -> Cenova 24 sefer)
      annualVoyagesCount: 24,
      departurePortName: "Ambarlı (İstanbul)",
      departureUnlocode: "TRAMB",
      departureIsEu: false,
      arrivalPortName: "Cenova (İtalya)",
      arrivalUnlocode: "ITGOA",
      arrivalIsEu: true,

      fuelType: "VLSFO",
      fuelQuantityTonnes: 1350,
      bioFuelQuantityTonnes: 50,
      useShorePower: true,
      opsElectricityKWh: 36000,

      evidences: [
        {
          fileName: "BDN-2025-MEDKON-014.pdf",
          fileType: "Bunker Delivery Note (BDN)",
          sizeBytes: 184520,
          sha256Hash: "b8a9238e8316c80c2f82161b9a997ef3dc138e68cfb9ec9c0e5a87679ad30e99",
          status: "verified",
          uploadedAt: "2025-06-12T09:30:00Z",
        },
        {
          fileName: "MRV_MON_PLAN_MEDKON_IZMIR_STAMPED.pdf",
          fileType: "DNV Onaylı MRV İzleme Planı",
          sizeBytes: 942100,
          sha256Hash: "d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592",
          status: "verified",
          uploadedAt: "2025-03-01T14:15:00Z",
        },
        {
          fileName: "OPS_SHORE_POWER_LOG_GENOA.pdf",
          fileType: "Sahil Elektriği Bağlantı Kaydı (Cenova)",
          sizeBytes: 215400,
          sha256Hash: "4c7d0b3f89ec128741369d7b92ac0673e4b789125648f0a3d46174c8109bf5a7",
          status: "verified",
          uploadedAt: "2025-08-20T11:45:00Z",
        },
      ],
    },
  },
];

const cache = new Map<string, SealedMaritimePackageOutput>();

export function getTestMaritimeDossier(packageId: string): MaritimeComplianceDossier | null {
  const fx = FIXTURES.find((f) => f.packageId === packageId);
  if (!fx) return null;
  return buildMaritimeDossier(fx.input);
}

export function getTestMaritimeSealedPackage(packageId: string): SealedMaritimePackageOutput | null {
  const fx = FIXTURES.find((f) => f.packageId === packageId);
  if (!fx) return null;
  const hit = cache.get(packageId);
  if (hit) return hit;

  const dossier = buildMaritimeDossier(fx.input);
  const pkg = createSealedMaritimePackage(dossier, {
    packageId: fx.packageId,
    timestamp: fx.sealedAt,
  });

  cache.set(packageId, pkg);
  return pkg;
}

export function buildTestMaritimeSeedHistory(): TestMaritimeSeedHistoryItem[] {
  return FIXTURES.map((fx) => {
    const pkg = getTestMaritimeSealedPackage(fx.packageId)!;
    const d = pkg.dossier;
    return {
      packageId: fx.packageId,
      reportingYear: d.reportingYear,
      shipName: d.ship.shipName,
      imoNumber: d.ship.imoNumber,
      companyName: d.company.companyName,
      grossTonnage: d.ship.grossTonnage,
      flagState: d.ship.flagState,
      routeSummary: `${d.voyages[0]?.departurePort || "Ambarlı"} ↔ ${d.voyages[0]?.arrivalPort || "Cenova"}`,
      annualVoyages: d.voyages.length,
      administeringAuthority: d.company.administeringAuthority,
      verifierName: d.verifier.verifierName,
      surrenderEua: d.etsCalculation.surrenderEuaObligation,
      estimatedEtsCostEur: d.etsCalculation.estimatedFinancialCostEur,
      actualGhgIntensity: d.fuelEuCalculation.actualGhgIntensity,
      fuelEuTargetIntensity: d.fuelEuCalculation.targetGhgIntensity,
      isFuelEuCompliant: d.fuelEuCalculation.isCompliant,
      masterHash: pkg.masterHash,
      zipFilename: pkg.zipFilename || `${fx.packageId}-Muhurlu-Uyum-Paketi.zip`,
      sealedAt: fx.sealedAt,
      paidAmountUsd: 599,
      readinessScore: d.readiness.score,
      status: "PAID_AND_SEALED",
    };
  });
}

export function downloadTestMaritimeZip(packageId: string): boolean {
  const pkg = getTestMaritimeSealedPackage(packageId);
  if (!pkg) return false;
  return downloadMaritimePackageZip(pkg);
}

export function downloadTestMaritimeFile(packageId: string, filename: string): boolean {
  const pkg = getTestMaritimeSealedPackage(packageId);
  if (!pkg) return false;
  return downloadMaritimePackageFile(pkg, filename);
}

export function listTestMaritimeFilenames(packageId: string): string[] {
  return getTestMaritimeSealedPackage(packageId)?.files.map((f) => f.filename) || [];
}
