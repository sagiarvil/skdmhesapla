/**
 * GATE-R (RM-006) kanıt scripti — canonical CI kontrolü (build kırıcı).
 *
 * 1. Registry (SSOT): her rotanın canonicalRoute'u kendi yolu olmalıdır —
 *    bilinçli sapmalar yalnızca `canonicalOverride: true` ile açılır.
 * 2. PUBLISHED_INDEXABLE her sayfa, kendi page.tsx'inde metadata export
 *    etmelidir — aksi halde root layout'un anasayfa metadata'sını sessizce
 *    miras alır (canonical "/" olur). NOINDEX uygulama sayfaları bilinçli
 *    istisnadır (indekslenmezler).
 * 3. /dogrula/ kendi metadata export'una sahiptir: canonical /dogrula/,
 *    kendi title/description/og:url.
 *
 * Kullanım: npx tsx scripts/verify-gate-r-canonical-ci.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const PASS = [];
const FAIL = [];
function check(name, ok, detail = "") {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}${detail ? ` — ${detail}` : ""}`);
}

// ── 1) Registry canonical mutabakatı (SSOT) ─────────────────────────────────
const registry = JSON.parse(readFileSync("data/seo/registry.json", "utf8"));
const entries = registry.entries || [];

const sapma = entries.filter(
  (r) => r.canonicalRoute && r.canonicalRoute !== r.route && r.canonicalOverride !== true
);
check(
  "Registry: canonicalRoute ≠ route olan sayfa yok (override'sız)",
  sapma.length === 0,
  sapma.map((r) => `${r.route} → ${r.canonicalRoute}`).join(", ")
);
const dogrulaEntry = entries.find((r) => r.route === "/dogrula/");
check("Registry: /dogrula/ canonicalRoute = /dogrula/", dogrulaEntry?.canonicalRoute === "/dogrula/");

// ── 2) /dogrula/ kendi metadata export'una sahip ────────────────────────────
const dogrulaSrc = readFileSync("src/app/dogrula/page.tsx", "utf8");
check("/dogrula/ page.tsx metadata export eder", /export const metadata/.test(dogrulaSrc));
check("/dogrula/ metadata path'i kendi yoludur", dogrulaSrc.includes('path: "/dogrula/"'));
check("/dogrula/ page.tsx server bileşendir (client değil)", !dogrulaSrc.startsWith('"use client"'));
check("/dogrula/ kendi title'ına sahip", /title: "Mühür doğrula"/.test(dogrulaSrc));
check("/dogrula/ kendi description'ına sahip", /description:\s*"/.test(dogrulaSrc));

// ── 3) Indexable sayfalar metadata export eder ──────────────────────────────
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (name === "page.tsx") acc.push(p);
  }
  return acc;
}
const appPages = walk("src/app");
const pageByRoute = new Map(
  appPages.map((p) => [p.replace("src/app", "").replace("page.tsx", ""), p])
);

const indexable = entries.filter((r) => r.state === "PUBLISHED_INDEXABLE");
const eksik = [];
for (const r of indexable) {
  const p = pageByRoute.get(r.route);
  if (!p) continue;
  const src = readFileSync(p, "utf8");
  if (!/export const metadata/.test(src) && !/export (async )?function generateMetadata/.test(src)) {
    eksik.push(r.route);
  }
}
check(
  "Indexable sayfaların tamamı kendi metadata'sını export eder",
  eksik.length === 0,
  eksik.join(", ")
);

// /basla/ ve /hesapla/[sector]/ de düzeltildi (GATE-R kapsamı genişletmesi).
const baslaSrc = readFileSync("src/app/basla/page.tsx", "utf8");
check("/basla/ metadata export eder", /export const metadata/.test(baslaSrc));
check("/basla/ canonical kendi yolu", baslaSrc.includes('path: "/basla/"'));
const hesaplaSrc = readFileSync("src/app/hesapla/[sector]/page.tsx", "utf8");
check("/hesapla/[sector]/ generateMetadata üretir", /export function generateMetadata/.test(hesaplaSrc));
check("/hesapla/[sector]/ canonical kendi yolu", hesaplaSrc.includes('path: `/hesapla/${sector}/`'));

console.log(`\n${"-".repeat(60)}`);
console.log(`Taranan page.tsx: ${appPages.length} · Registry rotası: ${entries.length} · Indexable: ${indexable.length}`);
console.log(`${"-".repeat(60)}`);

if (FAIL.length === 0) {
  console.log(`\nGATE-R KANIT GEÇTİ (${PASS.length} kontrol)`);
} else {
  console.log(`\nGATE-R KANIT KALDI: ${FAIL.length} başarısız — build kırılır`);
  process.exitCode = 1;
}
