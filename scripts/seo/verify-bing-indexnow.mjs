#!/usr/bin/env node
/**
 * Bing Webmaster Tools + IndexNow uyumluluk doğrulaması (canlı/statik).
 *
 * 1. public/BingSiteAuth.xml — Bing XML dosya doğrulaması (kullanıcı kodu).
 * 2. public/<key>.txt — IndexNow anahtar dosyası (dosya adı = içerik).
 * 3. robots.txt — Bingbot Allow / + Sitemap satırı.
 * 4. notifyIndexNow Bing endpoint'e gönderir (www.bing.com/indexnow).
 *
 * Kullanım: node scripts/seo/verify-bing-indexnow.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PASS = [];
const FAIL = [];

function check(name, ok, detail = "") {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}${detail ? " — " + detail : ""}`);
}

const pub = path.join(ROOT, "public");

// ── 1) BingSiteAuth.xml ─────────────────────────────────────────────────────
const bingXmlPath = path.join(pub, "BingSiteAuth.xml");
const bingOk = fs.existsSync(bingXmlPath);
let bingCode = "";
if (bingOk) {
  const xml = fs.readFileSync(bingXmlPath, "utf8");
  const m = xml.match(/<user>\s*([^<]+)\s*<\/user>/);
  bingCode = m ? m[1].trim() : "";
}
check("public/BingSiteAuth.xml mevcut", bingOk);
check(
  "BingSiteAuth.xml <users><user> kodu içeriyor",
  bingOk && /^[A-F0-9]{32}$/i.test(bingCode),
  bingCode || "kod yok"
);
check(
  "BingSiteAuth.xml kök konumda (public kökü, klasör içinde değil)",
  path.basename(path.dirname(bingXmlPath)) === "public" || path.dirname(bingXmlPath) === pub
);

// ── 2) IndexNow anahtar dosyası ─────────────────────────────────────────────
const KEY_RE = /^[a-f0-9]{8,128}$/i;
const keyFiles = fs.existsSync(pub)
  ? fs.readdirSync(pub).filter((n) => n.endsWith(".txt") && KEY_RE.test(n.slice(0, -4)))
  : [];
let key = "";
for (const name of keyFiles) {
  const stem = name.slice(0, -4);
  const body = fs.readFileSync(path.join(pub, name), "utf8").trim();
  if (body === stem) {
    key = stem;
    break;
  }
}
check("IndexNow anahtar dosyası public/<key>.txt mevcut ve içerik=ad", Boolean(key), key || "yok");
check(
  "IndexNow anahtarı protokol formatı (8-128 hex)",
  !key || KEY_RE.test(key)
);

// ── 3) robots.txt — Bingbot + Sitemap ───────────────────────────────────────
const robots = fs.existsSync(path.join(pub, "robots.txt"))
  ? fs.readFileSync(path.join(pub, "robots.txt"), "utf8")
  : "";
check("robots.txt Bingbot'a Allow / verir", /User-agent: Bingbot[\s\S]*?Allow: \//.test(robots));
check("robots.txt Sitemap satırı içerir", /^Sitemap: https:\/\/skdmhesapla\.com\/sitemap\.xml$/m.test(robots));

// ── 4) Bing doğrudan IndexNow endpoint'i ────────────────────────────────────
const indexnowSrc = fs.readFileSync(path.join(ROOT, "scripts/seo/indexnow.mjs"), "utf8");
check(
  "notifyIndexNow Bing endpoint'ini (www.bing.com/indexnow) gönderir",
  indexnowSrc.includes("https://www.bing.com/indexnow")
);
check(
  "notifyIndexNow api.indexnow.org hub'ını gönderir",
  indexnowSrc.includes("https://api.indexnow.org/indexnow")
);
check("notifyIndexNow keyLocation'ı https://<host>/<key>.txt üretir", indexnowSrc.includes("keyLocation"));

console.log(`\n${"-".repeat(60)}`);
console.log("KANIT:");
console.log(`  BingSiteAuth.xml kodu: ${bingCode || "—"}`);
console.log(`  IndexNow key: ${key || "—"} → https://skdmhesapla.com/${key}.txt`);
console.log(`  IndexNow keyLocation: https://skdmhesapla.com/${key}.txt`);
console.log(`${"-".repeat(60)}`);

if (FAIL.length === 0) {
  console.log(`\nBING+INDEXNOW UYUMLULUK GEÇTİ (${PASS.length} kontrol)`);
} else {
  console.log(`\nBING+INDEXNOW UYUMLULUK KALDI: ${FAIL.length} başarısız`);
  process.exit(1);
}
