/**
 * GATE-C (RM-006) kanıt scripti — Elektrik ve Isi Denge Raporu iç tutarlılığı.
 *
 * SEAL-2026-DC-7782 paketini yeniden üretir, Elektrik-ve-Isi-Denge-Raporu.xlsx
 * içeriğini çözer ve şunları kanıtlar:
 *   1. Tablo kaynak akışı register'ından türetilir: her yakıt kendi satırında,
 *      kendi emisyon faktörüyle (kok/kömür doğalgazla birleştirilmez).
 *   2. Her satırın "Toplam Emisyon" hücresi o satırın kendi hesabının sonucudur
 *      (formüldeki sonuçla birebir eşittir; başka satırdan kopya toplam yok).
 *   3. Alt toplamlar (enerji / öncül) satır toplamlarından türetilir ve
 *      GENEL TOPLAM, GATE-A'daki toplam emisyonla mutabıktır.
 *
 * Kullanım: npx tsx scripts/verify-gate-c-balance.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { sealedFileBytes } from "../src/lib/skdm/package-seal";
import { getTestSealedPackage } from "../src/lib/skdm/test-user-packages";

const OUT = ".cache/gate-c";
mkdirSync(OUT, { recursive: true });

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

function extractStoreZipEntry(buf, targetName) {
  let off = 0;
  while (off + 30 <= buf.length) {
    if (buf.readUInt32LE(off) !== 0x04034b50) {
      off += 1;
      continue;
    }
    const nameLen = buf.readUInt16LE(off + 26);
    const extraLen = buf.readUInt16LE(off + 28);
    const name = buf.toString("utf8", off + 30, off + 30 + nameLen);
    const dataStart = off + 30 + nameLen + extraLen;
    const dataLen = buf.readUInt32LE(off + 18);
    if (name === targetName) return buf.subarray(dataStart, dataStart + dataLen);
    off = dataStart + dataLen;
  }
  return null;
}

const pkg = getTestSealedPackage("SEAL-2026-DC-7782");
check("SEAL-2026-DC-7782 paketi üretilebildi", pkg !== null);

const iziFile = pkg.files.find((f) => f.filename === "Hesaplama-Izi.json");
const izi = JSON.parse(new TextDecoder().decode(sealedFileBytes(iziFile)));
const totalEmissions = izi.outputs.totalEmissions;
const iziSteps = izi.steps;

const f10 = pkg.files.find((f) => f.filename === "Elektrik-ve-Isi-Denge-Raporu.xlsx");
const xlsxBytes = Buffer.from(sealedFileBytes(f10));
writeFileSync(`${OUT}/Elektrik-ve-Isi-Denge-Raporu.xlsx`, xlsxBytes);
const sheetXml = extractStoreZipEntry(xlsxBytes, "xl/worksheets/sheet1.xml");
check("Elektrik-ve-Isi-Denge-Raporu.xlsx üretildi ve sheet1.xml çıkarılabildi", sheetXml !== null);
const xml = sheetXml ? sheetXml.toString("utf8") : "";

const decodeEnt = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
const rowBlocks = [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map((m) => m[1]);
const rows = rowBlocks.map((block) =>
  [...block.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => decodeEnt(t[1]))
);
const dataRows = rows.filter((c) => c.length >= 5 && c[0] && c[0] !== "Kaynak Akışı" && c[0] !== "Elektrik ve Isi Denge Raporu (Energy & Heat Balance)");

// ── 1) Satır bazlı mutabakat: her hücre kendi çarpımının sonucu ─────────────
const formulaResult = (formula) => {
  const m = formula.match(/=\s*([\d.]+)\s*tCO2e/);
  if (m) return Number(m[1]);
  const m2 = formula.match(/([\d.]+)\s*tCO2e\s*\(/); // proses: "410 tCO2e (doğrudan ölçüm)"
  if (m2) return Number(m2[1]);
  return null;
};
let rowMismatches = 0;
const streamRows = [];
for (const c of dataRows) {
  if (c[0].startsWith("ENERJİ ALT TOPLAMI") || c[0].startsWith("ÖNCÜL MADDE GÖMÜLÜ") || c[0].startsWith("GENEL TOPLAM") || c[0].startsWith("Not:")) {
    continue;
  }
  streamRows.push(c);
  const computed = formulaResult(c[2]);
  const cellValue = Number(c[4]);
  if (computed === null || Math.abs(computed - cellValue) > 1e-6) {
    rowMismatches++;
    console.log(`   uyumsuz satır: ${c.join(" | ")}`);
  }
}
check(
  `Her satırın Toplam Emisyon hücresi kendi hesabının sonucu (${streamRows.length} akış satırı)`,
  rowMismatches === 0
);

// ── 2) Kok/kömür kendi satırında (doğalgazla birleştirilmedi) ───────────────
const kokRow = streamRows.find((c) => c[0].includes("Kok"));
check("Kok / kömür kendi satırında, kendi faktörüyle (920 GJ × 0.1070 = 98.44)", !!kokRow && Math.abs(formulaResult(kokRow[2]) - 98.44) < 0.01);
const dogalgazRows = streamRows.filter((c) => c[0].includes("Doğalgaz"));
check("Doğalgaz satırlarında 0.0561 faktörü (1850 GJ → 103.79)", dogalgazRows.some((c) => c[2].includes("0.0561") && c[2].includes("103.79")));

// ── 3) Eski sabit "1.500 GJ × 0,056 = 1.775" hatası yok ─────────────────────
const rawXml = xml;
check("Eski hatalı '1.500 GJ' sabiti yok", !rawXml.includes("1.500") && !rawXml.includes("1500 GJ"));
check("Eski hatalı '1.775' kopya toplamı yok (kendi çarpımıyla ilgisiz hücre)", !rawXml.includes("= 1.775"));

// ── 4) Alt toplamlar + GATE-A mutabakatı ────────────────────────────────────
const energySum = iziSteps.filter((s) => s.kind !== "precursor").reduce((a, s) => a + s.resultTco2e, 0);
const precursorSum = iziSteps.filter((s) => s.kind === "precursor").reduce((a, s) => a + s.resultTco2e, 0);
const energyRow = rows.find((c) => c[0].startsWith("ENERJİ ALT TOPLAMI")) || [];
const precRow = rows.find((c) => c[0].startsWith("ÖNCÜL MADDE GÖMÜLÜ")) || [];
const totalRow = rows.find((c) => c[0].startsWith("GENEL TOPLAM")) || [];
check(
  `ENERJİ ALT TOPLAMI satır toplamlarından türetildi (${energyRow[4]} = ${energySum.toFixed(2)})`,
  Number(energyRow[4]) === Math.round(energySum * 100) / 100
);
check(
  `ÖNCÜL MADDE GÖMÜLÜ satır toplamlarından türetildi (${precRow[4]} = ${precursorSum.toFixed(2)})`,
  Number(precRow[4]) === Math.round(precursorSum * 100) / 100
);
check(
  `GENEL TOPLAM GATE-A toplamıyla mutabık (${totalRow[4]} = ${totalEmissions.toFixed(2)})`,
  Number(totalRow[4]) === Math.round(totalEmissions * 100) / 100
);

console.log(`\n${"-".repeat(60)}`);
console.log("KANIT — Elektrik-ve-Isi-Denge-Raporu.xlsx içeriği:");
for (const c of rows) {
  if (c.length > 0) console.log(`  ${c.join(",")}`);
}
console.log(`${"-".repeat(60)}`);

if (FAIL.length === 0) {
  console.log(`\nGATE-C KANIT GEÇTİ (${PASS.length} kontrol) → ${OUT}/`);
} else {
  console.log(`\nGATE-C KANIT KALDI: ${FAIL.length} başarısız`);
  process.exitCode = 1;
}
