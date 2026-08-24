#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { ROOT } from "./load.mjs";

const sources = JSON.parse(fs.readFileSync(path.join(ROOT, "data/seo/regulatory-watch-sources.json"), "utf8")).sources ?? [];
const stateDir = path.join(ROOT, ".regulatory-watch");
const statePath = path.join(stateDir, "state.json");
const reportPath = path.join(ROOT, "regulatory-watch-result.md");
fs.mkdirSync(stateDir, { recursive: true });

let previous = { sources: {} };
if (fs.existsSync(statePath)) {
  try { previous = JSON.parse(fs.readFileSync(statePath, "utf8")); } catch { previous = { sources: {} }; }
}

function normalizeHtml(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function sha256(value) { return createHash("sha256").update(value).digest("hex"); }

const next = { checkedAt: new Date().toISOString(), sources: {} };
const changes = [];
const failures = [];

for (const source of sources) {
  try {
    const response = await fetch(source.url, {
      headers: { "user-agent": "SKDMHesapla-Regulatory-Watch/1.0 (+https://skdmhesapla.com/mevzuat-guncellemeleri/)" },
      redirect: "follow",
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    const normalized = normalizeHtml(html);
    const record = {
      id: source.id,
      url: source.url,
      finalUrl: response.url,
      etag: response.headers.get("etag"),
      lastModified: response.headers.get("last-modified"),
      contentHash: sha256(normalized),
      contentLength: normalized.length,
      checkedAt: next.checkedAt,
    };
    next.sources[source.id] = record;
    const old = previous.sources?.[source.id];
    if (old && old.contentHash !== record.contentHash) {
      changes.push({ source, old, record });
    }
  } catch (error) {
    failures.push({ source, message: error instanceof Error ? error.message : String(error) });
    if (previous.sources?.[source.id]) next.sources[source.id] = previous.sources[source.id];
  }
}

fs.writeFileSync(statePath, JSON.stringify(next, null, 2) + "\n");
const lines = [
  "# CBAM resmî kaynak izleme sonucu", "",
  `Kontrol zamanı: ${next.checkedAt}`, "",
  "Bu çıktı yalnız **değişiklik tespiti** içindir. Production mevzuat kaydı otomatik yayımlanmaz; resmi içerik insan incelemesinden sonra `APPROVED` yapılmalıdır.", "",
];
if (changes.length) {
  lines.push("## Değişiklik tespit edilen kaynaklar", "");
  for (const { source, old, record } of changes) {
    lines.push(`- **${source.label}**`, `  - ${source.url}`, `  - Önceki hash: \`${old.contentHash.slice(0, 16)}\``, `  - Yeni hash: \`${record.contentHash.slice(0, 16)}\``, `  - Last-Modified: ${record.lastModified || "yok"}`);
  }
  lines.push("", "## İnceleme kapısı", "", "1. Resmî sayfada hukuki/operasyonel olarak anlamlı değişiklik olup olmadığını doğrulayın.", "2. Gerekirse `data/seo/regulatory-updates.json` içine `CANDIDATE` kayıt ekleyin.", "3. Kaynak, tarih, hukuki ağırlık ve ihracatçı etkisi insan tarafından doğrulandıktan sonra `APPROVED` yapın.", "4. Build sonrası ana sayfa, detay URL, sitemap, Markdown, llms.txt ve schema otomatik türetilir.", "");
} else {
  lines.push("## Sonuç", "", previous.checkedAt ? "İzlenen kaynaklarda yeni içerik hash değişikliği tespit edilmedi." : "İlk çalıştırma baseline oluşturdu; bildirim üretilmedi.", "");
}
if (failures.length) {
  lines.push("## Erişim uyarıları", "");
  for (const f of failures) lines.push(`- ${f.source.label}: ${f.message}`);
  lines.push("");
}
fs.writeFileSync(reportPath, lines.join("\n"));

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changes.length > 0 ? "true" : "false"}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `change_count=${changes.length}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `failure_count=${failures.length}\n`);
}

console.log(`regulatory-watch: ${changes.length} change, ${failures.length} fetch warning`);
