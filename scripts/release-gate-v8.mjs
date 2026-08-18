#!/usr/bin/env node
/**
 * release-gate-v8 — yayın öncesi V8 kapı zinciri.
 * Sıra: functions-core derle → güvenlik testleri → trust boundary →
 * sentetik veri → RM otorite → imza kontrolü → manifest testleri.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const steps = [
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
