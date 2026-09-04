export type MaritimeRole =
  | "gemi-sahibi"
  | "ism-doc-company"
  | "gemi-isletmecisi"
  | "charterer"
  | "forwarder"
  | "liman-acente"
  | "ihracatci";

export type MaritimeScopeLevel = "out" | "review" | "likely" | "critical";

export interface MaritimeScopeInput {
  role: MaritimeRole;
  grossTonnage: number;
  euPortCallsPerYear: number;
  carriesCbamGoods: boolean;
  hasFuelRecords: boolean;
  hasVoyageRecords: boolean;
  hasMonitoringPlan: boolean;
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
}
