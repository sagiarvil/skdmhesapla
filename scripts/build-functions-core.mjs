#!/usr/bin/env node
/**
 * build:functions-core — PCF ve CBAM hesaplama/paketleme çekirdeğini Functions'a (CJS) derler.
 * Sunucu-otorite mühür zincirinin runtime gereksinimidir.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "functions", "pcf-core");

const requiredModules = [
  "pcf/calculator.js",
  "pcf/package-seal.js",
  "pcf/report.js",
  "pcf/types.js",
  "pcf/policy.js",
  "pcf/quality.js",
  "pcf/factors.js",
  "pcf/factor-registry.js",
  "pcf/factor-resolver.js",
  "pcf/package-manifest.js",
  "skdm/seal-binary.js",
];

execFileSync(
  "npx",
  ["tsc", "-p", "tsconfig.functions-core.json"],
  { cwd: root, stdio: "inherit" },
);

const missing = requiredModules.filter((m) => !fs.existsSync(path.join(outDir, m)));
if (missing.length > 0) {
  console.error(`build:functions-core EKSIK MODÜL: ${missing.join(", ")}`);
  process.exit(1);
}

const check = [];
function collect(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(p);
    else if (entry.name.endsWith(".js")) check.push(p);
  }
}
collect(outDir);
for (const file of check) {
  execFileSync("node", ["--check", file], { cwd: root, stdio: "inherit" });
}
console.log(`build:functions-core PASS — ${check.length} modül derlendi (${outDir})`);

// ─────────────────────────────────────────────────────────────
// SKDM server-authoritative calculator + package core
// ─────────────────────────────────────────────────────────────

const skdmOutDir = path.join(root, "functions", "skdm-core");

execFileSync(
  "npx",
  ["tsc", "-p", "tsconfig.functions-skdm-core.json"],
  { cwd: root, stdio: "inherit" },
);

const skdmRequired = [
  "calculator.js",
  "config.js",
  "audit.js",
  "fuel-emission-factors.js",
  "package-seal.js",
  "package-manifest.js",
  "seal-binary.js",
  "registerValidation.js",
  "qc.js",
  "annex-ruleset.js",
];

const skdmMissing = skdmRequired.filter(
  (m) => !fs.existsSync(path.join(skdmOutDir, m))
);

if (skdmMissing.length > 0) {
  console.error(
    `build:functions-core SKDM EKSIK MODÜL: ${skdmMissing.join(", ")}`
  );
  process.exit(1);
}

for (const file of skdmRequired) {
  execFileSync(
    "node",
    ["--check", path.join(skdmOutDir, file)],
    { cwd: root, stdio: "inherit" },
  );
}

console.log(
  `build:functions-core SKDM PASS — ${skdmRequired.length} kritik modül derlendi (${skdmOutDir})`
);

// Copy data/skdm to functions/data/skdm for production runtime parity
const srcDataDir = path.join(root, "data/skdm");
const destDataDir = path.join(root, "functions/data/skdm");
fs.mkdirSync(destDataDir, { recursive: true });
for (const file of fs.readdirSync(srcDataDir)) {
  if (file.endsWith(".json")) {
    fs.copyFileSync(path.join(srcDataDir, file), path.join(destDataDir, file));
  }
}

// Rewrite relative require paths in compiled functions/skdm-core to resolve correctly inside functions/
const pdfReportJs = path.join(skdmOutDir, "pdf/kapsamliDurumRaporu.js");
if (fs.existsSync(pdfReportJs)) {
  let content = fs.readFileSync(pdfReportJs, "utf8");
  content = content.replace(
    /require\("\.\.\/\.\.\/\.\.\/\.\.\/data\/skdm\/parameters-cn-codes\.json"\)/g,
    'require("../../data/skdm/parameters-cn-codes.json")'
  );
  fs.writeFileSync(pdfReportJs, content, "utf8");
}
