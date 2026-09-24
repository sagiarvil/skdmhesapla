import fs from "node:fs";
import path from "node:path";
import { ROOT, loadSeo } from "./load.mjs";

function escapeXml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822Date(dateString) {
  const d = dateString ? new Date(dateString) : new Date();
  return isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

export function generateRss(bundle) {
  const { config, regulatoryUpdates = [] } = bundle || loadSeo();
  const host = config.canonicalHost.replace(/\/$/, "");

  const marketPath = path.join(ROOT, "data/seo/market-updates.json");
  const marketData = fs.existsSync(marketPath) ? JSON.parse(fs.readFileSync(marketPath, "utf8")) : { updates: [] };
  const marketUpdates = (marketData.updates || [])
    .filter((item) => item?.publicationState === "APPROVED" && item?.humanReviewedAt && item?.sourceUrl)
    .sort((a, b) => Date.parse(b.detectedAt) - Date.parse(a.detectedAt));

  const items = [];

  // Mevzuat Güncellemeleri
  for (const item of regulatoryUpdates) {
    const link = `${host}/mevzuat-guncellemeleri/${item.slug}/`;
    const pubDate = toRfc822Date(item.officialPublishedAt || item.detectedAt);
    items.push(`    <item>
      <title>${escapeXml(item.title || item.shortTitle)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(item.summary || "")}</description>
      <category>Mevzuat Güncellemesi</category>
    </item>`);
  }

  // Piyasa Güncellemeleri
  for (const item of marketUpdates) {
    const link = `${host}/mevzuat-guncellemeleri/`;
    const pubDate = toRfc822Date(item.officialPublishedAt || item.detectedAt);
    items.push(`    <item>
      <title>${escapeXml(item.title || item.shortTitle)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(item.slug)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(item.summary || "")}</description>
      <category>Piyasa Sinyali</category>
    </item>`);
  }

  const lastBuildDate = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SKDMHesapla — SKDM &amp; CBAM Mevzuat ve Karbon Bildirim Portalı</title>
    <link>${escapeXml(host)}/</link>
    <description>Sınırda Karbon Düzenleme Mekanizması (SKDM / CBAM) mevzuat güncellemeleri, ETS karbon piyasa sinyalleri, metodoloji ve Türk ihracatçısı analizleri.</description>
    <language>tr</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(host)}/rss.xml" rel="self" type="application/rss+xml"/>
${items.join("\n")}
  </channel>
</rss>
`;

  const rssPath = path.join(ROOT, "public/rss.xml");
  const feedPath = path.join(ROOT, "public/feed.xml");
  fs.writeFileSync(rssPath, xml, "utf8");
  fs.writeFileSync(feedPath, xml, "utf8");

  return { count: items.length, rssPath, feedPath };
}

if (process.argv[1] && process.argv[1].endsWith("generate-rss.mjs")) {
  const result = generateRss();
  console.log(`rss: generated ${result.count} items -> public/rss.xml, public/feed.xml`);
}
