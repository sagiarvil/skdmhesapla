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

const backend = read("functions/maritime-backend-v2.js");
const main = read("functions/main.js");
const firebase = JSON.parse(read("firebase.json"));
const firestoreRules = read("firestore.rules");
const storageRules = read("storage.rules");
const bridge = read("src/components/maritime/MaritimePreparationEnterpriseBridge.tsx");
const proxy = read("src/components/maritime/MaritimePreparationWorkbench.tsx");
const client = read("src/lib/maritime/backend-client.ts");

// Server identity / trust boundary
assert(backend.includes("verifyIdToken(m[1].trim(), true)"), "Firebase ID token checkRevoked=true zorunlu");
assert(backend.includes("REGISTERED_USER_REQUIRED"), "anonymous kullanıcı kalıcı denizcilik dosyasına girememeli");
assert(!backend.includes("ownerUid: req.body") && !backend.includes("uid: req.body"), "owner/uid request body otoritesi olamaz");
assert(backend.includes("expectedRevision") && backend.includes("REVISION_CONFLICT"), "optimistic concurrency + fail-closed conflict gerekli");
assert(backend.includes("activeSyncId") && backend.includes("syncId"), "atomik aktif sync görünürlüğü gerekli");
assert(backend.includes("canonicalHash") && backend.includes("sha256"), "deterministik SHA-256 veri/snapshot hash zinciri gerekli");
assert(backend.includes("auditEvents") && backend.includes("versions"), "immutable version + audit zinciri gerekli");
assert(backend.includes("automaticPurge: false"), "regulatory retention kayıtları otomatik silinmemeli");
assert(backend.includes("fuelEuMinimumYears: 5"), "FuelEU supporting information minimum 5 yıl retention metadata gerekli");
assert(!/path\s*===\s*["']\/delete/.test(backend), "compliance hard-delete API bulunmamalı");

// RBAC
for (const role of ["owner", "admin", "compliance_manager", "editor", "viewer"]) {
  assert(backend.includes(`\"${role}\"`), `RBAC role eksik: ${role}`);
}
assert(backend.includes("LOCK_ROLES") && backend.includes("ADMIN_ROLES"), "lock/member ayrı yetki kapıları gerekli");

// Firebase routing and export
assert(main.includes("maritimeApi: maritimeExports.maritimeApi"), "maritimeApi function export edilmeli");
const rewrites = firebase.hosting?.rewrites || [];
const maritimeIndex = rewrites.findIndex((x) => x.source === "/api/maritime/**" && x.function?.functionId === "maritimeApi");
const genericIndex = rewrites.findIndex((x) => x.source === "/api/**" && x.function?.functionId === "api");
assert(maritimeIndex >= 0, "/api/maritime/** rewrite eksik");
assert(genericIndex >= 0 && maritimeIndex < genericIndex, "maritime rewrite generic /api/** öncesinde olmalı");
assert(firebase.firestore?.rules === "firestore.rules", "Firestore rules deploy config eksik");
assert(firebase.storage?.rules === "storage.rules", "Storage rules deploy config eksik");

// Direct browser access to maritime authority must be closed
assert(firestoreRules.includes("match /maritimeUserHomes/{uid} { allow read, write: if false; }"), "maritimeUserHomes direct client access kapalı olmalı");
assert(firestoreRules.includes("match /companies/{companyId}"), "companies security boundary eksik");
assert(firestoreRules.includes("match /{document=**} { allow read, write: if false; }"), "Firestore fail-closed wildcard eksik");
assert(storageRules.includes("match /maritime-evidence/{allPaths=**}"), "maritime evidence private namespace eksik");
assert(storageRules.includes("allow read, write: if false"), "Storage browser access fail-closed olmalı");

// Client must use authenticated API; localStorage may exist only behind the enterprise bridge as recovery cache.
assert(client.includes("user.getIdToken()"), "maritime client Firebase Bearer ID token kullanmalı");
assert(client.includes("expectedRevision"), "client revision precondition göndermeli");
assert(proxy.includes("MaritimePreparationEnterpriseBridge"), "production workbench enterprise bridge üzerinden açılmalı");
assert(bridge.includes("loadMaritimeWorkspace") && bridge.includes("saveMaritimeFile"), "enterprise bridge server load/save kullanmalı");
assert(bridge.includes("REVISION_CONFLICT") && bridge.includes("reloadMaritimeFile"), "client silent overwrite yerine server conflict restore yapmalı");
assert(bridge.includes("server sürümü browser cache'i üzerine") || bridge.includes("server sürümü"), "server-authority migration açıklaması korunmalı");

console.log("MARITIME ENTERPRISE BACKEND GATE PASS");
