export type MaritimeRole =
  | "gemi-sahibi" | "ism-doc-company" | "gemi-isletmecisi" | "charterer"
  | "forwarder" | "liman-acente" | "ihracatci";
export type MaritimeShipType = "cargo" | "general-cargo" | "passenger" | "offshore" | "other";
export type MaritimePortRegion = "eu" | "norway-iceland" | "none" | "unknown";
export type MaritimeScopeLevel = "out" | "review" | "likely" | "critical";
export type VoyageScope = "intra-eu-eea" | "eu-eea-third" | "at-eu-eea-port" | "outside" | "excluded";
export type MaritimeEnergyCategory = "fossil" | "biofuel" | "rfnbo" | "ops" | "other";

export interface MaritimeScopeInput {
  role: MaritimeRole; shipType: MaritimeShipType; grossTonnage: number; portRegion: MaritimePortRegion;
  euPortCallsPerYear: number; emissionsYear: number; carriesCbamGoods: boolean; hasFuelRecords: boolean;
  hasVoyageRecords: boolean; hasMonitoringPlan: boolean; hasFormalResponsibilityMandate?: boolean;
  etsScopeEmissionsTco2e?: number; euaPriceEur?: number;
}
export interface MaritimeScopeResult {
  mrv: MaritimeScopeLevel; ets: MaritimeScopeLevel; fueleu: MaritimeScopeLevel; cbamPartnerPotential: MaritimeScopeLevel;
  readinessScore: number; missingEvidence: string[];
  commercialRoute: "free" | "paid-pre-analysis" | "annual-compliance" | "partner-desk";
  headline: string; decisionReasons: { mrv: string; ets: string; fueleu: string; partner: string };
  etsCoverageFactor: number; estimatedEtsCostEur: number | null; warnings: string[];
}

export interface MaritimeCompanyData {
  companyName: string; role: MaritimeRole; imoCompanyNumber: string; registeredOwnerName: string;
  registeredOwnerImoNumber: string; country: string; address: string; contactName: string; contactEmail: string;
  telephone: string; administeringAuthority: string; formalMandateReference: string;
  responsibilityFrom: string; responsibilityTo: string;
  /** Primary-evidence-backed values only; never synthesize from company/IMO numbers. */
  unionRegistryMohaAccount?: string;
  administeringAuthoritySourceReference?: string;
  companyRegistryReference?: string;
  /** Required when distinct legal names are asserted against the same IMO company/owner number. */
  legalIdentityRelationshipReference?: string;
}
export interface MaritimeVerifierData {
  verifierName: string; accreditationNumber: string; address: string; contactEmail: string;
  accreditationBody?: string;
  accreditationScope?: string;
  accreditationValidFrom?: string;
  accreditationValidTo?: string;
  evidenceReference?: string;
}
export interface MaritimeShipData {
  shipName: string; imoNumber: string; portOfRegistry: string; homePort: string; flagState: string;
  shipType: MaritimeShipType; officialCategory: string; deadweightTonnes: number; grossTonnage: number;
  classificationSociety: string; iceClass: string; technicalEfficiencyType: "EEDI" | "EEXI" | "EIV" | "none";
  technicalEfficiencyValue: string; description: string;
  registryEvidenceReference?: string;
  tonnageEvidenceReference?: string;
  classEvidenceReference?: string;
}
export interface MaritimeMonitoringData {
  monitoringPlanVersion: string; monitoringPlanReferenceDate: string; monitoringPlanAssessed: boolean;
  monitoringPlanApproved: boolean; revisionNotes: string; fuelMonitoringMethod: string; densityMethod: string;
  uncertaintyMethod: string; uncertaintyPercent: number; emissionFactorMethod: string; dataGapMethod: string;
  voyageCompletenessProcedure: string; emissionSources: string[]; measurementEquipment: string;
  itSystem: string; proceduresReference: string;
}
export interface MaritimeVoyageRecord {
  id: string; departurePort: string; departureUnlocode: string; departureAt: string; arrivalPort: string;
  arrivalUnlocode: string; arrivalAt: string; scope: VoyageScope; portCallPurpose: string; exclusionReason: string;
  distanceNm: number; timeAtSeaHours: number; timeAtBerthHours: number; anchorageHours: number;
  cargoTonnes: number; passengers: number; transportWorkTonneNm: number;
  co2Tonnes: number; ch4TonnesCo2e: number; n2oTonnesCo2e: number;
  fuelTonnes: number; dataGap: boolean; dataGapReason: string;
}
export interface MaritimeFuelRecord {
  id: string; scope: VoyageScope; portName: string; portUnlocode: string; terminalBerth: string;
  fuelType: string; fuelConsumer: string; bdnReference: string; sustainabilityCertificate: string;
  /** Physical fuel consumed in the row. BDN bunkered quantity is evidence, not a substitute for consumption. */
  quantityTonnes: number; lowerCalorificValueMjPerTonne: number; energyMj: number; atBerthEnergyMj: number;
  wellToTankFactorGco2ePerMj: number; tankToWakeCo2Factor: number; tankToWakeCh4Factor: number;
  tankToWakeN2oFactor: number; slipFactor: number;
  /** Legacy/report comparator only. The canonical engine MUST recompute WtW and never trust this as authority. */
  wellToWakeEmissionsGco2e: number;
  opsElectricityKwh: number; opsConnectionHours: number; opsPeakPowerKw: number; opsExceptionReference: string;
  zeroEmissionEnergyMj: number; substituteEnergyMj: number; windRewardFactor: number; rfNboEnergyMj: number;
  measurementMethod: string; calibrationReference: string; factorSourceReference: string;
}
export interface MaritimeIceData {
  exclusionClaimed: boolean; entryUtc: string; exitUtc: string; distanceInIceNm: number;
  fuelInIceTonnes: number; totalDistanceNm: number; evidenceReference: string;
}
export interface MaritimeFuelEuFlexibilityData {
  bankingRequested: boolean; borrowingRequested: boolean; poolingPlanned: boolean;
  previousBankedSurplusReference: string; poolReference: string;
}
export interface MaritimeEvidenceState { [key: string]: boolean; }
export interface MaritimeEvidenceReferences { [key: string]: string; }
export interface MaritimePreparationFile {
  reportingYear: number; company: MaritimeCompanyData; verifier: MaritimeVerifierData; ship: MaritimeShipData;
  monitoring: MaritimeMonitoringData; voyages: MaritimeVoyageRecord[]; fuels: MaritimeFuelRecord[];
  ice: MaritimeIceData; flexibility: MaritimeFuelEuFlexibilityData; evidence: MaritimeEvidenceState;
  evidenceReferences: MaritimeEvidenceReferences;
}

export interface MaritimeFuelWtWReconciliation {
  fuelId: string;
  calculatedGco2e: number;
  reportedComparatorGco2e: number | null;
  differenceGco2e: number | null;
  differencePercent: number | null;
}

export interface MaritimeFuelEuBreakdown {
  fuelId: string;
  fuelType: string;
  category: MaritimeEnergyCategory;
  scopeFactor: number;
  physicalEnergyMj: number;
  scopedEnergyMj: number;
  calculatedWtWEmissionsGco2e: number;
  scopedWtWEmissionsGco2e: number;
  intensityGco2ePerMj: number | null;
  energySharePercent: number;
}

export interface MaritimeCalculatedResult {
  totalReportedCo2Tonnes: number;
  totalReportedCh4Co2eTonnes: number;
  totalReportedN2oCo2eTonnes: number;
  /** Total physical MRV GHG = CO2 + CH4 + N2O, expressed as tCO2e. */
  totalReportedCo2eTonnes: number;
  /** 2024-2025 = CO2 only; from 2026 = CO2 + CH4 + N2O. */
  etsGasBasis: "CO2" | "CO2_CH4_N2O";
  etsGeographicCo2eTonnes: number;
  etsPhaseIn: number;
  /** Unrounded preliminary covered-gas quantity after phase-in; verifier/registry remains authoritative. */
  estimatedEuaObligation: number;
  /** Whole-EUA operational planning quantity only; not an official registry result. */
  estimatedWholeEuaPlanningQuantity: number;
  estimatedEtsCostEur: number | null;
  fuelRegisterConsumptionTonnes: number;
  voyageFuelConsumptionTonnes: number;
  fuelConsumptionVarianceTonnes: number;
  fuelConsumptionVariancePercent: number | null;
  fueleuEnergyMj: number; fueleuWtWEmissionsGco2e: number;
  fueleuIntensityGco2ePerMj: number | null; fueleuLimitGco2ePerMj: number;
  fueleuIntensityGap: number | null;
  fueleuComplianceBalanceGco2e: number | null;
  fuelWtWReconciliation: MaritimeFuelWtWReconciliation[];
  fueleuBreakdown: MaritimeFuelEuBreakdown[];
  fueleuEnergySharesPercent: Record<MaritimeEnergyCategory, number>;
  totalDistanceNm: number;
  totalTimeAtSeaHours: number;
  totalTimeAtBerthHours: number;
  totalTransportWorkTonneNm: number;
  /** CO2 / transport work; this is not labelled AER. */
  transportWorkCo2IntensityGco2PerTonneNm: number | null;
  rfNboEnergyMj: number; opsElectricityKwh: number;
}
export interface MaritimeReadinessResult {
  score: number; blocking: string[]; warnings: string[]; complete: string[]; status: "blocked" | "review" | "ready";
}

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
