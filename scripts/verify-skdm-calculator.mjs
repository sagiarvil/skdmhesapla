import { calculateSkdmLiability } from "../src/lib/skdm/calculator";
import { SKDM_SECTORS } from "../src/lib/skdm/config";

console.log("=== SKDM CALCULATOR AUTOMATED TEST SUITE (CORRECTION MANDATE - 3 CRITICAL ITEMS) ===");

// MADDE 1 — Test 1: Iron & Steel 2026 Default Benchmark (75.4 € Q1 2026 Ruleset Price)
// 2300 tCO2e × %2.5 = 57.5 sertifika × 75.4 € = 4.335,50 €
const test1 = calculateSkdmLiability({
  sectorId: "iron-steel",
  productionVolume: 1000,
  year: 2026,
  etsQuarter: "2026-Q1", // 75.4 € / tCO2e
  trEtsNettingEur: 0,
  useCustomEmissions: false
});

console.log("Test 1 (Iron-Steel 2026 Default 1000t @ 75.4 € Ruleset Price):");
console.log(`- Kullanılan ETS Fiyatı: ${test1.audit.usedEtsPrice} € (${test1.audit.etsQuarter})`);
console.log(`- Toplam Emisyon: ${test1.totalEmissions} tCO2e (Beklenen: 2300)`);
console.log(`- Yükümlü Emisyon (%2.5): ${test1.liableEmissions} tCO2e (Beklenen: 57.5)`);
console.log(`- Alıcının Üstleneceği Sertifika Maliyeti: ${test1.importerCostEur.toFixed(2)} € (Beklenen: 4335.50 €)`);
console.log(`- Audit Hash: ${test1.audit.hash}`);

if (Math.abs(test1.importerCostEur - 4335.50) < 0.01) {
  console.log("✅ Test 1 PASSED");
} else {
  console.error(`❌ Test 1 FAILED: Expected 4335.50, got ${test1.importerCostEur}`);
  process.exit(1);
}

// MADDE 2 — Test 2: Alıcı Yıllık Toplamı 45t -> Muafiyet Testi
const test2 = calculateSkdmLiability({
  sectorId: "iron-steel",
  productionVolume: 45,
  year: 2026,
  importerAnnualVolumeStatus: "under50", // Alıcı yıllık toplamı 50t altında
  useCustomEmissions: false
});

console.log("\nTest 2 (alıcı yıllık toplamı 45t → muafiyet):");
console.log(`- İthalatçı Durumu: ${test2.importerAnnualVolumeStatus}`);
console.log(`- De Minimis Muaf mı?: ${test2.isDeMinimisExempt} (Beklenen: true)`);
console.log(`- Alıcının Üstleneceği Maliyet: ${test2.importerCostEur} € (Beklenen: 0 €)`);

if (test2.isDeMinimisExempt && test2.importerCostEur === 0) {
  console.log("✅ Test 2 (alıcı yıllık toplamı 45t → muafiyet) PASSED");
} else {
  console.error("❌ Test 2 FAILED");
  process.exit(1);
}

// Test Case 3: Çeyreklik Elde Tutma Yükümlülüğü (%50 Kuralı)
const test3 = calculateSkdmLiability({
  sectorId: "aluminum",
  productionVolume: 1000,
  year: 2026,
  etsQuarter: "2026-Q1", // 75.4 €
  trEtsNettingEur: 0,
  useCustomEmissions: false
});

console.log("\nTest 3 (Quarterly 50% Certificate Holding Test):");
console.log(`- Toplam Yükümlü Emisyon: ${test3.liableEmissions} tCO2e`);
console.log(`- Çeyreklik Bulundurulacak Emisyon (%50): ${test3.quarterlyHoldingEmissions} tCO2e (Beklenen: ${test3.liableEmissions * 0.5})`);

if (test3.quarterlyHoldingEmissions === test3.liableEmissions * 0.5) {
  console.log("✅ Test 3 (Quarterly Holding) PASSED");
} else {
  console.error("❌ Test 3 FAILED");
  process.exit(1);
}

// Test Case 4: Hazırlık Skoru (Case Readiness Score %100)
const test4 = calculateSkdmLiability({
  sectorId: "iron-steel",
  productionVolume: 1000,
  year: 2026,
  useCustomEmissions: true,
  customDirectEmission: 0.5,
  customIndirectEmission: 0.2,
  hasVerificationEvidence: true
});

console.log("\nTest 4 (Case Readiness Score %100 Test):");
console.log(`- Hazırlık Skoru: %${test4.readinessScore} (Beklenen: %100)`);

if (test4.readinessScore === 100) {
  console.log("✅ Test 4 (Readiness Score %100) PASSED");
} else {
  console.error(`❌ Test 4 FAILED: Expected 100, got ${test4.readinessScore}`);
  process.exit(1);
}

// Test Case 5: 20 Sektör Haritası Varlık Kontrolü
const sectorCount = Object.keys(SKDM_SECTORS).length;
console.log(`\nTest 5 (20 Sektör Haritası Varlık Kontrolü):`);
console.log(`- Tanımlı Sektör Sayısı: ${sectorCount} (Beklenen: 20)`);

if (sectorCount === 20) {
  console.log("✅ Test 5 (20 Sectors) PASSED");
} else {
  console.error(`❌ Test 5 FAILED: Expected 20, got ${sectorCount}`);
  process.exit(1);
}


// MADDE 0 — Test 6: Hidrojen Sektöründe De Minimis Muafiyeti Uygulanmaz (10t < 50t olsa bile)
const test6 = calculateSkdmLiability({
  sectorId: "hydrogen",
  productionVolume: 10,
  year: 2026,
  importerAnnualVolumeStatus: "under50",
  trEtsNettingEur: 0,
  useCustomEmissions: false
});

console.log("\nTest 6 (Hidrojen alıcı yıllık toplamı 10t → de minimis muafiyeti UYGULANMAZ):");
console.log(`- Sektör: ${test6.sector.name}`);
console.log(`- De Minimis Muaf mı?: ${test6.isDeMinimisExempt} (Beklenen: false)`);
console.log(`- Alıcının Üstleneceği Maliyet: ${test6.importerCostEur.toFixed(2)} € (Beklenen > 0 €)`);
console.log(`- Not: ${test6.deMinimisNotice}`);

if (
  !test6.isDeMinimisExempt &&
  test6.importerCostEur > 0 &&
  test6.deMinimisNotice.includes("Elektrik ve hidrojen ithalatı de minimis muafiyeti kapsamı dışındadır (AB 2025/2083).")
) {
  console.log("✅ Test 6 (Hidrojen De Minimis Muafiyetsizlik) PASSED");
} else {
  console.error("❌ Test 6 FAILED: Hydrogen must not be exempt");
  process.exit(1);
}

import { runSealedPackageIntegrityAudit } from "./verify-sealed-package.mjs";

// MADDE 3 — Test 7: Bütünlük Kendi-Kendine Denetim (ZIP aç + SHA-256)
console.log("\nTest 7 (Mühürlü Paket Bütünlük & Manifest Self-Audit Testi):");
try {
  runSealedPackageIntegrityAudit();
  console.log("✅ Test 7 (Mühürlü Paket Bütünlük Self-Audit) PASSED");
} catch (err) {
  console.error("❌ Test 7 FAILED:", err);
  process.exit(1);
}

console.log("\n🎉 ALL 7/7 SKDM SPRINT 3 TESTS PASSED SUCCESSFULLY!");


