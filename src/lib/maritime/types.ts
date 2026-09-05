/**
 * EU Denizcilik Karbon Uyumu (EU MRV + EU ETS Maritime + FuelEU Maritime)
 * Resmî Mevzuat Veri Modelleri ve Tip Tanımları
 *
 * Dayanak Mevzuat:
 * - EU MRV: Regulation (EU) 2015/757 & (EU) 2023/957
 * - EU ETS: Directive 2003/87/EC as amended & Implementing Decision (EU) 2023/2297
 * - FuelEU Maritime: Regulation (EU) 2023/1805 & Implementing Regs (EU) 2024/2027, 2024/2031
 */

export type ShipType =
  | "container"
  | "bulk_carrier"
  | "general_cargo"
  | "tanker"
  | "ro_ro"
  | "passenger"
  | "offshore";

export type IceClass = "none" | "IC" | "IB" | "IA" | "IAS";

export type ReportingYearStatus =
  | "draft"
  | "audited"
  | "locked"
  | "sealed"
  | "REGULATORY_REVIEW_REQUIRED";

export interface MaritimeCompany {
  id: string; // company UUID or IMO Company Number
  title: string;
  imoCompanyNumber: string; // 7 digits
  vkn?: string;
  country: string; // ISO 2-letter, e.g. "TR", "GR"
  administeringMemberState: string; // e.g. "DE", "MT", "GR", "FR"
  mohaAccountId?: string; // Maritime Operator Holding Account in Union Registry
  createdAt: string;
  updatedAt: string;
}

export interface Fleet {
  id: string;
  companyId: string;
  name: string;
  description?: string;
}

export interface Vessel {
  id: string; // IMO vessel number or UUID
  companyId: string;
  fleetId: string;
  name: string;
  imoNumber: string; // 7 digits
  flagState: string;
  grossTonnage: number; // GT
  shipType: ShipType;
  iceClass: IceClass;
  eediEexiGramsCo2PerTn?: number;
  createdAt: string;
}

export interface PortInfo {
  code: string; // UN/LOCODE, e.g. "TRAMB", "ITGOA", "EGPSD", "MATNG"
  name: string;
  country: string; // ISO 2-letter
  isEuEea: boolean;
  isNeighbouringContainerTransshipment: boolean; // Directive 2003/87/EC Art 3ga (Port Said, Tanger Med)
}

export type ScopeAllocation = 1.0 | 0.5 | 0.0;

export interface Voyage {
  id: string;
  vesselId: string;
  reportingYear: number;
  voyageNumber: string;
  departurePort: PortInfo;
  arrivalPort: PortInfo;
  departureDate: string; // ISO
  arrivalDate: string; // ISO
  distanceNm: number;
  cargoWeightTonnes: number;
  teuCount?: number;
  hoursUnderway: number;
  hoursAtBerth: number;
  scopeRatio: ScopeAllocation; // 1.0 = EU-EU or at berth; 0.5 = EU-nonEU; 0.0 = nonEU-nonEU
  exceptionFlags: string[];
}

export type FuelType =
  | "VLSFO" // 0.50% S Very Low Sulphur Fuel Oil
  | "LSMGO" // 0.10% S Low Sulphur Marine Gas Oil
  | "HFO" // Heavy Fuel Oil
  | "LNG_OTTO_MEDIUM_SPEED"
  | "LNG_DIESEL"
  | "BIO_DIESEL" // FAME / HVO
  | "BIO_LNG"
  | "E_METHANOL" // RFNBO
  | "E_AMMONIA" // RFNBO
  | "HYDROGEN" // RFNBO
  | "OPS"; // Onshore Power Supply (Electricity)

export interface FuelConsumption {
  id: string;
  voyageId: string;
  vesselId: string;
  fuelType: FuelType;
  massTonnes: number; // For OPS, this represents zero fuel mass, but electricity kWh is tracked
  electricityKWh?: number; // Only for OPS
  lcvMjPerKg: number; // Lower Calorific Value (MJ/kg)
  bdnReferenceId?: string; // Bunker Delivery Note ID
  evidenceId?: string;
  isRfnbo?: boolean; // Eligible for 2x reward factor under FuelEU Art 5(3) until 2033
  // Emissions
  co2FactorTtW: number; // tCO2 / tFuel
  ghgIntensityWtW: number; // gCO2eq / MJ
}

export type EvidenceDocumentType =
  | "BDN"
  | "LOGBOOK"
  | "MONITORING_PLAN"
  | "CALIBRATION_CERT"
  | "SUSTAINABILITY_CERT"
  | "OPS_INVOICE";

export interface EvidenceDocument {
  id: string;
  vesselId: string;
  reportingYear: number;
  fileName: string;
  fileType: EvidenceDocumentType;
  mimeType: string;
  sizeBytes: number;
  sha256Hash: string; // 64-char hex
  storagePath: string;
  supportingRecordType: "fuel_consumption" | "voyage" | "berth" | "general";
  supportingRecordId?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface AuditLogEntry {
  id: string;
  entityType: "vessel" | "voyage" | "fuel_consumption" | "evidence" | "reporting_year";
  entityId: string;
  action: "create" | "update" | "lock" | "seal" | "regulatory_flag" | "verify";
  performedBy: string;
  timestamp: string;
  changesSummary: string;
}

export type MaritimeReadinessStatus =
  | "PRE_VERIFICATION_INCOMPLETE_NOT_FOR_SUBMISSION"
  | "PRE_VERIFICATION_DOSSIER_READY_FOR_ACCREDITED_VERIFIER_REVIEW";

export interface FuelEuCalculationResult {
  year: number;
  totalEnergyMj: number;
  targetGhgIntensity: number; // gCO2eq/MJ (e.g. 89.3368 for 2025: -2% from 91.16)
  actualGhgIntensity: number; // gCO2eq/MJ
  statutoryUnit: "gCO2eq";
  complianceBalanceGco2eq: number; // Statutory Compliance Balance in gCO2eq: (GHGIE_target - GHGIE_actual) * TotalEnergy
  complianceBalanceMj: number; // Geriye dönük uyumluluk / açıklayıcı eşdeğer
  explanatoryEnergyEquivalentSurplusMj?: number; // Kullanıcıya açıklayıcı enerji eşdeğeri (MJ)
  complianceStatus: "POSITIVE_COMPLIANCE_SURPLUS" | "COMPLIANCE_DEFICIT" | "BALANCED";
  isCompliant: boolean;
  compliancePenaltyEur: number; // Ceza tahakkuku (CB < 0 iken)
  consecutiveDeficitYears: number;
  opsArticle6Applicable: boolean; // 2025'te konteyner/yolcu gemileri için zorunlu değildir (2030/2035)
  opsComplianceStatus: "COMPLIANT" | "NON_COMPLIANT" | "EXEMPT" | "VOLUNTARY_USAGE_RECORDED";
  opsExplanatoryNote: string;
  opsPenaltyEur: number;
  rfnboRewardMj: number;
  bankingAllowed: boolean;
  bankingStatus: "BANKABLE_SUBJECT_TO_VERIFICATION" | "NOT_ELIGIBLE" | "NOT_USED";
  maxBorrowingLimitGco2eq: number;
  maxBorrowingDeficitMj: number; // Geriye dönük uyumluluk
  borrowingStatus: "NOT_USED" | "REQUESTED_SUBJECT_TO_VERIFICATION" | "NOT_ELIGIBLE";
  poolingStatus: "NOT_USED" | "POOLED";
}

export interface EtsCalculationResult {
  year: number;
  phaseInPercentage: number; // 2024: 0.4, 2025: 0.7, 2026+: 1.0
  totalReportedCo2Tonnes: number;
  totalReportedCh4Tonnes?: number; // MRV fiziksel raporlamasında yer alır
  totalReportedN2oTonnes?: number; // MRV fiziksel raporlamasında yer alır
  etsLiableCo2Tonnes: number; // 2025 ETS surrender kapsamında YALNIZCA CO2
  etsLiableCh4Tonnes: number; // 2025'te 0.0 (2026 emisyonlarından itibaren dahil)
  etsLiableN2oTonnes: number; // 2025'te 0.0 (2026 emisyonlarından itibaren dahil)
  liableGhgTonnes: number; // Phase-in ve 50%/100% rota kapsamına göre düzeltilmiş nihai tonaj
  surrenderEuaRequired: number; // Yukarı yuvarlanmış tam EUA tahsisatı
  financialBenchmarkNote?: string;
  referenceEuaPriceEur: number;
  estimatedFinancialCostEur: number;
}
