"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSkdmAuditHash = generateSkdmAuditHash;
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("./config");
function generateSkdmAuditHash(input) {
    const timestamp = input.timestamp || new Date().toISOString();
    const engineVersion = "skdm-calc-v2026.1";
    const rulesetVersion = config_1.SKDM_RULESET_VERSION;
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
    const hash = crypto_1.default.createHash("sha256").update(rawPayload).digest("hex");
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
