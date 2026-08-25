#!/usr/bin/env node
/**
 * Sitemap üretimi — lastmod gerçek Git içerik zamanından türetilir.
 * Build/deploy saati YASAK. XML: yalnız loc + lastmod.
 */
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ROOT, canonicalUrl, isIndexable } from "./load.mjs";

const PUBLIC = path.join(ROOT, "public");
const SITEMAP_PATH = path.join(PUBLIC, "sitemap.xml");
const TMP_PATH = path.join(PUBLIC, ".sitemap.tmp");
const BASELINE_PATH = path.join(ROOT, "data/seo/sitemap-baseline.json");
const CHUNK_MAX = 45000;
const gitIsoCache = new Map();

export function resolvePageFiles(route) {
  const files = [];
  const add = (rel) => {
    if (fs.existsSync(path.join(ROOT, rel))) files.push(rel);
  };
  if (route === "/") {
    add("src/app/page.tsx");
    return files;
  }
  const segs = route.replace(/\/$/, "").split("/").filter(Boolean);
  add(["src/app", ...segs, "page.tsx"].join("/"));
  if (segs[0] === "sektor") add("src/app/sektor/[slug]/page.tsx");
  if (segs[0] === "urun") {
    add("src/app/urun/[slug]/page.tsx");
    add("src/lib/seo/product-decisions.ts");
  }
  if (segs[0] === "sozluk" && segs[1]) {
    add("src/app/sozluk/[terim]/page.tsx");
    add("src/lib/skdm/content/sozluk.ts");
  }
  if (segs[0] === "rehber" && !segs[1]) add("src/lib/skdm/content/rehber.ts");
  if (segs[0] === "hesapla") add("src/app/hesapla/[sector]/page.tsx");
  if (segs[0] === "mevzuat-guncellemeleri") {
    add("data/seo/regulatory-updates.json");
    if (segs[1]) add("src/app/mevzuat-guncellemeleri/[slug]/page.tsx");
  }
  return [...new Set(files)];
}

function gitCommitIso(rel) {
  if (gitIsoCache.has(rel)) return gitIsoCache.get(rel);
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${rel}"`, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    gitIsoCache.set(rel, iso || null);
    return iso || null;
  } catch {
    gitIsoCache.set(rel, null);
    return null;
  }
}

export function lastmodForRoute(route, now = new Date()) {
  const files = resolvePageFiles(route);
  let latest = 0;
  for (const f of files) {
    const iso = gitCommitIso(f);
    const t = iso ? Date.parse(iso) : NaN;
    if (!Number.isNaN(t) && t > latest) latest = t;
  }
  if (!latest) return null;
  const clipped = Math.min(latest, now.getTime());
  return new Date(clipped).toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function timestampRatio(values) {
  if (values.length === 0) return 0;
  const counts = new Map();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  return Math.max(...counts.values()) / values.length;
}

export function sitemapEntries(config, registry, now = new Date()) {
  return registry.entries
    .filter((e) => isIndexable(e) && e.canonicalRoute === e.route && e.crawlable !== false)
    .map((e) => ({ loc: canonicalUrl(config, e.route), route: e.route, lastmod: lastmodForRoute(e.route, now) }))
    .sort((a, b) => a.loc.localeCompare(b.loc, "en"));
}

export function buildSitemapXml(entries) {
  if (entries.length > CHUNK_MAX) throw new Error(`sitemap chunk rollover: ${entries.length} > ${CHUNK_MAX}`);
  const body = entries.map((e) => {
    const last = e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : "";
    return `  <url>\n    <loc>${e.loc}</loc>${last}\n  </url>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function sha256(text) { return createHash("sha256").update(text).digest("hex"); }
export function readBaseline() { return fs.existsSync(BASELINE_PATH) ? JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8")) : null; }

export function writeSitemapAtomic(xml) {
  if (!xml.includes("<url>")) throw new Error("S19: 0 URL — canlı sitemap ezilmez");
  fs.writeFileSync(TMP_PATH, xml);
  fs.renameSync(TMP_PATH, SITEMAP_PATH);
}

export function assertSitemapQuality(xml, entries, baseline) {
  const errors = [];
  const warnings = [];
  if (/<priority>|<changefreq>/.test(xml)) errors.push("S17: priority/changefreq yasak");
  if (entries.length === 0) errors.push("S19: 0 URL");
  const locs = entries.map((e) => e.loc);
  if (new Set(locs).size !== locs.length) errors.push("S12: yinelenen loc");
  if (!locs.includes("https://skdmhesapla.com/")) errors.push("S18: ana sayfa yok");
  for (const loc of locs) {
    if (/[?&#]/.test(new URL(loc).search + new URL(loc).hash)) errors.push(`S15: parametreli loc ${loc}`);
    if (/[çğıöşüÇĞİÖŞÜ]/.test(loc)) errors.push(`S28: loc'da Türkçe karakter ${loc}`);
  }
  const mods = entries.map((e) => e.lastmod).filter(Boolean);
  const future = mods.filter((m) => Date.parse(m) > Date.now() + 86400000);
  if (future.length) errors.push(`S16: gelecek lastmod ${future[0]}`);
  const ratio = timestampRatio(mods);
  if (ratio >= 0.95) errors.push(`lastmod homojenliği ${(ratio * 100).toFixed(0)}% ≥95% FAIL`);
  else if (ratio >= 0.8) warnings.push(`lastmod homojenliği ${(ratio * 100).toFixed(0)}% ≥80%`);
  if (baseline?.urlCount) {
    const drop = (baseline.urlCount - entries.length) / baseline.urlCount;
    if (drop > 0.2 && process.env.SEO_SITEMAP_FORCE !== "1") errors.push(`URL düşüşü ${(drop * 100).toFixed(0)}% >20%`);
  }
  return { errors, warnings };
}

export function writeBaseline(xml, entries) {
  const prev = readBaseline();
  const hash = sha256(xml);
  const status = !prev ? "NEW" : prev.sha256 === hash ? "UNCHANGED" : "CHANGED";
  const payload = { sha256: hash, urlCount: entries.length, urls: Object.fromEntries(entries.map((e) => [e.loc, e.lastmod])) };
  fs.writeFileSync(BASELINE_PATH, JSON.stringify(payload, null, 2) + "\n");
  return { ...payload, status };
}

export function generateSitemap(config, registry, now = new Date()) {
  const entries = sitemapEntries(config, registry, now);
  const xml = buildSitemapXml(entries);
  const baseline = readBaseline();
  const { errors, warnings } = assertSitemapQuality(xml, entries, baseline);
  if (errors.length) {
    const err = new Error(errors.join("; "));
    err.details = { errors, warnings };
    throw err;
  }
  writeSitemapAtomic(xml);
  const report = writeBaseline(xml, entries);
  return { count: entries.length, warnings, report };
}
