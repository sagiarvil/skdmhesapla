/**
 * EU Denizcilik Karbon Uyumu — teb232 Uçtan Uca Simülasyon ve Teslimat Doğrulama Testi
 *
 * Müşteri: teb232@gmail.com (Ahmet Yılmaz — DPA)
 * Gemi: M/V MEDKON IZMIR (IMO: 9437892 — 14.200 GT)
 * Rota: Ambarlı (TRAMB) ↔ Cenova (ITGOA) · Yıllık 24 Sefer
 * Bedel: 599 USD (Ödendi & Mühürlendi)
 * Doğrulayıcı: DNV GL SE (DAkkS D-VS-14065-01-00)
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  getTestMaritimeDossier,
  getTestMaritimeSealedPackage,
  buildTestMaritimeSeedHistory,
  TEST_USER_EMAIL,
} from "../../src/lib/maritime/test-user-dossiers";
import {
  sealedMaritimeFileBytes,
  type SealedMaritimePackageOutput,
} from "../../src/lib/maritime/package-seal";

describe("EU Denizcilik Karbon Uyumu — teb232 Uçtan Uca Simülasyon Testi", () => {
  const packageId = "MAR-2026-MEDKON-9437892";

  it("1. teb232 müşteri kimliği ve gemi IMO sağlama toplamı doğrulanır", () => {
    assert.strictEqual(TEST_USER_EMAIL, "teb232@gmail.com");

    const dossier = getTestMaritimeDossier(packageId);
    assert.ok(dossier, "Dossier nesnesi başarıyla üretilmelidir");
    assert.strictEqual(dossier.ship.imoNumber, "9437892");

    // IMO Checksum doğrulaması
    const digits = dossier.ship.imoNumber.split("").map(Number);
    const sum =
      digits[0]! * 7 +
      digits[1]! * 6 +
      digits[2]! * 5 +
      digits[3]! * 4 +
      digits[4]! * 3 +
      digits[5]! * 2;
    assert.strictEqual(sum % 10, digits[6], "IMO sağlama basamağı tam eşleşmelidir");
  });

  it("2. Armatör, rota ve coğrafi kapsam %50 AB dışı -> AB olarak çözümlenir", () => {
    const dossier = getTestMaritimeDossier(packageId)!;

    assert.strictEqual(dossier.company.companyName, "Medkon Hat İşletmeciliği Denizcilik ve Tic. A.Ş.");
    assert.strictEqual(dossier.company.imoCompanyNumber, "5421987");
    assert.strictEqual(dossier.ship.grossTonnage, 14200);
    assert.strictEqual(dossier.ship.flagState, "TR - Türkiye");

    // Sefer kontrolü (dossier için temsili denetim seferleri)
    assert.ok(dossier.voyages.length > 0, "Denetim seferleri mevcut olmalıdır");
    const v1 = dossier.voyages[0]!;
    assert.strictEqual(v1.departureUnlocode, "TRAMB");
    assert.strictEqual(v1.arrivalUnlocode, "ITGOA");
    assert.strictEqual(v1.scope, "third-eu-eea");
    assert.strictEqual(v1.scopeRatio, 0.5);
  });

  it("3. EU ETS 2025/2026 %70 Phase-In ve EUA teslim yükümlülüğü kesin hesaplanır", () => {
    const dossier = getTestMaritimeDossier(packageId)!;
    const ets = dossier.etsCalculation;

    assert.strictEqual(ets.phaseInPercentage, 70);
    assert.ok(ets.totalReportedCo2eTonnes > 4000, "Toplam bunker CO₂ ~4,204 ton olmalıdır");
    assert.ok(ets.scopedCo2eTonnes > 2000, "Kapsamdaki CO₂ (%50) ~2,102 ton olmalıdır");
    assert.strictEqual(ets.surrenderEuaObligation, 1472, "EUA teslim yükümlülüğü 1,472 olmalıdır");
    assert.strictEqual(ets.referenceEuaPriceEur, 75.0);
    assert.strictEqual(ets.estimatedFinancialCostEur, 110400, "Tahmini maliyet 1,472 * 75 = €110,400 olmalıdır");
  });

  it("4. FuelEU Maritime sera gazı yoğunluğu ve uyum dengesi doğrulanır", () => {
    const dossier = getTestMaritimeDossier(packageId)!;
    const fueleu = dossier.fuelEuCalculation;

    assert.strictEqual(fueleu.reportingYear, 2025);
    assert.ok(fueleu.targetGhgIntensity > 89 && fueleu.targetGhgIntensity < 90);
    assert.ok(fueleu.actualGhgIntensity > 80 && fueleu.actualGhgIntensity < 95, `GHG yoğunluğu beklenen aralıkta olmalıdır (bulunan: ${fueleu.actualGhgIntensity})`);
    assert.ok(fueleu.totalEnergyMj > 0);
  });

  it("5. DNV GL SE akredite doğrulayıcı bilgisi ve readiness 100/100 denetime hazır doğrulanır", () => {
    const dossier = getTestMaritimeDossier(packageId)!;

    assert.strictEqual(dossier.verifier.verifierName, "DNV GL SE");
    assert.strictEqual(dossier.verifier.accreditationNumber, "DAkkS D-VS-14065-01-00");
    assert.strictEqual(dossier.readiness.score, 100, "Tüm kapılar tamamlandığında readiness 100 olmalıdır");
    assert.ok(
      dossier.readiness.status === "PRE_VERIFICATION_DOSSIER_READY_FOR_ACCREDITED_VERIFIER_REVIEW" ||
        dossier.readiness.status === "VERIFIER_AUDIT_READY",
      "Statü PRE-VERIFICATION DOSSIER READY FOR ACCREDITED VERIFIER REVIEW olmalıdır"
    );
  });

  it("6. Mühürlü 6 parçalı paket ve deterministik ZIP paketi başarıyla üretilir", () => {
    const pkg: SealedMaritimePackageOutput | null = getTestMaritimeSealedPackage(packageId);
    assert.ok(pkg, "Paket başarıyla mühürlenmelidir");
    assert.strictEqual(pkg.files.length, 6, "Tam olarak 6 resmi yasal dosya bulunmalıdır");

    // 1. Türkçe PDF
    const trPdf = pkg.files.find((f) => f.filename.endsWith("_TR.pdf"));
    assert.ok(trPdf, "Türkçe Pro Uyum Raporu PDF bulunmalıdır");
    const trBytes = sealedMaritimeFileBytes(trPdf!);
    const trHeader = Buffer.from(trBytes.slice(0, 5)).toString("ascii");
    assert.strictEqual(trHeader, "%PDF-", "Geçerli PDF-1.4 başlığı (%PDF-) olmalıdır");

    // 2. İngilizce PDF
    const enPdf = pkg.files.find((f) => f.filename.endsWith("_EN.pdf"));
    assert.ok(enPdf, "İngilizce Compliance Report PDF bulunmalıdır");
    const enBytes = sealedMaritimeFileBytes(enPdf!);
    const enHeader = Buffer.from(enBytes.slice(0, 5)).toString("ascii");
    assert.strictEqual(enHeader, "%PDF-", "Geçerli PDF-1.4 başlığı (%PDF-) olmalıdır");

    // 3. THETIS-MRV Schema v2 XML
    const thetisXml = pkg.files.find((f) => f.filename.startsWith("THETIS_MRV_"));
    assert.ok(thetisXml, "EMSA THETIS-MRV XML dosyası bulunmalıdır");
    assert.ok(thetisXml!.content.includes("<ThetisMrvReport"), "EMSA ThetisMrvReport kökü bulunmalıdır");
    assert.ok(thetisXml!.content.includes("<PartA_ShipAndCompanyIdentification>"), "Part A gemi verisi bulunmalıdır");
    assert.ok(thetisXml!.content.includes("<PartB_Verification>"), "Part B verifier verisi bulunmalıdır");
    assert.ok(thetisXml!.content.includes("<PartC_MonitoringMethodsAndUncertainty>"), "Part C izleme metotları bulunmalıdır");
    assert.ok(thetisXml!.content.includes("<PartD_FuelConsumptionAndEmissions>"), "Part D yakıt ve emisyon verisi bulunmalıdır");

    // 4. FuelEU JSON
    const fuelEuJson = pkg.files.find((f) => f.filename.startsWith("FUELEU_MARITIME_"));
    assert.ok(fuelEuJson, "FuelEU JSON dosyası bulunmalıdır");
    const fuelEuParsed = JSON.parse(fuelEuJson!.content);
    assert.ok(fuelEuParsed.standard.includes("Regulation (EU) 2023/1805"), "FuelEU mevzuat standardı eşleşmelidir");
    assert.ok(fuelEuParsed.complianceBalanceRecord, "complianceBalanceRecord nesnesi mevcut olmalıdır");

    // 5. Sefer & BDN CSV
    const ledgerCsv = pkg.files.find((f) => f.filename.startsWith("SEFER_VE_BDN_KUTUGU_"));
    assert.ok(ledgerCsv, "Sefer ve BDN Denetim Kütüğü CSV dosyası bulunmalıdır");
    assert.ok(ledgerCsv!.content.includes("\uFEFF"), "Excel uyumlu UTF-8 BOM bulunmalıdır");
    assert.ok(ledgerCsv!.content.includes("Sefer No"), "Sefer No sütunu bulunmalıdır");
    assert.ok(ledgerCsv!.content.includes("MRV ANNEX II PART G"), "MRV Annex II Part G bölüm başlığı bulunmalıdır");

    // 6. Bütünlük Manifestosu JSON
    const manifesto = pkg.files.find((f) => f.filename.startsWith("BUTUNLUK_MANIFESTOSU_"));
    assert.ok(manifesto, "Bütünlük Manifestosu JSON dosyası bulunmalıdır");
    const manifestoParsed = JSON.parse(manifesto!.content);
    assert.ok(manifestoParsed.rootSha256, "Kriptografik kök parmak izi mevcut olmalıdır");
    assert.ok(Array.isArray(manifestoParsed.statutoryDeliverables), "Dosya hash tablosu mevcut olmalıdır");
    assert.ok(manifestoParsed.statutoryDeliverables.length >= 5, "En az 5 resmi çıktı hash'i içermelidir");

    // 7. PKZIP (STORE) Arşivi
    assert.ok(pkg.zipBytes, "ZIP baytları üretilmiş olmalıdır");
    assert.ok(pkg.zipBytes!.length > 10000, "ZIP dosya boyutu anlamlı olmalıdır");
    const zipMagic = Buffer.from(pkg.zipBytes!.slice(0, 4)).toString("hex");
    assert.strictEqual(zipMagic, "504b0304", "Standart PKZIP magic header (PK\\x03\\x04) doğrulanmalıdır");
  });

  it("7. buildTestMaritimeSeedHistory() /hesabim/ konsolu için doğru veri üretir", () => {
    const list = buildTestMaritimeSeedHistory();
    assert.strictEqual(list.length, 1);
    const item = list[0]!;

    assert.strictEqual(item.packageId, packageId);
    assert.strictEqual(item.shipName, "M/V MEDKON IZMIR");
    assert.strictEqual(item.imoNumber, "9437892");
    assert.strictEqual(item.grossTonnage, 14200);
    assert.strictEqual(item.surrenderEua, 1472);
    assert.strictEqual(item.estimatedEtsCostEur, 110400);
    assert.strictEqual(item.paidAmountUsd, 599);
    assert.strictEqual(item.status, "PAID_AND_SEALED");
  });
});
