#!/usr/bin/env node
/**
 * V7 CI full audit — dependency-free.
 * Production registry default; --fixture <path> for negative tests (must fail).
 */
import fs from "node:fs";
import path from "node:path";
import {
  ROOT,
  REQUIRED_REGISTRY_FIELDS,
  STATES,
  FORBIDDEN_SCHEMA,
  CONVERSION_EVENTS,
  loadSeo,
  readJson,
  sourceById,
  daysSince,
  isIndexable,
} from "./load.mjs";
import { validateLegalFacts } from "./validate-legal-facts.mjs";

const args = process.argv.slice(2);
const fixtureIdx = args.indexOf("--fixture");
const expectFail = args.includes("--expect-fail");

function loadBundle() {
  if (fixtureIdx >= 0) {
    return readJson(args[fixtureIdx + 1]);
  }
  return loadSeo();
}

export function audit(bundle, now = new Date()) {
  const errors = [];
  const warnings = [];
  const { config, legalSources, legalFacts, registry, conflicts, launch } = bundle;
  const src = sourceById(legalSources || { sources: [] });

  if (!config?.canonicalHost) errors.push("config.canonicalHost eksik");
  if (config?.canonicalHost !== "https://skdmhesapla.com") {
    errors.push(`canonical host ${config?.canonicalHost}`);
  }
  if (config?.trailingSlash !== true) errors.push("trailingSlash tek politika: true olmalı");
  if (config?.hstsPreload) errors.push("HSTS preload otomasyonu yasak");
  if (config?.llmsFullEnabled) warnings.push("llms-full açık — ölçülebilir talep yoksa kapat");

  const searchAllow = new Set(config?.crawlerPolicy?.searchAllow || []);
  for (const bot of ["Googlebot", "Bingbot", "OAI-SearchBot", "PerplexityBot", "Claude-SearchBot", "Claude-User"]) {
    if (!searchAllow.has(bot)) errors.push(`search crawler Allow eksik: ${bot}`);
  }
  const train = new Set(config?.crawlerPolicy?.trainingDisallow || []);
  for (const bot of ["GPTBot", "ClaudeBot", "Google-Extended"]) {
    if (!train.has(bot)) errors.push(`training Disallow eksik: ${bot}`);
  }
  const neverDis = config?.crawlerPolicy?.neverDisallowPaths || [];
  if (!neverDis.includes("/_next/")) errors.push("_next/ Disallow edilemez");

  const factR = validateLegalFacts.wrapped ? null : null;
  void factR;
  if (fixtureIdx < 0) {
    const lf = validateLegalFacts(now);
    errors.push(...lf.errors);
    warnings.push(...lf.warnings);
    const appDir = path.join(ROOT, "src/app");
    if (fs.existsSync(appDir)) {
      const forbidden = [
        [/11 parçalı/i, "public copy 11 parçalı — packageFileCount LegalFact kullanın"],
        [/6 dosyalık/i, "public copy 6 dosyalık yasak"],
        [/250 CN/i, "public copy 250 CN — cnUniverseCount 569"],
      ];
      const walk = (dir) => {
        for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
          const p = path.join(dir, ent.name);
          if (ent.isDirectory()) walk(p);
          else if (/\.(tsx|ts|mdx|html)$/.test(ent.name)) {
            const txt = fs.readFileSync(p, "utf8");
            for (const [re, msg] of forbidden) {
              if (re.test(txt)) errors.push(`${path.relative(ROOT, p)}: ${msg}`);
            }
          }
        }
      };
      walk(appDir);
    }
  } else if (legalFacts) {
    // fixture may omit facts
  }

  const entries = registry?.entries || [];
  const routes = new Map();
  const intents = new Map();

  for (const e of entries) {
    for (const f of REQUIRED_REGISTRY_FIELDS) {
      if (e[f] === undefined || e[f] === null || e[f] === "") {
        errors.push(`${e.route || "?"}: alan eksik ${f}`);
      }
    }
    if (!STATES.has(e.state)) errors.push(`${e.route}: state ${e.state}`);
    if (routes.has(e.route)) errors.push(`duplicate route ${e.route}`);
    routes.set(e.route, e);

    if (e.state === "PUBLISHED_INDEXABLE" && e.intentOwner) {
      if (intents.has(e.primaryIntent)) {
        errors.push(`duplicate intent owner ${e.primaryIntent} (${intents.get(e.primaryIntent)} vs ${e.route})`);
      }
      intents.set(e.primaryIntent, e.route);
    }

    if (e.modifiedAt && Date.parse(e.modifiedAt) > now.getTime() + 86400000) {
      errors.push(`${e.route}: future modifiedAt ${e.modifiedAt}`);
    }

    if (e.state === "PUBLISHED_INDEXABLE" && e.canonicalRoute !== e.route) {
      errors.push(`${e.route}: indexable non-self-canonical → ${e.canonicalRoute}`);
    }

    if (!Array.isArray(e.sourceRefs) || e.sourceRefs.length === 0) {
      errors.push(`${e.route}: missing sourceRef`);
    } else {
      for (const id of e.sourceRefs) {
        const s = src.get(id);
        if (!s) errors.push(`${e.route}: sourceRef registry'de yok: ${id}`);
        else if (s.status === "archived") warnings.push(`${e.route}: archived source ${id}`);
        else if (s.status === "superseded") {
          errors.push(`${e.route}: superseded source ${id}`);
          if (!s.supersededBy) errors.push(`source ${id}: superseded ama target yok`);
        } else if (s.status === "active" && daysSince(s.lastHumanReviewAt, now) > (config.freshnessDays || 90)) {
          errors.push(`stale official source ${id} >90d (ref ${e.route})`);
        }
      }
    }

    if (e.legalClaims && !e.humanReviewedAt) {
      errors.push(`${e.route}: legalClaims without human review`);
    }
    if (e.legalClaims && !e.limitations) {
      errors.push(`${e.route}: legalClaims without limitations`);
    }

    if (e.programmatic && e.state === "PUBLISHED_INDEXABLE") {
      if (!e.humanReviewedAt) errors.push(`${e.route}: programmatic publish without legal review`);
      const n = (e.uniqueDecisionFields || []).length;
      if (e.decisionEnabled && n < 3) {
        errors.push(`${e.route}: programmatic uniqueDecisionFields <3 (${n})`);
      }
    }

    for (const t of e.schemaTypes || []) {
      if (FORBIDDEN_SCHEMA.has(t)) errors.push(`${e.route}: forbidden schema type ${t}`);
    }

    if (e.conversionEvent && !CONVERSION_EVENTS.has(e.conversionEvent)) {
      errors.push(`${e.route}: conversionEvent ${e.conversionEvent} contract dışı`);
    }

    if (e.role === "application" && e.state === "PUBLISHED_INDEXABLE") {
      warnings.push(`${e.route}: application katmanı indexable — landing ile karışmasın`);
    }
  }

  for (const s of legalSources?.sources || []) {
    if (s.status === "active" && daysSince(s.lastHumanReviewAt, now) > (config.freshnessDays || 90)) {
      errors.push(`stale official source ${s.id} >90d`);
    }
    if (s.status === "superseded" && !s.supersededBy) {
      errors.push(`superseded source ${s.id} ama target yok`);
    }
  }

  const indexable = entries.filter(isIndexable);
  if (indexable.length > (config.firstWaveMaxUrls || 50)) {
    errors.push(`first wave indexable ${indexable.length} > ${config.firstWaveMaxUrls}`);
  }

  const linked = new Set(["/"]);
  for (const e of entries) {
    if (e.parentHub) linked.add(e.route);
    for (const r of e.relatedRoutes || []) linked.add(r);
    for (const r of e.internalInLinks || []) linked.add(r);
  }
  const navFile = path.join(ROOT, "src/lib/skdm/constants.ts");
  if (fs.existsSync(navFile)) {
    const nav = fs.readFileSync(navFile, "utf8");
    for (const e of indexable) {
      if (nav.includes(`"${e.route}"`) || nav.includes(`'${e.route}'`)) linked.add(e.route);
    }
  }
  for (const e of indexable) {
    if (!linked.has(e.route)) errors.push(`orphan indexable URL ${e.route}`);
  }

  for (const e of entries) {
    if (e.state === "REDIRECTED") {
      const target = entries.find((x) => x.route === e.canonicalRoute);
      if (target?.state === "REDIRECTED") errors.push(`redirect chain ${e.route}`);
    }
  }

  const privateNeedNoindex = ["/giris/", "/kayit/", "/hesabim/", "/admin/", "/v/"];
  for (const p of privateNeedNoindex) {
    const e = routes.get(p);
    if (e && e.state === "PUBLISHED_INDEXABLE") {
      errors.push(`private path accidentally indexed ${p}`);
    }
  }

  function pageExists(route) {
    if (route === "/") return fs.existsSync(path.join(ROOT, "src/app/page.tsx"));
    const segs = route.replace(/\/$/, "").split("/").filter(Boolean);
    const staticDir = path.join(ROOT, "src/app", ...segs, "page.tsx");
    if (fs.existsSync(staticDir)) return true;
    if (segs[0] === "sektor") return fs.existsSync(path.join(ROOT, "src/app/sektor/[slug]/page.tsx"));
    if (segs[0] === "urun") return fs.existsSync(path.join(ROOT, "src/app/urun/[slug]/page.tsx"));
    if (segs[0] === "sozluk" && segs[1]) return fs.existsSync(path.join(ROOT, "src/app/sozluk/[terim]/page.tsx"));
    if (segs[0] === "hesapla") return fs.existsSync(path.join(ROOT, "src/app/hesapla/[sector]/page.tsx"));
    return false;
  }
  for (const e of indexable) {
    if (!pageExists(e.route)) errors.push(`indexable route missing page ${e.route}`);
  }

  if (conflicts?.conflicts?.length) {
    errors.push(`legal conflict register ${conflicts.conflicts.length} açık kayıt`);
  }

  const draftLaunch = (launch?.candidates || []).filter((c) => c.state && c.state !== "DRAFT");
  if (draftLaunch.length) {
    errors.push("launch-candidates DRAFT olmayan kayıt içeriyor — yayın onayı değil");
  }

  if (fixtureIdx < 0) {
    const robots = fs.readFileSync(path.join(ROOT, "public/robots.txt"), "utf8");
    if (/User-agent:\s*GPTBot[\s\S]{0,40}Allow:\s*\//i.test(robots) && !/User-agent:\s*GPTBot\s*\nDisallow:\s*\//.test(robots)) {
      errors.push("training bot policy mismatch GPTBot");
    }
    for (const bot of ["GPTBot", "ClaudeBot", "Google-Extended"]) {
      const re = new RegExp(`User-agent:\\s*${bot}\\s*\\nDisallow:\\s*/`, "i");
      if (!re.test(robots)) errors.push(`training bot policy mismatch ${bot}`);
    }
    for (const bot of ["OAI-SearchBot", "PerplexityBot", "Claude-SearchBot", "Claude-User"]) {
      const re = new RegExp(`User-agent:\\s*${bot}\\s*\\nAllow:\\s*/`, "i");
      if (!re.test(robots)) errors.push(`search crawler missing allow ${bot}`);
    }
    if (/Disallow:\s*\/_next\//.test(robots)) errors.push("robots Disallow _next/");

    const sm = fs.readFileSync(path.join(ROOT, "public/sitemap.xml"), "utf8");
    const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const lastmods = [...sm.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
    const indexSet = new Set(indexable.map((e) => `https://skdmhesapla.com${e.route}`));
    for (const loc of locs) {
      if (!indexSet.has(loc)) errors.push(`non-indexable URL in sitemap ${loc}`);
    }
    for (const e of indexable) {
      const loc = `https://skdmhesapla.com${e.route}`;
      if (!locs.includes(loc)) errors.push(`indexable missing from sitemap ${e.route}`);
    }
    for (let i = 0; i < locs.length; i++) {
      const route = locs[i].replace("https://skdmhesapla.com", "");
      const ent = routes.get(route);
      if (ent && lastmods[i] && lastmods[i] !== ent.modifiedAt) {
        errors.push(`sitemap lastmod ≠ registry.modifiedAt ${route}`);
      }
    }

    if (fs.existsSync(path.join(ROOT, "public/llms-full.txt")) && !config.llmsFullEnabled) {
      errors.push("llms-full.txt varsayılan KAPALI iken mevcut");
    }
  }

  return { errors: [...new Set(errors)], warnings: [...new Set(warnings)] };
}

const bundle = loadBundle();
const { errors, warnings } = audit(bundle);

for (const w of warnings) console.warn("WARN", w);
if (expectFail) {
  if (errors.length === 0) {
    console.error("negative fixture PASS beklenmiyordu");
    process.exit(1);
  }
  console.log(`negative fixture caught ${errors.length} violations`);
  for (const e of errors) console.log(" -", e);
  process.exit(0);
}
if (errors.length) {
  for (const e of errors) console.error("BLOCK", e);
  process.exit(1);
}
console.log(`seo full-audit: PASS (${(bundle.registry?.entries || []).length} routes)`);
