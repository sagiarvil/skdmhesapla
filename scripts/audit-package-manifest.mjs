/**
 * Case Manager §42 — paket dosya sayısı SSOT kilidi.
 * UI/constants sayısı ≡ package-manifest ≡ mühür ZIP dosya sayısı.
 */
import { createSealedAuditPackage } from "../src/lib/skdm/package-seal";
import { calculateSkdmLiability } from "../src/lib/skdm/calculator";
import {
  SEALED_PACKAGE_FILE_COUNT,
  SEALED_PACKAGE_FILENAMES,
} from "../src/lib/skdm/package-manifest";
import { PLATFORM_STATS } from "../src/lib/skdm/constants";

console.log("=== PACKAGE MANIFEST SSOT AUDIT ===");

if (PLATFORM_STATS.fileCount !== SEALED_PACKAGE_FILE_COUNT) {
  console.error(
    `FAIL: PLATFORM_STATS.fileCount=${PLATFORM_STATS.fileCount} ≠ manifest=${SEALED_PACKAGE_FILE_COUNT}`
  );
  process.exit(1);
}

const calc = calculateSkdmLiability({
  sectorId: "iron-steel",
  productionVolume: 1000,
  year: 2026,
  useCustomEmissions: true,
  customDirectEmission: 0.5,
  customIndirectEmission: 0,
  hasVerificationEvidence: true,
  etsQuarter: "2026-Q1",
  trEtsNettingEur: 0,
  importerAnnualVolumeStatus: "over50",
});

const pkg = createSealedAuditPackage(calc, {
  goods: [{ id: "g1", category: "Test", cn: "7208", route: "BF-BOF" }],
  processes: [{ id: "p1", name: "Test", included: ["x"] }],
  streams: [{ method: "Combustion", name: "NG", ad: 1, unit: "GJ", ncv: "48", processId: "p1" }],
  precs: [{ name: "Ore", total: 1, internal: 0, other: 1, source: "Dış", see: 0.1 }],
  dProcesses: { a: 1000, b: 900, c: 50, d: 50 },
  fieldValues: {
    vFirma: "TEB Metal & Alüminyum San. Tic. A.Ş.",
    vkn: "1000036109",
    isletmeTuru: "turel",
  },
});

if (pkg.files.length !== SEALED_PACKAGE_FILE_COUNT) {
  console.error(
    `FAIL: sealed files=${pkg.files.length} ≠ manifest=${SEALED_PACKAGE_FILE_COUNT}`
  );
  process.exit(1);
}

const sealedNames = pkg.files.map((f) => f.filename);
for (const name of SEALED_PACKAGE_FILENAMES) {
  if (!sealedNames.includes(name)) {
    console.error(`FAIL: mühür paketinde eksik dosya: ${name}`);
    process.exit(1);
  }
}

const hardCodedBad = ["6 dosyalık", "11 dosyalık mühür", "Expected: 11"];
console.log(`✓ fileCount SSOT = ${SEALED_PACKAGE_FILE_COUNT}`);
console.log(`✓ createSealedAuditPackage files = ${pkg.files.length}`);
console.log(`✓ tüm manifest dosya adları mühürde mevcut`);
console.log("🎉 PACKAGE MANIFEST AUDIT PASSED");
