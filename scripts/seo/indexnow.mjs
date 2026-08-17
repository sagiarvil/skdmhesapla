#!/usr/bin/env node
/**
 * IndexNow — keşif bildirimi (sitemap envanterinin yerine geçmez).
 * Anahtar: public/<key>.txt (protokol gereği herkese açık) veya INDEXNOW_KEY.
 * CI ve seo:audit varsayılanı submit etmez. Prod: --submit, key canlı 200 olduktan sonra.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT, loadSeo, canonicalUrl, isIndexable } from "./load.mjs";
import { readBaseline } from "./sitemap-core.mjs";

const CI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";
const force = process.argv.includes("--submit");
const STATE_PATH = path.join(ROOT, "data/seo/indexnow-state.json");
const KEY_RE = /^[a-f0-9]{8,128}$/i;

export function resolveIndexNowKey() {
  const env = (process.env.INDEXNOW_KEY || "").trim();
  if (env && KEY_RE.test(env)) return env;
  const pub = path.join(ROOT, "public");
  if (!fs.existsSync(pub)) return "";
  for (const name of fs.readdirSync(pub)) {
    if (!name.endsWith(".txt")) continue;
    const stem = name.slice(0, -4);
    if (!KEY_RE.test(stem)) continue;
    const body = fs.readFileSync(path.join(pub, name), "utf8").trim();
    if (body === stem) return stem;
  }
  return "";
}

export function changedUrls(current, prev) {
  if (!prev?.urls) return current.map((u) => u.loc);
  const out = [];
  const prevMap = prev.urls;
  const nowSet = new Set(current.map((u) => u.loc));
  for (const u of current) {
    if (prevMap[u.loc] !== u.lastmod) out.push(u.loc);
  }
  for (const loc of Object.keys(prevMap)) {
    if (!nowSet.has(loc)) out.push(loc);
  }
  return [...new Set(out)];
}

export async function notifyIndexNow(urls, { host, key: k }) {
  const endpoint = "https://api.indexnow.org/indexnow";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: k,
      keyLocation: `https://${host}/${k}.txt`,
      urlList: urls,
    }),
  });
  return { status: res.status, ok: res.ok };
}

function currentUrlList(config, registry) {
  const baseline = readBaseline();
  return registry.entries
    .filter((e) => isIndexable(e) && e.canonicalRoute === e.route && e.crawlable !== false)
    .map((e) => ({
      loc: canonicalUrl(config, e.route),
      lastmod: baseline?.urls?.[canonicalUrl(config, e.route)] || e.modifiedAt,
    }));
}

async function main() {
  const { config, registry } = loadSeo();
  const host = new URL(config.canonicalHost).host;
  const key = resolveIndexNowKey();
  const current = currentUrlList(config, registry);
  let prev = null;
  if (fs.existsSync(STATE_PATH)) {
    prev = JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  }
  const urls = changedUrls(current, prev);

  if (CI && !force) {
    console.log(`IndexNow SKIP (CI=true, ${urls.length} değişen / ${current.length} envanter)`);
    return;
  }
  if (!key) {
    console.log(`IndexNow SKIP (anahtar yok, ${current.length} URL)`);
    return;
  }
  if (urls.length === 0) {
    console.log("IndexNow: değişen URL yok, gönderim yok");
    return;
  }
  if (!force) {
    console.log(`IndexNow dry-run ${urls.length} URL. Prod: --submit`);
    console.log(urls.slice(0, 5).join("\n"), urls.length > 5 ? `… +${urls.length - 5}` : "");
    return;
  }

  const result = await notifyIndexNow(urls, { host, key });
  console.log("IndexNow", result.status, `${urls.length} URL`);
  if (!result.ok) process.exit(1);

  const next = { submittedAt: new Date().toISOString(), urls: {} };
  for (const u of current) next.urls[u.loc] = u.lastmod;
  fs.writeFileSync(STATE_PATH, JSON.stringify(next, null, 2) + "\n");
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  main();
}
