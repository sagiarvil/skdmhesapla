/**
 * GATE-N (RM-006) kanıt scripti — adım sayacı tek sabit; pazarlama sayıları eşit (INV-5).
 *
 * 1. Sihirbaz adım sayısı tek kaynak: STEPS.length — sihirbazdaki tek ilerleme
 *    göstergesi (üstteki adım izi) bu değeri kullanır; `stepCount` sabitiyle
 *    birebir eşittir (11).
 * 2. Ekranda yalnızca bir ilerleme göstergesi vardır — NavRow'daki ikinci
 *    sayaç ("Adım X / 10") kaldırılmıştır; hardcoded payda yoktur.
 * 3. Pazarlama metinleri: "11 adımlı sihirbaz" PLATFORM_STATS.stepCount'tan,
 *    "10 katmanlı" PLATFORM_STATS.layerCount'ten beslenir; elle yazılmış
 *    sayı kalmadı.
 *
 * Kullanım: npx tsx scripts/verify-gate-n-step-counter.mjs
 */
import { readFileSync } from "node:fs";
import { PLATFORM_STATS } from "../src/lib/skdm/constants";

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

const wizard = readFileSync("src/components/wizard/SkdmWizard.tsx", "utf8");

// ── 1) Sihirbazdaki tek gösterge + tek sabit ────────────────────────────────
check("Adım sayısı sabitlerde tanımlı (stepCount=15)", PLATFORM_STATS.stepCount === 15);
check("Katman sayısı sabitlerde tanımlı (layerCount=10)", PLATFORM_STATS.layerCount === 10);

// Tek ilerleme göstergesi: üstteki adım izi, payda STEPS.length (1 tabanlı).
check("Tek ilerleme göstergesi: {step + 1} / {STEPS.length}", wizard.includes("{step + 1} / {STEPS.length}"));
// NavRow'da hardcoded paydalı sayaç kalmadı.
check("NavRow'da 'Adım {step} / 10' sayacı kaldırıldı", !wizard.includes("Adım {step} / 10"));
check("NavRow'da hardcoded '10' paydası yok", !wizard.includes("/ 10</span>") && !wizard.includes("} / 10"));
// Sıfır tabanlı eski gösterge izleri yok.
check("Wizard'da '1 / 11' literal'i yok", !wizard.includes("1 / 11"));
check("Wizard'da '0 / 10' literal'i yok", !wizard.includes("0 / 10"));
// STEPS dizisi 15 adım içeriyor (triyaj + 4 kimlik/dönem + 9 veri + doğrulayıcı/akreditasyon bölünmesi).
const stepsDef = wizard.match(/const STEPS = \[([\s\S]*?)\] as const;/)?.[1] ?? "";
const stepCount = (stepsDef.match(/n: \d+/g) ?? []).length;
check(`STEPS tanımı 15 adım içeriyor (bulunan: ${stepCount})`, stepCount === PLATFORM_STATS.stepCount);

// ── 2) Pazarlama metinleri sabitten beslenir ────────────────────────────────
const hakkinda = readFileSync("src/app/hakkinda/page.tsx", "utf8");
check("/hakkinda/ 'adımlı sihirbaz' sayısını stepCount'tan besler", hakkinda.includes("{PLATFORM_STATS.stepCount} adımlı sihirbaz"));
const jsonld = readFileSync("src/lib/seo/jsonld.ts", "utf8");
const seo = readFileSync("src/lib/skdm/seo.ts", "utf8");
check("jsonld 'adımlı sihirbaz' stepCount'tan beslenir", jsonld.includes("{PLATFORM_STATS.stepCount} adımlı sihirbaz"));
check("seo 'adımlı sihirbaz' stepCount'tan beslenir", seo.includes("{PLATFORM_STATS.stepCount} adımlı sihirbaz"));
const fiyat = readFileSync("src/app/fiyatlandirma/page.tsx", "utf8");
check("fiyatlandırma SSS 'katmanlı' sayısını layerCount'tan besler", fiyat.includes("{PLATFORM_STATS.layerCount} katmanlı veri girişi"));
check("fiyatlandırma SSS'nde elle yazılmış '10 katmanlı' yok", !fiyat.includes('"10 katmanlı'));

console.log(`\n${"-".repeat(60)}`);
console.log(`stepCount = ${PLATFORM_STATS.stepCount} (sihirbaz adımları) · layerCount = ${PLATFORM_STATS.layerCount} (kalite katmanları)`);
console.log(`Wizard göstergesi: "Kapsam · 1 / ${PLATFORM_STATS.stepCount}" … "Özet ve mühür · ${PLATFORM_STATS.stepCount} / ${PLATFORM_STATS.stepCount}"`);
console.log(`${"-".repeat(60)}`);

if (FAIL.length === 0) {
  console.log(`\nGATE-N KANIT GEÇTİ (${PASS.length} kontrol)`);
} else {
  console.log(`\nGATE-N KANIT KALDI: ${FAIL.length} başarısız`);
  process.exitCode = 1;
}
