import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { calculateMaritimePreparation } from "../../src/lib/maritime/calculator";
import type { MaritimePreparationFile } from "../../src/lib/maritime/types";

const require = createRequire(import.meta.url);
const { calculateAuthority } = require("../../functions/maritime-compliance-audit-v1.js") as {
  calculateAuthority: (file: MaritimePreparationFile) => any;
};

function fixture(year: number): MaritimePreparationFile {
  return {
    reportingYear: year,
    company: {
      companyName: "Parity Shipping A.S.", role: "gemi-sahibi", imoCompanyNumber: "COMP-1",
      registeredOwnerName: "Parity Shipping A.S.", registeredOwnerImoNumber: "COMP-1", country: "TR", address: "Istanbul",
      contactName: "Compliance", contactEmail: "ops@example.com", telephone: "+90 212 000 0000", administeringAuthority: "Authority",
      formalMandateReference: "", responsibilityFrom: `${year}-01-01`, responsibilityTo: `${year}-12-31`,
    },
    verifier: { verifierName: "Verifier", accreditationNumber: "ACC", address: "EU", contactEmail: "v@example.com" },
    ship: {
      shipName: "Parity Vessel", imoNumber: "1234567", portOfRegistry: "Istanbul", homePort: "Istanbul", flagState: "TR",
      shipType: "cargo", officialCategory: "Container ship", deadweightTonnes: 10000, grossTonnage: 12000,
      classificationSociety: "Class", iceClass: "", technicalEfficiencyType: "none", technicalEfficiencyValue: "", description: "",
    },
    monitoring: {
      monitoringPlanVersion: "1", monitoringPlanReferenceDate: `${year}-01-01`, monitoringPlanAssessed: false, monitoringPlanApproved: false,
      revisionNotes: "", fuelMonitoringMethod: "BDN", densityMethod: "BDN", uncertaintyMethod: "reconciliation", uncertaintyPercent: 0.5,
      emissionFactorMethod: "EU factors", dataGapMethod: "surrogate", voyageCompletenessProcedure: "port calls", emissionSources: ["Main Engine"],
      measurementEquipment: "tank", itSystem: "system", proceduresReference: "PROC",
    },
    voyages: [{
      id: "V-1", departurePort: "Ambarli", departureUnlocode: "TRAMB", departureAt: `${year}-01-01T00:00:00Z`,
      arrivalPort: "Genoa", arrivalUnlocode: "ITGOA", arrivalAt: `${year}-01-04T00:00:00Z`, scope: "eu-eea-third",
      portCallPurpose: "cargo", exclusionReason: "", distanceNm: 1250, timeAtSeaHours: 72, timeAtBerthHours: 12, anchorageHours: 0,
      cargoTonnes: 7500, passengers: 0, transportWorkTonneNm: 9_375_000, co2Tonnes: 100, ch4TonnesCo2e: 10,
      n2oTonnesCo2e: 5, fuelTonnes: 100, dataGap: false, dataGapReason: "",
    }],
    fuels: [{
      id: "F-1", scope: "eu-eea-third", portName: "", portUnlocode: "", terminalBerth: "", fuelType: "VLSFO", fuelConsumer: "Main Engine",
      bdnReference: "BDN-1", sustainabilityCertificate: "", quantityTonnes: 100, lowerCalorificValueMjPerTonne: 41000,
      energyMj: 4_100_000, atBerthEnergyMj: 0, wellToTankFactorGco2ePerMj: 13.5, tankToWakeCo2Factor: 3.114,
      tankToWakeCh4Factor: 0, tankToWakeN2oFactor: 0, slipFactor: 0, wellToWakeEmissionsGco2e: 366_750_000,
      opsElectricityKwh: 0, opsConnectionHours: 0, opsPeakPowerKw: 0, opsExceptionReference: "", zeroEmissionEnergyMj: 0,
      substituteEnergyMj: 0, windRewardFactor: 1, rfNboEnergyMj: 0, measurementMethod: "BDN", calibrationReference: "",
      factorSourceReference: "EU-2023-1805 Annex II",
    }],
    ice: { exclusionClaimed: false, entryUtc: "", exitUtc: "", distanceInIceNm: 0, fuelInIceTonnes: 0, totalDistanceNm: 0, evidenceReference: "" },
    flexibility: { bankingRequested: false, borrowingRequested: false, poolingPlanned: false, previousBankedSurplusReference: "", poolReference: "" },
    evidence: {}, evidenceReferences: {},
  };
}

for (const year of [2025, 2026]) {
  const file = fixture(year);
  const browser = calculateMaritimePreparation(file);
  const server = calculateAuthority(file);
  assert.equal(browser.totalReportedCo2Tonnes, server.mrv.co2Tonnes);
  assert.equal(browser.totalReportedCh4Co2eTonnes, server.mrv.ch4TonnesCo2e);
  assert.equal(browser.totalReportedN2oCo2eTonnes, server.mrv.n2oTonnesCo2e);
  assert.equal(browser.totalReportedCo2eTonnes, server.mrv.totalGhgTonnesCo2e);
  assert.equal(browser.etsGasBasis, server.ets.gasBasis);
  assert.equal(browser.etsGeographicCo2eTonnes, server.ets.geographicCoveredGasTonnesCo2e);
  assert.equal(browser.etsPhaseIn, server.ets.phaseIn);
  assert.equal(browser.estimatedEuaObligation, server.ets.preliminaryLiableTonnesCo2e);
  assert.equal(browser.estimatedWholeEuaPlanningQuantity, server.ets.wholeEuaPlanningQuantity);
  assert.equal(browser.fueleuEnergyMj, server.fueleu.energyMj);
  assert.equal(browser.fueleuWtWEmissionsGco2e, server.fueleu.wtwEmissionsGco2e);
  assert.equal(browser.fueleuIntensityGco2ePerMj, server.fueleu.intensityGco2ePerMj);
  assert.equal(browser.fueleuLimitGco2ePerMj, server.fueleu.targetIntensityGco2ePerMj);
  assert.equal(browser.fueleuComplianceBalanceGco2e, server.fueleu.complianceBalanceGco2eq);
  assert.deepEqual(browser.fueleuEnergySharesPercent, server.fueleu.energySharesPercent);
  assert.equal(browser.fuelRegisterConsumptionTonnes, server.reconciliation.fuelRegisterTonnes);
  assert.equal(browser.voyageFuelConsumptionTonnes, server.reconciliation.voyageFuelTonnes);
  assert.equal(browser.totalDistanceNm, server.operations.distanceNm);
  assert.equal(browser.totalTransportWorkTonneNm, server.operations.transportWorkTonneNm);
  assert.equal(browser.transportWorkCo2IntensityGco2PerTonneNm, server.operations.transportWorkCo2IntensityGco2PerTonneNm);
}
