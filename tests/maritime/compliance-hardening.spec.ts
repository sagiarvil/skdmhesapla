import assert from "node:assert/strict";
import { calculateMaritimePreparation, fuelWtWEmissionsGco2e } from "../../src/lib/maritime/calculator";
import { assessMaritimeReadiness, validImoNumber } from "../../src/lib/maritime/readiness";
import { FUELEU_GWP100, MARITIME_LEGAL_ARTICLES } from "../../src/lib/maritime/regulatory";
import type { MaritimePreparationFile } from "../../src/lib/maritime/types";

const evidence = {
  "ship-registry": true,
  "tonnage-certificate": true,
  "class-certificate": true,
  "company-registry": true,
  "administering-authority": true,
  "union-registry-moha": true,
  "verifier-accreditation": true,
  "monitoring-plan": true,
  "voyage-list": true,
  "port-call-register": true,
  "rob-register": true,
  "logbook": true,
  "bdn": true,
  "distance-time": true,
  "factors": true,
};

function fixture(): MaritimePreparationFile {
  return {
    reportingYear: 2025,
    company: {
      companyName: "Evidence Shipping A.S.", role: "gemi-sahibi", imoCompanyNumber: "COMP-1",
      registeredOwnerName: "Evidence Shipping A.S.", registeredOwnerImoNumber: "COMP-1", country: "TR",
      address: "Istanbul", contactName: "Compliance", contactEmail: "ops@example.com", telephone: "+90 212 000 0000",
      administeringAuthority: "Evidence-backed authority", formalMandateReference: "", responsibilityFrom: "2025-01-01",
      responsibilityTo: "2025-12-31",
    },
    verifier: { verifierName: "Accredited Verifier Legal Entity", accreditationNumber: "ACC-1", address: "EU", contactEmail: "v@example.com" },
    ship: {
      shipName: "Evidence Vessel", imoNumber: "1234567", portOfRegistry: "Istanbul", homePort: "Istanbul", flagState: "TR",
      shipType: "cargo", officialCategory: "Container ship", deadweightTonnes: 10000, grossTonnage: 12000,
      classificationSociety: "Class Society", iceClass: "", technicalEfficiencyType: "none", technicalEfficiencyValue: "", description: "",
    },
    monitoring: {
      monitoringPlanVersion: "1", monitoringPlanReferenceDate: "2025-01-01", monitoringPlanAssessed: false, monitoringPlanApproved: false,
      revisionNotes: "", fuelMonitoringMethod: "BDN + tank", densityMethod: "BDN density", uncertaintyMethod: "annual reconciliation",
      uncertaintyPercent: 0.5, emissionFactorMethod: "EU legal factors", dataGapMethod: "surrogate procedure",
      voyageCompletenessProcedure: "port-call reconciliation", emissionSources: ["Main Engine"], measurementEquipment: "tank/BDN",
      itSystem: "DMS", proceduresReference: "PROC-1",
    },
    voyages: [{
      id: "V-1", departurePort: "Ambarli", departureUnlocode: "TRAMB", departureAt: "2025-01-01T00:00",
      arrivalPort: "Genoa", arrivalUnlocode: "ITGOA", arrivalAt: "2025-01-04T00:00", scope: "eu-eea-third",
      portCallPurpose: "cargo", exclusionReason: "", distanceNm: 1250, timeAtSeaHours: 72, timeAtBerthHours: 12,
      anchorageHours: 0, cargoTonnes: 10000, passengers: 0, transportWorkTonneNm: 12500000,
      co2Tonnes: 100, ch4TonnesCo2e: 10, n2oTonnesCo2e: 5, fuelTonnes: 100, dataGap: false, dataGapReason: "",
    }],
    fuels: [{
      id: "F-1", scope: "eu-eea-third", portName: "", portUnlocode: "", terminalBerth: "", fuelType: "VLSFO",
      fuelConsumer: "Main Engine", bdnReference: "BDN-1", sustainabilityCertificate: "", quantityTonnes: 100,
      lowerCalorificValueMjPerTonne: 41000, energyMj: 4100000, atBerthEnergyMj: 0, wellToTankFactorGco2ePerMj: 13.5,
      tankToWakeCo2Factor: 3.114, tankToWakeCh4Factor: 0, tankToWakeN2oFactor: 0, slipFactor: 0,
      wellToWakeEmissionsGco2e: 366750000, opsElectricityKwh: 0, opsConnectionHours: 0, opsPeakPowerKw: 0,
      opsExceptionReference: "", zeroEmissionEnergyMj: 0, substituteEnergyMj: 0, windRewardFactor: 1, rfNboEnergyMj: 0,
      measurementMethod: "BDN + tank", calibrationReference: "", factorSourceReference: "EU-2023-1805 Annex II",
    }],
    ice: { exclusionClaimed: false, entryUtc: "", exitUtc: "", distanceInIceNm: 0, fuelInIceTonnes: 0, totalDistanceNm: 0, evidenceReference: "" },
    flexibility: { bankingRequested: false, borrowingRequested: false, poolingPlanned: false, previousBankedSurplusReference: "", poolReference: "" },
    evidence: { ...evidence }, evidenceReferences: {},
  };
}

assert.equal(validImoNumber("1234567"), true);
assert.equal(validImoNumber("1234568"), false);
assert.deepEqual(FUELEU_GWP100, { CO2: 1, CH4: 28, N2O: 265 });
assert.match(MARITIME_LEGAL_ARTICLES.fueleuBankingBorrowing, /Article 20/);
assert.match(MARITIME_LEGAL_ARTICLES.fueleuPooling, /Article 21/);
assert.match(MARITIME_LEGAL_ARTICLES.fueleuDocumentOfCompliance, /Article 22/);

const base = fixture();
const calc = calculateMaritimePreparation(base);
assert.equal(calc.totalReportedCo2Tonnes, 100);
assert.equal(calc.totalReportedCh4Co2eTonnes, 10);
assert.equal(calc.totalReportedN2oCo2eTonnes, 5);
assert.equal(calc.totalReportedCo2eTonnes, 115);
// 2025 ETS surrender uses CO2 only: 100 × 50% geography × 70% phase-in.
assert.equal(calc.etsGeographicCo2eTonnes, 50);
assert.equal(calc.etsPhaseIn, 0.7);
assert.equal(calc.estimatedEuaObligation, 35);
assert.equal(calc.fueleuEnergyMj, 2050000);
assert.equal(calc.fueleuWtWEmissionsGco2e, 183375000);
assert.equal(Number(calc.fueleuIntensityGco2ePerMj?.toFixed(6)), Number((366750000 / 4100000).toFixed(6)));
assert.equal(calc.fuelConsumptionVarianceTonnes, 0);
assert.equal(fuelWtWEmissionsGco2e(base.fuels[0]), 366750000);
assert.equal(assessMaritimeReadiness(base).score, 100);
assert.equal(assessMaritimeReadiness(base).status, "ready");

const fakeOverride = fixture();
fakeOverride.fuels[0].wellToWakeEmissionsGco2e = 1;
assert.equal(calculateMaritimePreparation(fakeOverride).fueleuWtWEmissionsGco2e, 183375000, "user comparator must not override deterministic WtW");
assert.ok(assessMaritimeReadiness(fakeOverride).blocking.some(x => x.includes("WtW mutabakatı")));
assert.ok(assessMaritimeReadiness(fakeOverride).score <= 49);

const fuelMismatch = fixture();
fuelMismatch.voyages[0].fuelTonnes = 95;
assert.ok(assessMaritimeReadiness(fuelMismatch).blocking.some(x => x.includes("Yakıt mutabakatı")));
assert.ok(assessMaritimeReadiness(fuelMismatch).score <= 49);

const energyMismatch = fixture();
energyMismatch.fuels[0].energyMj = 4000000;
assert.ok(assessMaritimeReadiness(energyMismatch).blocking.some(x => x.includes("Quantity × LCV")));

const missingIdentity = fixture();
missingIdentity.evidence["ship-registry"] = false;
assert.ok(assessMaritimeReadiness(missingIdentity).blocking.some(x => x.includes("Certificate of Registry")));
assert.ok(assessMaritimeReadiness(missingIdentity).score <= 49);
