import assert from "node:assert/strict";
import { assessMaritimeScope } from "../../src/lib/maritime/scope";

const annual = assessMaritimeScope({
  role: "gemi-sahibi",
  grossTonnage: 12000,
  euPortCallsPerYear: 12,
  carriesCbamGoods: false,
  hasFuelRecords: true,
  hasVoyageRecords: true,
  hasMonitoringPlan: true,
});

assert.equal(annual.mrv, "critical");
assert.equal(annual.ets, "critical");
assert.equal(annual.fueleu, "critical");
assert.equal(annual.commercialRoute, "annual-compliance");
assert.equal(annual.readinessScore, 100);

const partner = assessMaritimeScope({
  role: "forwarder",
  grossTonnage: 0,
  euPortCallsPerYear: 4,
  carriesCbamGoods: true,
  hasFuelRecords: false,
  hasVoyageRecords: false,
  hasMonitoringPlan: false,
});

assert.equal(partner.cbamPartnerPotential, "critical");
assert.equal(partner.commercialRoute, "partner-desk");
assert.ok(partner.missingEvidence.includes("Yakıt/BDN kayıtları"));

const low = assessMaritimeScope({
  role: "ihracatci",
  grossTonnage: 0,
  euPortCallsPerYear: 0,
  carriesCbamGoods: false,
  hasFuelRecords: false,
  hasVoyageRecords: false,
  hasMonitoringPlan: false,
});

assert.equal(low.commercialRoute, "free");
assert.equal(low.readinessScore, 0);
