import assert from "node:assert/strict";
import { assessMaritimeScope } from "../../src/lib/maritime/scope";

const annual = assessMaritimeScope({
  role: "gemi-sahibi",
  shipType: "cargo",
  grossTonnage: 12000,
  portRegion: "eu",
  euPortCallsPerYear: 12,
  emissionsYear: 2026,
  carriesCbamGoods: false,
  hasFuelRecords: true,
  hasVoyageRecords: true,
  hasMonitoringPlan: true,
  etsScopeEmissionsTco2e: 1000,
  euaPriceEur: 80,
});
assert.equal(annual.mrv, "critical");
assert.equal(annual.ets, "critical");
assert.equal(annual.fueleu, "critical");
assert.equal(annual.commercialRoute, "annual-compliance");
assert.equal(annual.readinessScore, 100);
assert.equal(annual.etsCoverageFactor, 1);
assert.equal(annual.estimatedEtsCostEur, 80000);

const mrvSmallGeneralCargo = assessMaritimeScope({
  role: "gemi-isletmecisi",
  shipType: "general-cargo",
  grossTonnage: 1200,
  portRegion: "eu",
  euPortCallsPerYear: 4,
  emissionsYear: 2026,
  carriesCbamGoods: false,
  hasFuelRecords: false,
  hasVoyageRecords: false,
  hasMonitoringPlan: false,
});
assert.equal(mrvSmallGeneralCargo.mrv, "critical");
assert.equal(mrvSmallGeneralCargo.ets, "out");
assert.equal(mrvSmallGeneralCargo.fueleu, "out");

const offshore2026 = assessMaritimeScope({
  role: "ism-doc-company",
  shipType: "offshore",
  grossTonnage: 8000,
  portRegion: "eu",
  euPortCallsPerYear: 3,
  emissionsYear: 2026,
  carriesCbamGoods: false,
  hasFuelRecords: true,
  hasVoyageRecords: true,
  hasMonitoringPlan: true,
});
assert.equal(offshore2026.mrv, "critical");
assert.equal(offshore2026.ets, "out");

const offshore2027 = assessMaritimeScope({ ...offshore2026, emissionsYear: 2027 });
assert.equal(offshore2027.ets, "critical");

const fueleuBoundary = assessMaritimeScope({
  role: "gemi-sahibi",
  shipType: "cargo",
  grossTonnage: 5000,
  portRegion: "eu",
  euPortCallsPerYear: 2,
  emissionsYear: 2026,
  carriesCbamGoods: false,
  hasFuelRecords: true,
  hasVoyageRecords: true,
  hasMonitoringPlan: true,
});
assert.equal(fueleuBoundary.fueleu, "review");

const partner = assessMaritimeScope({
  role: "forwarder",
  shipType: "other",
  grossTonnage: 0,
  portRegion: "eu",
  euPortCallsPerYear: 4,
  emissionsYear: 2026,
  carriesCbamGoods: true,
  hasFuelRecords: false,
  hasVoyageRecords: false,
  hasMonitoringPlan: false,
});
assert.equal(partner.cbamPartnerPotential, "critical");
assert.equal(partner.commercialRoute, "partner-desk");
assert.ok(partner.missingEvidence.includes("Yakıt / BDN kayıtları"));

const norway = assessMaritimeScope({
  role: "gemi-sahibi",
  shipType: "cargo",
  grossTonnage: 10000,
  portRegion: "norway-iceland",
  euPortCallsPerYear: 2,
  emissionsYear: 2026,
  carriesCbamGoods: false,
  hasFuelRecords: true,
  hasVoyageRecords: true,
  hasMonitoringPlan: true,
});
assert.equal(norway.fueleu, "review");
assert.ok(norway.warnings.some((item) => item.includes("Norveç/İzlanda")));
