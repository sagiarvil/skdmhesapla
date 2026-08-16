import crypto from "crypto";
import { SKDM_RULESET_VERSION } from "./config";

export interface AuditRecordInput {
  sectorId: string;
  year: number;
  volume: number;
  customDirectEmission?: number;
  customIndirectEmission?: number;
  euEtsPrice: number;
  etsQuarter?: string;
  trEtsPrice: number;
  scope1Emissions: number;
  scope2Emissions: number;
  grossLiabilityEmissions: number;
  netFinancialCostEur: number;
  importerAnnualVolumeStatus?: "unknown" | "under50" | "over50";
  timestamp?: string;
}

export interface AuditRecordOutput {
  hash: string;
  timestamp: string;
  algorithm: string;
  engineVersion: string;
  rulesetVersion: string;
  usedEtsPrice: number;
  etsQuarter: string;
  verificationPayload: string;
}

export function generateSkdmAuditHash(input: AuditRecordInput): AuditRecordOutput {
  const timestamp = input.timestamp || new Date().toISOString();
  const engineVersion = "skdm-calc-v2026.1";
  const rulesetVersion = SKDM_RULESET_VERSION;
  const etsQuarter = input.etsQuarter || "2026-Q1";
  const usedEtsPrice = input.euEtsPrice;

  // Deterministik JSON stringify payload
  const rawPayload = JSON.stringify({
    v: engineVersion,
    rSet: rulesetVersion,
    ts: timestamp,
    sec: input.sectorId,
    yr: input.year,
    vol: input.volume,
    impStat: input.importerAnnualVolumeStatus || "unknown",
    cDir: input.customDirectEmission ?? null,
    cInd: input.customIndirectEmission ?? null,
    euP: usedEtsPrice,
    etsQ: etsQuarter,
    trP: input.trEtsPrice,
    s1: Number(input.scope1Emissions.toFixed(4)),
    s2: Number(input.scope2Emissions.toFixed(4)),
    gLiab: Number(input.grossLiabilityEmissions.toFixed(4)),
    netEur: Number(input.netFinancialCostEur.toFixed(2)),
  });

  const hash = crypto.createHash("sha256").update(rawPayload).digest("hex");

  return {
    hash: `sha256:${hash}`,
    timestamp,
    algorithm: "SHA-256",
    engineVersion,
    rulesetVersion,
    usedEtsPrice,
    etsQuarter,
    verificationPayload: rawPayload,
  };
}
