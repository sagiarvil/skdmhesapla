#!/usr/bin/env node
/**
 * install-v8-package-scripts — V8 script'lerinin package.json'da hazır olduğunu doğrular.
 * Eksikse net hata verir; otomatik değil, yapılandırmayı korur.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const REQUIRED = [
  "build:functions-core",
  "test:security:v8",
  "test:governance:v8",
  "test:release:v8",
  "audit:public-contract:v8",
  "release:gate:v8",
];

const missing = REQUIRED.filter((s) => !pkg.scripts?.[s]);
if (missing.length > 0) {
  console.error("install-v8-package-scripts: EKSİK SCRIPT'LER:");
  for (const s of missing) console.error(`  - ${s}`);
  process.exit(1);
}
console.log("install-v8-package-scripts: PASS (6 script hazır)");
