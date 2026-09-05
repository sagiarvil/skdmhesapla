#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "functions/maritime-backend-v2.js");
let src = fs.readFileSync(target, "utf8");
let changed = false;

function replaceOnce(from, to, label) {
  if (src.includes(to)) return;
  const count = src.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly one anchor, got ${count}`);
  src = src.replace(from, to);
  changed = true;
}

replaceOnce(
  'const REQUIRED_EVIDENCE = ["monitoring-plan", "voyage-list", "data-gaps", "logbook", "bdn", "fuel-certificates", "distance-time", "factors"];',
  'const CORE_BINARY_EVIDENCE = ["monitoring-plan", "voyage-list", "logbook", "distance-time", "factors"];',
  "binary evidence constant",
);

replaceOnce(
`  clean.evidence = clean.evidence && typeof clean.evidence === "object" && !Array.isArray(clean.evidence) ? clean.evidence : {};
  clean.evidenceReferences = clean.evidenceReferences && typeof clean.evidenceReferences === "object" && !Array.isArray(clean.evidenceReferences) ? clean.evidenceReferences : {};
  if (Object.keys(clean.evidence).length > MAX_EVIDENCE || Object.keys(clean.evidenceReferences).length > MAX_EVIDENCE) throw httpError(413, "EVIDENCE_LIMIT", "Kanıt anahtarı sayısı sınırı aşıyor");`,
`  // Browser evidence flags/references are presentation cache only. Binary evidence authority
  // lives in immutable evidenceDocuments written by maritimeEvidenceApi.
  clean.evidence = {};
  clean.evidenceReferences = {};`,
  "client evidence authority removal",
);

replaceOnce(
`  const [v,f,e]=await Promise.all([
    yearRef(ctx).collection("voyages").where("syncId","==",y.activeSyncId).get(),
    yearRef(ctx).collection("fuels").where("syncId","==",y.activeSyncId).get(),
    yearRef(ctx).collection("evidence").where("syncId","==",y.activeSyncId).get(),
  ]);`,
`  const [v,f,e,binaryEvidence]=await Promise.all([
    yearRef(ctx).collection("voyages").where("syncId","==",y.activeSyncId).get(),
    yearRef(ctx).collection("fuels").where("syncId","==",y.activeSyncId).get(),
    yearRef(ctx).collection("evidence").where("syncId","==",y.activeSyncId).get(),
    yearRef(ctx).collection("evidenceDocuments").orderBy("finalizedAt","asc").get(),
  ]);`,
  "hydrate evidence query",
);

replaceOnce(
`  e.docs.forEach(d=>{const x=d.data();evidence[x.key]=x.present===true;if(x.reference) evidenceReferences[x.key]=x.reference;});`,
`  e.docs.forEach(d=>{const x=d.data();evidence[x.key]=x.present===true;if(x.reference) evidenceReferences[x.key]=x.reference;});
  // Server-finalized binary documents override every legacy/browser evidence flag.
  binaryEvidence.docs.forEach(d=>{const x=d.data();if(!x.documentType||!x.sha256||!x.evidenceChainHash)return;evidence[x.documentType]=true;evidenceReferences[x.documentType]=\`${'${x.evidenceId}'} · sha256:${'${x.sha256}'}\`;});`,
  "hydrate binary evidence overlay",
);

const readinessStart = `function readiness(file) {
  const missing=[]; const req=(ok,label)=>{if(!ok)missing.push(label);}; const c=file.company||{},s=file.ship||{},m=file.monitoring||{};`;
const readinessReplacement = `async function binaryEvidenceManifest(ctx) {
  const [docsSnap, yearSnap] = await Promise.all([
    yearRef(ctx).collection("evidenceDocuments").orderBy("finalizedAt", "asc").get(),
    yearRef(ctx).get(),
  ]);
  const docs = docsSnap.docs.map((d) => d.data()).filter((x) => x && x.immutable === true && x.sha256 && x.evidenceChainHash && x.documentType);
  const coverage = {};
  for (const doc of docs) coverage[doc.documentType] = Number(coverage[doc.documentType] || 0) + 1;
  const manifestHash = canonicalHash(docs.map((doc) => ({
    evidenceId: doc.evidenceId,
    documentType: doc.documentType,
    sha256: doc.sha256,
    evidenceChainHash: doc.evidenceChainHash,
    supports: Array.isArray(doc.supports) ? doc.supports : [],
    linkedVoyageIds: Array.isArray(doc.linkedVoyageIds) ? doc.linkedVoyageIds : [],
    linkedFuelIds: Array.isArray(doc.linkedFuelIds) ? doc.linkedFuelIds : [],
  })));
  return { docs, coverage, manifestHash, chainHead: yearSnap.data()?.evidenceChainHead || null };
}

function readiness(file, binaryEvidence) {
  const missing=[]; const req=(ok,label)=>{if(!ok)missing.push(label);}; const c=file.company||{},s=file.ship||{},m=file.monitoring||{};`;
replaceOnce(readinessStart, readinessReplacement, "binary manifest insertion");

replaceOnce(
`  REQUIRED_EVIDENCE.forEach(k=>req(file.evidence?.[k]===true,\`Kanıt: ${'${k}'}\`)); return {ready:missing.length===0,missing};`,
`  const hasBinary=(key)=>Number(binaryEvidence?.coverage?.[key]||0)>0;
  CORE_BINARY_EVIDENCE.forEach(k=>req(hasBinary(k),\`Binary kanıt: ${'${k}'}\`));
  const anyDataGap=(file.voyages||[]).some(v=>v.dataGap===true);
  const anyFuel=(file.fuels||[]).some(f=>Number(f.quantityTonnes)>0||Number(f.energyMj)>0||Boolean(String(f.bdnReference||"").trim()));
  const needsSustainability=(file.fuels||[]).some(f=>Boolean(String(f.sustainabilityCertificate||"").trim())||/(bio|methanol|ammonia|hydrogen|rfnbo|renewable|e-fuel|synthetic)/i.test(String(f.fuelType||"")));
  const needsElectricity=(file.fuels||[]).some(f=>Number(f.opsElectricityKwh)>0);
  const needsCalibration=(file.fuels||[]).some(f=>Boolean(String(f.calibrationReference||"").trim()));
  if(anyFuel)req(hasBinary("bdn"),"Binary kanıt: bdn");
  if(anyDataGap)req(hasBinary("data-gaps"),"Binary kanıt: data-gaps");
  if(needsSustainability)req(hasBinary("fuel-certificates"),"Binary kanıt: fuel-certificates");
  if(needsElectricity)req(hasBinary("electricity"),"Binary kanıt: electricity");
  if(file.ice?.exclusionClaimed)req(hasBinary("ice"),"Binary kanıt: ice");
  if(needsCalibration)req(hasBinary("calibration"),"Binary kanıt: calibration");
  if(c.role!=="gemi-sahibi")req(hasBinary("formal-mandate"),"Binary kanıt: formal-mandate");
  return {ready:missing.length===0,missing,evidenceManifestHash:binaryEvidence?.manifestHash||null,evidenceChainHead:binaryEvidence?.chainHead||null,evidenceDocumentCount:Number(binaryEvidence?.docs?.length||0)};`,
  "server binary readiness",
);

replaceOnce(
`  const role=await authorize(ctx.companyId,user.uid,lock?LOCK_ROLES:WRITE_ROLES); const h=await hydrate(ctx);
  if(!h?.file)throw httpError(409,"NO_DATA","Kaydedilmiş çalışma verisi bulunamadı"); if(h.status==="locked")throw httpError(423,"FILE_LOCKED","Dosya zaten kilitli");
  const gate=readiness(h.file); if(lock&&!gate.ready)throw httpError(422,"READINESS_BLOCKED","Kritik hazırlık alanları tamamlanmadan dosya kilitlenemez",{missing:gate.missing});`,
`  const role=await authorize(ctx.companyId,user.uid,lock?LOCK_ROLES:WRITE_ROLES); const h=await hydrate(ctx);
  if(!h?.file)throw httpError(409,"NO_DATA","Kaydedilmiş çalışma verisi bulunamadı"); if(h.status==="locked")throw httpError(423,"FILE_LOCKED","Dosya zaten kilitli");
  const binaryEvidence=await binaryEvidenceManifest(ctx);
  const gate=readiness(h.file,binaryEvidence); if(lock&&!gate.ready)throw httpError(422,"READINESS_BLOCKED","Kritik hazırlık alanları ve server-finalized binary kanıtlar tamamlanmadan dosya kilitlenemez",{missing:gate.missing});`,
  "checkpoint binary gate",
);

replaceOnce(
`  const snapshotHash=canonicalHash({product:"SKDMhesapla Maritime Carbon Compliance Preparation File",schemaVersion:SCHEMA_VERSION,rulesetId:RULESET_ID,sourceRevision:h.revision,sourceHash:h.dataHash,file:h.file,type:lock?"locked-preparation":"checkpoint"});`,
`  const snapshotHash=canonicalHash({product:"SKDMhesapla Maritime Carbon Compliance Preparation File",schemaVersion:SCHEMA_VERSION,rulesetId:RULESET_ID,sourceRevision:h.revision,sourceHash:h.dataHash,evidenceManifestHash:binaryEvidence.manifestHash,evidenceChainHead:binaryEvidence.chainHead,file:h.file,type:lock?"locked-preparation":"checkpoint"});`,
  "snapshot evidence binding",
);

replaceOnce(
`rowCounts:d.rowCounts||{},readiness:gate,createdAt:ts,createdBy:user.uid`,
`rowCounts:d.rowCounts||{},evidenceManifestHash:binaryEvidence.manifestHash,evidenceChainHead:binaryEvidence.chainHead,evidenceDocumentCount:binaryEvidence.docs.length,readiness:gate,createdAt:ts,createdBy:user.uid`,
  "version evidence binding",
);

replaceOnce(
`snapshotHash,rulesetId:RULESET_ID,immutable:true`,
`snapshotHash,evidenceManifestHash:binaryEvidence.manifestHash,evidenceChainHead:binaryEvidence.chainHead,evidenceDocumentCount:binaryEvidence.docs.length,rulesetId:RULESET_ID,immutable:true`,
  "audit evidence binding",
);

if (changed) {
  fs.writeFileSync(target, src, "utf8");
  console.log("Maritime backend binary-evidence authority patch applied.");
} else {
  console.log("Maritime backend already binary-evidence authoritative.");
}
