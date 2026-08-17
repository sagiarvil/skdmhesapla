import crypto from "crypto";
import { calculateSkdmLiability } from "../src/lib/skdm/calculator";
import { createSealedAuditPackage } from "../src/lib/skdm/package-seal";

/**
 * STORE yöntemi ZIP okuyucu — tek byte farkta FAIL için ham baytlardan dosya çıkarır.
 * @param {Uint8Array|Buffer} zipBytes
 * @returns {Record<string, Buffer>}
 */
export function extractStoreZip(zipBytes) {
  const view = Buffer.from(zipBytes);
  const files = {};
  let o = 0;

  while (o + 30 <= view.length) {
    const sig = view.readUInt32LE(o);
    if (sig !== 0x04034b50) break;

    const method = view.readUInt16LE(o + 8);
    const compSize = view.readUInt32LE(o + 18);
    const nameLen = view.readUInt16LE(o + 26);
    const extraLen = view.readUInt16LE(o + 28);
    const name = view.slice(o + 30, o + 30 + nameLen).toString("utf8");
    const dataStart = o + 30 + nameLen + extraLen;
    const data = view.slice(dataStart, dataStart + compSize);

    if (method !== 0) {
      throw new Error(`FAIL: Desteklenmeyen ZIP sıkıştırma yöntemi ${method} (${name})`);
    }

    files[name] = data;
    o = dataStart + compSize;
  }

  return files;
}

export function runSealedPackageIntegrityAudit() {
  console.log("=== RUNNING SEALED AUDIT PACKAGE SELF-INTEGRITY AUDIT ===");

  const calcResult = calculateSkdmLiability({
    sectorId: "iron-steel",
    productionVolume: 1000,
    year: 2026,
    importerAnnualVolumeStatus: "over50",
    useCustomEmissions: true,
    customDirectEmission: 0.5,
    customIndirectEmission: 0.2,
    hasVerificationEvidence: true,
    etsQuarter: "2026-Q1",
    trEtsNettingEur: 0,
  });

  if (calcResult.readinessScore !== 100) {
    throw new Error(
      `Fail-Closed Precondition Failed: Readiness score is ${calcResult.readinessScore}%, expected 100%`
    );
  }

  const sealedPkg = createSealedAuditPackage(calcResult, {
    sessionId: "audit-self-test",
    sectorSlug: "demir-celik",
    goods: [{ id: "g1", category: "Aggregated goods", cn: "7208", route: "BF-BOF" }],
    processes: [{ id: "p1", name: "Hot rolled", included: ["sinter"] }],
    streams: [
      { method: "Combustion", name: "Natural gas", ad: 100, unit: "GJ", ncv: "48", processId: "p1" },
    ],
    precs: [{ name: "Iron ore", total: 10, internal: 4, other: 6, source: "Tek tesis", see: 0.1 }],
    dProcesses: { a: 1000, b: 900, c: 50, d: 50 },
    fieldValues: { tonaj: "1000", vFirma: "Test Verifier" },
  });
  console.log(`Generated Package ID: ${sealedPkg.packageId}`);
  console.log(`Master Hash Signature: ${sealedPkg.masterHash}`);
  console.log(`Files count: ${sealedPkg.files.length} (Expected: 12)`);

  if (sealedPkg.files.length !== 12) {
    throw new Error(`Expected 12 files in package, found ${sealedPkg.files.length}`);
  }

  if (!sealedPkg.zipBytes || sealedPkg.zipBytes.length < 4) {
    throw new Error("FAIL: zipBytes eksik — mühürlü ZIP üretilmedi");
  }
  if (sealedPkg.zipBytes[0] !== 0x50 || sealedPkg.zipBytes[1] !== 0x4b) {
    throw new Error("FAIL: ZIP magic bytes hatalı (PK bekleniyor)");
  }
  console.log(`ZIP boyutu: ${sealedPkg.zipBytes.length} B | Dosya: ${sealedPkg.zipFilename}`);

  // Madde 3: ZIP'i aç → her dosyanın SHA-256'sını yeniden hesapla → manifesto ile karşılaştır
  const extracted = extractStoreZip(sealedPkg.zipBytes);
  const extractedNames = Object.keys(extracted);
  console.log(`ZIP içinden çıkarılan dosya sayısı: ${extractedNames.length}`);

  if (extractedNames.length !== 12) {
    throw new Error(`FAIL: ZIP içinde 12 dosya bekleniyordu, ${extractedNames.length} bulundu`);
  }

  const manifestoFile = extracted["BUTUNLIK-MANIFESTOSU.json"];
  if (!manifestoFile) {
    throw new Error("FAIL: ZIP içinde BUTUNLIK-MANIFESTOSU.json yok");
  }

  const manifesto = JSON.parse(manifestoFile.toString("utf8"));
  const filesHashes = manifesto.filesHashes || {};
  const recomputedHashes = {};

  for (const filename of Object.keys(filesHashes)) {
    const data = extracted[filename];
    if (!data) {
      throw new Error(`FAIL: Manifestodaki ${filename} ZIP içinde yok`);
    }

    const computedHash = crypto.createHash("sha256").update(data).digest("hex");
    console.log(
      `- ZIP File: ${filename.padEnd(30)} [${data.length} B] -> Recomputed SHA-256: ${computedHash.substring(0, 16)}...`
    );

    const manifestHash = filesHashes[filename];
    if (computedHash !== manifestHash) {
      throw new Error(
        `FAIL: Tek byte fark — ${filename} Manifest: ${manifestHash}, Computed: ${computedHash}`
      );
    }

    const original = sealedPkg.files.find((f) => f.filename === filename);
    if (!original) {
      throw new Error(`FAIL: ${filename} sealedPkg.files içinde yok`);
    }
    const originalBytes =
      original.contentEncoding === "base64"
        ? Buffer.from(original.content, "base64")
        : Buffer.from(original.content, "utf8");
    const originalHash = crypto.createHash("sha256").update(originalBytes).digest("hex");
    if (originalHash !== computedHash) {
      throw new Error(`FAIL: ZIP ↔ bellek içerik drift: ${filename}`);
    }

    recomputedHashes[filename] = computedHash;
  }

  const expectedPackageSig = `sha256:${crypto
    .createHash("sha256")
    .update(JSON.stringify(recomputedHashes))
    .digest("hex")}`;
  if (expectedPackageSig !== manifesto.packageSignature) {
    throw new Error(
      `FAIL: Master package signature mismatch! Expected: ${expectedPackageSig}, Found: ${manifesto.packageSignature}`
    );
  }
  console.log("✅ Master Package Signature Integrity: 100% MATCH (ZIP açıldı + yeniden hash)");

  const hesaplamaIziBuf = extracted["Hesaplama-Izi.json"];
  if (!hesaplamaIziBuf) {
    throw new Error("FAIL: ZIP içinde Hesaplama-Izi.json yok");
  }

  const auditJson = JSON.parse(hesaplamaIziBuf.toString("utf8"));
  console.log("Checking required audit fields in Hesaplama-Izi.json (from ZIP):");

  const requiredFields = [
    { key: "engineVersion", val: auditJson.engineVersion },
    { key: "rulesetVersion", val: auditJson.rulesetVersion },
    { key: "etsQ/etsQuarter", val: auditJson.inputs?.etsQuarter },
    { key: "euP/euEtsPriceEur", val: auditJson.inputs?.euEtsPriceEur },
    { key: "auditHash", val: auditJson.auditHash },
  ];

  for (const field of requiredFields) {
    if (field.val === undefined || field.val === null || field.val === "") {
      throw new Error(`FAIL: Required field ${field.key} is missing or empty in Hesaplama-Izi.json`);
    }
    console.log(`  ✓ ${field.key}: ${field.val}`);
  }

  // Plan 20: register gömülü olmalı
  if (!auditJson.registers || typeof auditJson.registers !== "object") {
    throw new Error("FAIL: Hesaplama-Izi.json içinde registers yok (Plan 20)");
  }
  if (!Array.isArray(auditJson.registers.goods) || auditJson.registers.goods.length < 1) {
    throw new Error("FAIL: registers.goods boş — mühür paketine G register gömülmedi");
  }
  if (!Array.isArray(auditJson.registers.streams) || auditJson.registers.streams.length < 1) {
    throw new Error("FAIL: registers.streams boş — mühür paketine B register gömülmedi");
  }
  if (!auditJson.registers.dProcesses || auditJson.registers.dProcesses.a !== 1000) {
    throw new Error("FAIL: registers.dProcesses eksik veya bozulmuş");
  }
  console.log(
    `  ✓ registers: G=${auditJson.registers.goods.length} P=${auditJson.registers.processes.length} B=${auditJson.registers.streams.length} E=${auditJson.registers.precs.length}`
  );

  const file0 = extracted["Kapsamli-Durum-Raporu.pdf"];
  if (!file0 || file0[0] !== 0x25 || file0[1] !== 0x50 || file0[2] !== 0x44 || file0[3] !== 0x46) {
    throw new Error("FAIL: Kapsamli-Durum-Raporu.pdf PDF magic (%PDF) taşımıyor");
  }
  const file0Text = file0.toString("utf8");
  if (!file0Text.includes("KAPSAMLI DURUM RAPORU") || !file0Text.includes("YÖNETİCİ ÖZETİ")) {
    throw new Error("FAIL: Kapsamli-Durum-Raporu.pdf beklenen bölüm başlıklarını içermiyor");
  }
  console.log("  ✓ Kapsamli-Durum-Raporu.pdf magic + bölüm başlıkları mevcut");

  const file1 = extracted["Denetime-Hazirlik-Dosyasi.pdf"];
  if (!file1 || file1[0] !== 0x25 || file1[1] !== 0x50 || file1[2] !== 0x44 || file1[3] !== 0x46) {
    throw new Error("FAIL: Denetime-Hazirlik-Dosyasi.pdf PDF magic (%PDF) taşımıyor");
  }
  const file1Text = file1.toString("utf8");
  if (!file1Text.includes("REGISTER ÖZETİ")) {
    throw new Error("FAIL: Denetime-Hazirlik-Dosyasi.pdf REGISTER ÖZETİ içermiyor");
  }
  console.log("  ✓ File1 PDF magic + REGISTER ÖZETİ mevcut");

  const xlsx = extracted["Kanit-Kayit-Defteri.xlsx"];
  if (!xlsx || xlsx[0] !== 0x50 || xlsx[1] !== 0x4b) {
    throw new Error("FAIL: Kanit-Kayit-Defteri.xlsx ZIP/XLSX magic (PK) taşımıyor");
  }
  console.log("  ✓ File3 XLSX (OOXML) magic mevcut");

  if (sealedPkg.signedDownloadUrl && /STUB/i.test(sealedPkg.signedDownloadUrl)) {
    throw new Error("FAIL: signedDownloadUrl hâlâ STUB içeriyor");
  }
  console.log("  ✓ signedDownloadUrl STUB değil");

  console.log("🎉 ALL INTEGRITY CHECKS PASSED: 0 BYTES DRIFT DETECTED.");
  return true;
}

const isDirectRun =
  typeof process !== "undefined" &&
  process.argv[1] &&
  import.meta.url === `file://${process.argv[1]}`;

if (isDirectRun) {
  try {
    runSealedPackageIntegrityAudit();
    process.exit(0);
  } catch (err) {
    console.error("❌ INTEGRITY AUDIT FAILED:", err);
    process.exit(1);
  }
}
