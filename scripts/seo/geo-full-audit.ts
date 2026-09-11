import { execFileSync } from "node:child_process";
import path from "node:path";

const ROOT = process.cwd();

function run(label: string, command: string, args: string[]) {
  console.log(`\n=== ${label} ===`);
  execFileSync(command, args, { cwd: ROOT, stdio: "inherit" });
}

console.log("=== Starting GEO Full Audit ===");

try {
  run("Regulatory consistency", "npx", ["tsx", path.join(ROOT, "scripts/seo/validate-regulatory-consistency.ts")]);
  run("SEO full audit", "node", [path.join(ROOT, "scripts/seo/full-audit.mjs")]);
  run("AI validators", "node", [path.join(ROOT, "scripts/seo/ai-audit.mjs")]);
  run("Schema parity", "npx", ["tsx", path.join(ROOT, "scripts/seo/validate-schema-parity.ts")]);
  run("Dark Pool & Black Box Telemetry (6 Vectors)", "npx", ["tsx", path.join(ROOT, "scripts/seo/dark-pool-telemetry.ts")]);
  run("MANDATE G0-G15 Quality Gates", "npx", ["tsx", path.join(ROOT, "scripts/ci-quality-gates.ts")]);
  run("18-Engine V3.0 Audit (129 Weight Matrix)", "npx", ["tsx", path.join(ROOT, "scripts/seo/engine-v3-audit.ts")]);
  run("30-File Deterministic Delivery Package (STORE CRC-32)", "npx", ["tsx", path.join(ROOT, "scripts/seo/generate-mandate-package.ts")]);

  console.log("\n=== GEO Full Audit Passed (%100 Başarı) ===");
} catch (error) {
  console.error("\n=== GEO Full Audit Failed ===");
  if (error instanceof Error) console.error(error.message);
  process.exit(1);
}
