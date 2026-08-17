import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const SEO_DIR = path.join(ROOT, "data/seo");

export function readJson(rel) {
  const p = path.isAbsolute(rel) ? rel : path.join(ROOT, rel);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function derivedCrawlerPolicy(aiPolicy) {
  return {
    searchAllow: Object.entries(aiPolicy.search || {})
      .filter(([, v]) => v === "allow")
      .map(([k]) => k),
    trainingDisallow: Object.entries(aiPolicy.training || {})
      .filter(([, v]) => v === "disallow")
      .map(([k]) => k),
  };
}

export function loadSeo() {
  const config = readJson("data/seo/config.json");
  const legalSources = readJson("data/seo/legal-sources.json");
  const legalFacts = readJson("data/seo/legal-facts.json");
  const registry = readJson("data/seo/registry.json");
  const conflicts = readJson("data/seo/conflicts.json");
  const aiPolicy = fs.existsSync(path.join(SEO_DIR, "ai-policy.json"))
    ? readJson("data/seo/ai-policy.json")
    : null;
  const aiResources = fs.existsSync(path.join(SEO_DIR, "ai-resources.json"))
    ? readJson("data/seo/ai-resources.json")
    : { resources: [], sections: [] };
  const aiEvals = fs.existsSync(path.join(SEO_DIR, "ai-evals.json"))
    ? readJson("data/seo/ai-evals.json")
    : [];
  const launch = fs.existsSync(path.join(SEO_DIR, "launch-candidates.json"))
    ? readJson("data/seo/launch-candidates.json")
    : { candidates: [] };
  if (aiPolicy) {
    const derived = derivedCrawlerPolicy(aiPolicy);
    config.crawlerPolicy = {
      ...config.crawlerPolicy,
      searchAllow: derived.searchAllow,
      trainingDisallow: derived.trainingDisallow,
    };
    config.llmsFullEnabled = aiPolicy.llms?.fullEnabled === true;
  }
  return {
    config,
    legalSources,
    legalFacts,
    registry,
    conflicts,
    launch,
    aiPolicy,
    aiResources,
    aiEvals,
  };
}

export function sourceById(legalSources) {
  const map = new Map();
  for (const s of legalSources.sources) map.set(s.id, s);
  return map;
}

export function daysSince(iso, now = new Date()) {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return Infinity;
  return (now.getTime() - t) / 86400000;
}

export function isIndexable(entry) {
  return entry.state === "PUBLISHED_INDEXABLE";
}

export function canonicalUrl(config, route) {
  const host = config.canonicalHost.replace(/\/$/, "");
  return `${host}${route}`;
}

export const REQUIRED_REGISTRY_FIELDS = [
  "route",
  "role",
  "state",
  "canonicalRoute",
  "title",
  "metaDescription",
  "h1",
  "primaryIntent",
  "intentOwner",
  "schemaTypes",
  "sourceRefs",
  "legalClaims",
  "humanReviewedAt",
  "modifiedAt",
  "limitations",
  "uniqueValueTypes",
  "decisionEnabled",
  "conversionEvent",
];

export const STATES = new Set([
  "PUBLISHED_INDEXABLE",
  "PUBLISHED_NOINDEX",
  "REDIRECTED",
  "GONE",
  "DRAFT",
]);

export const FORBIDDEN_SCHEMA = new Set([
  "FAQPage",
  "HowTo",
  "AggregateRating",
  "Speakable",
  "QAPage",
  "Product",
  "Review",
]);

export const CONVERSION_EVENTS = new Set([
  "organic_scope_check_started",
  "candidate_cn_selected",
  "scope_result_viewed",
  "wizard_started",
  "pcf_wizard_started",
  "wizard_layer_completed",
  "seal_intent",
  "purchase",
]);
