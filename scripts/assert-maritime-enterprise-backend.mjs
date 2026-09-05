#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const assert = (condition, message) => {
  if (!condition) {
    console.error(`MARITIME ENTERPRISE GATE FAIL: ${message}`);
    process.exit(1);
  }
};

const backendLegacy = read("functions/maritime-backend-v2.js");
const backendStrict = read("functions/maritime-backend-v3.js");
const auditCore = read("functions/maritime-compliance-audit-v1.js");
const commerceStrict = read("functions/maritime-commerce-v2.js");
const main = read("functions/main.js");
const registry = JSON.parse(read("data/maritime/evidence-registry.json"));
const firebase = JSON.parse(read("firebase.json"));
const firestoreRules = read("firestore.rules");
const storageRules = read("storage.rules");
const bridge = read("src/components/maritime/MaritimePreparationEnterpriseBridge.tsx");
const proxy = read("src/components/maritime/MaritimePreparationWorkbench.tsx");
const client = read("src/lib/maritime/backend-client.ts");
const calculator = read("src/lib/maritime/calculator.ts");
const regulatory = read("src/lib/maritime/regulatory.ts");

// Existing server identity / trust boundary remains authoritative.
assert(backendLegacy.includes("verifyIdToken(m[1].trim(), true)"), "Firebase ID token checkRevoked=true zorunlu");
assert(backendLegacy.includes("REGISTERED_USER_REQUIRED"), "anonymous kullanıcı kalıcı denizcilik dosyasına girememeli");
assert(!backendLegacy.includes("ownerUid: req.body") && !backendLegacy.includes("uid: req.body"), "owner/uid request body otoritesi olamaz");
assert(backendLegacy.includes("expectedRevision") && backendLegacy.includes("REVISION_CONFLICT"), "optimistic concurrency + fail-closed conflict gerekli");
assert(backendLegacy.includes("activeSyncId") && backendLegacy.includes("syncId"), "atomik aktif sync görünürlüğü gerekli");
assert(backendLegacy.includes("canonicalHash") && backendLegacy.includes("sha256"), "deterministik SHA-256 veri/snapshot hash zinciri gerekli");
assert(backendLegacy.includes("auditEvents") && backendLegacy.includes("versions"), "immutable version + audit zinciri gerekli");
assert(backendLegacy.includes("automaticPurge: false"), "regulatory retention kayıtları otomatik silinmemeli");
assert(backendLegacy.includes("fuelEuMinimumYears: 5"), "FuelEU supporting information minimum 5 yıl retention metadata gerekli");
assert(!/path\s*===\s*["']\/delete/.test(backendLegacy), "compliance hard-delete API bulunmamalı");

// Strict wrapper must be the production export and must fail closed before checkpoint/lock/payment.
assert(main.includes('require("./maritime-backend-v3.js")'), "production maritime API strict v3 wrapper kullanmalı");
assert(main.includes('require("./maritime-commerce-v2.js")'), "production maritime commerce strict v2 wrapper kullanmalı");
assert(backendStrict.includes("STRICT_READINESS_BLOCKED") && backendStrict.includes("auditPreparationFile"), "checkpoint/lock strict audit kapısı gerekli");
assert(commerceStrict.includes("STRICT_READINESS_BLOCKED") && commerceStrict.includes("auditCheckpoint"), "payment intent strict snapshot audit kapısı gerekli");
assert(commerceStrict.includes("EVIDENCE_SNAPSHOT_STALE"), "checkpoint sonrası kanıt değişikliği yeni checkpoint zorunlu kılmalı");
assert(auditCore.includes('score: ready ? 100 : Math.min(49'), "blocking bulunan dosya 49/100 üzeri görünmemeli");
assert(auditCore.includes("validImoNumber") && auditCore.includes("ship-registry") && auditCore.includes("tonnage-certificate"), "BLOCK-0 gemi kimliği primary-evidence gate gerekli");
assert(auditCore.includes("Annual fuel reconciliation"), "voyage↔fuel register yıllık mutabakat gate gerekli");
assert(auditCore.includes("entered energy must reconcile to quantity × LCV"), "fuel energy mass×LCV mutabakat gate gerekli");
assert(auditCore.includes("WtW comparator must reconcile"), "FuelEU WtW source-factor mutabakat gate gerekli");
assert(auditCore.includes("union-registry-moha") && auditCore.includes("administering-authority"), "EU ETS authority/MOHA primary-evidence gate gerekli");
assert(auditCore.includes("verifier-accreditation"), "verifier accreditation evidence gate gerekli");

// Regulatory/calc invariants.
assert(regulatory.includes("Article 20") && regulatory.includes("Article 21") && regulatory.includes("Article 22"), "FuelEU Articles 20/21/22 mapping gerekli");
assert(regulatory.includes("CH4: 28") && regulatory.includes("N2O: 265"), "FuelEU Annex I GWP100 authority 28/265 olmalı");
assert(calculator.includes("mass * lcv"), "fuel mass×LCV canonical energy authority olmalı");
assert(!calculator.includes("if (item.wellToWakeEmissionsGco2e > 0) return"), "user-entered WtW total calculation authority olamaz");
assert(calculator.includes("fueleuComplianceBalanceGco2e"), "FuelEU compliance balance gCO2eq output gerekli");
assert(calculator.includes("totalReportedCo2Tonnes") && calculator.includes("totalReportedCo2eTonnes"), "MRV CO2 ile toplam GHG ayrı tutulmalı");

// Primary evidence catalog must expose all audit-critical document classes.
const keys = new Set(registry.map((x) => x.key));
for (const key of [
  "ship-registry", "tonnage-certificate", "company-registry", "administering-authority", "union-registry-moha",
  "verifier-accreditation", "monitoring-plan", "voyage-list", "port-call-register", "rob-register", "logbook", "bdn", "distance-time", "factors",
]) assert(keys.has(key), `evidence registry critical key eksik: ${key}`);

// RBAC.
for (const role of ["owner", "admin", "compliance_manager", "editor", "viewer"]) {
  assert(backendLegacy.includes(`\"${role}\"`), `RBAC role eksik: ${role}`);
}
assert(backendLegacy.includes("LOCK_ROLES") && backendLegacy.includes("ADMIN_ROLES"), "lock/member ayrı yetki kapıları gerekli");

// Firebase routing and export.
assert(main.includes("maritimeApi: maritimeExports.maritimeApi"), "maritimeApi function export edilmeli");
const rewrites = firebase.hosting?.rewrites || [];
const maritimeIndex = rewrites.findIndex((x) => x.source === "/api/maritime/**" && x.function?.functionId === "maritimeApi");
const genericIndex = rewrites.findIndex((x) => x.source === "/api/**" && x.function?.functionId === "api");
assert(maritimeIndex >= 0, "/api/maritime/** rewrite eksik");
assert(genericIndex >= 0 && maritimeIndex < genericIndex, "maritime rewrite generic /api/** öncesinde olmalı");
assert(firebase.firestore?.rules === "firestore.rules", "Firestore rules deploy config eksik");
assert(firebase.storage?.rules === "storage.rules", "Storage rules deploy config eksik");

// Direct browser access to maritime authority must be closed.
assert(firestoreRules.includes("match /maritimeUserHomes/{uid} { allow read, write: if false; }"), "maritimeUserHomes direct client access kapalı olmalı");
assert(firestoreRules.includes("match /companies/{companyId}"), "companies security boundary eksik");
assert(firestoreRules.includes("match /{document=**} { allow read, write: if false; }"), "Firestore fail-closed wildcard eksik");
assert(storageRules.includes("match /maritime-evidence/{allPaths=**}"), "maritime evidence private namespace eksik");
assert(storageRules.includes("allow read, write: if false"), "Storage browser access fail-closed olmalı");

// Client uses authenticated API; localStorage is recovery only.
assert(client.includes("user.getIdToken()"), "maritime client Firebase Bearer ID token kullanmalı");
assert(client.includes("expectedRevision"), "client revision precondition göndermeli");
assert(proxy.includes("MaritimePreparationEnterpriseBridge"), "production workbench enterprise bridge üzerinden açılmalı");
assert(bridge.includes("loadMaritimeWorkspace") && bridge.includes("saveMaritimeFile"), "enterprise bridge server load/save kullanmalı");
assert(bridge.includes("REVISION_CONFLICT") && bridge.includes("reloadMaritimeFile"), "client silent overwrite yerine server conflict restore yapmalı");
assert(bridge.includes("response.fileState?.file") && bridge.includes("localStorage.setItem(RECOVERY_KEY, serialized)"), "server file browser recovery cache üzerine bootstrap edilmeli");
assert(bridge.includes("lastSavedPayloadRef.current = serialized"), "server bootstrap sonrası recovery cache yanlışlıkla yeniden yazılmamalı");

console.log("MARITIME ENTERPRISE BACKEND GATE PASS");
