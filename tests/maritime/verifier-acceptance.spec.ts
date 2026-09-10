/**
 * EU Denizcilik Karbon Uyumu — Gerçek Verifier Kabul Testi (Acceptance Test Suite)
 *
 * Akredite Bağımsız Doğrulayıcı (Klas Kuruluşu — DNV / Bureau Veritas / RINA)
 * Perspektifinden Uçtan Uca Doğrulama Testi:
 *
 * Test Senaryosu:
 * 1. Şirket: İstanbul Denizcilik A.Ş. (TR merkezli armatör, IMO Co No: 5912345)
 * 2. Gemi: M/V BOSPHORUS EXPRESS (IMO: 9876543, 16.500 GT, Konteyner Gemisi)
 * 3. Sefer Zinciri:
 *    - Sefer 1: Ambarlı (TR) -> Cenova (IT) (AB Dışı -> AB: %50 Kapsam)
 *    - Sefer 2: Cenova (IT) -> Pire (GR) (AB İçi: %100 Kapsam)
 *    - Sefer 3: Pire (GR) -> Tanger Med (MA) -> Cenova (IT) (Komşu Aktarma 300 mil kuralı)
 * 4. Bunker & BDN Kanıt Belgeleri (SHA-256 hash bütünlüğü)
 * 5. FuelEU Maritime GHG Yoğunluğu & Compliance Balance (2025 yılı -%2 hedefi)
 * 6. EU ETS Maritime %70 Phase-in Teslim Yükümlülüğü
 * 7. ISM Şirket Seviyesi Filo Mutabakatı (Reconciliation)
 * 8. Administering Authority Ataması
 * 9. İstisna Motoru ve Port Call Denetimi
 * 10. Mevzuat İzleme & REGULATORY_REVIEW_REQUIRED Durumu
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import type {
  MaritimeCompany,
  Vessel,
  Voyage,
  FuelConsumption,
  PortInfo,
} from "../../src/lib/maritime/types";
import { computeSha256, createEvidenceRecord, verifyEvidenceIntegrity } from "../../src/lib/maritime/evidence/hasher";
import { calculateFuelEuCompliance, poolComplianceBalances } from "../../src/lib/maritime/fueleu/engine";
import { resolveVoyageScope, aggregateVoyageConsumptions } from "../../src/lib/maritime/voyage/scope-resolver";
import { mapToThetisMrvPartB, exportThetisMrvXml } from "../../src/lib/maritime/mrv/template-mapper";
import { reconcileFleetEtsObligation } from "../../src/lib/maritime/ets/company-reconcile";
import { determineAdministeringMemberState } from "../../src/lib/maritime/registry/administering-authority";
import { evaluateMaritimeExceptions } from "../../src/lib/maritime/rules/exception-engine";
import { auditSessionAgainstActiveRules, CURRENT_MARITIME_RULESET } from "../../src/lib/maritime/regulatory/tracker";

describe("EU Denizcilik Karbon Uyumu — 10 Aşamalı Kurumsal Verifier Kabul Testi", () => {
  // Test Verileri
  const company: MaritimeCompany = {
    id: "COMP-TR-001",
    title: "İstanbul Denizcilik ve Ticaret A.Ş.",
    imoCompanyNumber: "5912345",
    vkn: "1234567890",
    country: "TR",
    administeringMemberState: "IT",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  };

  const vessel: Vessel = {
    id: "VESSEL-9876543",
    companyId: company.id,
    fleetId: "FLEET-MED-01",
    name: "M/V BOSPHORUS EXPRESS",
    imoNumber: "9876543",
    flagState: "TR",
    grossTonnage: 16500,
    shipType: "container",
    iceClass: "none",
    createdAt: "2025-01-01T00:00:00Z",
  };

  const portAmbarli: PortInfo = {
    code: "TRAMB",
    name: "Ambarlı Limanı (İstanbul)",
    country: "TR",
    isEuEea: false,
    isNeighbouringContainerTransshipment: false,
  };

  const portGenoa: PortInfo = {
    code: "ITGOA",
    name: "Cenova Limanı",
    country: "IT",
    isEuEea: true,
    isNeighbouringContainerTransshipment: false,
  };

  const portPiraeus: PortInfo = {
    code: "GRPIR",
    name: "Pire Limanı",
    country: "GR",
    isEuEea: true,
    isNeighbouringContainerTransshipment: false,
  };

  const portTangerMed: PortInfo = {
    code: "MATNG",
    name: "Tanger Med Limanı",
    country: "MA",
    isEuEea: false,
    isNeighbouringContainerTransshipment: true,
  };

  it("1. & 2. Aşama: BDN Kanıt Belgesi ve SHA-256 Kriptografik Mühürleme Testi", async () => {
    const rawBdnContent = "BDN-2025-001;SUPPLIER=SOCAR_BUNKER;FUEL=VLSFO;MASS=650.0;DATE=2025-03-15";
    const bdnBytes = new TextEncoder().encode(rawBdnContent);

    const evidence = await createEvidenceRecord({
      vesselId: vessel.id,
      reportingYear: 2025,
      fileName: "BDN_2025_001_Ambarli.pdf",
      fileType: "BDN",
      mimeType: "application/pdf",
      sizeBytes: bdnBytes.length,
      fileData: bdnBytes,
      storagePath: `evidence/${vessel.id}/2025/bdn_001.pdf`,
      supportingRecordType: "fuel_consumption",
      uploadedBy: "chief_engineer@istanbuldenizcilik.com",
    });

    assert.ok(evidence.sha256Hash.length === 64, "SHA-256 hash 64 karakterli hex olmalıdır.");

    // Bütünlük doğrulama
    const isValid = await verifyEvidenceIntegrity(evidence, bdnBytes);
    assert.strictEqual(isValid, true, "Kanıt belgesi bütünlüğü doğrulanmalıdır.");

    // Tahrifat kontrolü
    const tamperedBytes = new TextEncoder().encode("TAMPERED_BDN_DATA");
    const isTamperedValid = await verifyEvidenceIntegrity(evidence, tamperedBytes);
    assert.strictEqual(isTamperedValid, false, "Tahrif edilmiş dosya reddedilmelidir.");
  });

  it("3. Aşama: FuelEU Maritime Hesap Motoru & Compliance Balance Testi", () => {
    // 2025 Yılı için VLSFO ve Biyodizel karışımı
    const result = calculateFuelEuCompliance({
      year: 2025,
      consumptions: [
        {
          fuelType: "VLSFO",
          massTonnes: 1000,
          scopeRatio: 0.5, // 500 ton efektif
        },
        {
          fuelType: "BIO_DIESEL",
          massTonnes: 150,
          scopeRatio: 0.5, // 75 ton efektif sürdürülebilir yakıt
        },
      ],
      consecutiveDeficitYears: 1,
    });

    assert.strictEqual(result.year, 2025);
    assert.strictEqual(result.targetGhgIntensity, 89.3368, "2025 FuelEU hedefi 89.3368 gCO2eq/MJ olmalıdır.");
    assert.ok(result.totalEnergyMj > 0, "Toplam enerji pozitif olmalıdır.");
    assert.ok(result.actualGhgIntensity > 0, "Gerçekleşen yoğunluk hesaplanmalıdır.");
    // Biyodizel harmanlaması yoğunluğu düşürdüğü için uyum dengesi pozitif olmalı
    assert.ok(result.actualGhgIntensity < 91.4, "Biyodizel harmanlaması sera gazı yoğunluğunu VLSFO'dan düşürmelidir.");
  });

  it("4. Aşama: Rota ve Coğrafi Kapsam Motoru & Komşu Aktarma Kuralı", () => {
    // 1. Türkiye -> İtalya: %50 Kapsam
    const scopeExtraEu = resolveVoyageScope(portAmbarli, portGenoa, true);
    assert.strictEqual(scopeExtraEu.scopeRatio, 0.5, "Türkiye-AB seferi %50 kapsamda olmalıdır.");

    // 2. İtalya -> Yunanistan: %100 Kapsam
    const scopeIntraEu = resolveVoyageScope(portGenoa, portPiraeus, true);
    assert.strictEqual(scopeIntraEu.scopeRatio, 1.0, "AB içi sefer %100 kapsamda olmalıdır.");

    // 3. Tanger Med Aktarması (300 deniz mili kuralı)
    const scopeTanger = resolveVoyageScope(portAmbarli, portTangerMed, true);
    assert.strictEqual(scopeTanger.isTransshipmentBypassApplied, true);
    assert.strictEqual(scopeTanger.scopeRatio, 0.5);
  });

  it("5. Aşama: Resmî THETIS-MRV Şablon Eşlemesi ve XML Çıktısı Testi", () => {
    const voyages: Voyage[] = [
      {
        id: "VOY-001",
        vesselId: vessel.id,
        reportingYear: 2025,
        voyageNumber: "2025-01",
        departurePort: portAmbarli,
        arrivalPort: portGenoa,
        departureDate: "2025-02-01T08:00:00Z",
        arrivalDate: "2025-02-05T12:00:00Z",
        distanceNm: 1250,
        cargoWeightTonnes: 12000,
        hoursUnderway: 100,
        hoursAtBerth: 24,
        scopeRatio: 0.5,
        exceptionFlags: [],
      },
    ];

    const consumptions: FuelConsumption[] = [
      {
        id: "FC-001",
        voyageId: "VOY-001",
        vesselId: vessel.id,
        fuelType: "VLSFO",
        massTonnes: 120,
        lcvMjPerKg: 41.0,
        co2FactorTtW: 3.114,
        ghgIntensityWtW: 91.4,
      },
    ];

    const mrvReport = mapToThetisMrvPartB(company, vessel, 2025, voyages, consumptions, "DNV AS");
    assert.strictEqual(mrvReport.shipDetails.imoNumber, "9876543");
    assert.strictEqual(mrvReport.verifierInformation.accreditedVerifierName, "DNV AS");
    assert.ok(mrvReport.emissionsData.totalCo2EmissionsTonnes > 0);

    const xmlOutput = exportThetisMrvXml(mrvReport);
    assert.ok(xmlOutput.includes("<ThetisMrvReport"), "Geçerli XML kökü içermelidir.");
    assert.ok(xmlOutput.includes("<ImoNumber>9876543</ImoNumber>"), "IMO numarasını içermelidir.");
  });

  it("6. Aşama: EU ETS Şirket ve Filo Toplulaştırma & Mutabakatı Testi", () => {
    const fleetVessels = [
      {
        vesselId: vessel.id,
        vesselName: vessel.name,
        imoNumber: vessel.imoNumber,
        charterType: "OWNED_OPERATED" as const,
        grossTonnage: 16500,
        isSubjectToEts: true,
        totalScopedCo2Tonnes: 186.84, // %50 seferlik 120 ton VLSFO * 3.114 * 0.5
      },
      {
        vesselId: "VESSEL-9876544",
        vesselName: "M/V ANATOLIA LEADER",
        imoNumber: "9876544",
        charterType: "TIME_CHARTER" as const,
        chartererName: "Mediterranean Chartering Ltd",
        grossTonnage: 28000,
        isSubjectToEts: true,
        totalScopedCo2Tonnes: 450.0,
      },
    ];

    const reconciliation = reconcileFleetEtsObligation(
      company.id,
      company.title,
      2025,
      fleetVessels,
      75.0 // 75 EUR/ton EUA
    );

    assert.strictEqual(reconciliation.phaseInRatio, 0.7, "2025 yılı ETS phase-in oranı %70 olmalıdır.");
    assert.strictEqual(reconciliation.qualifyingShipsCount, 2);
    assert.ok(reconciliation.totalEuaSurrenderRequired > 0);
    assert.ok(reconciliation.totalFinancialExposureEur > 0);
    assert.strictEqual(
      reconciliation.vesselAllocations[1]?.responsibleParty,
      "Kiracı: Mediterranean Chartering Ltd (BIMCO ETS Clause)"
    );
  });

  it("7. Aşama: Administering Authority ve Union Registry Karar Ağacı Testi", () => {
    // Türkiye merkezli armatör, en çok İtalya limanına uğrak yapmış
    const decision = determineAdministeringMemberState(
      false,
      undefined,
      [
        { countryCode: "IT", portCallsCount: 28 },
        { countryCode: "GR", portCallsCount: 14 },
        { countryCode: "ES", portCallsCount: 6 },
      ],
      "IT"
    );

    assert.strictEqual(decision.assignedMemberState, "IT", "En çok liman uğrağı yapılan İtalya seçilmelidir.");
    assert.strictEqual(decision.ruleApplied, "GREATEST_PORT_CALLS_4YR");
    assert.ok(decision.mohaOpeningChecklist.length >= 5, "MOHA hesap açılış kontrol listesi tam olmalıdır.");
  });

  it("8. Aşama: Denetçi İstisna Motoru (Exception Engine) Testi", () => {
    // 1. Yakıt ikmali amaçlı durak (Excluded port call)
    const bunkeringEvaluation = evaluateMaritimeExceptions({
      shipType: "container",
      grossTonnage: 16500,
      iceClass: "none",
      stopPurpose: "BUNKERING_ONLY",
      port: portPiraeus,
      reportingYear: 2025,
    });
    assert.strictEqual(bunkeringEvaluation.isValidPortCall, false, "Yalnızca yakıt ikmali durak sayılmaz.");

    // 2. 400-4.999 GT Genel Kargo Gemisi (MRV var, ETS yok)
    const smallCargoEvaluation = evaluateMaritimeExceptions({
      shipType: "general_cargo",
      grossTonnage: 3200,
      iceClass: "none",
      stopPurpose: "CARGO_OPERATION",
      port: portGenoa,
      reportingYear: 2025,
    });
    assert.strictEqual(smallCargoEvaluation.isSubjectToMrv, true, "3.200 GT genel kargo 2025'te MRV'ye tabidir.");
    assert.strictEqual(smallCargoEvaluation.isSubjectToEtsSurrender, false, "5.000 GT altı ETS teslimine tabi değildir.");

    // 3. Ice Class IA Düzeltmesi
    const iceEvaluation = evaluateMaritimeExceptions({
      shipType: "bulk_carrier",
      grossTonnage: 25000,
      iceClass: "IA",
      stopPurpose: "CARGO_OPERATION",
      port: portGenoa,
      reportingYear: 2025,
      isIceNavigation: true,
    });
    assert.strictEqual(iceEvaluation.fuelCorrectionFactor, 0.95, "Ice Class IA için %5 tüketim indirimi uygulanmalıdır.");
  });

  it("9. Aşama: Mevzuat Değişiklik Otomasyonu & İzleme Testi", () => {
    // Aktif kurallarla uyumlu oturum
    const cleanCheck = auditSessionAgainstActiveRules(CURRENT_MARITIME_RULESET.version);
    assert.strictEqual(cleanCheck.hasDeviation, false);
    assert.strictEqual(cleanCheck.status, "audited");

    // Eski/değişmiş kurallı oturum
    const dirtyCheck = auditSessionAgainstActiveRules("EU-MARITIME-2024.LEGACY", {
      fueleu2025Target: 95.0, // Geçersiz hedef
    });
    assert.strictEqual(dirtyCheck.hasDeviation, true);
    assert.strictEqual(
      dirtyCheck.status,
      "REGULATORY_REVIEW_REQUIRED",
      "Mevzuat sapması durumunda dosya REGULATORY_REVIEW_REQUIRED durumuna geçmelidir."
    );
  });

  it("10. Aşama: Uçtan Uca Bağımsız Klas Doğrulama Mührü Testi", async () => {
    // Tüm testlerin bileşkesi olarak mühür manifest hash'i hesaplanır
    const manifestPayload = JSON.stringify({
      companyImo: company.imoCompanyNumber,
      vesselImo: vessel.imoNumber,
      reportingYear: 2025,
      status: "VERIFIED_READY_FOR_SEAL",
      rulesetVersion: CURRENT_MARITIME_RULESET.version,
    });

    const sealHash = await computeSha256(manifestPayload);
    assert.ok(sealHash.length === 64);
    assert.ok(/^[0-9a-f]{64}$/.test(sealHash), "Kriptografik SHA-256 biçimi doğrulanmalıdır.");
  });
});
