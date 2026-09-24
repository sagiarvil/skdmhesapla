import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Traffic & Revenue Architecture — complete coverage", () => {
  const root = process.cwd();
  
  // 1. Sitemap
  const sitemap = path.join(root, "public/sitemap.xml");
  assert.ok(fs.existsSync(sitemap), "sitemap.xml exists");
  const sitemapText = fs.readFileSync(sitemap, "utf8");
  const urlCount = (sitemapText.match(/<loc>/g) || []).length;
  assert.ok(urlCount >= 70, `Expected at least 70 URLs, got ${urlCount}`);

  // 2. Feeds
  assert.ok(fs.existsSync(path.join(root, "public/rss.xml")), "rss.xml exists");
  assert.ok(fs.existsSync(path.join(root, "public/atom.xml")), "atom.xml exists");
  assert.ok(fs.existsSync(path.join(root, "public/feed.xml")), "feed.xml exists");

  // 3. AI Manifests
  assert.ok(fs.existsSync(path.join(root, "public/llms.txt")), "llms.txt exists");
  assert.ok(fs.existsSync(path.join(root, "public/.well-known/agent-card.json")), "agent-card.json exists");
  assert.ok(fs.existsSync(path.join(root, "public/.well-known/traffic-manifest.json")), "traffic-manifest.json exists");

  // 4. Wikidata Entities
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "public/.well-known/traffic-manifest.json"), "utf8"));
  assert.ok(Array.isArray(manifest.aiSearchGrounding.wikidataEntities));
  assert.ok(manifest.aiSearchGrounding.wikidataEntities.some((e: any) => e.qid === "Q111667085"));
});
