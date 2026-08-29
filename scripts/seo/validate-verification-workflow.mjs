#!/usr/bin/env node
import fs from "node:fs";

const read = (p) => fs.readFileSync(p, "utf8");
const fail = (message) => {
  console.error(`VERIFICATION WORKFLOW FAIL: ${message}`);
  process.exitCode = 1;
};

const workflow = read("src/lib/skdm/verification-workflow.ts");
const calculator = read("src/lib/skdm/calculator.ts");
const calculatorPage = read("src/app/hesapla/[sector]/page.tsx");
const notice = read("src/components/regulatory/VerificationGuidanceNotice.tsx");
const regulatory = read("data/seo/regulatory-updates.json");

for (const required of [
  'version: "2026-08-28.1"',
  'registryAccessFrom: "2026-09-01"',
  'verificationReportsFrom: "2027-01"',
  'declarantsManualPublishedAt: "2026-08-21"',
  'calculationImpact: "NONE"',
  "iki ay içinde",
  "10 Ağustos 2026 corrected default values",
  "NCA akreditasyon kontrolü",
]) {
  if (!workflow.includes(required)) fail(`workflow SSOT missing: ${required}`);
}

// Operasyon rehberi hesaplama formülüne sızmamalı. Hesap motoru workflow SSOT'u import etmez.
if (calculator.includes("verification-workflow")) {
  fail("calculator.ts must not import operational verification workflow; formula and workflow stay versioned separately");
}

for (const required of [
  "skdm-calculation-regulatory-context",
  "calculationRulesetVersion",
  "verificationWorkflowVersion",
  "calculationImpact",
]) {
  if (!calculatorPage.includes(required)) fail(`Kademe A calculation context missing: ${required}`);
}

if (!notice.includes("CBAM Registry / 21 Ağustos manual")) fail("Registry manual reference missing from visible notice");
if (!regulatory.includes("cbam-verifier-registry-erisim-proseduru-28-agustos-2026")) fail("28 August verifier registry access procedure update missing");
if (!regulatory.includes("cbam-accreditation-guidance-2026")) fail("24 August regulatory update missing");
if (!regulatory.includes("cbam-registry-declarants-portal-21-agustos-2026")) fail("21 August declarants portal update missing");
if (!regulatory.includes("duzeltilmis-varsayilan-degerler-10-agustos-2026")) fail("10 August corrected defaults update missing");

if (process.exitCode) process.exit(process.exitCode);
console.log("VERIFICATION WORKFLOW PASS — 24/28 Aug guidance & procedure, 1 Sep Registry, 21 Aug manual, Jan 2027 reports; calculation impact NONE.");
