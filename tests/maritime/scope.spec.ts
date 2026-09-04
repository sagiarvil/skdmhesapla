import assert from "node:assert/strict";
import { assessMaritimeScope } from "../../src/lib/maritime/scope";
import { calculateMaritimePreparation, etsGeographicFactor } from "../../src/lib/maritime/calculator";
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
const offshore2026 = assessMaritimeScope(offshore2026Input);
assert.equal(offshore2026.mrv, "critical");
assert.equal(offshore2026.ets, "out");
assert.equal(assessMaritimeScope({ ...offshore2026Input, emissionsYear: 2027 }).ets, "critical");

const noMandate = assessMaritimeScope({ ...base, role: "ism-doc-company", hasFormalResponsibilityMandate: false });
assert.equal(noMandate.mrv, "review");
assert.ok(noMandate.missingEvidence.some((x) => x.includes("mandate")));

assert.equal(etsGeographicFactor("intra-eu-eea"), 1);
assert.equal(etsGeographicFactor("eu-eea-third"), 0.5);
assert.equal(etsGeographicFactor("outside"), 0);
assert.equal(Number(fueleuIntensityLimit(2025).toFixed(4)), Number((91.16 * 0.98).toFixed(4)));
assert.equal(Number(fueleuIntensityLimit(2030).toFixed(4)), Number((91.16 * 0.94).toFixed(4)));

const file: MaritimePreparationFile = {
  reportingYear: 2026,
  company: { companyName: "Demo", role: "gemi-sahibi", imoCompanyNumber: "IMO-COMP", registeredOwnerName: "Demo", registeredOwnerImoNumber: "IMO-COMP", country: "TR", address: "", contactName: "", contactEmail: "ops@example.com", telephone: "", administeringAuthority: "", formalMandateReference: "" },
  ship: { shipName: "Demo Ship", imoNumber: "1234567", portOfRegistry: "Istanbul", homePort: "", flagState: "TR", shipType: "cargo", officialCategory: "Container ship", deadweightTonnes: 10000, grossTonnage: 12000, classificationSociety: "", iceClass: "", technicalEfficiencyType: "none", technicalEfficiencyValue: "", description: "" },
  monitoring: { monitoringPlanVersion: "1", monitoringPlanReferenceDate: "2026-01-01", monitoringPlanAssessed: true, monitoringPlanApproved: true, revisionNotes: "", fuelMonitoringMethod: "BDN", densityMethod: "", uncertaintyMethod: "", emissionFactorMethod: "", dataGapMethod: "surrogate", emissionSources: ["Main engines"], measurementEquipment: "", itSystem: "", proceduresReference: "" },
  voyages: [
    { id: "1", departurePort: "Istanbul", departureUnlocode: "TRIST", departureAt: "2026-01-01T00:00", arrivalPort: "Piraeus", arrivalUnlocode: "GRPIR", arrivalAt: "2026-01-03T00:00", scope: "eu-eea-third", portCallPurpose: "cargo", exclusionReason: "", distanceNm: 500, timeAtSeaHours: 48, timeAtBerthHours: 3, cargoTonnes: 1000, passengers: 0, transportWorkTonneNm: 500000, co2Tonnes: 100, ch4TonnesCo2e: 2, n2oTonnesCo2e: 1, fuelTonnes: 30, dataGap: false, dataGapReason: "" },
  ],
  fuels: [
    { id: "1", fuelType: "MGO", fuelConsumer: "Main engines", bdnReference: "BDN-1", sustainabilityCertificate: "", quantityTonnes: 30, lowerCalorificValueMjPerTonne: 42000, energyMj: 1260000, atBerthEnergyMj: 0, wellToTankFactorGco2ePerMj: 0, tankToWakeCo2Factor: 0, tankToWakeCh4Factor: 0, tankToWakeN2oFactor: 0, slipFactor: 0, wellToWakeEmissionsGco2e: 110000000, opsElectricityKwh: 0, measurementMethod: "BDN + tank", calibrationReference: "CAL-1", factorSourceReference: "EU Annex II" },
  ],
  evidence: {},
};
const calc = calculateMaritimePreparation(file, 80);
assert.equal(calc.totalReportedCo2eTonnes, 103);
assert.equal(calc.etsGeographicCo2eTonnes, 51.5);
assert.equal(calc.estimatedEuaObligation, 51.5);
assert.equal(calc.estimatedEtsCostEur, 4120);
assert.ok(calc.fueleuIntensityGco2ePerMj !== null);
