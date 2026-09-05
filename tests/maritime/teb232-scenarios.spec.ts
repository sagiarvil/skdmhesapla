import assert from "node:assert/strict";
import { assessMaritimeScope } from "../../src/lib/maritime/scope";
import { calculateMaritimePreparation } from "../../src/lib/maritime/calculator";
import { assessMaritimeReadiness } from "../../src/lib/maritime/readiness";
import { VERIFIER_EVIDENCE_CHECKLIST } from "../../src/lib/maritime/regulatory";
import type { MaritimePreparationFile, MaritimeScopeInput } from "../../src/lib/maritime/types";

const TEST_USER_EMAIL = "teb232@gmail.com";
const TEST_COMPANY = "TEB Maritime Test Shipping A.Ş.";

function fullEvidence() {
  return Object.fromEntries(VERIFIER_EVIDENCE_CHECKLIST.map((item) => [item.key, true]));
}

function baseFile(): MaritimePreparationFile {
  return {
    reportingYear: 2026,
    company: {
      companyName: TEST_COMPANY,
      role: "gemi-sahibi",
      imoCompanyNumber: "IMO-COMP-TEB232",
      registeredOwnerName: TEST_COMPANY,
      registeredOwnerImoNumber: "IMO-COMP-TEB232",
      country: "Türkiye",
      address: "İzmir, Türkiye",
      contactName: "TEB232 Test Operator",
      contactEmail: TEST_USER_EMAIL,
      telephone: "+90 232 000 00 00",
      administeringAuthority: "Configured EU ETS Administering Authority",
      formalMandateReference: "",
      responsibilityFrom: "2026-01-01",
      responsibilityTo: "2026-12-31",
    },
    verifier: {
      verifierName: "Accredited Verifier Test Fixture",
      accreditationNumber: "ACC-TEST-232",
      address: "European Union",
      contactEmail: "verifier-test@example.com",
    },
    ship: {
      shipName: "TEB232 M/V AEGEAN TEST",
      imoNumber: "9876543",
      portOfRegistry: "İzmir",
      homePort: "İzmir",
      flagState: "Türkiye",
      shipType: "cargo",
      officialCategory: "Container ship",
      deadweightTonnes: 22500,
      grossTonnage: 18500,
      classificationSociety: "IACS Test Class",
      iceClass: "",
      technicalEfficiencyType: "EEXI",
      technicalEfficiencyValue: "6.9 gCO2/t-nm",
      description: "TEB232 deterministic maritime scenario vessel",
    },
    monitoring: {
      monitoringPlanVersion: "MP-2026-03",
      monitoringPlanReferenceDate: "2026-01-01",
      monitoringPlanAssessed: true,
      monitoringPlanApproved: true,
      revisionNotes: "Annual scenario test fixture",
      fuelMonitoringMethod: "BDN + tank readings + flow meter reconciliation",
      densityMethod: "BDN density with onboard reconciliation",
      uncertaintyMethod: "Calibrated flow meter + tank sounding control",
      uncertaintyPercent: 1.2,
      emissionFactorMethod: "EU regulatory factor source registered in preparation file",
      dataGapMethod: "Documented surrogate-data procedure with conservative substitution",
      voyageCompletenessProcedure: "Port-call register reconciled to logbook and noon reports",
      emissionSources: ["Main engines", "Auxiliary engines", "Boilers"],
      measurementEquipment: "Main flow meters + calibrated tank sounding system",
      itSystem: "TEB232 Maritime DMS",
      proceduresReference: "PROC-MRV-FUELEU-2026-232",
    },
    voyages: [
      {
        id: "V-001",
        departurePort: "İzmir",
        departureUnlocode: "TRIZM",
        departureAt: "2026-01-10T06:00:00Z",
        arrivalPort: "Piraeus",
        arrivalUnlocode: "GRPIR",
        arrivalAt: "2026-01-12T03:00:00Z",
        scope: "eu-eea-third",
        portCallPurpose: "Commercial container cargo",
        exclusionReason: "",
        distanceNm: 385,
        timeAtSeaHours: 45,
        timeAtBerthHours: 7,
        anchorageHours: 2,
        cargoTonnes: 9800,
        passengers: 0,
        transportWorkTonneNm: 3773000,
        co2Tonnes: 100,
        ch4TonnesCo2e: 2,
        n2oTonnesCo2e: 1,
        fuelTonnes: 31,
        dataGap: false,
        dataGapReason: "",
      },
      {
        id: "V-002",
        departurePort: "Piraeus",
        departureUnlocode: "GRPIR",
        departureAt: "2026-01-13T04:00:00Z",
        arrivalPort: "Rotterdam",
        arrivalUnlocode: "NLRTM",
        arrivalAt: "2026-01-18T15:00:00Z",
        scope: "intra-eu-eea",
        portCallPurpose: "Commercial container cargo",
        exclusionReason: "",
        distanceNm: 1720,
        timeAtSeaHours: 131,
        timeAtBerthHours: 10,
        anchorageHours: 3,
        cargoTonnes: 10100,
        passengers: 0,
        transportWorkTonneNm: 17372000,
        co2Tonnes: 80,
        ch4TonnesCo2e: 1,
        n2oTonnesCo2e: 0.5,
        fuelTonnes: 25,
        dataGap: false,
        dataGapReason: "",
      },
      {
        id: "V-003",
        departurePort: "Rotterdam",
        departureUnlocode: "NLRTM",
        departureAt: "2026-01-18T15:00:00Z",
        arrivalPort: "Rotterdam",
        arrivalUnlocode: "NLRTM",
        arrivalAt: "2026-01-19T01:00:00Z",
        scope: "at-eu-eea-port",
        portCallPurpose: "At-berth hotel load",
        exclusionReason: "",
        distanceNm: 0,
        timeAtSeaHours: 0,
        timeAtBerthHours: 10,
        anchorageHours: 0,
        cargoTonnes: 0,
        passengers: 0,
        transportWorkTonneNm: 0,
        co2Tonnes: 10,
        ch4TonnesCo2e: 0.2,
        n2oTonnesCo2e: 0.1,
        fuelTonnes: 3,
        dataGap: false,
        dataGapReason: "",
      },
    ],
    fuels: [
      {
        id: "F-001",
        scope: "eu-eea-third",
        portName: "",
        portUnlocode: "",
        terminalBerth: "",
        fuelType: "MGO",
        fuelConsumer: "Main engines",
        bdnReference: "BDN-TEB232-001",
        sustainabilityCertificate: "",
        quantityTonnes: 45,
        lowerCalorificValueMjPerTonne: 42000,
        energyMj: 2000000,
        atBerthEnergyMj: 0,
        wellToTankFactorGco2ePerMj: 14.4,
        tankToWakeCo2Factor: 3.206,
        tankToWakeCh4Factor: 0,
        tankToWakeN2oFactor: 0,
        slipFactor: 0,
        wellToWakeEmissionsGco2e: 180000000,
        opsElectricityKwh: 0,
        opsConnectionHours: 0,
        opsPeakPowerKw: 0,
        opsExceptionReference: "",
        zeroEmissionEnergyMj: 0,
        substituteEnergyMj: 0,
        windRewardFactor: 1,
        rfNboEnergyMj: 0,
        measurementMethod: "BDN + calibrated flow meter",
        calibrationReference: "CAL-FM-2026-001",
        factorSourceReference: "FuelEU factor register / Annex source reference",
      },
      {
        id: "F-002",
        scope: "intra-eu-eea",
        portName: "",
        portUnlocode: "",
        terminalBerth: "",
        fuelType: "MGO",
        fuelConsumer: "Main + auxiliary engines",
        bdnReference: "BDN-TEB232-002",
        sustainabilityCertificate: "",
        quantityTonnes: 24,
        lowerCalorificValueMjPerTonne: 42000,
        energyMj: 1000000,
        atBerthEnergyMj: 0,
        wellToTankFactorGco2ePerMj: 14.4,
        tankToWakeCo2Factor: 3.206,
        tankToWakeCh4Factor: 0,
        tankToWakeN2oFactor: 0,
        slipFactor: 0,
        wellToWakeEmissionsGco2e: 95000000,
        opsElectricityKwh: 0,
        opsConnectionHours: 0,
        opsPeakPowerKw: 0,
        opsExceptionReference: "",
        zeroEmissionEnergyMj: 0,
        substituteEnergyMj: 0,
        windRewardFactor: 1,
        rfNboEnergyMj: 0,
        measurementMethod: "BDN + calibrated flow meter",
        calibrationReference: "CAL-FM-2026-002",
        factorSourceReference: "FuelEU factor register / Annex source reference",
      },
      {
        id: "F-003",
        scope: "at-eu-eea-port",
        portName: "Rotterdam",
        portUnlocode: "NLRTM",
        terminalBerth: "TEST TERMINAL 4",
        fuelType: "Grid electricity / OPS",
        fuelConsumer: "On-shore power supply",
        bdnReference: "",
        sustainabilityCertificate: "",
        quantityTonnes: 0,
        lowerCalorificValueMjPerTonne: 0,
        energyMj: 200000,
        atBerthEnergyMj: 200000,
        wellToTankFactorGco2ePerMj: 0,
        tankToWakeCo2Factor: 0,
        tankToWakeCh4Factor: 0,
        tankToWakeN2oFactor: 0,
        slipFactor: 0,
        wellToWakeEmissionsGco2e: 5000000,
        opsElectricityKwh: 20000,
        opsConnectionHours: 10,
        opsPeakPowerKw: 2000,
        opsExceptionReference: "",
        zeroEmissionEnergyMj: 200000,
        substituteEnergyMj: 0,
        windRewardFactor: 1,
        rfNboEnergyMj: 0,
        measurementMethod: "Terminal certified electricity meter",
        calibrationReference: "OPS-METER-2026-004",
        factorSourceReference: "FuelEU electricity factor source reference",
      },
    ],
    ice: {
      exclusionClaimed: false,
      entryUtc: "",
      exitUtc: "",
      distanceInIceNm: 0,
      fuelInIceTonnes: 0,
      totalDistanceNm: 0,
      evidenceReference: "",
    },
    flexibility: {
      bankingRequested: false,
      borrowingRequested: false,
      poolingPlanned: false,
      previousBankedSurplusReference: "",
      poolReference: "",
    },
    evidence: fullEvidence(),
    evidenceReferences: Object.fromEntries(VERIFIER_EVIDENCE_CHECKLIST.map((item) => [item.key, `TEB232-${item.key}-REF`])),
  };
}

function scope(overrides: Partial<MaritimeScopeInput> = {}) {
  return assessMaritimeScope({
    role: "gemi-sahibi",
    shipType: "cargo",
    grossTonnage: 18500,
    portRegion: "eu",
    euPortCallsPerYear: 24,
    emissionsYear: 2026,
    carriesCbamGoods: true,
    hasFuelRecords: true,
    hasVoyageRecords: true,
    hasMonitoringPlan: true,
    hasFormalResponsibilityMandate: true,
    ...overrides,
  });
}

console.log("TEB232 maritime scenario suite starting", { user: TEST_USER_EMAIL });

// Scenario 1 — full 2026 cargo vessel: MRV + ETS + FuelEU should all be in scope.
const s1 = scope({ etsScopeEmissionsTco2e: 143.3, euaPriceEur: 80 });
assert.equal(s1.mrv, "critical");
assert.equal(s1.ets, "critical");
assert.equal(s1.fueleu, "critical");
assert.equal(s1.etsCoverageFactor, 1);
assert.equal(s1.estimatedEtsCostEur, 11464);

// Scenario 2 — 1,200 GT general cargo in 2026: MRV expansion applies; ETS/FuelEU do not.
const s2 = scope({ shipType: "general-cargo", grossTonnage: 1200 });
assert.equal(s2.mrv, "critical");
assert.equal(s2.ets, "out");
assert.equal(s2.fueleu, "out");

// Scenario 3 — offshore 8,000 GT: ETS starts in 2027 in current ruleset.
const s3_2026 = scope({ shipType: "offshore", grossTonnage: 8000, emissionsYear: 2026 });
const s3_2027 = scope({ shipType: "offshore", grossTonnage: 8000, emissionsYear: 2027 });
assert.equal(s3_2026.mrv, "critical");
assert.equal(s3_2026.ets, "out");
assert.equal(s3_2027.ets, "critical");

// Scenario 4 — delegated ISM/DOC responsibility without mandate must not auto-pass.
const s4 = scope({ role: "ism-doc-company", hasFormalResponsibilityMandate: false });
assert.equal(s4.mrv, "review");
assert.equal(s4.ets, "review");
assert.ok(s4.missingEvidence.some((item) => item.includes("mandate")));

// Scenario 5 — complete preparation file should reach 100% internal readiness.
const complete = baseFile();
const readiness = assessMaritimeReadiness(complete);
assert.equal(readiness.score, 100);
assert.equal(readiness.status, "ready");
assert.equal(readiness.blocking.length, 0);
assert.equal(readiness.warnings.length, 0);

// Scenario 6 — deterministic 2026 calculations across mixed geographic scopes.
const calc = calculateMaritimePreparation(complete, 80);
assert.ok(Math.abs(calc.totalReportedCo2eTonnes - 194.8) < 1e-9);
assert.ok(Math.abs(calc.etsGeographicCo2eTonnes - 143.3) < 1e-9);
assert.ok(Math.abs(calc.estimatedEuaObligation - 143.3) < 1e-9);
assert.ok(Math.abs((calc.estimatedEtsCostEur ?? 0) - 11464) < 1e-9);
assert.ok(Math.abs(calc.fueleuEnergyMj - 2200000) < 1e-9);
assert.ok(Math.abs(calc.fueleuWtWEmissionsGco2e - 190000000) < 1e-9);
assert.ok((calc.fueleuIntensityGco2ePerMj ?? 999) < calc.fueleuLimitGco2ePerMj);
assert.ok((calc.fueleuIntensityGap ?? 999) < 0);

// Scenario 7 — missing BDN/evidence must block verifier-readiness gate.
const missingBdn = baseFile();
missingBdn.fuels[0]!.bdnReference = "";
missingBdn.evidence.bdn = false;
const blocked = assessMaritimeReadiness(missingBdn);
assert.equal(blocked.status, "blocked");
assert.ok(blocked.blocking.some((item) => item.includes("BDN")));
assert.ok(blocked.score < 100);

// Scenario 8 — 2025 ETS uses CO2 only and 70% phase-in.
const y2025 = baseFile();
y2025.reportingYear = 2025;
const calc2025 = calculateMaritimePreparation(y2025, 80);
const expected2025GeoCo2 = 100 * 0.5 + 80 + 10;
assert.ok(Math.abs(calc2025.etsGeographicCo2eTonnes - expected2025GeoCo2) < 1e-9);
assert.equal(calc2025.etsPhaseIn, 0.7);
assert.ok(Math.abs(calc2025.estimatedEuaObligation - expected2025GeoCo2 * 0.7) < 1e-9);

console.log("TEB232 maritime scenario suite PASSED", {
  user: TEST_USER_EMAIL,
  company: TEST_COMPANY,
  readiness: readiness.score,
  totalReportedCo2eTonnes: calc.totalReportedCo2eTonnes,
  etsGeographicCo2eTonnes: calc.etsGeographicCo2eTonnes,
  estimatedEuaObligation: calc.estimatedEuaObligation,
  estimatedEtsCostEur: calc.estimatedEtsCostEur,
  fueleuIntensityGco2ePerMj: calc.fueleuIntensityGco2ePerMj,
  fueleuLimitGco2ePerMj: calc.fueleuLimitGco2ePerMj,
});
