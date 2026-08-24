#!/usr/bin/env node
/**
 * release-gate-v8 — yayın öncesi V8 kapı zinciri.
 * Mevzuat zinciri SSOT → motor/reference-data → kullanıcı ekranı → status
 * ayrışamaz; implementation contract kanıtı olmadan IMPLEMENTED kabul edilmez.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const steps = [
  ["regulatory-ssot", "node scripts/seo/validate-regulatory-ssot.mjs"],
  ["regulatory-chain", "node scripts/seo/validate-regulatory-chain.mjs"],
  ["regulatory-links", "node scripts/seo/validate-regulatory-links.mjs"],
  ["verification-workflow", "node scripts/seo/validate-verification-workflow.mjs"],
  ["build:functions-core", "npm run build:functions-core"],
  ["test:security:v8", "npm run test:security:v8"],
  ["trust-boundary", "node scripts/assert-api-trust-boundary.mjs"],
  ["synthetic-seal", "node scripts/assert-no-synthetic-seal-data.mjs"],
  ["rm-authority", "node scripts/assert-rm-authority.mjs"],
  ["payment-seal", "npm run test:payment-seal"],
];

for (const [name, cmd] of steps) {
  console.log(`\n[release-gate:v8] ${name}`);
  try {
    execFileSync(cmd, { cwd: root, stdio: "inherit", shell: true });
  } catch {
    console.error(`[release-gate:v8] DURDU — ${name} başarısız`);
    process.exit(1);
  }
}
console.log("\nrelease-gate:v8: PASS");
