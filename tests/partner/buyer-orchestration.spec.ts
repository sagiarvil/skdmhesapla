import assert from "node:assert/strict";
import {
  canTransitionCollection,
  transitionCollectionState,
  calculateCollectionReadiness,
  type CollectionState,
} from "../../src/lib/skdm/buyer-orchestration";

console.log("=== Running Buyer Orchestration Lifecycle Tests ===");

// Test 1: Permitted transitions
assert.equal(canTransitionCollection("DRAFT", "INVITED"), true);
assert.equal(canTransitionCollection("INVITED", "OPENED"), true);
assert.equal(canTransitionCollection("OPENED", "IN_PROGRESS"), true);
assert.equal(canTransitionCollection("IN_PROGRESS", "SUBMITTED"), true);
assert.equal(canTransitionCollection("SUBMITTED", "DATA_READY"), true);
assert.equal(canTransitionCollection("SUBMITTED", "REVIEW_REQUIRED"), true);
console.log("✔ Test 1 passed: Permitted transitions verified.");

// Test 2: Blocked transitions
assert.equal(canTransitionCollection("DRAFT", "DATA_READY"), false);
assert.equal(canTransitionCollection("INVITED", "SUBMITTED"), false);
assert.equal(canTransitionCollection("DRAFT", "OPENED"), false);
console.log("✔ Test 2 passed: Illegal transitions blocked.");

// Test 3: transitionCollectionState generates valid audit event
const result = transitionCollectionState("DRAFT", "INVITED", {
  entityId: "INV-2026-001",
  actor: { type: "buyer", id: "BUYER-EU-884" },
  reason: "Invited Turkish supplier factory manager",
});

assert.equal(result.newState, "INVITED");
assert.equal(result.auditEvent.entityId, "INV-2026-001");
assert.equal(result.auditEvent.actor.id, "BUYER-EU-884");
assert.ok(result.auditEvent.eventType.includes("STATE_CHANGE_DRAFT_TO_INVITED"));
console.log("✔ Test 3 passed: Transition execution and audit trail logging verified.");

// Test 4: transitionCollectionState throws on illegal state jump
assert.throws(
  () => {
    transitionCollectionState("DRAFT", "DATA_READY", {
      entityId: "INV-2026-001",
      actor: { type: "system", id: "SYSTEM" },
    });
  },
  /INVALID_LIFECYCLE_TRANSITION/
);
console.log("✔ Test 4 passed: Exception thrown on illegal transition.");

// Test 5: calculateCollectionReadiness
const emptyResult = calculateCollectionReadiness({});
assert.equal(emptyResult.score, 0);
assert.equal(emptyResult.isComplete, false);
assert.equal(emptyResult.missingRequirements.length, 5);

const fullResult = calculateCollectionReadiness({
  installationName: "İskenderun Çelik Haddehanesi Tesis 1",
  installationAddress: "Organize Sanayi Bölgesi 2. Cadde No: 12 İskenderun / Hatay",
  cnCode: "72142000",
  activityVolumeTonnes: 4500,
  specificDirectEmissions: 1.84,
  evidenceHashes: ["e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"],
});

assert.equal(fullResult.score, 100);
assert.equal(fullResult.isComplete, true);
assert.equal(fullResult.missingRequirements.length, 0);
console.log("✔ Test 5 passed: Deterministic readiness scoring verified (0 -> 100).");

console.log("All Buyer Orchestration tests passed successfully.");
