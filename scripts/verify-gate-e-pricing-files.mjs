/**
 * GATE-E (RM-006) kanıt scripti — satılan paket = teslim edilen paket (INV-3).
 *
 * 1. Fiyatlandırma sayfası artık manifestten (SEALED_PACKAGE_FILES) render
 *    edilir; elle yazılmış statik liste yoktur.
 * 2. Manifest dosya adları, paket üreticisinin (createSealedAuditPackage)
 *    ürettiği dosya adlarıyla birebir eşleşir — iki listenin ayrışması
 *    teknik olarak imkânsızdır.
 * 3. Sayfa listesi ile gerçek ZIP içeriği yan yana gösterilir.
 *
 * Kullanım: npx tsx scripts/verify-gate-e-pricing-files.mjs
 */
import { readFileSync } from "node:fs";
import { SEALED_PACKAGE_FILES, SEALED_PACKAGE_FILE_COUNT } from "../src/lib/skdm/package-manifest";
import { getTestSealedPackage } from "../src/lib/skdm/test-user-packages";

const PASS = [];
const FAIL = [];
function check(name, ok) {
  if (ok) PASS.push(name);
  else FAIL.push(name);
  console.log(`${ok ? "✅" : "❌"} ${name}`);
}

// ── 1) Sayfa manifestten render ediliyor (statik liste yok) ──────────────────
const pageSrc = readFileSync("src/app/fiyatlandirma/page.tsx", "utf8");
check("Fiyatlandırma sayfası SEALED_PACKAGE_FILES import eder", pageSrc.includes('from "@/lib/skdm/package-manifest"'));
check("Elle yazılmış statik DAHIL_DOSYALAR listesi kaldırıldı", !pageSrc.includes("DAHIL_DOSYALAR"));
check("Sayfa kartları manifest listesinden map ile render edilir", pageSrc.includes("SEALED_PACKAGE_FILES.map"));

// ── 2) Manifest filenames == paket üreticisi filenames (birebir) ─────────────
const pkg = getTestSealedPackage("SEAL-2026-DC-7782");
const pkgFilenames = new Set(pkg.files.map((f) => f.filename));
const manifestFilenames = new Set(SEALED_PACKAGE_FILES.map((f) => f.filename));
const missingInPkg = [...manifestFilenames].filter((n) => !pkgFilenames.has(n));
const extraInPkg = [...pkgFilenames].filter((n) => !manifestFilenames.has(n));
check(
  `Manifest dosya adları pakette birebir mevcut (${manifestFilenames.size}/${pkgFilenames.size})`,
  missingInPkg.length === 0 && extraInPkg.length === 0
);
if (missingInPkg.length > 0) console.log("   pakette eksik:", missingInPkg);
if (extraInPkg.length > 0) console.log("   pakette fazla:", extraInPkg);

// ── 3) Sayı tutarlılığı ─────────────────────────────────────────────────────
check(`Manifest adedi ${SEALED_PACKAGE_FILE_COUNT} = paket adedi ${pkg.files.length}`, SEALED_PACKAGE_FILE_COUNT === pkg.files.length);

console.log(`\n${"-".repeat(60)}`);
console.log("KANIT — sayfa listesi ile gerçek paket yan yana:");
console.log(`${"#".padEnd(3)} ${"Sayfa (manifest label)".padEnd(46)} ${"Paket dosyası"}`);
SEALED_PACKAGE_FILES.forEach((f, i) => {
  const inPkg = pkgFilenames.has(f.filename) ? "✓" : "✗ YOK";
  console.log(`${String(i + 1).padEnd(3)} ${f.label.padEnd(46)} ${f.filename}  ${inPkg}`);
});
console.log(`${"-".repeat(60)}`);

if (FAIL.length === 0) {
  console.log(`\nGATE-E KANIT GEÇTİ (${PASS.length} kontrol)`);
} else {
  console.log(`\nGATE-E KANIT KALDI: ${FAIL.length} başarısız`);
  process.exitCode = 1;
}
