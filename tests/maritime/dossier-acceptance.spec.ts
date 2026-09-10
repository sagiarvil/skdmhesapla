/**
 * EU Denizcilik Karbon Uyumu — 7 Noktalı Mevzuat & Teslimat Kabul Testi
 *
 * Kullanıcının ve denetçilerin tespit ettiği 7 kritik eksiklik ve
 * iki dilli (TR & EN) Pro Premium PDF / XML / JSON / CSV teslimat doğrulaması.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { buildMaritimeDossier } from "../../src/lib/maritime/dossier/builder";
import { generateMaritimePdfBytes, generateMaritimePdfLines } from "../../src/lib/maritime/pdf/maritimeReportPdf";
import { generateThetisMrvXml, validateThetisMrvXml } from "../../src/lib/maritime/mrv/thetis-xml-generator";
import { generateFuelEuReportJson, generateFuelEuXml } from "../../src/lib/maritime/fueleu/fueleu-export";
import { generateVoyageBdnCsv } from "../../src/lib/maritime/voyage/ledger-csv";
import { generateIntegrityManifest } from "../../src/lib/maritime/evidence/manifest-generator";

describe("EU Denizcilik Karbon Uyumu — 7 Noktalı Mevzuat ve İki Dilli Pro Rapor Testi", () => {
  const sampleInput = {
    reportingYear: 2025,
    companyTitle: "Marmara Deniz Taşımacılık A.Ş.",
    imoCompanyNumber: "5871234",
    role: "ism-yoneticisi" as const,
    administeringAuthorityName: "İtalya Ulusal Denizcilik İdaresi",
    administeringCountryCode: "IT",
    shipName: "M/V MARMARA STAR",
    imoNumber: "9876543",
    flagState: "TR - Türkiye",
    grossTonnage: 16500,
    deadweightTonnes: 22000,
    shipType: "container",
    officialCategory: "Container ship",
    iceClass: "none",
    verifierName: "DNV GL SE",
    accreditationNumber: "DAkkS D-VS-14065-01-00",
    accreditationBody: "DAkkS (Almanya)",
    mrvPlanAssessed: true,
    fuelEuPlanAssessed: true,
    annualVoyagesCount: 24,
    departurePortName: "Ambarlı (TR)",
    departureUnlocode: "TRAMB",
    departureIsEu: false,
    arrivalPortName: "Cenova (IT)",
    arrivalUnlocode: "ITGOA",
    arrivalIsEu: true,
    fuelType: "VLSFO" as const,
    fuelQuantityTonnes: 1200,
    bioFuelQuantityTonnes: 100,
    useShorePower: true,
    opsElectricityKWh: 45000,
    evidences: [
      {
        fileName: "BDN-2025-0988.pdf",
        fileType: "BDN Faturası",
        sizeBytes: 245100,
        sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        status: "verified" as const,
        uploadedAt: "2025-06-15T10:00:00Z",
      },
    ],
  };

  const dossier = buildMaritimeDossier(sampleInput);

  it("1. FuelEU Monitoring Plan müstakil olarak tanımlı ve IR 2024/2031 standartlarında", () => {
    assert.ok(dossier.fuelEuMonitoringPlan, "fuelEuMonitoringPlan objesi mevcut olmalı");
    assert.strictEqual(dossier.fuelEuMonitoringPlan.assessedByVerifier, true);
    assert.ok(dossier.fuelEuMonitoringPlan.energyConsumers.length >= 3, "En az 3 ana enerji tüketicisi listelenmeli");
    assert.strictEqual(dossier.fuelEuMonitoringPlan.energyConsumers[0]?.consumerType, "Main Engine");
    assert.ok(dossier.fuelEuMonitoringPlan.opsConnectionProcedure.includes("IEC/IEEE 80005-1"));
  });

  it("2. Verifier bilgileri ve akreditasyon numarası eksiksiz (DR 2023/2917)", () => {
    assert.strictEqual(dossier.verifier.verifierName, "DNV GL SE");
    assert.strictEqual(dossier.verifier.accreditationNumber, "DAkkS D-VS-14065-01-00");
    assert.strictEqual(dossier.verifier.accreditationBody, "DAkkS (Almanya)");
    assert.ok(dossier.verifier.verificationStatus === "UNDER_VERIFICATION" || dossier.verifier.verificationStatus === "VERIFIED_AS_SATISFACTORY");
  });

  it("3. THETIS-MRV XML, IR 2023/2449 Annex II Part A-G ayrımına tam uyumlu", () => {
    const xml = generateThetisMrvXml(dossier);
    assert.ok(xml.includes("<PartA_ShipAndCompanyIdentification>"), "Part A etiketi mevcut olmalı");
    assert.ok(xml.includes("<PartB_Verification>"), "Part B etiketi mevcut olmalı");
    assert.ok(xml.includes("<PartC_MonitoringMethodsAndUncertainty>"), "Part C etiketi mevcut olmalı");
    assert.ok(xml.includes("<PartD_FuelConsumptionAndEmissions>"), "Part D etiketi mevcut olmalı");
    assert.ok(xml.includes("<PartE_OperationalMetrics>"), "Part E etiketi mevcut olmalı");
    assert.ok(xml.includes("<PartF_TransportWorkAndEfficiency>"), "Part F etiketi mevcut olmalı");
    assert.ok(xml.includes("<PartG_VoyagesRegister>"), "Part G etiketi mevcut olmalı");

    // EMSA Schema Doğrulama
    const validation = validateThetisMrvXml(xml);
    assert.strictEqual(validation.valid, true, `XML doğrulama hataları: ${validation.errors.join(", ")}`);
    assert.strictEqual(validation.errors.length, 0);
  });

  it("4. Company-Level Report müstakil yapıda (MRV Annex IV & Directive 2003/87/EC Art 3gb)", () => {
    assert.ok(dossier.companyLevelReport, "companyLevelReport objesi mevcut olmalı");
    assert.strictEqual(dossier.companyLevelReport.reportingYear, 2025);
    assert.strictEqual(dossier.companyLevelReport.imoCompanyNumber, "5871234");
    assert.strictEqual(dossier.companyLevelReport.etsPhaseInRate, 0.7);
    assert.ok(dossier.companyLevelReport.totalCompanySurrenderEuaObligation > 0);
  });

  it("5. Monitoring Plan onay durumu ve readiness kapısı doğru yönetiliyor", () => {
    assert.ok(
      dossier.readiness.status === "PRE_VERIFICATION_DOSSIER_READY_FOR_ACCREDITED_VERIFIER_REVIEW" ||
        dossier.readiness.status === "VERIFIER_AUDIT_READY",
      "Statü denetime hazır pre-verification dosya statüsünde olmalıdır"
    );
    assert.ok(dossier.readiness.score >= 80, "Tüm veriler tamken hazır olma skoru en az 80 olmalı");
    assert.strictEqual(dossier.readiness.blocking.length, 0, "Blokaj kalmamalı");
  });

  it("6. Hesaplanan tüm değerler kesin, reaktif ve sıfır/null değil", () => {
    assert.ok(dossier.etsCalculation.scopedCo2eTonnes > 0, "scopedCo2eTonnes > 0 olmalı");
    assert.ok(dossier.etsCalculation.surrenderEuaObligation > 0, "surrenderEuaObligation > 0 olmalı");
    assert.strictEqual(dossier.etsCalculation.phaseInPercentage, 70);
    assert.ok(dossier.fuelEuCalculation.totalEnergyMj > 0, "totalEnergyMj > 0 olmalı");
    assert.ok(dossier.fuelEuCalculation.actualGhgIntensity > 0, "actualGhgIntensity > 0 olmalı");
    assert.strictEqual(dossier.fuelEuCalculation.targetGhgIntensity, 89.3368);
    assert.notStrictEqual(dossier.fuelEuCalculation.complianceBalanceMj, null);
  });

  it("7. EMSA THETIS-MRV Schema v2 namespace ve tag kontrolleri başarılı", () => {
    const xml = generateThetisMrvXml(dossier);
    assert.ok(xml.includes('xmlns="urn:eu:europa:ec:clima:thetis:mrv:v2"'));
    assert.ok(xml.includes("<ImoNumber>9876543</ImoNumber>"));
    assert.ok(xml.includes("<ImoCompanyNumber>5871234</ImoCompanyNumber>"));
  });

  it("Pro Premium PDF Çıktısı Türkçe ve İngilizce olarak ayrı ayrı geçerli PDF-1.4 baytları üretir", () => {
    const trPdfBytes = generateMaritimePdfBytes(dossier, "tr");
    const enPdfBytes = generateMaritimePdfBytes(dossier, "en");

    assert.ok(trPdfBytes instanceof Uint8Array, "Türkçe çıktı Uint8Array olmalı");
    assert.ok(enPdfBytes instanceof Uint8Array, "İngilizce çıktı Uint8Array olmalı");

    // PDF Magic Bytes (%PDF-1.4)
    const trHeader = new TextDecoder().decode(trPdfBytes.subarray(0, 8));
    const enHeader = new TextDecoder().decode(enPdfBytes.subarray(0, 8));

    assert.ok(trHeader.startsWith("%PDF-1.4"), "Türkçe PDF başlığı %PDF-1.4 olmalı");
    assert.ok(enHeader.startsWith("%PDF-1.4"), "İngilizce PDF başlığı %PDF-1.4 olmalı");
    assert.ok(trPdfBytes.length > 5000, "Türkçe PDF en az 5 KB zengin içerik olmalı");
    assert.ok(enPdfBytes.length > 5000, "İngilizce PDF en az 5 KB zengin içerik olmalı");

    // Çizgi içerikleri kontrolü
    const trLines = generateMaritimePdfLines(dossier, "tr");
    const enLines = generateMaritimePdfLines(dossier, "en");
    assert.ok(
      trLines.some(
        (l) =>
          ("title" in l && typeof (l as any).title === "string" && (l as any).title.includes("AB DENİZCİLİK")) ||
          ("text" in l && typeof l.text === "string" && l.text.includes("AB DENİZCİLİK"))
      )
    );
    assert.ok(
      enLines.some(
        (l) =>
          ("title" in l && typeof (l as any).title === "string" && (l as any).title.includes("EU MARITIME")) ||
          ("text" in l && typeof l.text === "string" && l.text.includes("EU MARITIME"))
      )
    );
  });

  it("FuelEU JSON, FuelEU XML, Sefer CSV ve Kriptografik Manifesto başarıyla üretilir", () => {
    const jsonStr = generateFuelEuReportJson(dossier);
    const parsedJson = JSON.parse(jsonStr);
    assert.strictEqual(parsedJson.reportingPeriod, 2025);
    assert.ok(parsedJson.complianceBalanceRecord.totalEnergyConsumedMj > 0);

    const fueleuXml = generateFuelEuXml(dossier);
    assert.ok(fueleuXml.includes("<FuelEuMaritimeReport"));

    const csvStr = generateVoyageBdnCsv(dossier);
    assert.ok(csvStr.includes("Ambarlı (TR)"));
    assert.ok(csvStr.includes("Cenova (IT)"));
    assert.ok(csvStr.includes("BDN-2025-0988.pdf"));

    const manifestStr = generateIntegrityManifest(dossier, {
      "rapor.pdf": "hash123",
      "thetis.xml": "hash456",
    });
    const parsedManifest = JSON.parse(manifestStr);
    assert.strictEqual(parsedManifest.product, "SKDMhesapla Maritime Sealed Verification Package");
    assert.strictEqual(parsedManifest.statutoryDeliverables.length, 2);
  });
});
