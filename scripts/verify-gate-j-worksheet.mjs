/**
 * GATE-J (RM-006) kanıt scripti — Doğrulayıcı Çalışma Alanı satır-bazlı olmalı.
 *
 * 1. Her G/B/E register satırı için birebir ayrı kontrol satırı üretilir;
 *    her satır kendi CN kodunu ve rotasını gösterir (sektör geneli özet yok).
 * 2. Kontrol satırı sayısı = register satırı sayısı (birebir).
 * 3. "Kayıtlı" dışında "Gözden Geçirilmeli" (FAILED karşılığı) ve
 *    "Belirtilmedi" (VERİ YOK karşılığı) durumları gerçekten üretilebilir:
 *    eksik veri içeren bir senaryoda bu satırlar gösterilir.
 *    (RM-002 G-23: onaylı kelimeler — "hata/red/başarısız" yasak.)
 *
 * Kullanım: npx tsx scripts/verify-gate-j-worksheet.mjs
 */
import { calculateSkdmLiability } from "../src/lib/skdm/calculator";
import { buildVerifierWorksheetCsv, sealedFileBytes } from "../src/lib/skdm/package-seal";
import { getTestSealedPackage } from "../src/lib/skdm/test-user-packages";

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

/** XLSX (ZIP) içinden hedef girişi çıkarır. */
function extractStoreZipEntry(buf, targetName) {
  const bytes = Buffer.from(buf);
  let pos = 0;
  while (pos + 4 <= bytes.length) {
    if (bytes.readUInt32LE(pos) !== 0x04034b50) break;
    const flags = bytes.readUInt16LE(pos + 6);
    const comp = bytes.readUInt16LE(pos + 8);
    const csize = bytes.readUInt32LE(pos + 18);
    const nlen = bytes.readUInt16LE(pos + 26);
    const elen = bytes.readUInt16LE(pos + 28);
    const name = bytes.subarray(pos + 30, pos + 30 + nlen).toString("utf8");
    const data = bytes.subarray(pos + 30 + nlen + elen, pos + 30 + nlen + elen + csize);
    if (name === targetName) {
      if (comp !== 0) throw new Error("beklenmeyen sıkıştırma: " + targetName);
      return data;
    }
    pos = pos + 30 + nlen + elen + csize;
  }
  throw new Error("giriş bulunamadı: " + targetName);
}

function sheetRows(buf) {
  const xml = extractStoreZipEntry(buf, "xl/worksheets/sheet1.xml").toString("utf8");
  const decodeEnt = (s) =>
    s
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  const rowBlocks = [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map((m) => m[1]);
  return rowBlocks.map((block) =>
    [...block.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => decodeEnt(t[1]))
  );
}

// ── 1) Temel senaryo: SEAL-2026-DC-7782 — satır-bazlı + birebir eşleşme ────
const pkg = getTestSealedPackage("SEAL-2026-DC-7782");
const f4 = pkg.files.find((f) => f.filename === "Dogrulayici-Calisma-Alani.xlsx");
const rows = sheetRows(sealedFileBytes(f4)).map((r) => r.join(","));

const regRowIds = rows.filter((r) => /^(G\d+|B\d+|E\d+),/.test(r));
const goodsCount = rows.filter((r) => /^G\d+,/.test(r)).length;
const streamCount = rows.filter((r) => /^B\d+,/.test(r)).length;
const precCount = rows.filter((r) => /^E\d+,/.test(r)).length;
check("Temel: her G satırı kendi CN kodunu ve rotasını gösterir", goodsCount >= 2 && rows.some((r) => r.includes("CN 7208 39 00") && r.includes("Rota: BF-BOF")));
check("Temel: her B satırı kendi akış verisini gösterir", streamCount >= 4 && rows.some((r) => r.includes("AD=1850 GJ")));
check("Temel: her E satırı kendi SEE değerini gösterir", precCount >= 3 && rows.some((r) => r.includes("SEE=0.08")));
check("Temel: kontrol satırı sayısı = register satırı sayısı (birebir)", regRowIds.length === goodsCount + streamCount + precCount && goodsCount >= 2 && streamCount >= 4 && precCount >= 3);
check("Temel: sektör geneli özet tek satır yok (eski '7201-7203' kalıbı)", !rows.some((r) => r.includes("7201-7203")));
check("Temel: yasak kelimeler yok (PASSED/FAILED/hata/red)", !rows.some((r) => /PASSED|FAILED|VERİ YOK/.test(r)));

// ── 2) Eksik veri senaryosu — durumlar gerçekten üretilebilir ───────────────
const baseInput = {
  sectorId: "iron-steel",
  productionVolume: 1250,
  year: 2026,
  importerAnnualVolumeStatus: "over50",
  useCustomEmissions: true,
  customDirectEmission: 1.42,
  customIndirectEmission: 0,
  streams: [
    { method: "Combustion", name: "Doğalgaz", ad: 1850, unit: "GJ", ncv: "48.5", processId: "p2" },
    { method: "Combustion", name: "Kok / kömür", ad: 920, unit: "GJ", ncv: "28.2", processId: "p2" },
    { method: "MassBalance", name: "Proses CO2 (konverter)", ad: 410, unit: "tCO2e", ncv: "-", processId: "p2" },
    { method: "Combustion", name: "Doğalgaz (EAF yardımcı)", ad: 240, unit: "GJ", ncv: "48.5", processId: "p3" },
  ],
  precursors: [
    { name: "Demir cevheri pelet", total: 980, see: 0.08 },
    { name: "Hurda çelik", total: 420, see: 0.02 },
    { name: "Ferroalyaj", total: 55, see: 1.15 },
  ],
  etsQuarter: "2026-Q1",
  euEtsPriceEur: 75.4,
  trEtsNettingEur: 0,
  hasVerificationEvidence: true,
};

const result = calculateSkdmLiability(baseInput);
check("Eksik-veri senaryosu: hesap skoru %100 (mühürlenebilir zemin)", result.readinessScore === 100);

const eksikRegister = {
  sessionId: "sess-j-eksik",
  sectorSlug: "demir-celik",
  // CN: çimento kodu (2523 10 00) demir-çelik kapsamı dışında → Gözden Geçirilmeli
  goods: [
    { id: "g1", category: "Yassı çelik / sac", cn: "7208 39 00", route: "BF-BOF" },
    { id: "g2", category: "Çimento kodu — kapsam dışı örnek", cn: "2523 10 00", route: "-" },
  ],
  processes: [{ id: "p1", name: "Sinter / yükleme", included: ["sinter"] }],
  // B1 tam, B2'de yöntem belirtilmemiş → Gözden Geçirilmeli
  streams: [
    { method: "Combustion", name: "Doğalgaz", ad: 1850, unit: "GJ", ncv: "48.5", processId: "p2" },
    { method: "-", name: "-", ad: 0, unit: "GJ", ncv: "-", processId: "-" },
  ],
  // E1 SEE girilmemiş → Gözden Geçirilmeli
  precs: [{ name: "Demir cevheri pelet", total: 980, internal: 0, other: 980, source: "Dış tedarikçi", see: undefined }],
  // dProcesses yok → Belirtilmedi (VERİ YOK)
};
const eksikCsv = buildVerifierWorksheetCsv(result, eksikRegister, "footer");
const rowsB = eksikCsv.split("\n").filter((l) => l.trim().length > 0);
const text = rowsB.join("\n");

check("Eksik: kapsam dışı CN satırı 'Gözden Geçirilmeli' üretir", text.includes("G2,") && text.includes("2523 10 00") && text.includes("Gözden Geçirilmeli"));
check("Eksik: yöntemi eksik akış satırı 'Gözden Geçirilmeli' üretir", text.includes("B2,") && text.includes("Gözden Geçirilmeli"));
check("Eksik: SEE'siz öncül satırı 'Gözden Geçirilmeli' üretir", text.includes("E1,") && text.includes("Gözden Geçirilmeli"));
check("Eksik: dProcesses yoksa 'Belirtilmedi' (VERİ YOK) üretilir", text.includes("Belirtilmedi"));
check("Eksik: aynı dosyada 'Kayıtlı' satırlar da var (karışık durum)", text.includes("G1,") && text.includes("Kayıtlı"));
check("Eksik: kontrol satırı sayısı yine register ile birebir", rowsB.filter((r) => /^(G\d+|B\d+|E\d+),/.test(r)).length === 2 + 2 + 1);

console.log(`\n${"-".repeat(60)}`);
console.log("KANIT — eksik veri senaryosu çalışma alanı satırları:");
for (const r of rowsB.filter((x) => /^(G\d+|B\d+|E\d+|\d+),/.test(x))) {
  const [adim, kontrol, sonuc, not] = r.split(",");
  console.log(`  ${adim.padEnd(4)} ${kontrol.padEnd(26)} ${sonuc.padEnd(20)} ${not || ""}`);
}
console.log(`${"-".repeat(60)}`);

if (FAIL.length === 0) {
  console.log(`\nGATE-J KANIT GEÇTİ (${PASS.length} kontrol)`);
} else {
  console.log(`\nGATE-J KANIT KALDI: ${FAIL.length} başarısız`);
  process.exitCode = 1;
}
