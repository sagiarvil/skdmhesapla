/**
 * GATE-B (RM-006) kanıt scripti — Kanıt Kayıt Defteri'nde dürüst kanıt durumu.
 *
 * SEAL-2026-DC-7782 paketini yeniden üretir, Kanit-Kayit-Defteri.xlsx içeriğini
 * çözer ve şunları kanıtlar:
 *   1. "Doğrulandı / Akredite / Tam / Uyumlu" ifadelerinden hiçbiri geçmiyor (INV-2).
 *   2. "Kanıt Durumu" sütunu yalnız 4 izinli değerden birini taşıyor:
 *      Kullanıcı beyanı | Belge yüklendi | Belge yüklenmedi | Varsayılan değer kullanıldı.
 *   3. "Doğrulama kanıtı" satırı "Belge yüklenmedi" + açıklayıcı değer taşıyor ve
 *      eksiklik (EKSİK KANIT) olarak görünüyor.
 *   4. Emisyon satırları kademeye göre "Kullanıcı beyanı" veya
 *      "Varsayılan değer kullanıldı" gösteriyor.
 *
 * Kullanım: npx tsx scripts/verify-gate-b-evidence.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { sealedFileBytes } from "../src/lib/skdm/package-seal";
import { getTestSealedPackage } from "../src/lib/skdm/test-user-packages";

const OUT = ".cache/gate-b";
mkdirSync(OUT, { recursive: true });

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

const pkg = getTestSealedPackage("SEAL-2026-DC-7782");
check("SEAL-2026-DC-7782 paketi üretilebildi (hiçbir belge yüklenmemiş senaryo)", pkg !== null);

const f3 = pkg.files.find((f) => f.filename === "Kanit-Kayit-Defteri.xlsx");
const xlsxBytes = Buffer.from(sealedFileBytes(f3));
writeFileSync(`${OUT}/Kanit-Kayit-Defteri.xlsx`, xlsxBytes);

// XLSX kendisi bir ZIP (STORE). xl/worksheets/sheet1.xml girişini çıkar.
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
    if (name === targetName) {
      return buf.subarray(dataStart, dataStart + dataLen);
    }
    off = dataStart + dataLen;
  }
  return null;
}

const sheetXml = extractStoreZipEntry(xlsxBytes, "xl/worksheets/sheet1.xml");
check("Kanit-Kayit-Defteri.xlsx üretildi ve sheet1.xml çıkarılabildi", sheetXml !== null);
const xml = sheetXml ? sheetXml.toString("utf8") : "";

// XML satır bloklarını hücre dizilerine ayrıştır (CSV'deki virgüller hücrelere
// bölündüğü için XML'de kalmaz; her <row> bir CSV satırına karşılık gelir).
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
const plain = rows.map((cells) => cells.join(",")).join("\n");

// ── 1) Yasak ifadeler tamamen yok ───────────────────────────────────────────
const forbidden = [
  ["Doğrulandı", /\bDoğrulandı\b/],
  ["Akredite", /\bAkredite\b/i],
  ["Uyumlu", /\bUyumlu\b/],
];
// "Tam": yalnızca bağımsız sözcük olarak yasak (ör. "Tam" hücre değeri).
const tam = /(^|[^a-zA-ZÇĞİÖŞÜçğıöşü0-9])Tam([^a-zA-ZÇĞİÖŞÜçğıöşü0-9]|$)/;
for (const [name, re] of forbidden) {
  const hit = re.test(plain);
  check(`Yasak ifade yok: "${name}"`, !hit);
}
check('Yasak ifade yok: "Tam" (bağımsız sözcük)', !tam.test(plain));

// ── 2) Kanıt Durumu sütunu yalnız izinli 4 değer ─────────────────────────────
const ALLOWED = new Set([
  "Kullanıcı beyanı",
  "Belge yüklendi",
  "Belge yüklenmedi",
  "Varsayılan değer kullanıldı",
]);
let statusCount = 0;
const illegalStatuses = new Set();
for (const cells of rows) {
  const key = cells[0] || "";
  if (key === "Parametre" || key.startsWith("EKSİK KANIT")) continue;
  if (cells.length >= 4) {
    const status = cells[3].trim();
    if (!ALLOWED.has(status)) illegalStatuses.add(status);
    statusCount++;
  }
}
check(
  `"Kanıt Durumu" sütunu yalnız izinli değerler (${statusCount} satır kontrol edildi)`,
  illegalStatuses.size === 0
);
if (illegalStatuses.size > 0) console.log("   izinsiz değerler:", [...illegalStatuses]);

// ── 3) Doğrulama kanıtı satırı dürüst + eksiklik görünür ────────────────────
const dogr = rows.find((c) => c[0] === "Doğrulama kanıtı") || [];
check(
  "Doğrulama kanıtı satırı 'Belge yüklenmedi' durumunda",
  dogr[3] === "Belge yüklenmedi" && (dogr[1] || "").includes("doğrulama görüşü bu sistemden alınmaz")
);
check("EKSİK KANIT notu dosyada görünür (gizlenmiyor)", plain.includes("EKSİK KANIT"));

// ── 4) Emisyon satırları kademeye uygun durum taşıyor ───────────────────────
const scope1 = rows.find((c) => c[0] === "Kapsam 1 Emisyon") || [];
const scope2 = rows.find((c) => c[0] === "Kapsam 2 Emisyon") || [];
check(
  "Kapsam 1 Emisyon: Kullanıcı beyanı (doğrudan ölçüm kademesi)",
  scope1[3] === "Kullanıcı beyanı"
);
check(
  "Kapsam 2 Emisyon: Kullanıcı beyanı (doğrudan ölçüm kademesi)",
  scope2[3] === "Kullanıcı beyanı"
);

console.log(`\n${"-".repeat(50)}`);
console.log("KANIT — Kanit-Kayit-Defteri.xlsx içeriği (özet):");
for (const cells of rows) {
  if (cells.length > 0) console.log(`  ${cells.join(",")}`);
}
console.log(`${"-".repeat(50)}`);

if (FAIL.length === 0) {
  console.log(`\nGATE-B KANIT GEÇTİ (${PASS.length} kontrol) → ${OUT}/`);
} else {
  console.log(`\nGATE-B KANIT KALDI: ${FAIL.length} başarısız`);
  process.exitCode = 1;
}
