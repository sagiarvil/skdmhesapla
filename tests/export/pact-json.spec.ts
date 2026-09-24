import { test } from "node:test";
import assert from "node:assert/strict";
import { calculatePcf } from "../../src/lib/pcf/calculator";
import { generatePactJson } from "../../src/lib/pcf/pact-export";
import type { PcfInput } from "../../src/lib/pcf/types";

test("WBCSD PACT 2.0 JSON Export — valid structure & conformance", () => {
  const input: PcfInput = {
    reportId: "PCF-TEST-PACT-001",
    createdAt: "2026-08-17T12:00:00.000Z",
    companyName: "Erdemir Demir ve Çelik Fabrikaları T.A.Ş.",
    facilityName: "Ereğli Entegre Tesisleri",
    country: "TR",
    buyerName: "ThyssenKrupp AG",
    productName: "Sıcak Haddelenmiş Rulo Sac",
    cnCode: "72083900",
    reportingPeriodStart: "2026-01-01",
    reportingPeriodEnd: "2026-12-31",
    functionalUnit: "1 ton",
    productionQuantityForPeriod: 1000,
    allocationShare: 1.0,
    allocationMethod: "Kütle bazlı fiziksel tahsis",
    materials: [],
    packaging: [],
    fuels: [],
    evidence: {
      productionRecord: true,
      electricityInvoice: true,
      fuelInvoice: true,
      materialEvidenceCount: 1,
    },
  };

  const result = calculatePcf(input);
  const pact = generatePactJson(result, input);

  assert.equal(pact.specVersion, "2.0.0");
  assert.equal(pact.status, "Active");
  assert.equal(pact.companyName, "Erdemir Demir ve Çelik Fabrikaları T.A.Ş.");
  assert.deepEqual(pact.companyIds, ["urn:country:TR"]);
  assert.equal(pact.productNameCompany, "Sıcak Haddelenmiş Rulo Sac");
  assert.deepEqual(pact.productIds, ["urn:gtip:72083900"]);

  // PCF field conformance
  assert.equal(pact.pcf.declaredUnit, "1 ton");
  assert.equal(pact.pcf.characterizationFactors, "IPCC 2021 GWP100");
  assert.ok(pact.pcf.crossSectoralStandardsUsed.includes("GHG Protocol Product Standard"));
  assert.ok(pact.pcf.crossSectoralStandardsUsed.includes("ISO 14067:2018"));
  assert.ok(pact.pcf.dataQualityRating.reliability !== undefined);
});
