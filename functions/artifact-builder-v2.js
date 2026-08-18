/**
 * artifact-builder-v2 — mühürlü paketi sunucuda üretir.
 * İstemci paket/hash/manifest doğruluk kaynağı olamaz.
 */
const { createPcfSealedPackage } = require("./pcf-core/pcf/package-seal.js");

/**
 * PCF paketini sunucu snapshot'ından üretir.
 * meta: { sessionId, packageId, createdAt }
 * Dönen paket: files[], masterHash, manifesto, zipBytes, zipFilename.
 */
function buildPcfPackage(canonicalInput, recomputedResult, meta) {
  if (recomputedResult.status === "blocked") {
    const err = new Error("PCF sonucu mühürlemeye uygun değil");
    err.code = "PCF_BLOCKED";
    throw err;
  }
  return createPcfSealedPackage(canonicalInput, recomputedResult, meta);
}

/** ZIP'i base64'e çevirir (Firestore blob saklama). */
function zipToBase64(pkg) {
  return Buffer.from(pkg.zipBytes).toString("base64");
}

/** Paket dosya kayıtları — sunucu tarafı üretilen hash'ler. */
function packageFileRecords(pkg) {
  return pkg.files.map((f) => ({
    filename: f.filename,
    mimeType: f.mimeType,
    sizeBytes: f.sizeBytes,
    sha256: f.sha256,
  }));
}

module.exports = { buildPcfPackage, zipToBase64, packageFileRecords };
