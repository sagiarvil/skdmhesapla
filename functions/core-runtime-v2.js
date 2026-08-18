/**
 * core-runtime-v2 — sunucu tarafı snapshot/kimlik/hesaplama yardımcıları.
 * İstemci girdisi paket doğruluğunu belirleyemez; snapshot kanonik girdidir.
 */
const crypto = require("node:crypto");
const { calculatePcf } = require("./pcf-core/pcf/calculator.js");

const sha256hex = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");

function shortHash(input) {
  return sha256hex(new TextEncoder().encode(input)).slice(0, 12).toUpperCase();
}

/** Kanonik girdinin deterministik SHA-256'sı. */
function computeSnapshotHash(canonicalInput) {
  return `sha256:${sha256hex(new TextEncoder().encode(JSON.stringify(canonicalInput)))}`;
}

/** Deterministik paket kimliği — Date.now/random yok. */
function computePackageId(workflowType, sessionId, transactionId, snapshotHash) {
  if (workflowType === "pcf") {
    return `PCF-SEAL-${shortHash(`${workflowType}:${sessionId}:${transactionId}:${snapshotHash}`)}`;
  }
  return `SEAL-${shortHash(`${workflowType}:${sessionId}:${transactionId}:${snapshotHash}`)}`;
}

/** Sunucu yeniden hesaplama — istemci result/readiness değerleri dikkate alınmaz. */
function recomputePcf(canonicalInput) {
  return calculatePcf(canonicalInput);
}

module.exports = {
  computeSnapshotHash,
  computePackageId,
  recomputePcf,
  shortHash,
};
