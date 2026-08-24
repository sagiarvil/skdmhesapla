#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const updatesPath = path.join(ROOT, "data/seo/regulatory-updates.json");
const contractsPath = path.join(ROOT, "data/seo/regulatory-implementation.json");

const updatesRaw = JSON.parse(fs.readFileSync(updatesPath, "utf8"));
const implementationRaw = JSON.parse(fs.readFileSync(contractsPath, "utf8"));
const approved = (updatesRaw.updates || []).filter((item) => item.publicationState === "APPROVED");
const contracts = implementationRaw.contracts || [];
const contractBySlug = new Map(contracts.map((item) => [item.slug, item]));

const validStatuses = new Set(["IMPLEMENTED", "ACTION_REQUIRED", "MONITORING"]);
const validImpact = new Set(["NONE", "WORKFLOW_ONLY", "REFERENCE_DATA", "METHODOLOGY_REVIEW"]);
const validLayerStates = new Set(["WIRED", "PARTIAL", "NOT_REQUIRED", "PENDING"]);
const errors = [];

if (implementationRaw.policy?.implementedRequiresAllEvidence !== true) {
  errors.push("implementation policy: implementedRequiresAllEvidence true olmalı");
}
if (implementationRaw.policy?.statusSource !== "implementation-contract") {
  errors.push("implementation policy: statusSource implementation-contract olmalı");
}

for (const item of approved) {
  const contract = contractBySlug.get(item.slug);
  if (!contract) {
    errors.push(`${item.slug}: APPROVED kayıt için implementation contract yok`);
    continue;
  }

  if (!validStatuses.has(contract.status)) errors.push(`${item.slug}: status geçersiz`);
  if (!validImpact.has(contract.calculationImpact)) errors.push(`${item.slug}: calculationImpact geçersiz`);
  if (!validLayerStates.has(contract.engineState)) errors.push(`${item.slug}: engineState geçersiz`);
  if (!validLayerStates.has(contract.uiState)) errors.push(`${item.slug}: uiState geçersiz`);
  if (!Array.isArray(contract.surfaces) || contract.surfaces.length === 0) errors.push(`${item.slug}: surfaces boş olamaz`);
  if (!Array.isArray(contract.evidence) || contract.evidence.length === 0) errors.push(`${item.slug}: evidence boş olamaz`);
  if (!Array.isArray(contract.blockingGaps)) errors.push(`${item.slug}: blockingGaps dizi olmalı`);

  let evidenceComplete = true;
  for (const evidence of contract.evidence || []) {
    const evidencePath = path.join(ROOT, evidence.path || "");
    if (!evidence.path || !fs.existsSync(evidencePath)) {
      evidenceComplete = false;
      errors.push(`${item.slug}: evidence dosyası yok -> ${evidence.path || "<path-yok>"}`);
      continue;
    }
    const source = fs.readFileSync(evidencePath, "utf8");
    for (const marker of evidence.contains || []) {
      if (!source.includes(marker)) {
        evidenceComplete = false;
        errors.push(`${item.slug}: ${evidence.path} içinde kanıt marker yok -> ${marker}`);
      }
    }
  }

  if (contract.status === "IMPLEMENTED") {
    if (!evidenceComplete) errors.push(`${item.slug}: IMPLEMENTED fakat evidence eksik`);
    if ((contract.blockingGaps || []).length !== 0) errors.push(`${item.slug}: IMPLEMENTED fakat blockingGaps boş değil`);
    if (contract.uiState !== "WIRED") errors.push(`${item.slug}: IMPLEMENTED için uiState WIRED olmalı`);
    if (["REFERENCE_DATA", "METHODOLOGY_REVIEW"].includes(contract.calculationImpact) && contract.engineState !== "WIRED") {
      errors.push(`${item.slug}: hesap/reference-data etkili IMPLEMENTED kayıt için engineState WIRED olmalı`);
    }
    if (["NONE", "WORKFLOW_ONLY"].includes(contract.calculationImpact) && !["WIRED", "NOT_REQUIRED"].includes(contract.engineState)) {
      errors.push(`${item.slug}: workflow/no-calc IMPLEMENTED kayıt için engineState WIRED veya NOT_REQUIRED olmalı`);
    }
  }

  if (contract.status === "ACTION_REQUIRED" && (contract.blockingGaps || []).length === 0) {
    errors.push(`${item.slug}: ACTION_REQUIRED ise en az bir blockingGap açıklanmalı`);
  }
}

for (const contract of contracts) {
  if (!approved.some((item) => item.slug === contract.slug)) {
    errors.push(`${contract.slug}: orphan implementation contract (APPROVED mevzuat kaydı yok)`);
  }
}

// UI runtime'ın status'u implementation contract'tan türettiğini doğrula.
const runtimeFile = path.join(ROOT, "src/lib/skdm/regulatory-updates.ts");
const runtime = fs.readFileSync(runtimeFile, "utf8");
for (const marker of [
  "regulatory-implementation.json",
  "productStatus: implementation.status",
  "implementationBySlug",
]) {
  if (!runtime.includes(marker)) errors.push(`runtime status bağlama marker eksik: ${marker}`);
}

// Detay sayfası kullanıcıya gerçek implementation durumunu görünür kılmalı.
const detailPage = path.join(ROOT, "src/app/mevzuat-guncellemeleri/[slug]/page.tsx");
const detail = fs.readFileSync(detailPage, "utf8");
for (const marker of ["item.implementation", "blockingGaps", "calculationImpact", "engineState", "uiState"]) {
  if (!detail.includes(marker)) errors.push(`regulatory detail UI marker eksik: ${marker}`);
}

if (errors.length) {
  console.error(`REGULATORY CHAIN FAIL (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const implemented = contracts.filter((item) => item.status === "IMPLEMENTED").length;
const actionRequired = contracts.filter((item) => item.status === "ACTION_REQUIRED").length;
console.log(`REGULATORY CHAIN PASS — ${approved.length} APPROVED / ${implemented} IMPLEMENTED / ${actionRequired} ACTION_REQUIRED`);
