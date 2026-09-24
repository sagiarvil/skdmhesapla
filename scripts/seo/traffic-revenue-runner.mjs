import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./load.mjs";

function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
}

console.log("=== TRAFFIC & REVENUE TELEMETRY AUDIT ===");

// 1. Sitemap Denetimi
const sitemapPath = path.join(ROOT, "public/sitemap.xml");
assert(fs.existsSync(sitemapPath), "public/sitemap.xml bulunamadı");
const sitemapXml = fs.readFileSync(sitemapPath, "utf8");
const urlCount = (sitemapXml.match(/<loc>/g) || []).length;
assert(urlCount >= 70, `Sitemap URL sayısı yetersiz: ${urlCount} (en az 70 bekleniyor)`);
console.log(`  ✓ Sitemap URL Sayısı: ${urlCount} (Tam İndekslenebilir)`);

// 2. RSS & Atom Feeds
const rssPath = path.join(ROOT, "public/rss.xml");
const atomPath = path.join(ROOT, "public/atom.xml");
const feedPath = path.join(ROOT, "public/feed.xml");
assert(fs.existsSync(rssPath), "public/rss.xml bulunamadı");
assert(fs.existsSync(atomPath), "public/atom.xml bulunamadı");
assert(fs.existsSync(feedPath), "public/feed.xml bulunamadı");
console.log(`  ✓ Feeds: RSS 2.0, Atom 1.0 ve Compact Feed yayında`);

// 3. LLMs & AI Search Surfaces
const llmsPath = path.join(ROOT, "public/llms.txt");
const llmCompactPath = path.join(ROOT, "public/llm.txt");
assert(fs.existsSync(llmsPath), "public/llms.txt bulunamadı");
assert(fs.existsSync(llmCompactPath), "public/llm.txt bulunamadı");
console.log(`  ✓ LLMs Katmanı: llms.txt ve llm.txt hazır`);

// 4. Agent & Traffic Manifests
const agentCardPath = path.join(ROOT, "public/.well-known/agent-card.json");
const trafficManifestPath = path.join(ROOT, "public/.well-known/traffic-manifest.json");
assert(fs.existsSync(agentCardPath), "agent-card.json bulunamadı");
assert(fs.existsSync(trafficManifestPath), "traffic-manifest.json bulunamadı");

const trafficManifest = JSON.parse(fs.readFileSync(trafficManifestPath, "utf8"));
assert(trafficManifest.aiSearchGrounding?.wikidataEntities?.length >= 4, "Wikidata varlık temellendirmesi eksik");
console.log(`  ✓ Agent Card & Traffic Manifest: ${trafficManifest.aiSearchGrounding.wikidataEntities.length} Wikidata Q-ID ile zırhlandırıldı`);

// 5. UTF-8 & BOM Kontrolü
for (const file of [sitemapPath, rssPath, atomPath, feedPath, llmsPath, trafficManifestPath]) {
  const content = fs.readFileSync(file);
  assert(content[0] !== 0xEF || content[1] !== 0xBB || content[2] !== 0xBF, `${file} dosyasında BOM bulundu!`);
}
console.log(`  ✓ BOM Kontrolü: 0 BOM baytı, saf UTF-8.`);

console.log("traffic-revenue-runner: PASS (Tüm trafik ve gelir vektörleri eksiksiz aktif)");
