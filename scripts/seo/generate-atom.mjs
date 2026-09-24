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

function toIsoDate(dateString) {
  const d = dateString ? new Date(dateString) : new Date();
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export function generateAtom(bundle) {
  const { config, regulatoryUpdates = [] } = bundle || loadSeo();
  const host = config.canonicalHost.replace(/\/$/, "");

  const marketPath = path.join(ROOT, "data/seo/market-updates.json");
  const marketData = fs.existsSync(marketPath) ? JSON.parse(fs.readFileSync(marketPath, "utf8")) : { updates: [] };
  const marketUpdates = (marketData.updates || [])
    .filter((item) => item?.publicationState === "APPROVED" && item?.humanReviewedAt && item?.sourceUrl)
    .sort((a, b) => Date.parse(b.detectedAt) - Date.parse(a.detectedAt));

  const entries = [];

  // Mevzuat Güncellemeleri
  for (const item of regulatoryUpdates) {
    const link = `${host}/mevzuat-guncellemeleri/${item.slug}/`;
    const updated = toIsoDate(item.officialPublishedAt || item.detectedAt);
    entries.push(`  <entry>
    <title>${escapeXml(item.title || item.shortTitle)}</title>
    <link href="${escapeXml(link)}" rel="alternate" type="text/html"/>
    <id>${escapeXml(link)}</id>
    <updated>${updated}</updated>
    <summary>${escapeXml(item.summary || "")}</summary>
    <category term="Mevzuat Güncellemesi"/>
    <author>
      <name>SKDMHesapla Mevzuat Masası</name>
    </author>
  </entry>`);
  }

  // Piyasa Güncellemeleri
  for (const item of marketUpdates) {
    const link = `${host}/mevzuat-guncellemeleri/`;
    const updated = toIsoDate(item.officialPublishedAt || item.detectedAt);
    entries.push(`  <entry>
    <title>${escapeXml(item.title || item.shortTitle)}</title>
    <link href="${escapeXml(link)}" rel="alternate" type="text/html"/>
    <id>${escapeXml(host)}/piyasa/${escapeXml(item.slug)}</id>
    <updated>${updated}</updated>
    <summary>${escapeXml(item.summary || "")}</summary>
    <category term="Piyasa Sinyali"/>
    <author>
      <name>SKDMHesapla Piyasa Masası</name>
    </author>
  </entry>`);
  }

  const updatedDate = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>SKDMHesapla — SKDM &amp; CBAM Mevzuat ve Karbon Bildirim Portalı</title>
  <subtitle>Sınırda Karbon Düzenleme Mekanizması (SKDM / CBAM) mevzuat güncellemeleri, ETS karbon piyasa sinyalleri, metodoloji ve Türk ihracatçısı analizleri.</subtitle>
  <link href="${escapeXml(host)}/atom.xml" rel="self" type="application/atom+xml"/>
  <link href="${escapeXml(host)}/" rel="alternate" type="text/html"/>
  <id>${escapeXml(host)}/</id>
  <updated>${updatedDate}</updated>
  <author>
    <name>SKDMHesapla Uzman Heyeti</name>
    <email>iletisim@skdmhesapla.com</email>
  </author>
${entries.join("\n")}
</feed>
`;

  const atomPath = path.join(ROOT, "public/atom.xml");
  fs.writeFileSync(atomPath, xml, "utf8");

  return { count: entries.length, atomPath };
}

if (process.argv[1] && process.argv[1].endsWith("generate-atom.mjs")) {
  const result = generateAtom();
  console.log(`atom: generated ${result.count} entries -> public/atom.xml`);
}
