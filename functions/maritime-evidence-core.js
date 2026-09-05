"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const CHUNK_BYTES = 4 * 1024 * 1024;
const MAX_FILE_BYTES = 200 * 1024 * 1024;
const MAX_CHUNKS = Math.ceil(MAX_FILE_BYTES / CHUNK_BYTES);
const MAX_TEXT = 4000;

const SUPPORT_TARGETS = new Set([
  "mrv-monitoring",
  "mrv-activity-data",
  "mrv-data-gap",
  "mrv-fuel-consumption",
  "mrv-emission-factor",
  "mrv-measurement",
  "mrv-emissions",
  "mrv-responsibility",
  "ets-geographic-scope",
  "ets-emissions",
  "ets-responsibility",
  "fueleu-monitoring",
  "fueleu-voyage-scope",
  "fueleu-data-gap",
  "fueleu-fuel-energy",
  "fueleu-fuel-factor",
  "fueleu-ghg-intensity",
  "fueleu-ops",
  "fueleu-ice-exclusion",
  "fueleu-measurement",
  "verifier-data-flow",
  "verifier-handoff",
]);

const MIME_EXTENSIONS = new Map([
  ["application/pdf", new Set(["pdf"])],
  ["text/plain", new Set(["txt", "log"])],
  ["text/csv", new Set(["csv"])],
  ["application/xml", new Set(["xml"])],
  ["text/xml", new Set(["xml"])],
  ["image/jpeg", new Set(["jpg", "jpeg"])],
  ["image/png", new Set(["png"])],
  ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", new Set(["xlsx"])],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", new Set(["docx"])],
  ["application/vnd.ms-excel", new Set(["xls"])],
]);

function loadRegistry() {
  const candidates = [
    path.join(__dirname, "data", "maritime", "evidence-registry.json"),
    path.join(__dirname, "..", "data", "maritime", "evidence-registry.json"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      const parsed = JSON.parse(fs.readFileSync(candidate, "utf8"));
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Maritime evidence registry is empty");
      return parsed;
    }
  }
  throw new Error("Maritime evidence registry missing");
}

const EVIDENCE_REGISTRY = loadRegistry();
const EVIDENCE_BY_KEY = new Map(EVIDENCE_REGISTRY.map((x) => [x.key, x]));

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.keys(value).sort().reduce((out, key) => {
      out[key] = stable(value[key]);
      return out;
    }, {});
  }
  return value;
}

function canonicalHash(value) {
  return sha256(JSON.stringify(stable(value)));
}

function safeId(value, max = 160) {
  return String(value || "").replace(/[^A-Za-z0-9._-]/g, "-").slice(0, max);
}

function safeText(value, max = MAX_TEXT) {
  return String(value || "").trim().slice(0, max);
}

function safeFileName(value) {
  const raw = String(value || "document").replace(/[\\/]/g, "-").replace(/[\u0000-\u001f\u007f]/g, "").trim();
  const cleaned = raw.replace(/[^A-Za-z0-9._()\- ]/g, "-").replace(/\s+/g, " ").slice(0, 180);
  return cleaned || "document";
}

function extensionOf(name) {
  const m = /\.([A-Za-z0-9]+)$/.exec(String(name || ""));
  return m ? m[1].toLowerCase() : "";
}

function validateMimeAndExtension(contentType, originalName) {
  const mime = String(contentType || "").toLowerCase().split(";")[0].trim();
  const allowed = MIME_EXTENSIONS.get(mime);
  if (!allowed) throw Object.assign(new Error("Bu belge MIME türü güvenli yükleme listesinde değil"), { code: "EVIDENCE_MIME_DENIED", http: 415 });
  const ext = extensionOf(originalName);
  if (!ext || !allowed.has(ext)) throw Object.assign(new Error("Dosya uzantısı beyan edilen MIME türüyle eşleşmiyor"), { code: "EVIDENCE_EXTENSION_MISMATCH", http: 415 });
  return mime;
}

function validateMagic(contentType, head) {
  const b = Buffer.isBuffer(head) ? head : Buffer.from(head || []);
  const mime = String(contentType || "").toLowerCase();
  if (mime === "application/pdf" && b.subarray(0, 5).toString("ascii") !== "%PDF-") return false;
  if (mime === "image/png" && !b.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))) return false;
  if (mime === "image/jpeg" && !(b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff)) return false;
  if (mime.includes("openxmlformats-officedocument") && !(b[0] === 0x50 && b[1] === 0x4b)) return false;
  if (["text/plain", "text/csv", "application/xml", "text/xml"].includes(mime) && b.includes(0x00)) return false;
  return true;
}

function dateOnly(value) {
  const s = String(value || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw Object.assign(new Error("Belge tarihi YYYY-MM-DD formatında zorunlu"), { code: "EVIDENCE_DATE_INVALID", http: 400 });
  const d = new Date(`${s}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s) throw Object.assign(new Error("Belge tarihi geçersiz"), { code: "EVIDENCE_DATE_INVALID", http: 400 });
  return s;
}

function validateEvidenceMetadata(raw) {
  const documentType = safeId(raw?.documentType, 80);
  const registry = EVIDENCE_BY_KEY.get(documentType);
  if (!registry) throw Object.assign(new Error("Belge tipi mevzuat kanıt kataloğunda bulunamadı"), { code: "EVIDENCE_TYPE_INVALID", http: 400 });

  const originalName = safeFileName(raw?.originalName);
  const contentType = validateMimeAndExtension(raw?.contentType, originalName);
  const size = Math.trunc(Number(raw?.size || 0));
  if (!Number.isInteger(size) || size < 1 || size > MAX_FILE_BYTES) {
    throw Object.assign(new Error(`Belge boyutu 1 byte ile ${MAX_FILE_BYTES} byte arasında olmalı`), { code: "EVIDENCE_SIZE_INVALID", http: 413 });
  }

  const sourceName = safeText(raw?.sourceName, 500);
  if (!sourceName) throw Object.assign(new Error("Belge kaynağı zorunlu"), { code: "EVIDENCE_SOURCE_REQUIRED", http: 400 });
  const documentDate = dateOnly(raw?.documentDate);
  const sourceReference = safeText(raw?.sourceReference, 1000);
  const notes = safeText(raw?.notes, 4000);

  const supportsRaw = Array.isArray(raw?.supports) && raw.supports.length ? raw.supports : registry.defaultSupports;
  const supports = [...new Set(supportsRaw.map((x) => safeId(x, 100)).filter((x) => SUPPORT_TARGETS.has(x)))];
  if (supports.length === 0) throw Object.assign(new Error("Belgenin desteklediği hesaplama/veri zinciri seçilmelidir"), { code: "EVIDENCE_SUPPORT_REQUIRED", http: 400 });

  const linkedVoyageIds = [...new Set((Array.isArray(raw?.linkedVoyageIds) ? raw.linkedVoyageIds : []).map((x) => safeId(x, 120)).filter(Boolean))].slice(0, 5000);
  const linkedFuelIds = [...new Set((Array.isArray(raw?.linkedFuelIds) ? raw.linkedFuelIds : []).map((x) => safeId(x, 120)).filter(Boolean))].slice(0, 1000);

  return {
    documentType,
    documentLabel: registry.label,
    legalBasis: registry.legalBasis,
    criticality: registry.criticality,
    originalName,
    contentType,
    size,
    documentDate,
    sourceName,
    sourceReference,
    notes,
    supports,
    linkedVoyageIds,
    linkedFuelIds,
  };
}

function buildRetention(reportingYear) {
  const year = Math.trunc(Number(reportingYear));
  if (!Number.isInteger(year) || year < 2024 || year > 2100) throw new Error("reportingYear invalid");
  return {
    policyVersion: "maritime-evidence-retention-v3",
    automaticPurge: false,
    hardDeleteApi: false,
    legalHoldSupported: true,
    fuelEuMinimumYears: 5,
    fuelEuMinimumUntil: `${year + 5}-12-31T23:59:59.999Z`,
    fuelEuLegalBasis: "Commission Implementing Regulation (EU) 2024/2027 Article 11(5); Regulation (EU) 2023/1805 Article 7(4)",
    mrvLegalBasis: "Commission Delegated Regulation (EU) 2023/2917 Article 10(5): MARPOL/SOLAS retention periods",
  };
}

function buildEvidenceChainHash(previousChainHash, record) {
  return canonicalHash({ previousChainHash: previousChainHash || null, record });
}

function expectedChunkSize(totalSize, index) {
  const count = Math.ceil(totalSize / CHUNK_BYTES);
  if (index < 0 || index >= count) return null;
  if (index < count - 1) return CHUNK_BYTES;
  return totalSize - (count - 1) * CHUNK_BYTES;
}

module.exports = {
  CHUNK_BYTES,
  MAX_FILE_BYTES,
  MAX_CHUNKS,
  SUPPORT_TARGETS,
  MIME_EXTENSIONS,
  EVIDENCE_REGISTRY,
  EVIDENCE_BY_KEY,
  sha256,
  stable,
  canonicalHash,
  safeId,
  safeText,
  safeFileName,
  validateMimeAndExtension,
  validateMagic,
  validateEvidenceMetadata,
  buildRetention,
  buildEvidenceChainHash,
  expectedChunkSize,
};
