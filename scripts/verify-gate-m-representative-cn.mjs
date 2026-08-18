/**
 * GATE-M (RM-006) kanıt scripti — sektör CN kodları tek kaynak + temsili kod (INV-5).
 *
 * 1. Sektör → temsili CN eşlemesi tek kaynaktan (annex-ruleset.ts SECTORS)
 *    gelir; hem /basla/ hem sihirbaz kartı aynı `representativeCn` alanını
 *    kullanır.
 * 2. Gösterilen kod sektörün ana ürün grubunu temsil eder (demir-çelik 72xx,
 *    çimento 2523) — marginal annex kodları (2601 12 00, 2507 00 80) başlıkta
 *    gösterilmez.
 * 3. "CN CN" tekrarı düzeltildi: kart değeri "CN " öneki taşımaz, şablon tek
 *    önek basar.
 *
 * Kullanım: npx tsx scripts/verify-gate-m-representative-cn.mjs
 */
import { readFileSync } from "node:fs";
import { SECTORS } from "../src/lib/skdm/annex-ruleset";

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

// ── 1) Tek kaynak + 6 sektör için temsili kod ───────────────────────────────
const ids = Object.keys(SECTORS);
check("SECTORS 6 sektörü tanımlıyor", ids.length === 6);
check("Her sektörde representativeCn var", ids.every((id) => typeof SECTORS[id].representativeCn === "string" && SECTORS[id].representativeCn.length > 0));

// ── 2) Temsili kodlar ana ürün grubunu gösterir ─────────────────────────────
const EXPECT = {
  "iron-steel": "7201–7229", // 72xx — demir ve çelik ana faslı
  aluminum: "7601–7616",
  cement: "2523", // çimento ana pozisyonu
  fertilizer: "2808 00 00",
  hydrogen: "2804 10 00",
  electricity: "2716 00 00",
};
for (const id of ids) {
  check(`${id}: temsili kod = ${EXPECT[id]}`, SECTORS[id].representativeCn === EXPECT[id]);
}
check("Demir-çelik kartı marginal 2601 12 00 göstermiyor", !SECTORS["iron-steel"].representativeCn.includes("2601"));
check("Çimento kartı marginal 2507 00 80 göstermiyor", !SECTORS.cement.representativeCn.includes("2507"));
check("Demir-çelik temsilcisi 72xx ana faslını taşıyor", SECTORS["iron-steel"].representativeCn.startsWith("7201"));
check("Çimento temsilcisi 2523 pozisyonunu taşıyor", SECTORS.cement.representativeCn.startsWith("2523"));

// ── 3) İki sayfa aynı kaynağı kullanır + "CN CN" yok ────────────────────────
const triage = readFileSync("src/components/wizard/ScopeTriage.tsx", "utf8");
const basla = readFileSync("src/components/basla/BaslaPage.tsx", "utf8");

check("Sihirbaz kartı representativeCn kullanır", triage.includes("def.representativeCn"));
check("Sihirbaz kartında 'CN CN' üretimi yok", !triage.includes('"CN " +') && !triage.includes("`CN ${def.cnRangeLabel") && !triage.includes("CN CN"));
check("/basla/ annex-ruleset SECTORS import eder", basla.includes('from "@/lib/skdm/annex-ruleset"'));
check("/basla/ kartı representativeCn kullanır", basla.includes("ANNEX_SECTORS[s.id as SectorId].representativeCn"));
check("/basla/ kartında eski cnCodes[0] kalmadı", !basla.includes("s.cnCodes[0]"));
check("Temsili değerler 'CN ' öneki taşımıyor (şablon tek önek basar)", ids.every((id) => !SECTORS[id].representativeCn.startsWith("CN ")));

console.log(`\n${"-".repeat(60)}`);
console.log("KANIT — altı sektör, iki sayfa (aynı kaynak):");
for (const id of ids) {
  console.log(`  ${SECTORS[id].labelTr.padEnd(22)} /basla/ "CN: ${SECTORS[id].representativeCn}"  ·  sihirbaz "CN ${SECTORS[id].representativeCn}"`);
}
console.log(`${"-".repeat(60)}`);

if (FAIL.length === 0) {
  console.log(`\nGATE-M KANIT GEÇTİ (${PASS.length} kontrol)`);
} else {
  console.log(`\nGATE-M KANIT KALDI: ${FAIL.length} başarısız`);
  process.exitCode = 1;
}
