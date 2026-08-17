/**
 * Kapsam çözücü + çıkmaz sokak yasağı.
 * CI: npm run test:regression
 */
import {
  resolveScope,
  routeVerdict,
  suggestTierBMaterials,
  assertNoDeadEnd,
  assertNoSkdmCalcWhenOutOfScope,
  assertCopyIsClean,
  TIERB_MATERIAL_IDS,
} from "../../src/lib/skdm/resolve-scope";
import { reconcileWithOfficialList, SECTORS } from "../../src/lib/skdm/annex-ruleset";

let pass = 0;
let fail = 0;
function t(name: string, cond: boolean, extra = "") {
  if (cond) {
    pass++;
    console.log("  ✓", name);
  } else {
    fail++;
    console.log("  ✗", name, extra);
  }
}

console.log("\n═══ 1. KAPSAM ÇÖZÜCÜ ═══");
const dc = resolveScope("7214 20 00");
t("7214 20 00 → demir-çelik", dc.sector?.id === "iron-steel", String(dc.sector?.id));
t("demir-çelik Annex II direkt-only", dc.annexIIDirectOnly === true);

const alu = resolveScope("7610 90 90");
t("7610 90 90 → ALÜMİNYUM (demir-çelik DEĞİL)", alu.sector?.id === "aluminum", String(alu.sector?.id));
t("alüminyum Annex II direkt-only", alu.annexIIDirectOnly === true);
t("alüminyum slug doğru", alu.sector?.slug === "aluminyum");

const cim = resolveScope("2523 10 00");
t("2523 10 00 → çimento", cim.sector?.id === "cement");
t("çimento endirekt DE fiyatlanır", cim.annexIIDirectOnly === false);

const gub = resolveScope("3102 10 10");
t("3102 → gübre", gub.sector?.id === "fertilizer");
t("gübre endirekt DE fiyatlanır", gub.annexIIDirectOnly === false);

t("2804 10 00 → hidrojen", resolveScope("2804 10 00").sector?.id === "hydrogen");
t("2716 00 00 → elektrik", resolveScope("2716 00 00").sector?.id === "electricity");
t("26011200 → sinterlenmiş cevher / demir-çelik", resolveScope("26011200").sector?.id === "iron-steel");

console.log("\n═══ 2. KAPSAM DIŞI ═══");
const cam = resolveScope("7005 29 80");
t("cam (70. fasıl) kapsam dışı", cam.status === "out_of_scope");
t("cam fasıl açıklaması var", cam.chapterLabelTr === "Cam ve cam eşya", cam.chapterLabelTr);
const tekstil = resolveScope("6109 10 00");
t("tişört kapsam dışı", tekstil.status === "out_of_scope");
t("hurda 7204 kapsam dışı", resolveScope("72041000").status === "out_of_scope");
t("31056000 kapsam dışı", resolveScope("31056000").status === "out_of_scope");
t("boş kod → GTİP isteniyor", resolveScope("").status === "needs_cn_code");
t("2 haneli kod → GTİP isteniyor", resolveScope("72").status === "needs_cn_code");

console.log("\n═══ 3. EN UZUN ÖNEK KAZANIR ═══");
t("28080000 → gübre (nitrik asit)", resolveScope("28080000").sector?.id === "fertilizer");
t("28041000 → hidrojen (2804 spesifik)", resolveScope("28041000").sector?.id === "hydrogen");
t("2805 → kapsam dışı", resolveScope("28051100").status === "out_of_scope");

console.log("\n═══ 4. MALZEME ÖNERİSİ ═══");
t("sadece cam → glass", JSON.stringify(suggestTierBMaterials({ invoice: "cam" })) === '["glass"]');
t(
  "komple sistem → aluminium+glass",
  JSON.stringify(suggestTierBMaterials({ invoice: "sistem" })) === '["aluminium","glass"]',
);
t(
  "çelik çerçeve → steel",
  suggestTierBMaterials({ invoice: "profil", frame: "celik" }).includes("steel"),
);
t(
  "tekrar eklenmiyor",
  suggestTierBMaterials({ invoice: "profil", frame: "alu" }).filter((x) => x === "aluminium").length === 1,
);
t("uydurma malzeme reddedilir", suggestTierBMaterials({ dominantMaterial: "uydurma_seffaf_madde" }).length === 0);
t("hiçbir ipucu yoksa boş", suggestTierBMaterials({}).length === 0);

console.log("\n═══ 5. ÇIKMAZ SOKAK YASAĞI ═══");
const camRoute = routeVerdict("7005 29 80", { invoice: "cam" });
t(
  "kapsam dışı → Kademe B BİRİNCİL",
  camRoute.ctas[0].variant === "primary" && camRoute.ctas[0].href.includes("/tedarikci-verisi/"),
  camRoute.ctas[0].href,
);
t(
  "kapsam dışı beyanı seçeneği KORUNDU",
  camRoute.ctas.some((c) => c.href === "/kapsam-disi-beyani/"),
);
t("malzeme parametresi ön-dolduruldu", camRoute.ctas[0].href.includes("malzeme=glass"), camRoute.ctas[0].href);
t("köprü metni var", (camRoute.bridgeTr ?? "").includes("Kapsam 3"));

try {
  assertNoDeadEnd(camRoute);
  t("assertNoDeadEnd geçti", true);
} catch (e: unknown) {
  t("assertNoDeadEnd geçti", false, e instanceof Error ? e.message : String(e));
}
try {
  assertNoSkdmCalcWhenOutOfScope(camRoute);
  t("kapsam dışı SKDM'ye sızmıyor", true);
} catch (e: unknown) {
  t("kapsam dışı SKDM'ye sızmıyor", false, e instanceof Error ? e.message : String(e));
}
try {
  assertCopyIsClean(camRoute);
  t("yasaklı ifade yok", true);
} catch (e: unknown) {
  t("yasaklı ifade yok", false, e instanceof Error ? e.message : String(e));
}

const belirsiz = routeVerdict("", { invoice: "cam" });
try {
  assertNoDeadEnd(belirsiz);
  t("GTİP eksik dalında da Kademe B var", true);
} catch (e: unknown) {
  t("GTİP eksik dalında da Kademe B var", false, e instanceof Error ? e.message : String(e));
}

const aluRoute = routeVerdict("7610 90 90", {});
t(
  "7610 → /hesapla/aluminyum/ (demir-çelik DEĞİL)",
  aluRoute.ctas[0].href === "/hesapla/aluminyum/",
  aluRoute.ctas[0].href,
);

console.log("\n═══ 6. NEGATİF TEST — çıkmaz sokak yakalanıyor mu ═══");
const kotuRoute = { ...camRoute, ctas: [{ labelTr: "Tamam", href: "/", variant: "primary" as const }] };
try {
  assertNoDeadEnd(kotuRoute);
  t("çıkmaz sokak YAKALANMADI (hata!)", false);
} catch {
  t("çıkmaz sokak doğru şekilde yakalandı", true);
}

const kotuMetin = { ...camRoute, bodyTr: "Bu ürün için işlem gerekmez." };
try {
  assertCopyIsClean(kotuMetin);
  t("yasaklı ifade YAKALANMADI (hata!)", false);
} catch {
  t("yasaklı ifade doğru şekilde yakalandı", true);
}

console.log("\n═══ 7. RESMİ LİSTE MUTABAKATI ═══");
const rep = reconcileWithOfficialList(
  ["72142000", "76109090", "25231000", "31021010", "28041000", "27160000", "72083900"],
  ["70052980", "61091000"],
);
t(
  "resmi listedeki 7 kodun tamamı kapsanıyor",
  rep.missingFromRuleset.length === 0,
  JSON.stringify(rep.missingFromRuleset),
);
t("cam/tekstil fazla kapsanmıyor", rep.extraInRuleset.length === 0, JSON.stringify(rep.extraInRuleset));
t("mutabakat temiz", rep.isClean);

console.log("\n═══ 8. SEKTÖR TANIMLARI TUTARLI ═══");
const directOnly = Object.values(SECTORS)
  .filter((s) => s.annexIIDirectOnly)
  .map((s) => s.id)
  .sort();
t(
  "Annex II direkt-only tam olarak 4 sektör",
  JSON.stringify(directOnly) === JSON.stringify(["aluminum", "electricity", "hydrogen", "iron-steel"]),
  JSON.stringify(directOnly),
);
t("malzeme id listesi 32 kalem", TIERB_MATERIAL_IDS.length === 32, String(TIERB_MATERIAL_IDS.length));

console.log(`\n═══ SONUÇ: ${pass} geçti, ${fail} başarısız ═══`);
if (fail > 0) process.exit(1);
