import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateSkdmLiability } from "../../src/lib/skdm/calculator";
import { generateCbamDeclarantXml } from "../../src/lib/skdm/cbam-xml-export";

test("CBAM Declarant XML Export — valid structure & DG TAXUD compliance", () => {
  const calc = calculateSkdmLiability({
    sectorId: "iron-steel",
    productionVolume: 1000,
    year: 2026,
    etsQuarter: "2026-Q1",
    trEtsNettingEur: 0,
    importerAnnualVolumeStatus: "over50",
  });

  const xml = generateCbamDeclarantXml(
    calc,
    {
      companyName: "Kardemir A.Ş.",
      taxId: "1234567890",
      installationName: "Karabük Entegre Demir Çelik Tesisleri",
      city: "Karabük",
      country: "TR",
    },
    {
      reportingPeriod: "2026-Q1",
      cnCode: "72083900",
      productionRoute: "BF-BOF",
    }
  );

  // XML Header & Schema declarations
  assert.ok(xml.includes('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.ok(xml.includes('<cbam:CBAMReport xmlns:cbam="urn:cbam:declarant:v23"'));
  assert.ok(xml.includes('<ReportingPeriod>2026-Q1</ReportingPeriod>'));
  assert.ok(xml.includes('<SpecificationVersion>v23.00</SpecificationVersion>'));

  // Declarant & Installation tags
  assert.ok(xml.includes('<Name>Kardemir A.Ş.</Name>'));
  assert.ok(xml.includes('<City>Karabük</City>'));
  assert.ok(xml.includes('<CNCode>72083900</CNCode>'));
  assert.ok(xml.includes('<Quantity unit="t">1000.00</Quantity>'));

  // Specific embedded emissions & Annex II direct-only
  assert.ok(xml.includes('<DirectEmissions unit="tCO2e/t">1.8000</DirectEmissions>'));
  assert.ok(xml.includes('<IndirectEmissions unit="tCO2e/t">0.0000</IndirectEmissions>'));
  assert.ok(xml.includes('<TotalEmbeddedEmissions unit="tCO2e">1800.00</TotalEmbeddedEmissions>'));
  assert.ok(xml.includes('<LiableEmissions unit="tCO2e">45.00</LiableEmissions>'));

  // Financial obligations
  assert.ok(xml.includes('<EuEtsBenchmarkPrice currency="EUR">75.40</EuEtsBenchmarkPrice>'));
  assert.ok(xml.includes('<NetCostEur currency="EUR">3393.00</NetCostEur>'));

  // Audit provenance
  assert.ok(xml.includes('<AuditHash>'));
  assert.ok(xml.includes('Regulation (EU) 2023/956'));
});
