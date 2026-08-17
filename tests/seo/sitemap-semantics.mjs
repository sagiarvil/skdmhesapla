#!/usr/bin/env node
/** S01 S04 S05 S17 S18 — ağa bağımsız sitemap semantik kapıları */
import assert from "node:assert/strict";
import { loadSeo } from "../../scripts/seo/load.mjs";
import {
  sitemapEntries,
  buildSitemapXml,
  sha256,
  timestampRatio,
} from "../../scripts/seo/sitemap-core.mjs";

const { config, registry } = loadSeo();
const a = sitemapEntries(config, registry);
const xml1 = buildSitemapXml(a);
const xml2 = buildSitemapXml(sitemapEntries(config, registry));

assert.equal(xml1, xml2, "S01: aynı girdi → byte-identical");
assert.equal(sha256(xml1), sha256(xml2), "S01 hash");
assert.equal(xml1.includes("priority"), false, "S17 priority yok");
assert.equal(xml1.includes("changefreq"), false, "S17 changefreq yok");
assert.equal(/generator|Date\.now|uuid/i.test(xml1), false, "S05 metadata yok");
assert.match(xml1, /<loc>https:\/\/skdmhesapla.com\/<\/loc>/, "S18 home");

const locs = a.map((e) => e.loc);
const sorted = [...locs].sort((x, y) => x.localeCompare(y, "en"));
assert.deepEqual(locs, sorted, "S04 localeCompare(en)");

const mods = a.map((e) => e.lastmod).filter(Boolean);
assert.ok(mods.length === a.length, "her URL'de git lastmod kanıtı");
const ratio = timestampRatio(mods);
assert.ok(ratio < 0.95, `lastmod homojenliği ${(ratio * 100).toFixed(0)}% < 95%`);
assert.ok(!mods.some((m) => Date.parse(m) > Date.now() + 86400000), "S16 gelecek yok");

console.log(`sitemap-semantics: PASS (${a.length} URL, lastmod max-share ${(ratio * 100).toFixed(0)}%)`);
