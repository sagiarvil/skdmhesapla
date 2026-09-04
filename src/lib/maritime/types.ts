export type MaritimeRole =
  | "gemi-sahibi"
  | "ism-doc-company"
  | "gemi-isletmecisi"
  | "charterer"
  | "forwarder"
  | "liman-acente"
  | "ihracatci";

export type MaritimeShipType =
  | "cargo"
  | "general-cargo"
  | "passenger"
  | "offshore"
  | "other";

export type MaritimePortRegion = "eu" | "norway-iceland" | "none" | "unknown";
export type MaritimeScopeLevel = "out" | "review" | "likely" | "critical";

export interface MaritimeScopeInput {
  role: MaritimeRole;
  shipType: MaritimeShipType;
  grossTonnage: number;
  portRegion: MaritimePortRegion;
  euPortCallsPerYear: number;
  emissionsYear: number;
  carriesCbamGoods: boolean;
  hasFuelRecords: boolean;
  hasVoyageRecords: boolean;
  hasMonitoringPlan: boolean;
  etsScopeEmissionsTco2e?: number;
  euaPriceEur?: number;
}

export interface MaritimeScopeResult {
  mrv: MaritimeScopeLevel;
  ets: MaritimeScopeLevel;
  fueleu: MaritimeScopeLevel;
  cbamPartnerPotential: MaritimeScopeLevel;
  readinessScore: number;
  missingEvidence: string[];
  commercialRoute: "free" | "paid-pre-analysis" | "annual-compliance" | "partner-desk";
  headline: string;
  decisionReasons: {
    mrv: string;
    ets: string;
    fueleu: string;
    partner: string;
  };
  etsCoverageFactor: number;
  estimatedEtsCostEur: number | null;
  warnings: string[];
}
