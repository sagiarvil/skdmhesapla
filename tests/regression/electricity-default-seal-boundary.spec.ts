import assert from "node:assert/strict";
import { calculateSkdmLiability } from "../../src/lib/skdm/calculator";

const result = calculateSkdmLiability({
  sectorId: "cement",
  productionVolume: 100,
  year: 2026,
  importerAnnualVolumeStatus: "over50",
  useCustomEmissions: true,
  customDirectEmission: 0.4,
  hasVerificationEvidence: true,
  streams: [
    { method: "MassBalance", name: "Proses CO2", ad: 40, unit: "tCO2e", ncv: "" },
    { method: "Electricity", name: "Şebeke elektriği", ad: 50, unit: "MWh", ncv: "" },
  ],
});

const electricity = result.emissionSteps.find((step) => step.label === "Şebeke elektriği");
assert.ok(electricity, "elektrik hesap adımı üretilmeli");
assert.equal(electricity?.kind, "benchmark", "genel şebeke faktörü paid actual-data olarak sınıflandırılamaz");
assert.ok(result.emissionSteps.some((step) => step.kind === "benchmark"));
console.log("electricity-default-seal-boundary: PASS");
