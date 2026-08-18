/**
 * GATE-7 (RM-007) kanıt scripti — CN kodu üçlüsü tek kaynak (INV-5).
 *
 * Sorun: demir-çelikte dört farklı kod dolaşıyordu (/basla/ "7201-7229",
 * sihirbaz kartı "2601 12 00", URL "7210", paket gerçek kodları).
 *
 * Çözüm: sektör → temsili CN eşlemesi yalnızca annex-ruleset.ts'te tanımlı
 * (`representativeCn` kart gösterimi, `cardCnHint` route/URL gerçek kodu).
 * ScopeTriage'taki ikinci kaynak (CARD_CN_HINT) kaldırıldı; /basla/ kartı
 * bu üçlüden beslenir.
 *
 * Kullanım: npx tsx scripts/verify-gate-7-cn-tek-kaynak.mjs
 */
import { readFileSync } from "node:fs";
import { SECTORS } from "../src/lib/skdm/annex-ruleset";
import { routeVerdict } from "../src/lib/skdm/resolve-scope";

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

// ── 1) Tek kaynak: her sektörde representativeCn + cardCnHint tanımlı ────────
const ids = Object.keys(SECTORS);
check("6 sektörün tamamında cardCnHint var", ids.every((id) => typeof SECTORS[id].cardCnHint === "string" && SECTORS[id].cardCnHint.length === 8));
check("6 sektörün tamamında representativeCn var", ids.every((id) => typeof SECTORS[id].representativeCn === "string" && SECTORS[id].representativeCn.length > 0));

// ── 2) cardCnHint gerçek bir kod — routeVerdict'ten geçer ────────────────────
for (const id of ids) {
  const v = routeVerdict(SECTORS[id].cardCnHint);
  check(
    `${id}: cardCnHint "${SECTORS[id].cardCnHint}" kapsam-içi karar üretiyor`,
    v.status === "in_scope" && v.scope.sector?.slug === SECTORS[id].slug
  );
}

// ── 3) Demir-çelik temsili 72xx; marginal 2601 başlıkta yok ──────────────────
check("Demir-çelik representativeCn 72xx serisinde", SECTORS["iron-steel"].representativeCn.startsWith("7201"));
check("Demir-çelik representativeCn 2601 içermiyor", !SECTORS["iron-steel"].representativeCn.includes("2601"));
check("Demir-çelik cardCnHint 72xx serisinde", SECTORS["iron-steel"].cardCnHint.startsWith("72"));
check("2601 12 00 hiçbir kart gösteriminde yok", !SECTORS["iron-steel"].representativeCn.includes("2601 12 00"));

// ── 4) İkinci kaynak CARD_CN_HINT kaldırıldı (kaynak tekliği) ────────────────
const triage = readFileSync("src/components/wizard/ScopeTriage.tsx", "utf8");
check("ScopeTriage'ta CARD_CN_HINT tanımı YOK", !triage.includes("CARD_CN_HINT"));
check("ScopeTriage cardCnHint'ten beslenir", triage.includes(".cardCnHint"));
check("ScopeTriage'ta kopya sabit CN eşlemesi YOK", !/const CARD_CN|72142000/.test(triage.replace(/SECTORS\[[^\]]*\]\.cardCnHint/g, "")));

// ── 5) /basla/ kartı aynı tek kaynaktan beslenir + URL gerçek kodu taşır ─────
const basla = readFileSync("src/components/basla/BaslaPage.tsx", "utf8");
check("/basla/ annex-ruleset'ten beslenir", basla.includes('from "@/lib/skdm/annex-ruleset"'));
check("/basla/ kart gösterimi representativeCn kullanır", basla.includes("def.representativeCn"));
check("/basla/ kart linki cardCnHint'i URL'e taşır", basla.includes("def.cardCnHint"));
check("/basla/ URL'inde encodeURIComponent var (uydurma kısaltma yok)", basla.includes("encodeURIComponent(hint)"));

// ── 6) src/ içinde başka kart/kaynak yok: 2601/7210 kod taraması ─────────────
const rule = readFileSync("src/lib/skdm/annex-ruleset.ts", "utf8");
const other = [
  "src/lib/skdm/config.ts",
  "src/components/wizard/SkdmWizard.tsx",
  "src/components/wizard/ScopeTriage.tsx",
  "src/components/basla/BaslaPage.tsx",
].map((f) => [f, readFileSync(f, "utf8")]);

check(
  "Sihirbaz kartı/URL kaynağında 2601/7210 kopya tanım YOK",
  !["src/components/wizard/SkdmWizard.tsx", "src/components/wizard/ScopeTriage.tsx", "src/components/basla/BaslaPage.tsx"]
    .some((f) => {
      const src = readFileSync(f, "utf8");
      return src.includes("2601") || src.includes("7210");
    })
);
check(
  "annex-ruleset kapsam tanımında 2601 prefix'i yalnız hukuki önek (başlık değil)",
  rule.includes("26011200") && !rule.includes('representativeCn: "2601')
);
// config.ts cnCodes yalnız PDF/sektör sayfası için "aday CN aralığı" örneğidir;
// kart/başlık/URL kaynağı değildir.
check(
  "config.ts cnCodes başlık/kart/URL kaynağı değil (yalnız aday örnek liste)",
  readFileSync("src/lib/skdm/config.ts", "utf8").includes('cnCodes: ["7201-7203"')
);

console.log(`\n${"-".repeat(60)}`);
console.log("KANIT — üçlü tek kaynaktan:");
for (const id of ids) {
  const s = SECTORS[id];
  console.log(`  ${s.labelTr.padEnd(22)} kart "CN: ${s.representativeCn}" · URL ?cn=${s.cardCnHint.replace(/(\d{2})(?=\d)/g, "$1 ").trim()}`);
}
console.log(`${"-".repeat(60)}`);

if (FAIL.length === 0) {
  console.log(`\nGATE-7 KANIT GEÇTİ (${PASS.length} kontrol)`);
} else {
  console.log(`\nGATE-7 KANIT KALDI: ${FAIL.length} başarısız`);
  process.exitCode = 1;
}
