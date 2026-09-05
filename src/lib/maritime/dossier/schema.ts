/**
 * EU Denizcilik Karbon Uyumu — Bütünleşik Mevzuat Dosyası Şeması
 *
 * Dayanak Mevzuat:
 * 1. EU MRV: Regulation (EU) 2015/757 as amended by Regulation (EU) 2023/957
 * 2. EU MRV Uygulama Şablonları: Commission Implementing Regulation (EU) 2023/2449 (Annex II Part A-G & Annex IV)
 * 3. EU MRV Doğrulama ve Akreditasyon: Commission Delegated Regulation (EU) 2023/2917
 * 4. EU ETS Maritime: Directive 2003/87/EC as amended & Commission Implementing Decision (EU) 2024/411
 * 5. FuelEU Maritime: Regulation (EU) 2023/1805
 * 6. FuelEU Doğrulama & Rapor Şablonları: Commission Implementing Regulation (EU) 2024/2027
 * 7. FuelEU İzleme Planı Şablonları: Commission Implementing Regulation (EU) 2024/2031
 * 8. Komşu Konteyner Aktarma Limanları: Commission Implementing Regulation (EU) 2025/1127
 */

import type { FuelType, IceClass, ShipType } from "../types";

export interface DossierCompany {
  companyName: string;
  role: "gemi-sahibi" | "ism-yoneticisi" | "bareboat-kiracisi";
  imoCompanyNumber: string; // 7 digits
  registeredOwnerName: string;
  registeredOwnerImoNumber: string;
  country: string; // e.g. "Türkiye", "Malta", "Yunanistan"
  countryCode: string; // "TR", "MT", "GR"
  address: string;
  contactName: string;
  contactEmail: string;
  telephone: string;
  administeringAuthority: string; // Assigned EU Member State
  administeringCountryCode: string;
  mohaAccountId?: string; // Maritime Operator Holding Account
  formalMandateReference: string; // ISM Document of Compliance mandate reference
  responsibilityFrom: string; // YYYY-MM-DD
  responsibilityTo: string; // YYYY-MM-DD
}

export interface DossierVerifier {
  verifierName: string; // e.g. "DNV GL SE", "Bureau Veritas Marine & Offshore SAS", "RINA Services S.p.A."
  accreditationNumber: string; // e.g. "DAkkS D-VS-12345-01-00", "COFRAC 3-0892"
  accreditationBody: string; // e.g. "DAkkS (Germany)", "COFRAC (France)", "ACCREDIA (Italy)"
  leadAuditor?: string;
  address: string;
  contactEmail: string;
  verificationStatus: "DRAFT_PREPARATION" | "UNDER_VERIFICATION" | "VERIFIED_AS_SATISFACTORY";
  verificationDate?: string;
  auditScope: string; // "EU MRV • EU ETS Maritime • FuelEU Maritime"
}

export interface DossierShip {
  shipName: string;
  imoNumber: string; // 7 digits
  portOfRegistry: string;
  homePort: string;
  flagState: string;
  shipType: ShipType;
  officialCategory: string; // e.g. "Container ship", "Bulk carrier"
  deadweightTonnes: number;
  grossTonnage: number;
  classificationSociety: string;
  iceClass: IceClass;
  technicalEfficiencyType: "EEDI" | "EEXI" | "AER" | "none";
  technicalEfficiencyValue: string; // gCO2/t-nm
  description?: string;
}

export interface DossierMrvMonitoringPlan {
  monitoringPlanVersion: string;
  monitoringPlanReferenceDate: string;
  monitoringPlanAssessed: boolean;
  assessmentReference?: string;
  assessmentDate?: string;
  monitoringPlanApproved: boolean;
  approvalReference?: string;
  revisionNotes: string;
  fuelMonitoringMethod: "Method A (BDN)" | "Method B (Fuel tank)" | "Method C (Flow meters)" | "Method D (Direct emissions)";
  densityMethod: string;
  uncertaintyMethod: string;
  uncertaintyPercent: number;
  emissionFactorMethod: string;
  dataGapMethod: string;
  voyageCompletenessProcedure: string;
  emissionSources: string[];
  measurementEquipment: string;
  itSystem: string;
  proceduresReference: string;
}

export interface DossierFuelEuMonitoringPlan {
  planVersion: string;
  submissionDate: string;
  assessedByVerifier: boolean;
  energyConsumers: Array<{
    id: string;
    consumerType: "Main Engine" | "Auxiliary Engine" | "Auxiliary Boiler" | "Gas Turbine" | "Inert Gas Generator";
    powerRatingKw: number;
    fuelTypes: string[];
    monitoringMethod: string;
  }>;
  fuelClassesAllowed: string[]; // ["FOSSIL_VLSFO", "FOSSIL_LSMGO", "BIO_DIESEL_HVO", "RFNBO_E_METHANOL"]
  wtTFactorSource: "Annex II Default" | "Proof of Sustainability (RED II/III Certified)";
  ttWFactorSource: "Annex II Default" | "Laboratory Test Report";
  opsConnectionProcedure: string;
  opsNominalPowerKw: number;
  opsExemptionProcedures: string;
  windRewardProcedures?: string;
  dataGapSurrogateMethod: string;
}

export interface DossierVoyage {
  id: string;
  voyageNumber: string;
  departurePort: string;
  departureUnlocode: string;
  departureAt: string; // UTC ISO
  arrivalPort: string;
  arrivalUnlocode: string;
  arrivalAt: string; // UTC ISO
  scope: "eu-eea-intra" | "eu-eea-third" | "third-eu-eea" | "non-eu";
  scopeRatio: number; // 1.0, 0.5, 0.0
  portCallPurpose: string;
  distanceNm: number;
  timeAtSeaHours: number;
  timeAtBerthHours: number;
  anchorageHours: number;
  cargoTonnes: number;
  teuCount?: number;
  transportWorkTonneNm: number;
  co2Tonnes: number;
  ch4TonnesCo2e: number;
  n2oTonnesCo2e: number;
  fuelTonnes: number;
  dataGap: boolean;
  dataGapReason?: string;
}

export interface DossierFuel {
  id: string;
  voyageId?: string;
  scope: "eu-eea-intra" | "eu-eea-third" | "third-eu-eea" | "non-eu";
  scopeRatio: number;
  portName?: string;
  portUnlocode?: string;
  terminalBerth?: string;
  fuelType: FuelType;
  fuelConsumer: string;
  bdnReference: string;
  sustainabilityCertificate?: string;
  quantityTonnes: number;
  lowerCalorificValueMjPerKg: number;
  energyMj: number;
  atBerthEnergyMj: number;
  wellToTankFactorGco2ePerMj: number;
  tankToWakeCo2Factor: number;
  tankToWakeCh4Factor: number;
  tankToWakeN2oFactor: number;
  slipFactor: number;
  wellToWakeEmissionsGco2e: number;
  opsElectricityKwh: number;
  opsConnectionHours: number;
  opsPeakPowerKw: number;
  isRfnbo: boolean;
  measurementMethod: string;
}

export interface DossierEtsCalculation {
  reportingYear: number;
  phaseInPercentage: number; // e.g. 70 for 2025, 100 for 2026
  totalReportedCo2eTonnes: number;
  scopedCo2eTonnes: number;
  liableGhgTonnes: number;
  surrenderEuaObligation: number;
  referenceEuaPriceEur: number;
  estimatedFinancialCostEur: number;
  surrenderDeadline: string; // "30 September " + (year + 1)
}

export interface DossierFuelEuCalculation {
  reportingYear: number;
  totalEnergyMj: number;
  targetGhgIntensity: number; // 89.3368 for 2025-2029
  actualGhgIntensity: number; // gCO2eq/MJ
  intensityGap: number; // target - actual
  complianceBalanceMj: number;
  isCompliant: boolean;
  compliancePenaltyEur: number;
  consecutiveDeficitYears: number;
  opsComplianceStatus: "COMPLIANT" | "NON_COMPLIANT" | "EXEMPT";
  rfnboRewardMj: number;
  bankingAllowed: boolean;
  borrowingLimitMj: number;
}

export interface DossierCompanyLevelReport {
  reportingYear: number;
  companyName: string;
  imoCompanyNumber: string;
  administeringMemberState: string;
  mohaAccountId: string;
  totalFleetShipsCount: number;
  fleetShipsList: Array<{ shipName: string; imoNumber: string }>;
  aggregatedReportedCo2eTonnes: number;
  aggregatedScopedCo2eTonnes: number;
  etsPhaseInRate: number;
  totalCompanySurrenderEuaObligation: number;
  complianceDeadline: string;
}

export interface DossierEvidenceFile {
  fileName: string;
  fileType: string;
  sizeBytes: number;
  sha256Hash: string;
  status: "verified" | "processing";
  uploadedAt: string;
}

export interface DossierReadiness {
  score: number; // 0 - 100
  status: "BLOCKED_PREPARATION" | "VERIFIER_AUDIT_READY" | "VERIFIED_COMPLIANT";
  blocking: string[];
  warnings: string[];
  complete: string[];
}

export interface MaritimeComplianceDossier {
  product: "SKDMhesapla Maritime Carbon Compliance Preparation Dossier";
  ruleset: "eu-maritime-2026-09-05";
  schemaVersion: "2026.1";
  generatedAt: string;
  reportingYear: number;
  company: DossierCompany;
  verifier: DossierVerifier;
  ship: DossierShip;
  mrvMonitoringPlan: DossierMrvMonitoringPlan;
  fuelEuMonitoringPlan: DossierFuelEuMonitoringPlan;
  voyages: DossierVoyage[];
  fuels: DossierFuel[];
  etsCalculation: DossierEtsCalculation;
  fuelEuCalculation: DossierFuelEuCalculation;
  companyLevelReport: DossierCompanyLevelReport;
  readiness: DossierReadiness;
  evidences: DossierEvidenceFile[];
  sources: Array<{ id: string; title: string; authority: string; url: string }>;
  rootSha256: string;
  legalBoundary: string;
}
