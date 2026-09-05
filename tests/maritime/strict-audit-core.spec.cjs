"use strict";

const assert = require("node:assert/strict");
const {
  RULESET_ID,
  GWP100,
  auditPreparationFile,
  deterministicWtWGco2e,
  validImoNumber,
} = require("../../functions/maritime-compliance-audit-v1.js");

const HASH = "a".repeat(64);
const CHAIN = "b".repeat(64);
const requiredEvidence = [
  "ship-registry", "tonnage-certificate", "class-certificate", "company-registry",
  "administering-authority", "union-registry-moha", "verifier-accreditation",
  "monitoring-plan", "voyage-list", "port-call-register", "rob-register", "logbook", "bdn", "distance-time", "factors",
];
function docs() {
  return requiredEvidence.map((documentType, i) => ({
    evidenceId: `E-${i + 1}`, documentType, sha256: HASH, evidenceChainHash: CHAIN,
    immutable: true, finalizedAt: `2025-01-${String(i + 1).padStart(2, "0")}T00:00:00Z`, supports: [], linkedVoyageIds: [], linkedFuelIds: [],
  }));
}
function file() {
  return {
    reportingYear: 2025,
    company: {
      companyName: "Evidence Shipping A.S.", role: "gemi-sahibi", imoCompanyNumber: "COMP-1",
      registeredOwnerName: "Evidence Shipping A.S.", registeredOwnerImoNumber: "COMP-1", country: "TR", address: "Istanbul",
      contactName: "Compliance", contactEmail: "ops@example.com", telephone: "+90 212 000 0000", administeringAuthority: "Evidence-backed authority",
      formalMandateReference: "", responsibilityFrom: "2025-01-01", responsibilityTo: "2025-12-31",
    },
    verifier: { verifierName: "Verifier Legal Entity", accreditationNumber: "ACC-1", address: "EU", contactEmail: "v@example.com" },
    ship: {
      shipName: "Evidence Vessel", imoNumber: "1234567", portOfRegistry: "Istanbul", flagState: "TR", officialCategory: "Container ship",
      deadweightTonnes: 10000, grossTonnage: 12000, classificationSociety: "Class Society", shipType: "cargo",
    },
    monitoring: {
      monitoringPlanVersion: "1", monitoringPlanReferenceDate: "2025-01-01", monitoringPlanAssessed: false,
      fuelMonitoringMethod: "BDN + tank", uncertaintyMethod: "annual reconciliation", uncertaintyPercent: 0.5,
      emissionFactorMethod: "EU legal factors", dataGapMethod: "surrogate procedure", voyageCompletenessProcedure: "port-call reconciliation",
      proceduresReference: "PROC-1", emissionSources: ["Main Engine"],
    },
    voyages: [{
      id: "V-1", departurePort: "Ambarli", departureUnlocode: "TRAMB", departureAt: "2025-01-01T00:00",
      arrivalPort: "Genoa", arrivalUnlocode: "ITGOA", arrivalAt: "2025-01-04T00:00", scope: "eu-eea-third",
      portCallPurpose: "cargo", exclusionReason: "", distanceNm: 1250, timeAtSeaHours: 72, timeAtBerthHours: 12,
      co2Tonnes: 100, ch4TonnesCo2e: 10, n2oTonnesCo2e: 5, fuelTonnes: 100, dataGap: false, dataGapReason: "",
    }],
    fuels: [{
      id: "F-1", scope: "eu-eea-third", fuelType: "VLSFO", fuelConsumer: "Main Engine", bdnReference: "BDN-1",
      quantityTonnes: 100, lowerCalorificValueMjPerTonne: 41000, energyMj: 4100000, wellToTankFactorGco2ePerMj: 13.5,
      tankToWakeCo2Factor: 3.114, tankToWakeCh4Factor: 0, tankToWakeN2oFactor: 0, slipFactor: 0,
      wellToWakeEmissionsGco2e: 366750000, opsElectricityKwh: 0, measurementMethod: "BDN + tank",
      factorSourceReference: "EU-2023-1805 Annex II", calibrationReference: "",
    }],
    ice: { exclusionClaimed: false },
    flexibility: { bankingRequested: false, borrowingRequested: false, poolingPlanned: false },
  };
}

assert.equal(RULESET_ID, "eu-maritime-2026-09-05");
assert.deepEqual(GWP100, { CO2: 1, CH4: 28, N2O: 265 });
assert.equal(validImoNumber("1234567"), true);
assert.equal(validImoNumber("1234568"), false);
assert.equal(deterministicWtWGco2e(file().fuels[0]), 366750000);

const clean = auditPreparationFile(file(), docs());
assert.equal(clean.ready, true);
assert.equal(clean.score, 100);
assert.equal(clean.reconciliations.fuelVarianceTonnes, 0);

const identityDocs = docs().filter(x => x.documentType !== "ship-registry");
const identityBlocked = auditPreparationFile(file(), identityDocs);
assert.equal(identityBlocked.ready, false);
assert.ok(identityBlocked.score <= 49);
assert.ok(identityBlocked.missing.includes("Binary evidence: ship-registry"));

const fuelMismatch = file();
fuelMismatch.voyages[0].fuelTonnes = 95;
const fuelBlocked = auditPreparationFile(fuelMismatch, docs());
assert.equal(fuelBlocked.ready, false);
assert.ok(fuelBlocked.missing.some(x => x.includes("Annual fuel reconciliation")));

const wtwMismatch = file();
wtwMismatch.fuels[0].wellToWakeEmissionsGco2e = 1;
const wtwBlocked = auditPreparationFile(wtwMismatch, docs());
assert.equal(wtwBlocked.ready, false);
assert.ok(wtwBlocked.missing.some(x => x.includes("WtW comparator")));

const energyMismatch = file();
energyMismatch.fuels[0].energyMj = 4000000;
const energyBlocked = auditPreparationFile(energyMismatch, docs());
assert.equal(energyBlocked.ready, false);
assert.ok(energyBlocked.missing.some(x => x.includes("quantity × LCV")));

const noMohaEvidence = docs().filter(x => x.documentType !== "union-registry-moha");
const mohaBlocked = auditPreparationFile(file(), noMohaEvidence);
assert.equal(mohaBlocked.ready, false);
assert.ok(mohaBlocked.missing.includes("Binary evidence: union-registry-moha"));
