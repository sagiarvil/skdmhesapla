/**
 * teb232 mühürlü paketleri diske yazar — değerlendirme için.
 * Kullanım: npx tsx scripts/export-teb232-packages.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getTestSealedPackage, TEST_USER_EMAIL } from "../src/lib/skdm/test-user-packages";
import { sealedFileBytes } from "../src/lib/skdm/package-seal";
import { extractStoreZip } from "./verify-sealed-package.mjs";
import officialCn from "../data/skdm/parameters-cn-codes.json";
import { officialCnStatus, normalizeCn, matchPrefix, RULESET_VERSION } from "../src/lib/skdm/annex-ruleset";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "teb232");
const IDS = ["SEAL-2026-DC-7782", "SEAL-2026-AL-9914"];

function cnSatir(cn) {
  const n = normalizeCn(cn);
  const st = officialCnStatus(cn, officialCn.codes);
  const rule = matchPrefix(n);
  return `${cn} → ${n} | ${st}${rule ? ` | sektör=${rule.sector}` : ""}`;
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const ozet = [];
ozet.push(`# teb232 test paketleri — değerlendirme`);
ozet.push("");
ozet.push(`Kullanıcı: \`${TEST_USER_EMAIL}\``);
ozet.push(`Üretim: ${new Date().toISOString()}`);
ozet.push(`CN ruleset: \`${RULESET_VERSION}\` · resmi liste ${officialCn.count} kod`);
ozet.push("");
ozet.push("Bu klasör canlı `/hesabim/` indirmeleriyle aynı deterministik mühürdür.");
ozet.push("SKDMHesapla akredite doğrulama görüşü veya gümrük onayı vermez.");
ozet.push("");

for (const id of IDS) {
  const pkg = getTestSealedPackage(id);
  if (!pkg) throw new Error(`${id} üretilemedi`);
  const dir = path.join(OUT, id);
  fs.mkdirSync(dir, { recursive: true });

  const zipPath = path.join(dir, pkg.zipFilename || `${id}.zip`);
  fs.writeFileSync(zipPath, Buffer.from(pkg.zipBytes));

  const extracted = extractStoreZip(pkg.zipBytes);
  for (const [name, buf] of Object.entries(extracted)) {
    fs.writeFileSync(path.join(dir, name), buf);
  }

  const izi = pkg.files.find((f) => f.filename === "Hesaplama-Izi.json");
  const iziJson = izi ? JSON.parse(Buffer.from(sealedFileBytes(izi)).toString("utf8")) : null;
  const goods = iziJson?.registers?.goods || [];

  ozet.push(`## ${id}`);
  ozet.push("");
  ozet.push(`- Sektör: ${iziJson?.registers?.sectorSlug || "—"}`);
  ozet.push(`- Tesis: ${iziJson?.registers?.fieldValues?.tesisAdiEN || "—"}`);
  ozet.push(`- Master hash: \`${pkg.masterHash}\``);
  ozet.push(`- ZIP: \`${path.relative(ROOT, zipPath)}\` (${pkg.zipBytes.length} B)`);
  ozet.push(`- Dosya sayısı: ${pkg.files.length}`);
  ozet.push(`- Tonaj: ${iziJson?.inputs?.productionVolume}`);
  ozet.push(`- Kapsam 1 fatura (toplam emisyon): ${iziJson?.outputs?.totalEmissions} tCO2e`);
  ozet.push(`- Yükümlü emisyon: ${iziJson?.outputs?.liableEmissions} tCO2e`);
  ozet.push(`- Alıcı maliyeti: €${iziJson?.outputs?.importerCostEur}`);
  ozet.push(`- Hazırlık: %${iziJson?.outputs?.readinessScore}`);
  ozet.push("");
  ozet.push("### CN resmi liste");
  ozet.push("");
  for (const g of goods) {
    ozet.push(`- ${g.id} ${g.category}: ${cnSatir(g.cn)}`);
  }
  ozet.push("");
  ozet.push("### Paket dosyaları");
  ozet.push("");
  ozet.push("| Dosya | Bayt | SHA-256 |");
  ozet.push("|---|---:|---|");
  for (const f of pkg.files) {
    ozet.push(`| ${f.filename} | ${f.sizeBytes} | \`${f.sha256.slice(0, 16)}…\` |`);
  }
  ozet.push("");
}

const mdPath = path.join(OUT, "DEGERLENDIRME.md");
fs.writeFileSync(mdPath, ozet.join("\n"));
console.log(`yazıldı ${OUT}`);
console.log(ozet.join("\n"));
