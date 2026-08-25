#!/usr/bin/env node
/**
 * assert-api-trust-boundary — Gate 2.
 * PCF ve CBAM ücretli paketlerinde istemci hesap/hash/paket otoritesi olamaz.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const legacy = fs.readFileSync(path.join(root, "functions/index.js"), "utf8");
const cbam = fs.readFileSync(path.join(root, "functions/cbam-seal-v2.js"), "utf8");
const firebase = fs.readFileSync(path.join(root, "firebase.json"), "utf8");
const main = fs.readFileSync(path.join(root, "functions/main.js"), "utf8");
const errors = [];

const FORBIDDEN_LEGACY_CLIENT_AUTHORITY = [
  "body.masterHash",
  "body.manifesto",
  "body.files",
  "body.readinessScore",
  "body.resultStatus",
  "body.packageId",
  "body.packageType",
  "body.ownerUid",
];
for (const pat of FORBIDDEN_LEGACY_CLIENT_AUTHORITY) {
  if (legacy.includes(pat)) errors.push(`legacy istemci otorite alanı kabul ediliyor: ${pat}`);
}

const REQUIRED_LEGACY_SERVER_CHECKS = [
  "requireUser",
  "assertSessionOwner",
  "evaluateSealEntitlement",
  "recomputePcf",
  "db.runTransaction",
  "buildPcfPackage",
];
for (const pat of REQUIRED_LEGACY_SERVER_CHECKS) {
  if (!legacy.includes(pat)) errors.push(`legacy sunucu otorite kontrolü eksik: ${pat}`);
}

// Eski /api/seal CBAM için kapalı kalır; yeni v2 yalnız /api/cbam altında çalışır.
if (!legacy.includes("CBAM_SEAL_PACKAGE_V2_READY = false")) errors.push("legacy CBAM seal bayrağı false değil");
if (!legacy.includes('workflowType === "cbam"')) errors.push("legacy CBAM workflow engeli eksik");

const REQUIRED_CBAM_V2 = [
  "requireUser",
  "loadOwnedSession",
  "calculateSkdmLiability",
  "createSealedAuditPackage",
  "evaluateSealEntitlement",
  "db.runTransaction",
  "isRealDataUsed",
  'emissionDataQuality !== "dogrudan-olcum"',
  "private/cbam-packages/",
  "ownerUid",
  "entitlementSuspended",
  "paymentStatus === \"refunded\"",
  "MAX_ZIP_BYTES",
];
for (const pat of REQUIRED_CBAM_V2) {
  if (!cbam.includes(pat)) errors.push(`CBAM v2 trust-boundary kontrolü eksik: ${pat}`);
}

// Body allowlist yalnız session + Paddle transaction + workflowType olmalı.
for (const forbidden of ["masterHash", "manifesto", "files", "readinessScore", "resultStatus", "packageId", "packageType", "canonicalInput", "result"]) {
  if (cbam.includes(`body.${forbidden}`)) errors.push(`CBAM v2 istemciden otorite alanı okuyor: body.${forbidden}`);
}
if (!cbam.includes('new Set(["sessionId", "paddleTransactionId", "workflowType"])')) {
  errors.push("CBAM v2 body allowlist eksik/değişmiş");
}
if (!cbam.includes("unexpected.length")) errors.push("CBAM v2 beklenmeyen body alanlarını reddetmiyor");

// Route ve export zinciri yanlışlıkla düşürülemez.
if (!firebase.includes('"source": "/api/cbam/**"') || !firebase.includes('"functionId": "cbamApiV2"')) {
  errors.push("Firebase CBAM v2 rewrite eksik");
}
if (!main.includes("cbamApiV2")) errors.push("functions/main.js CBAM v2 export eksik");

if (errors.length > 0) {
  console.error("assert-api-trust-boundary: FAIL");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("assert-api-trust-boundary: PASS — legacy CBAM kapalı, v2 server-authoritative zincir doğrulandı");
