import assert from "node:assert/strict";
import { assessMaritimeScope } from "../../src/lib/maritime/scope";
import { calculateMaritimePreparation, etsGeographicFactor, fueleuGeographicFactor } from "../../src/lib/maritime/calculator";
import { fueleuIntensityLimit } from "../../src/lib/maritime/regulatory";
import type { MaritimePreparationFile } from "../../src/lib/maritime/types";

const base = {
  role: "gemi-sahibi" as const,
  shipType: "cargo" as const,
  grossTonnage: 12000,
  portRegion: "eu" as const,
  euPortCallsPerYear: 12,
  emissionsYear: 2026,
  carriesCbamGoods: false,
  hasFuelRecords: true,
  hasVoyageRecords: true,
  hasMonitoringPlan: true,
  hasFormalResponsibilityMandate: true,
};

const annual = assessMaritimeScope({ ...base, etsScopeEmissionsTco2e: 1000, euaPriceEur: 80 });
assert.equal(annual.mrv, "critical");
assert.equal(annual.ets, "critical");
assert.equal(annual.fueleu, "critical");
assert.equal(annual.etsCoverageFactor, 1);
assert.equal(annual.estimatedEtsCostEur, 80000);

const smallGeneralCargo = assessMaritimeScope({ ...base, role: "gemi-isletmecisi", shipType: "general-cargo", grossTonnage: 1200 });
assert.equal(smallGeneralCargo.mrv, "critical");
assert.equal(smallGeneralCargo.ets, "out");
assert.equal(smallGeneralCargo.fueleu, "out");

const offshore2026Input = { ...base, role: "ism-doc-company" as const, shipType: "offshore" as const, grossTonnage: 8000, emissionsYear: 2026 };
assert.equal(assessMaritimeScope(offshore2026Input).ets, "out");
assert.equal(assessMaritimeScope({ ...offshore2026Input, emissionsYear: 2027 }).ets, "critical");

const noMandate = assessMaritimeScope({ ...base, role: "ism-doc-company", hasFormalResponsibilityMandate: false });
assert.equal(noMandate.mrv, "review");
assert.ok(noMandate.missingEvidence.some((x) => x.includes("mandate")));

assert.equal(etsGeographicFactor("intra-eu-eea"), 1);
assert.equal(etsGeographicFactor("eu-eea-third"), 0.5);
assert.equal(etsGeographicFactor("outside"), 0);
assert.equal(fueleuGeographicFactor("intra-eu-eea"), 1);
assert.equal(fueleuGeographicFactor("eu-eea-third"), 0.5);
assert.equal(Number(fueleuIntensityLimit(2025).toFixed(4)), Number((91.16 * 0.98).toFixed(4)));
assert.equal(Number(fueleuIntensityLimit(2030).toFixed(4)), Number((91.16 * 0.94).toFixed(4)));

const file: MaritimePreparationFile = {
  reportingYear: 2026,
  company: {
    companyName: "Demo Shipping",
    role: "gemi-sahibi",
    imoCompanyNumber: "IMO-COMP",
    registeredOwnerName: "Demo Shipping",
    registeredOwnerImoNumber: "IMO-COMP",
    country: "TR",
    address: "Istanbul",
    contactName: "Ops",
    contactEmail: "ops@example.com",
    telephone: "+90 212 000 0000",
    administeringAuthority: "Demo Authority",
    formalMandateReference: "",
    responsibilityFrom: "2026-01-01",
    responsibilityTo: "2026-12-31",
  },
  verifier: {
    verifierName: "Demo Verifier",
    accreditationNumber: "ACC-1",
    address: "EU",
    contactEmail: "verifier@example.com",
  },
  ship: {
    shipName: "Demo Ship",
    imoNumber: "1234567",
    portOfRegistry: "Istanbul",
    homePort: "Istanbul",
    flagState: "TR",
    shipType: "cargo",
    officialCategory: "Container ship",
    deadweightTonnes: 10000,
    grossTonnage: 12000,
    classificationSociety: "Class",
    iceClass: "",
    technicalEfficiencyType: "none",
    technicalEfficiencyValue: "",
    description: "Demo vessel",
  },
  monitoring: {
    monitoringPlanVersion: "1",
    monitoringPlanReferenceDate: "2026-01-01",
    monitoringPlanAssessed: true,
    monitoringPlanApproved: true,
    revisionNotes: "",
    fuelMonitoringMethod: "BDN + tank readings",
    densityMethod: "BDN density",
    uncertaintyMethod: "meter control",
    uncertaintyPercent: 1,
    emissionFactorMethod: "EU default factors",
    dataGapMethod: "surrogate method",
    voyageCompletenessProcedure: "port-call reconciliation",
    emissionSources: ["Main engines"],
    measurementEquipment: "flow meter",
    itSystem: "DMS",
    proceduresReference: "PROC-1",
  },
  voyages: [
    {
      id: "1",
      departurePort: "Istanbul",
      departureUnlocode: "TRIST",
      departureAt: "2026-01-01T00:00",
      arrivalPort: "Piraeus",
      arrivalUnlocode: "GRPIR",
      arrivalAt: "2026-01-03T00:00",
      scope: "eu-eea-third",
      portCallPurpose: "cargo",
      exclusionReason: "",
      distanceNm: 500,
      timeAtSeaHours: 48,
      timeAtBerthHours: 3,
      anchorageHours: 0,
      cargoTonnes: 1000,
      passengers: 0,
      transportWorkTonneNm: 500000,
      co2Tonnes: 100,
      ch4TonnesCo2e: 2,
      n2oTonnesCo2e: 1,
      fuelTonnes: 30,
      dataGap: false,
      dataGapReason: "",
    },
  ],
  fuels: [
    {
      id: "1",
      scope: "eu-eea-third",
      portName: "",
      portUnlocode: "",
      terminalBerth: "",
      fuelType: "MGO",
      fuelConsumer: "Main engines",
      bdnReference: "BDN-1",
      sustainabilityCertificate: "",
      quantityTonnes: 30,
      lowerCalorificValueMjPerTonne: 42000,
      energyMj: 1260000,
      atBerthEnergyMj: 0,
      wellToTankFactorGco2ePerMj: 0,
      tankToWakeCo2Factor: 0,
      tankToWakeCh4Factor: 0,
      tankToWakeN2oFactor: 0,
      slipFactor: 0,
      wellToWakeEmissionsGco2e: 110000000,
      opsElectricityKwh: 0,
      opsConnectionHours: 0,
      opsPeakPowerKw: 0,
      opsExceptionReference: "",
      zeroEmissionEnergyMj: 0,
      substituteEnergyMj: 0,
      windRewardFactor: 1,
      rfNboEnergyMj: 0,
      measurementMethod: "BDN + tank",
      calibrationReference: "CAL-1",
      factorSourceReference: "EU Annex II",
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
  evidence: {},
  evidenceReferences: {},
};

const calc = calculateMaritimePreparation(file, 80);
assert.equal(calc.totalReportedCo2eTonnes, 103);
assert.equal(calc.etsGeographicCo2eTonnes, 51.5);
assert.equal(calc.estimatedEuaObligation, 51.5);
assert.equal(calc.estimatedEtsCostEur, 4120);
assert.equal(calc.fueleuEnergyMj, 630000);
assert.equal(calc.fueleuWtWEmissionsGco2e, 55000000);
assert.ok(calc.fueleuIntensityGco2ePerMj !== null);
