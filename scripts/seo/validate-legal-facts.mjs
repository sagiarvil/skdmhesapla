#!/usr/bin/env node
import { loadSeo, daysSince, sourceById } from "./load.mjs";

export function validateLegalFacts(now = new Date()) {
  const { config, legalSources, legalFacts } = loadSeo();
  const src = sourceById(legalSources);
  const errors = [];
  const warnings = [];
  const seen = new Set();

  if (!Array.isArray(legalFacts.facts) || legalFacts.facts.length === 0) {
    errors.push("legal-facts: facts[] boş");
    return { errors, warnings };
  }

  for (const fact of legalFacts.facts) {
    if (!fact.id) errors.push("legal-facts: id eksik");
    if (seen.has(fact.id)) errors.push(`legal-facts: duplicate id ${fact.id}`);
    seen.add(fact.id);
    if (fact.value === undefined || fact.value === null) {
      errors.push(`legal-facts: ${fact.id} value yok`);
    }
    if (!fact.authority) errors.push(`legal-facts: ${fact.id} authority yok`);
    if (!Array.isArray(fact.sourceRefs) || fact.sourceRefs.length === 0) {
      errors.push(`legal-facts: ${fact.id} sourceRefs yok`);
    }
    for (const id of fact.sourceRefs || []) {
      const s = src.get(id);
      if (!s) errors.push(`legal-facts: ${fact.id} sourceRef yok: ${id}`);
      else if (s.status === "archived") {
        warnings.push(`legal-facts: ${fact.id} archived source ${id}`);
      } else if (s.status === "superseded") {
        errors.push(`legal-facts: ${fact.id} superseded source ${id}`);
      } else if (s.status === "active" && daysSince(s.lastHumanReviewAt, now) > config.freshnessDays) {
        errors.push(`legal-facts: ${fact.id} source ${id} review >${config.freshnessDays}g`);
      }
    }
    if (fact.status === "active" && daysSince(fact.lastHumanReviewAt, now) > config.freshnessDays) {
      errors.push(`legal-facts: ${fact.id} lastHumanReviewAt >${config.freshnessDays}g`);
    }
  }

  const required = ["sectorFamilyCount", "cnUniverseCount", "deMinimisTons"];
  for (const id of required) {
    if (!seen.has(id)) errors.push(`legal-facts: zorunlu fact eksik: ${id}`);
  }

  const families = legalFacts.facts.find((f) => f.id === "sectorFamilyCount");
  const cn = legalFacts.facts.find((f) => f.id === "cnUniverseCount");
  if (families && families.value !== 6) {
    errors.push("legal-facts: sectorFamilyCount RM-001 ile 6 olmalı");
  }
  if (cn && cn.value !== 569) {
    errors.push("legal-facts: cnUniverseCount RM-001 ile 569 olmalı");
  }

  return { errors, warnings };
}

const isMain = process.argv[1] && process.argv[1].endsWith("validate-legal-facts.mjs");
if (isMain) {
  const { errors, warnings } = validateLegalFacts();
  for (const w of warnings) console.warn("WARN", w);
  if (errors.length) {
    for (const e of errors) console.error("BLOCK", e);
    process.exit(1);
  }
  console.log("legal-facts: PASS");
}
