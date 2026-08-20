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

  console.log("\n=== GEO Full Audit Passed ===");
} catch (error) {
  console.error("\n=== GEO Full Audit Failed ===");
  if (error instanceof Error) console.error(error.message);
  process.exit(1);
}
