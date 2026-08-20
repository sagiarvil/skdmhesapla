import { execSync } from 'child_process';
import * as path from 'path';

const ROOT = process.cwd();

console.log("=== Starting GEO Full Audit ===");

try {
  // 1. Run the existing full audit
  console.log("Running SEO full audit...");
  execSync(`node ${path.join(ROOT, 'scripts/seo/full-audit.mjs')}`, { stdio: 'inherit' });

  // 2. Run the AI audit
  console.log("Running AI validators...");
  execSync(`node ${path.join(ROOT, 'scripts/seo/ai-audit.mjs')}`, { stdio: 'inherit' });

  // 3. Run Schema Parity
  console.log("Running Schema Parity validator...");
  execSync(`npx ts-node ${path.join(ROOT, 'scripts/seo/validate-schema-parity.ts')}`, { stdio: 'inherit' });

  console.log("=== GEO Full Audit Passed! ===");
} catch (error) {
  console.error("=== GEO Full Audit Failed! ===");
  process.exit(1);
}
