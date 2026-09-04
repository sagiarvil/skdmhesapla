export type MaritimeRole =
  | "gemi-sahibi" | "ism-doc-company" | "gemi-isletmecisi" | "charterer"
  | "forwarder" | "liman-acente" | "ihracatci";
export type MaritimeShipType = "cargo" | "general-cargo" | "passenger" | "offshore" | "other";
export type MaritimePortRegion = "eu" | "norway-iceland" | "none" | "unknown";
export type MaritimeScopeLevel = "out" | "review" | "likely" | "critical";
export type VoyageScope = "intra-eu-eea" | "eu-eea-third" | "at-eu-eea-port" | "outside" | "excluded";

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
}
export interface MaritimeVerifierData {
  verifierName: string; accreditationNumber: string; address: string; contactEmail: string;
}
export interface MaritimeShipData {
  shipName: string; imoNumber: string; portOfRegistry: string; homePort: string; flagState: string;
  shipType: MaritimeShipType; officialCategory: string; deadweightTonnes: number; grossTonnage: number;
  classificationSociety: string; iceClass: string; technicalEfficiencyType: "EEDI" | "EEXI" | "EIV" | "none";
  technicalEfficiencyValue: string; description: string;
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
  quantityTonnes: number; lowerCalorificValueMjPerTonne: number; energyMj: number; atBerthEnergyMj: number;
  wellToTankFactorGco2ePerMj: number; tankToWakeCo2Factor: number; tankToWakeCh4Factor: number;
  tankToWakeN2oFactor: number; slipFactor: number; wellToWakeEmissionsGco2e: number;
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
export interface MaritimePreparationFile {
  reportingYear: number; company: MaritimeCompanyData; verifier: MaritimeVerifierData; ship: MaritimeShipData;
  monitoring: MaritimeMonitoringData; voyages: MaritimeVoyageRecord[]; fuels: MaritimeFuelRecord[];
  ice: MaritimeIceData; flexibility: MaritimeFuelEuFlexibilityData; evidence: MaritimeEvidenceState;
}
export interface MaritimeCalculatedResult {
  totalReportedCo2eTonnes: number; etsGeographicCo2eTonnes: number; etsPhaseIn: number;
  estimatedEuaObligation: number; estimatedEtsCostEur: number | null; fueleuEnergyMj: number;
  fueleuWtWEmissionsGco2e: number; fueleuIntensityGco2ePerMj: number | null;
  fueleuLimitGco2ePerMj: number; fueleuIntensityGap: number | null; rfNboEnergyMj: number;
  opsElectricityKwh: number;
}
export interface MaritimeReadinessResult {
  score: number; blocking: string[]; warnings: string[]; complete: string[]; status: "blocked" | "review" | "ready";
}
