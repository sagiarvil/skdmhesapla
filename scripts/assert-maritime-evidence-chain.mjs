#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const fail = (msg) => { console.error(`MARITIME EVIDENCE GATE FAIL: ${msg}`); process.exit(1); };
const ok = (cond, msg) => { if (!cond) fail(msg); };

const evidenceApi = read("functions/maritime-evidence-v3.js");
const evidenceCore = read("functions/maritime-evidence-core.js");
const backend = read("functions/maritime-backend-v2.js");
const main = read("functions/main.js");
const firebase = JSON.parse(read("firebase.json"));
const storageRules = read("storage.rules");
const client = read("src/lib/maritime/evidence-client.ts");
const vault = read("src/components/maritime/MaritimeEvidenceVault.tsx");
const workbench = read("src/components/maritime/MaritimePreparationWorkbenchV2.tsx");
const registry = JSON.parse(read("data/maritime/evidence-registry.json"));

ok(evidenceApi.includes("verifyIdToken(match[1].trim(), true)"), "ID token revocation check required");
ok(evidenceApi.includes("REGISTERED_USER_REQUIRED"), "anonymous persistent evidence must be rejected");
ok(evidenceApi.includes("WRITE_ROLES") && evidenceApi.includes("READ_ROLES"), "evidence RBAC required");
ok(evidenceApi.includes("chunkHash = sha256(body)"), "each uploaded chunk must be server-hashed");
ok(evidenceApi.includes("crypto.createHash(\"sha256\")"), "final document must be server-hashed");
ok(evidenceApi.includes("validateMagic"), "MIME/extension alone is insufficient; signature check required");
ok(evidenceApi.includes("storageGeneration") && evidenceApi.includes("crc32c") && evidenceApi.includes("md5Hash"), "Storage integrity metadata required");
ok(evidenceApi.includes("previousEvidenceChainHash") && evidenceApi.includes("evidenceChainHash"), "tamper-evident chain-of-custody required");
ok(evidenceApi.includes("supportRevision") && evidenceApi.includes("supportDataHash"), "evidence must bind to calculation input revision/hash");
ok(evidenceApi.includes("linkedVoyageIds") && evidenceApi.includes("linkedFuelIds"), "evidence must link to supporting voyage/fuel records");
ok(evidenceApi.includes("supports"), "calculation/data support mapping required");
ok(evidenceApi.includes("documentDate") && evidenceApi.includes("sourceName") && evidenceApi.includes("sourceReference"), "date/source/reference metadata required");
ok(!/pathName\s*===\s*["']\/delete/.test(evidenceApi) && !/\/documents\/[^\n]+\/delete/.test(evidenceApi), "hard-delete endpoint prohibited");

ok(evidenceCore.includes("MAX_FILE_BYTES = 200 * 1024 * 1024"), "bounded evidence size required");
ok(evidenceCore.includes("CHUNK_BYTES = 4 * 1024 * 1024"), "bounded chunk size required");
ok(evidenceCore.includes("fuelEuMinimumYears: 5"), "FuelEU five-year retention metadata required");
ok(evidenceCore.includes("automaticPurge: false") && evidenceCore.includes("hardDeleteApi: false"), "automatic purge/hard delete prohibited");
ok(evidenceCore.includes("legalHoldSupported: true"), "legal hold capability required");

for (const key of ["monitoring-plan","voyage-list","data-gaps","logbook","bdn","fuel-certificates","electricity","distance-time","factors","it-flow","calibration","flowmeter","energy-meters","tank-readings","direct-measurement","formal-mandate"]) {
  ok(registry.some((x) => x.key === key), `regulatory evidence type missing: ${key}`);
}
for (const item of registry) {
  ok(Array.isArray(item.legalBasis) && item.legalBasis.length > 0, `legal basis missing: ${item.key}`);
  ok(Array.isArray(item.defaultSupports) && item.defaultSupports.length > 0, `support mapping missing: ${item.key}`);
}

ok(main.includes("maritimeEvidenceApi: maritimeEvidenceExports.maritimeEvidenceApi"), "evidence Cloud Function export missing");
const rewrites = firebase.hosting?.rewrites || [];
const evidenceRewrite = rewrites.findIndex((x) => x.source === "/api/maritime/evidence/**" && x.function?.functionId === "maritimeEvidenceApi");
const maritimeRewrite = rewrites.findIndex((x) => x.source === "/api/maritime/**" && x.function?.functionId === "maritimeApi");
ok(evidenceRewrite >= 0 && maritimeRewrite >= 0 && evidenceRewrite < maritimeRewrite, "evidence rewrite must precede generic maritime route");
ok(storageRules.includes("match /maritime-evidence/{allPaths=**}") && storageRules.includes("allow read, write: if false"), "direct browser Storage access must remain fail-closed");

ok(client.includes("user.getIdToken()"), "evidence client must authenticate every operation");
ok(client.includes("uploadChunkWithRetry") && client.includes("session.expectedChunks"), "chunked resumable-like upload client required");
ok(vault.includes("Belge tarihi") && vault.includes("Kaynak / düzenleyen") && vault.includes("Hangi hesaplama / veri zincirini destekliyor?"), "evidence metadata UI incomplete");
ok(vault.includes("Hash'i yeniden doğrula") && vault.includes("sha256:"), "integrity verification UI required");
ok(workbench.includes("<MaritimeEvidenceVault />"), "workbench must use binary evidence vault");
ok(!workbench.includes('<Check label={item.label} checked={Boolean(file.evidence[item.key])}'), "manual evidence checkbox authority still present");
ok(!workbench.includes('placeholder="Belge adı / DMS referansı / klasör yolu / hash"'), "legacy reference-only evidence UI still present");

ok(backend.includes("clean.evidence = {};"), "browser evidence flags must be stripped server-side");
ok(backend.includes("binaryEvidenceManifest(ctx)"), "server binary evidence manifest required");
ok(backend.includes("evidenceDocuments"), "backend lock must read finalized binary evidence");
ok(backend.includes("evidenceManifestHash") && backend.includes("evidenceChainHead"), "checkpoint/lock must bind evidence manifest and chain head");
ok(!backend.includes("REQUIRED_EVIDENCE.forEach(k=>req(file.evidence"), "client checkbox lock bypass remains");
ok(backend.includes("server-finalized binary kanıtlar"), "lock fail-closed evidence message missing");

console.log("MARITIME EVIDENCE CHAIN GATE PASS");
