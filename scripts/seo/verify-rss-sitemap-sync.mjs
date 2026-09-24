import fs from "node:fs";
import path from "node:path";
import { ROOT, loadSeo } from "./load.mjs";

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

const bundle = loadSeo();
const { config, regulatoryUpdates = [] } = bundle;
const host = config.canonicalHost.replace(/\/$/, "");

const rssPath = path.join(ROOT, "public/rss.xml");
const feedPath = path.join(ROOT, "public/feed.xml");
const atomPath = path.join(ROOT, "public/atom.xml");
const sitemapPath = path.join(ROOT, "public/sitemap.xml");

// 1. Dosya varlık kontrolü
assert(fs.existsSync(rssPath), "public/rss.xml bulunamadı");
assert(fs.existsSync(feedPath), "public/feed.xml bulunamadı");
assert(fs.existsSync(atomPath), "public/atom.xml bulunamadı");
assert(fs.existsSync(sitemapPath), "public/sitemap.xml bulunamadı");

const rssContent = fs.readFileSync(rssPath, "utf8");
const feedContent = fs.readFileSync(feedPath, "utf8");
const atomContent = fs.readFileSync(atomPath, "utf8");
const sitemapContent = fs.readFileSync(sitemapPath, "utf8");

// 2. Temel XML ve Root Etiket Doğrulamaları
assert(rssContent.includes('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">'), "RSS 2.0 kök etiketi veya atom namespace eksik");
assert(feedContent.includes('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">'), "Feed XML 2.0 kök etiketi eksik");
assert(atomContent.includes('<feed xmlns="http://www.w3.org/2005/Atom">'), "Atom 1.0 kök etiketi eksik");

// 3. Sitemap ile Eşzamanlılık ve Kayıpsız Yayın Kontrolü (Zero-Loss Parity)
for (const item of regulatoryUpdates) {
  const expectedUrl = `${host}/mevzuat-guncellemeleri/${item.slug}/`;
  
  // Sitemap'te var mı?
  assert(sitemapContent.includes(expectedUrl), `Sitemap içinde eksik mevzuat güncellemesi URL'i: ${expectedUrl}`);
  
  // RSS 2.0 içinde var mı?
  assert(rssContent.includes(expectedUrl), `RSS 2.0 içinde eksik mevzuat güncellemesi URL'i: ${expectedUrl}`);
  
  // Atom 1.0 içinde var mı?
  assert(atomContent.includes(expectedUrl), `Atom 1.0 içinde eksik mevzuat güncellemesi URL'i: ${expectedUrl}`);
}

// 4. BOM ve UTF-8 Denetimi
for (const [name, content] of [["rss.xml", rssContent], ["feed.xml", feedContent], ["atom.xml", atomContent]]) {
  assert(!content.startsWith("\uFEFF"), `${name} dosyasında BOM bulundu! Saf UTF-8 olmalı.`);
  assert(content.length > 500, `${name} dosya boyutu beklenenden küçük.`);
}

console.log(`verify-rss-sitemap-sync: PASS (Sitemap, RSS 2.0 ve Atom 1.0 tam eşzamanlı, ${regulatoryUpdates.length} mevzuat kaydı kayıpsız doğrulandı)`);
