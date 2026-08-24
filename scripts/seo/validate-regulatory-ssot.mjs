#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadSeo } from "./load.mjs";

const raw = JSON.parse(fs.readFileSync(path.join(ROOT, "data/seo/regulatory-updates.json"), "utf8"));
const updates = Array.isArray(raw.updates) ? raw.updates : [];
const states = new Set(["CANDIDATE", "APPROVED", "REJECTED"]);
const priorities = new Set(["P0", "P1", "P2"]);
const sourceTypes = new Set(["BINDING_ACT", "OFFICIAL_DATASET", "OFFICIAL_GUIDANCE", "OPERATIONAL_MANUAL"]);
const productStates = new Set(["IMPLEMENTED", "ACTION_REQUIRED", "MONITORING"]);
const seen = new Set();
const errors = [];

if (raw.policy?.candidateAutoPublish !== false) errors.push("candidateAutoPublish false olmalı");
for (const item of updates) {
  const id = item?.slug || "<slug-yok>";
  if (!states.has(item?.publicationState)) errors.push(`${id}: publicationState geçersiz`);
  if (!/^[a-z0-9-]+$/.test(id)) errors.push(`${id}: slug ASCII kebab-case olmalı`);
  if (seen.has(id)) errors.push(`${id}: duplicate slug`);
  seen.add(id);
  if (!priorities.has(item?.priority)) errors.push(`${id}: priority geçersiz`);
  if (!sourceTypes.has(item?.sourceType)) errors.push(`${id}: sourceType geçersiz`);
  if (!productStates.has(item?.productStatus)) errors.push(`${id}: productStatus geçersiz`);
  if (!item?.sourceUrl?.startsWith("https://")) errors.push(`${id}: sourceUrl HTTPS olmalı`);
  if (Number.isNaN(Date.parse(item?.detectedAt || ""))) errors.push(`${id}: detectedAt geçersiz`);
  if (Number.isNaN(Date.parse(item?.officialPublishedAt || ""))) errors.push(`${id}: officialPublishedAt geçersiz`);
  for (const key of ["title", "shortTitle", "summary", "relevantPeriod", "exporterImpact", "sourceLabel", "authorityNote"]) {
    if (!item?.[key] || typeof item[key] !== "string") errors.push(`${id}: ${key} zorunlu`);
  }
  for (const key of ["userActions", "affectedModules", "requiredActions"]) {
    if (!Array.isArray(item?.[key]) || item[key].length === 0) errors.push(`${id}: ${key} boş olamaz`);
  }
  if (item?.publicationState === "APPROVED") {
    if (!item.humanReviewedAt || Number.isNaN(Date.parse(item.humanReviewedAt))) errors.push(`${id}: APPROVED için humanReviewedAt zorunlu`);
    if (Date.parse(item.humanReviewedAt) < Date.parse(item.officialPublishedAt)) errors.push(`${id}: humanReviewedAt resmi yayın tarihinden önce olamaz`);
  }
}

const bundle = loadSeo();
const approved = updates.filter((x) => x.publicationState === "APPROVED");
if (bundle.regulatoryUpdates.length !== approved.length) errors.push("loadSeo APPROVED filtre sayısı uyuşmuyor");
for (const item of approved) {
  const route = `/mevzuat-guncellemeleri/${item.slug}/`;
  const entry = bundle.registry.entries.find((x) => x.route === route);
  if (!entry) errors.push(`${item.slug}: registry route türetilmedi`);
  else {
    if (entry.state !== "PUBLISHED_INDEXABLE") errors.push(`${item.slug}: registry state indexable değil`);
    if (entry.canonicalRoute !== route) errors.push(`${item.slug}: canonical route uyuşmuyor`);
    if (!entry.humanReviewedAt) errors.push(`${item.slug}: registry human review yok`);
  }
}
for (const item of updates.filter((x) => x.publicationState !== "APPROVED")) {
  const route = `/mevzuat-guncellemeleri/${item.slug}/`;
  if (bundle.registry.entries.some((x) => x.route === route)) errors.push(`${item.slug}: onaysız kayıt registry'ye sızdı`);
}

if (errors.length) {
  console.error(`REGULATORY SSOT FAIL (${errors.length})`);
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log(`REGULATORY SSOT PASS — ${approved.length} onaylı, ${updates.length - approved.length} yayın dışı kayıt`);
