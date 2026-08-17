#!/usr/bin/env node
/**
 * IndexNow change notification.
 * Key: process.env.INDEXNOW_KEY only. CI'da gerçek prod submit YOK.
 */
import { loadSeo, canonicalUrl, isIndexable } from "./load.mjs";

const CI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";
const key = process.env.INDEXNOW_KEY || "";
const force = process.argv.includes("--submit");

export async function notifyIndexNow(urls, { host, key: k }) {
  const endpoint = "https://api.indexnow.org/indexnow";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: k, keyLocation: `https://${host}/${k}.txt`, urlList: urls }),
  });
  return { status: res.status, ok: res.ok };
}

async function main() {
  const { config, registry } = loadSeo();
  const host = new URL(config.canonicalHost).host;
  const urls = registry.entries.filter(isIndexable).map((e) => canonicalUrl(config, e.route));

  if (CI && !force) {
    console.log(`IndexNow SKIP (CI=true, ${urls.length} URL queued, prod submit yok)`);
    return;
  }
  if (!key) {
    console.log(`IndexNow SKIP (INDEXNOW_KEY yok, ${urls.length} URL)`);
    return;
  }
  if (!force) {
    console.log("IndexNow dry-run. Prod için --submit ve INDEXNOW_KEY gerekir.");
    console.log(urls.slice(0, 5).join("\n"), urls.length > 5 ? `… +${urls.length - 5}` : "");
    return;
  }
  const result = await notifyIndexNow(urls, { host, key });
  console.log("IndexNow", result);
  if (!result.ok) process.exit(1);
}

main();
