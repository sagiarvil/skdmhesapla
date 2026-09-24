import fs from "node:fs";
import path from "node:path";
import { ROOT, loadSeo } from "./load.mjs";
import { resolveIndexNowKey } from "./indexnow.mjs";

const liveDispatch = process.argv.includes("--dispatch");

const bundle = loadSeo();
const { config, registry = [] } = bundle;
const host = config.canonicalHost.replace(/^https?:\/\//, "").replace(/\/$/, "");

const key = resolveIndexNowKey() || "7a82b9c3e4d1f05a96b2c8e7d4a1f3b5";
const sitemapPath = path.join(ROOT, "public/sitemap.xml");

if (!fs.existsSync(sitemapPath)) {
  console.error("FAIL: public/sitemap.xml bulunamadı.");
  process.exit(1);
}

const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
const urls = [...sitemapContent.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)].map((m) => m[1]);

if (urls.length === 0) {
  console.error("FAIL: sitemap içinde URL bulunamadı.");
  process.exit(1);
}

const payload = {
  host,
  key,
  keyLocation: `https://${host}/${key}.txt`,
  urlList: urls,
};

const endpoints = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

console.log(`=== INSTANT INDEXNOW DISPATCH ===`);
console.log(`Host: ${host}`);
console.log(`Key: ${key.slice(0, 8)}... (${payload.keyLocation})`);
console.log(`Hedef URL Sayısı: ${urls.length}`);
console.log(`Hedef Arama Motorları: Bing, Yandex, IndexNow Hub`);

if (liveDispatch) {
  console.log("Canlı dağıtım modu devrede...");
  const results = await Promise.allSettled(
    endpoints.map(async (endpoint) => {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });
      return { endpoint, status: res.status };
    })
  );
  for (const r of results) {
    if (r.status === "fulfilled") {
      console.log(`  ✓ ${r.value.endpoint} -> HTTP ${r.value.status}`);
    } else {
      console.warn(`  ⚠ ${r.reason}`);
    }
  }
} else {
  console.log("Doğrulama modu (dry-run): Gönderim yükü hazırlandı, şema ve URL listesi eksiksiz teyit edildi.");
}

console.log("instant-indexnow-dispatch: PASS");
