import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const SEO_DIR = path.join(ROOT, "data/seo");

export function readJson(rel) {
  const p = path.isAbsolute(rel) ? rel : path.join(ROOT, rel);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function approvedRegulatoryUpdates() {
  const p = path.join(SEO_DIR, "regulatory-updates.json");
  if (!fs.existsSync(p)) return [];
  const data = readJson("data/seo/regulatory-updates.json");
  const updates = Array.isArray(data.updates) ? data.updates : [];
  const slugs = new Set();
  return updates
    .filter((item) => {
      if (!item || item.publicationState !== "APPROVED") return false;
      if (!item.humanReviewedAt) throw new Error(`Regulatory APPROVED kayıtta humanReviewedAt zorunlu: ${item.slug ?? "?"}`);
      if (!item.slug || !/^[a-z0-9-]+$/.test(item.slug)) throw new Error(`Regulatory slug geçersiz: ${item.slug ?? "?"}`);
      if (slugs.has(item.slug)) throw new Error(`Regulatory duplicate slug: ${item.slug}`);
      slugs.add(item.slug);
      if (!item.sourceUrl?.startsWith("https://")) throw new Error(`Regulatory resmi kaynak HTTPS olmalı: ${item.slug}`);
      return true;
    })
    .sort((a, b) => Date.parse(b.detectedAt) - Date.parse(a.detectedAt));
}

function regulatoryRegistryEntries() {
  return approvedRegulatoryUpdates().map((item) => {
    const route = `/mevzuat-guncellemeleri/${item.slug}/`;
    return {
      route,
      role: "article",
      state: "PUBLISHED_INDEXABLE",
      canonicalRoute: route,
      title: `${item.shortTitle} — ${item.officialPublishedAt} | SKDMHesapla`,
      metaDescription: item.summary.length > 180 ? `${item.summary.slice(0, 177)}...` : item.summary,
      h1: item.title,
      primaryIntent: `cbam-regulatory-update-${item.slug}`,
      intentOwner: true,
      schemaTypes: ["Article", "WebPage"],
      sourceRefs: ["eu-2023-956", "ec-cbam-portal"],
      legalClaims: true,
      humanReviewedAt: item.humanReviewedAt,
      modifiedAt: item.humanReviewedAt,
      limitations: item.authorityNote,
      uniqueValueTypes: ["regulatory-update", "exporter-impact", "official-source", "user-actions", "product-impact"],
      decisionEnabled: true,
      uniqueDecisionFields: ["official-publication-date", "source-type", "relevant-period", "exporter-impact", "user-action", "product-status"],
      conversionEvent: "organic_scope_check_started",
      parentHub: "/mevzuat-guncellemeleri/",
      relatedRoutes: ["/mevzuat-guncellemeleri/", "/mevzuat/", "/metodoloji/", "/platform-kabiliyetleri/", "/basla/"],
      internalInLinks: ["/", "/mevzuat-guncellemeleri/"],
      programmatic: true,
      crawlable: true,
      regulatorySlug: item.slug,
    };
  });
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
  const seen = new Set(registry.entries.map((entry) => entry.route));
  const registryExtraPath = path.join(SEO_DIR, "registry-extra.json");
  if (fs.existsSync(registryExtraPath)) {
    const extra = readJson("data/seo/registry-extra.json");
    for (const entry of extra.entries ?? []) {
      if (seen.has(entry.route)) throw new Error(`SEO registry duplicate route: ${entry.route}`);
      registry.entries.push(entry);
      seen.add(entry.route);
    }
  }
  for (const entry of regulatoryRegistryEntries()) {
    if (seen.has(entry.route)) throw new Error(`SEO regulatory duplicate route: ${entry.route}`);
    registry.entries.push(entry);
    seen.add(entry.route);
  }

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
    regulatoryUpdates: approvedRegulatoryUpdates(),
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
  "route", "role", "state", "canonicalRoute", "title", "metaDescription", "h1", "primaryIntent", "intentOwner", "schemaTypes", "sourceRefs", "legalClaims", "humanReviewedAt", "modifiedAt", "limitations", "uniqueValueTypes", "decisionEnabled", "conversionEvent",
];

export const STATES = new Set(["PUBLISHED_INDEXABLE", "PUBLISHED_NOINDEX", "REDIRECTED", "GONE", "DRAFT"]);
export const FORBIDDEN_SCHEMA = new Set(["FAQPage", "HowTo", "AggregateRating", "Speakable", "QAPage", "Product", "Review"]);
export const CONVERSION_EVENTS = new Set(["organic_scope_check_started", "candidate_cn_selected", "scope_result_viewed", "wizard_started", "pcf_wizard_started", "wizard_layer_completed", "seal_intent", "purchase"]);
