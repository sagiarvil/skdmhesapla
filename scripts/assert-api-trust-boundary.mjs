#!/usr/bin/env node
/**
 * assert-api-trust-boundary — Gate 2.
 * Sunucu API'si istemci-otorite alanlarından karar üretemez; kimlik token'dan
 * türetilir, paket/hash/manifest/readiness istemciden kabul edilmez.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = fs.readFileSync(path.join(root, "functions/index.js"), "utf8");
const errors = [];

// Yalnız belirlenmiş istemci kimlik alanları kabul edilir.
const FORBIDDEN_CLIENT_AUTHORITY = [
  "body.masterHash",
  "body.manifesto",
  "body.files",
  "body.readinessScore",
  "body.resultStatus",
  "body.packageId",
  "body.packageType",
  "body.ownerUid",
];
for (const pat of FORBIDDEN_CLIENT_AUTHORITY) {
  if (src.includes(pat)) errors.push(`istemci otorite alanı kabul ediliyor: ${pat}`);
}

// Sunucu otorite zinciri zorunlu çağrılar.
const REQUIRED_SERVER_CHECKS = [
  "requireUser",
  "assertSessionOwner",
  "evaluateSealEntitlement",
  "recomputePcf",
  "db.runTransaction",
  "buildPcfPackage",
];
for (const pat of REQUIRED_SERVER_CHECKS) {
  if (!src.includes(pat)) errors.push(`sunucu otorite kontrolü eksik: ${pat}`);
}

// CBAM seal fail-closed olmalı.
if (!src.includes("CBAM_SEAL_PACKAGE_V2_READY = false")) {
  errors.push("CBAM seal bayrağı false değil");
}
if (!src.includes('workflowType === "cbam"')) {
  errors.push("CBAM workflow kontrolü eksik");
}

if (errors.length > 0) {
  console.error("assert-api-trust-boundary: FAIL");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("assert-api-trust-boundary: PASS");
