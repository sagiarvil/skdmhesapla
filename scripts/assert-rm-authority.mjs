#!/usr/bin/env node
/**
 * assert-rm-authority — Gate 1 (RM otorite).
 * RM-001…004 dosyaları resmî hesaplama otoritesinin tek doğruluk kaynağıdır.
 * - CBAM seal kapalıysa: eksik RM kaydı uyarıdır, yayın engellenmez.
 * - CBAM seal açıksa: RM dosyaları + sabit hash kaydı olmadan yayın DURDURULUR.
 * Kütük: docs/audit/RM_AUTHORITY_HASHES.json
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RM_FILES = [
  "docs/RM-001-veri-modeli.md",
  "docs/RM-002-ux.md",
  "docs/RM-003-hesaplama-motoru.md",
  "docs/RM-004-alan-haritasi.md",
];
const LEDGER = path.join(root, "docs/audit/RM_AUTHORITY_HASHES.json");

const fnSrc = fs.readFileSync(path.join(root, "functions/index.js"), "utf8");
const cbamSealEnabled = !fnSrc.includes("CBAM_SEAL_PACKAGE_V2_READY = false");

const missing = RM_FILES.filter((f) => !fs.existsSync(path.join(root, f)));
const hashes = {};
for (const f of RM_FILES) {
  if (fs.existsSync(path.join(root, f))) {
    hashes[f] = crypto.createHash("sha256").update(fs.readFileSync(path.join(root, f))).digest("hex");
  }
}
fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
fs.writeFileSync(LEDGER, JSON.stringify({ generatedAt: new Date().toISOString(), hashes, cbamSealEnabled }, null, 2));

if (cbamSealEnabled) {
  if (missing.length > 0) {
    console.error("assert-rm-authority: FAIL — CBAM seal açık ama RM otorite dosyaları eksik:");
    for (const f of missing) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log("assert-rm-authority: PASS (CBAM seal açık + RM otorite tam)");
} else {
  if (missing.length > 0) {
    console.log(`assert-rm-authority: WARN — CBAM seal kapalı; eksik RM otorite dosyaları (${missing.join(", ")}). Yayın engellenmedi.`);
  } else {
    console.log("assert-rm-authority: PASS (RM otorite tam)");
  }
}
