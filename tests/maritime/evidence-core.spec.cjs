"use strict";

const assert = require("node:assert/strict");
const {
  CHUNK_BYTES,
  MAX_FILE_BYTES,
  EVIDENCE_REGISTRY,
  validateEvidenceMetadata,
  validateMagic,
  buildRetention,
  buildEvidenceChainHash,
  expectedChunkSize,
  canonicalHash,
} = require("../../functions/maritime-evidence-core.js");

assert.equal(CHUNK_BYTES, 4 * 1024 * 1024);
assert.equal(MAX_FILE_BYTES, 200 * 1024 * 1024);
assert.ok(EVIDENCE_REGISTRY.length >= 18);
assert.ok(EVIDENCE_REGISTRY.some((x) => x.key === "bdn"));
assert.ok(EVIDENCE_REGISTRY.some((x) => x.key === "calibration"));
assert.ok(EVIDENCE_REGISTRY.some((x) => x.key === "fuel-certificates"));

const valid = validateEvidenceMetadata({
  documentType: "bdn",
  originalName: "BDN-2026-001.pdf",
  contentType: "application/pdf",
  size: 5 * 1024 * 1024,
  documentDate: "2026-08-31",
  sourceName: "Bunker Supplier A",
  sourceReference: "BDN-2026-001",
  supports: ["mrv-fuel-consumption", "ets-emissions", "fueleu-fuel-energy"],
  linkedFuelIds: ["fuel-1"],
});
assert.equal(valid.documentType, "bdn");
assert.equal(valid.documentDate, "2026-08-31");
assert.equal(valid.sourceName, "Bunker Supplier A");
assert.deepEqual(valid.linkedFuelIds, ["fuel-1"]);
assert.ok(valid.legalBasis.length > 0);

assert.throws(() => validateEvidenceMetadata({
  documentType: "bdn",
  originalName: "fake.exe",
  contentType: "application/pdf",
  size: 100,
  documentDate: "2026-08-31",
  sourceName: "Supplier",
  supports: ["mrv-fuel-consumption"],
}), (err) => err.code === "EVIDENCE_EXTENSION_MISMATCH");

assert.throws(() => validateEvidenceMetadata({
  documentType: "bdn",
  originalName: "BDN.pdf",
  contentType: "application/pdf",
  size: 100,
  documentDate: "31-08-2026",
  sourceName: "Supplier",
  supports: ["mrv-fuel-consumption"],
}), (err) => err.code === "EVIDENCE_DATE_INVALID");

assert.throws(() => validateEvidenceMetadata({
  documentType: "bdn",
  originalName: "BDN.pdf",
  contentType: "application/pdf",
  size: 100,
  documentDate: "2026-08-31",
  sourceName: "",
  supports: ["mrv-fuel-consumption"],
}), (err) => err.code === "EVIDENCE_SOURCE_REQUIRED");

assert.equal(validateMagic("application/pdf", Buffer.from("%PDF-1.7\n")), true);
assert.equal(validateMagic("application/pdf", Buffer.from("NOT-PDF")), false);
assert.equal(validateMagic("image/png", Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])), true);
assert.equal(validateMagic("image/jpeg", Buffer.from([0xff,0xd8,0xff,0x00])), true);

assert.equal(expectedChunkSize(5 * 1024 * 1024, 0), CHUNK_BYTES);
assert.equal(expectedChunkSize(5 * 1024 * 1024, 1), 1024 * 1024);
assert.equal(expectedChunkSize(5 * 1024 * 1024, 2), null);

const retention = buildRetention(2026);
assert.equal(retention.fuelEuMinimumYears, 5);
assert.equal(retention.fuelEuMinimumUntil, "2031-12-31T23:59:59.999Z");
assert.equal(retention.automaticPurge, false);
assert.equal(retention.hardDeleteApi, false);
assert.equal(retention.legalHoldSupported, true);

const record = { evidenceId: "e1", sha256: "a".repeat(64), documentType: "bdn" };
const first = buildEvidenceChainHash(null, record);
const firstAgain = buildEvidenceChainHash(null, record);
const second = buildEvidenceChainHash(first, record);
assert.equal(first, firstAgain);
assert.notEqual(first, second);
assert.equal(first.length, 64);
assert.equal(canonicalHash({ b: 2, a: 1 }), canonicalHash({ a: 1, b: 2 }));

console.log("MARITIME EVIDENCE CORE TEST PASS");
