/**
 * GATE-M3 kanıt scripti — Doğrulayıcı Çalışma Alanı satır-bazlı spesifiklik (RM-005).
 *
 * SEAL-2026-DC-7782 vaka verisiyle (2 CN kodlu: G1=7214 20 00/EAF, G2=7208 39 00/BF-BOF)
 * mühürlü paket üretir, Dogrulayici-Calisma-Alani.xlsx içindeki kontrol satırlarını
 * register satırlarıyla birebir eşleşme olarak doğrular.
 * INV-3: kontrol satırı statik şablon metninden değil register satırından türetilir.
 *
 * Kullanım: npx tsx scripts/verify-gate-m3-worksheet.mjs
 */
import { calculateSkdmLiability } from "../src/lib/skdm/calculator";
import { createSealedAuditPackage, sealedFileBytes } from "../src/lib/skdm/package-seal";
import { extractStoreZip } from "./verify-sealed-package.mjs";

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

// ── SEAL-2026-DC-7782 mandate senaryosu (2 CN, 2 rota) ──────────────────────
const result = calculateSkdmLiability({
  sectorId: "iron-steel",
  productionVolume: 1250,
  year: 2026,
  importerAnnualVolumeStatus: "over50",
  useCustomEmissions: true,
  customDirectEmission: 1.42,
  customIndirectEmission: 0,
  etsQuarter: "2026-Q1",
  euEtsPriceEur: 75.4,
  trEtsNettingEur: 0,
  hasVerificationEvidence: true,
});
check("Fail-Closed ön koşul: hazırlık %100", result.readinessScore === 100);

const pkg = createSealedAuditPackage(result, {
  sessionId: "sess-gate-m3",
  sectorSlug: "demir-celik",
  goods: [
    { id: "g1", category: "Sıcak haddelenmiş çubuklar", cn: "7214 20 00", route: "EAF" },
    { id: "g2", category: "Sıcak haddelenmiş yassı ürün", cn: "7208 39 00", route: "BF-BOF" },
  ],
  processes: [
    { id: "p1", name: "Çelik üretimi", included: ["Yakma", "Proses"] },
    { id: "p2", name: "Sıcak haddeler", included: ["Haddeleme"] },
  ],
  streams: [
    { method: "Hesap tabanlı", name: "Doğalgaz", ad: 480000, unit: "Nm³", ncv: "34,5 MJ/Nm³", processId: "p1" },
    { method: "Hesap tabanlı", name: "Hurda", ad: 1350, unit: "ton", ncv: "-", processId: "p1" },
  ],
  precs: [
    { name: "İnşaat demiri (kütük)", total: 900, internal: 900, other: 0, source: "Tesis içi üretim", see: 0.55 },
  ],
  dProcesses: { a: 1250, b: 1250, c: 0, d: 0 },
  fieldValues: {
    vFirma: "TEB Metal & Alüminyum San. Tic. A.Ş.",
    vkn: "1000036109",
    tonaj: "1250",
  },
});
check("Paket üretildi", pkg.files.length > 0);

// ── XLSX çıkarımı ───────────────────────────────────────────────────────────
const file4 = pkg.files.find((f) => f.filename === "Dogrulayici-Calisma-Alani.xlsx");
check("Dogrulayici-Calisma-Alani.xlsx pakette mevcut", Boolean(file4));
const xlsxFiles = extractStoreZip(sealedFileBytes(file4));
const sheet = xlsxFiles["xl/worksheets/sheet1.xml"]?.toString("utf8") ?? "";
check("sheet1.xml çıkarıldı", sheet.length > 0);

/** satır bazında hücre metinlerini döndürür */
function rowsOf(xml) {
  const out = [];
  const rowRe = /<row[^>]*>([\s\S]*?)<\/row>/g;
  let rm;
  while ((rm = rowRe.exec(xml))) {
    const cells = [];
    const cellRe = /<c[^>]*>(?:<is><t[^>]*>([\s\S]*?)<\/t><\/is>|<v>([\s\S]*?)<\/v>)?<\/c>/g;
    let cm;
    while ((cm = cellRe.exec(rm[1]))) {
      cells.push((cm[1] ?? cm[2] ?? "").trim());
    }
    out.push(cells);
  }
  return out;
}
const rows = rowsOf(sheet);
const text = rows.map((r) => r.join("|")).join("\n");

// ── G: her mal kategorisi satırı için ayrı CN eşleşmesi ────────────────────
const cnRows = rows.filter((r) => r[1] === "GTİP / CN Kod Eşleşmesi");
check("G register 2 satır → 2 ayrı CN eşleşmesi satırı", cnRows.length === 2);
const g1 = cnRows.find((r) => r[0] === "G1");
const g2 = cnRows.find((r) => r[0] === "G2");
check("G1 kendi CN kodunu gösterir (7214 20 00)", Boolean(g1) && g1.join("|").includes("7214 20 00"));
check("G1 kendi rotasını gösterir (EAF)", Boolean(g1) && g1.join("|").includes("EAF"));
check("G2 kendi CN kodunu gösterir (7208 39 00)", Boolean(g2) && g2.join("|").includes("7208 39 00"));
check("G2 kendi rotasını gösterir (BF-BOF)", Boolean(g2) && g2.join("|").includes("BF-BOF"));
check("G1/G2 sektör CN aralığında → Kayıtlı", cnRows.every((r) => r[2] === "Kayıtlı"));

// ── B: her kaynak akışı satırı için ayrı kontrol ───────────────────────────
const streamRows = rows.filter((r) => r[1] === "Kaynak Akışı Beyanı");
check("B register 2 satır → 2 ayrı kaynak akışı satırı", streamRows.length === 2);
check("B1 akış adını/AD'sini taşır (Doğalgaz, 480000)", streamRows.some((r) => r[0] === "B1" && r.join("|").includes("Doğalgaz") && r.join("|").includes("480000")));
check("B2 akış adını/AD'sini taşır (Hurda, 1350)", streamRows.some((r) => r[0] === "B2" && r.join("|").includes("Hurda") && r.join("|").includes("1350")));

// ── E: her öncül madde satırı için ayrı kontrol ────────────────────────────
const precRows = rows.filter((r) => r[1] === "Öncül Madde Beyanı");
check("E register 1 satır → 1 ayrı öncül madde satırı", precRows.length === 1);
check("E1 öncül adını/SEE'sini taşır (kütük, 0.55)", precRows[0]?.join("|").includes("İnşaat demiri") && precRows[0]?.join("|").includes("0.55"));

// ── Satır sayısı birebir eşleşme beyanı ────────────────────────────────────
const matchRow = rows.find((r) => r[1] === "Register satır eşleşmesi");
check(
  "Satır sayısı register ile birebir (Kontrol satırı=5 G=2 B=2 E=1)",
  Boolean(matchRow) && matchRow.join("|").includes("Kontrol satırı=5") && matchRow.join("|").includes("G=2") && matchRow.join("|").includes("B=2") && matchRow.join("|").includes("E=1")
);

// ── Sektör-seviye özet artık tekil CN satırı yerine geçmiyor ────────────────
const eskiSektorOzeti = text.split("\n").filter((l) => l.includes("7201-7203"));
check("Eski sektör-seviye tekil satır (7201-7203) yok", eskiSektorOzeti.length === 0);

if (FAIL.length > 0) {
  console.error(`\nGATE-M3 ÇALIŞMA ALANI KALDI: ${FAIL.length} başarısız`);
  console.error(text);
  process.exit(1);
}
console.log(`\nGATE-M3 ÇALIŞMA ALANI GEÇTİ (${PASS.length} kontrol)`);
console.log("---- Doğrulayıcı Çalışma Alanı satırları ----");
console.log(rows.map((r) => r.join(" | ")).join("\n"));
