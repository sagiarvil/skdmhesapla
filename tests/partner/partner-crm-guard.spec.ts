import assert from "node:assert/strict";
import {
  assertPartnerMarketingProtection,
  createPartnerLeadEntity,
  type PartnerLeadRecord,
} from "../../src/lib/skdm/partner-crm-guard";

console.log("=== Running Partner CRM Guard Tests ===");

// Test 1: Factory creates valid protected lead
const lead = createPartnerLeadEntity({
  companyName: "Atlas Gümrük Müşavirliği A.Ş.",
  contactName: "Mehmet Yılmaz",
  workEmail: "mehmet@atlasgumruk.com.tr",
  companyType: "gumruk-musavirligi",
  clientScale: "21_50",
  mainNeed: "Demir-çelik ve alüminyum müşterileri için dosya üretim altyapısı",
});

assert.equal(lead.source, "partner_network_landing");
assert.equal(lead.directMarketingEligible, false);
assert.equal(lead.status, "NEW");
assert.ok(lead.id.startsWith("PARTNER-LEAD-"));
console.log("✔ Test 1 passed: Factory creates protected partner lead entity.");

// Test 2: Guard allows valid protected record
assert.doesNotThrow(() => {
  assertPartnerMarketingProtection(lead);
});
console.log("✔ Test 2 passed: Guard permits compliant partner record.");

// Test 3: Guard strictly blocks and throws on directMarketingEligible: true
assert.throws(
  () => {
    assertPartnerMarketingProtection({
      source: "partner_network_landing",
      directMarketingEligible: true as any,
    });
  },
  /SECURITY_VIOLATION: Partner-originated clients cannot be enrolled into direct marketing/
);
console.log("✔ Test 3 passed: Guard enforces non-poaching security boundary.");

console.log("All Partner CRM Guard tests passed successfully.");
