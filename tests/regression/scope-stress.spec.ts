/**
 * Arama kutusu stres testi — 45 vaka, 9 kategori.
 * CI: npm run test:scope
 */
import {
  resolveScope,
  routeVerdict,
  assertNoDeadEnd,
  assertNoSkdmCalcWhenOutOfScope,
  assertCopyIsClean,
} from "../../src/lib/skdm/resolve-scope";

interface Case {
  grup: string;
  girdi: string;
  beklenen: string;
  not?: string;
}

const cases: Case[] = [
  { grup: "A", girdi: "7214 20 00", beklenen: "iron-steel", not: "nervürlü inşaat demiri" },
  { grup: "A", girdi: "7601 10 00", beklenen: "aluminum", not: "işlenmemiş alüminyum" },
  { grup: "A", girdi: "2523 10 00", beklenen: "cement", not: "klinker" },
  { grup: "A", girdi: "3102 10 10", beklenen: "fertilizer", not: "üre" },
  { grup: "B", girdi: "7318 15 90", beklenen: "iron-steel", not: "vida-somun, downstream" },
  { grup: "B", girdi: "7610 90 90", beklenen: "aluminum", not: "7610 demir-çelik DEĞİL" },
  { grup: "B", girdi: "2804 10 00", beklenen: "hydrogen" },
  { grup: "B", girdi: "2716 00 00", beklenen: "electricity" },
  { grup: "C", girdi: "7005 29 80", beklenen: "out", not: "float cam" },
  { grup: "C", girdi: "6109 10 00", beklenen: "out", not: "pamuklu tişört" },
  { grup: "C", girdi: "3923 30 10", beklenen: "out", not: "plastik şişe" },
  { grup: "C", girdi: "9403 20 80", beklenen: "out", not: "metal mobilya" },
  { grup: "D", girdi: "7204 41 10", beklenen: "out", not: "çelik hurda" },
  { grup: "D", girdi: "7602 00 19", beklenen: "out", not: "alüminyum hurda" },
  { grup: "D", girdi: "6811 40 00", beklenen: "out", not: "asbestli çimento eşya" },
  { grup: "D", girdi: "8544 49 91", beklenen: "out", not: "elektrik kablosu" },
  { grup: "D", girdi: "2805 11 00", beklenen: "out", not: "sodyum" },
  { grup: "E", girdi: "72142000", beklenen: "iron-steel", not: "boşluksuz" },
  { grup: "E", girdi: "7214.20.00", beklenen: "iron-steel", not: "noktalı" },
  { grup: "E", girdi: "7214-20-00", beklenen: "iron-steel", not: "tireli" },
  { grup: "E", girdi: "  7214 20 00  ", beklenen: "iron-steel", not: "baş/son boşluk" },
  { grup: "E", girdi: "7214200000", beklenen: "iron-steel", not: "10 haneli TARIC" },
  { grup: "E", girdi: "721420000000", beklenen: "iron-steel", not: "12 haneli" },
  { grup: "F", girdi: "", beklenen: "needs", not: "boş" },
  { grup: "F", girdi: "72", beklenen: "needs", not: "2 hane" },
  { grup: "F", girdi: "abc", beklenen: "needs", not: "harf" },
  { grup: "F", girdi: "!@#$%^&*()", beklenen: "needs", not: "sembol" },
  { grup: "F", girdi: "<script>alert(1)</script>", beklenen: "needs", not: "XSS" },
  { grup: "F", girdi: "7214' OR '1'='1", beklenen: "iron-steel", not: "SQLi — rakamlar kalır" },
  { grup: "F", girdi: "9".repeat(500), beklenen: "out", not: "500 hane" },
  { grup: "F", girdi: "0000000000", beklenen: "out", not: "tüm sıfır" },
  { grup: "G", girdi: "CAM", beklenen: "needs", not: "büyük harf ürün adı" },
  { grup: "G", girdi: "İNŞAAT DEMİRİ", beklenen: "needs", not: "Türkçe İ" },
  { grup: "G", girdi: "çelik profil", beklenen: "needs", not: "ç küçük" },
  { grup: "G", girdi: "ALÜMİNYUM 7610", beklenen: "aluminum", not: "metin+kod" },
  { grup: "H", girdi: "28080000", beklenen: "fertilizer", not: "nitrik asit" },
  { grup: "H", girdi: "28041000", beklenen: "hydrogen", not: "2804 spesifik" },
  { grup: "H", girdi: "28142000", beklenen: "fertilizer", not: "amonyak çözeltisi" },
  { grup: "H", girdi: "25070080", beklenen: "cement", not: "kalsine kil" },
  { grup: "H", girdi: "25070010", beklenen: "out", not: "kaolin" },
  { grup: "I", girdi: "7229 90 90", beklenen: "iron-steel", not: "72 fasıl üst sınır" },
  { grup: "I", girdi: "7301 10 00", beklenen: "iron-steel", not: "73 fasıl kapsamda" },
  { grup: "I", girdi: "7312 10 20", beklenen: "out", not: "halat" },
  { grup: "I", girdi: "7615 10 10", beklenen: "out", not: "mutfak eşyası" },
  { grup: "I", girdi: "7616 99 90", beklenen: "aluminum", not: "7616 kapsamda" },
];

let ok = 0;
let hata = 0;
const bulunanHatalar: string[] = [];

console.log("\n╔════════════════════════════════════════════════════════════════╗");
console.log("║  ARAMA KUTUSU STRES TESTİ — 45 vaka, 9 kategori               ║");
console.log("╚════════════════════════════════════════════════════════════════╝");

let sonGrup = "";
for (const c of cases) {
  if (c.grup !== sonGrup) {
    console.log(`\n─── GRUP ${c.grup} ───`);
    sonGrup = c.grup;
  }
  const r = resolveScope(c.girdi);
  const actual =
    r.status === "in_scope" ? (r.sector?.id ?? "?") : r.status === "needs_cn_code" ? "needs" : "out";
  const gecti = actual === c.beklenen;
  const gosterim = c.girdi.length > 30 ? c.girdi.slice(0, 27) + "..." : c.girdi;
  if (gecti) {
    ok++;
    console.log(`  ✓ "${gosterim}" → ${actual}${c.not ? "  · " + c.not : ""}`);
  } else {
    hata++;
    console.log(`  ✗ "${gosterim}" → ${actual} (beklenen: ${c.beklenen})${c.not ? "  · " + c.not : ""}`);
    bulunanHatalar.push(`${c.girdi} → ${actual}, beklenen ${c.beklenen} (${c.not ?? ""})`);
  }
}

console.log("\n─── ÇIKMAZ SOKAK DENETİMİ (her kapsam dışı vaka) ───");
let deadEnd = 0;
for (const c of cases.filter((x) => x.beklenen === "out" || x.beklenen === "needs")) {
  const route = routeVerdict(c.girdi, {});
  try {
    assertNoDeadEnd(route);
    assertNoSkdmCalcWhenOutOfScope(route);
    assertCopyIsClean(route);
  } catch (e: unknown) {
    deadEnd++;
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`  ✗ "${c.girdi}": ${msg.slice(0, 70)}`);
  }
}
console.log(
  deadEnd === 0
    ? `  ✓ ${cases.filter((x) => x.beklenen === "out" || x.beklenen === "needs").length} kapsam dışı/belirsiz vakada çıkmaz sokak YOK`
    : `  ✗ ${deadEnd} çıkmaz sokak!`,
);

console.log("\n─── PERFORMANS (500 haneli girdi dahil) ───");
const t0 = Date.now();
for (let i = 0; i < 10000; i++) resolveScope("7214 20 00");
for (let i = 0; i < 100; i++) resolveScope("9".repeat(500));
console.log(`  ✓ 10.100 çözümleme: ${Date.now() - t0} ms (donma yok)`);

console.log(`\n╔══════════════════════════════════════════╗`);
console.log(`║  SONUÇ: ${ok} geçti · ${hata} başarısız              ║`);
console.log(`╚══════════════════════════════════════════╝`);
if (bulunanHatalar.length) {
  console.log("\n⚠️ DÜZELTİLMESİ GEREKENLER:");
  bulunanHatalar.forEach((h, i) => console.log(`  ${i + 1}. ${h}`));
}
if (hata > 0 || deadEnd > 0) process.exit(1);
if (cases.length !== 45) {
  console.error(`vaka sayısı ${cases.length} ≠ 45`);
  process.exit(1);
}
