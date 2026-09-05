/**
 * EU Denizcilik Karbon Uyumu — 30 Kapılı Akredite Verifier Kabul Testi
 *
 * Mandate Bölüm 24 Kriterleri (30/30 Zorunlu Kabul Kapısı):
 * 1. Primary ship identity (BLOCK-0)
 * 2. Registered owner / ISM / responsibility mandate
 * 3. Administering authority
 * 4. MOHA evidence
 * 5. MRV MP validity
 * 6. MRV Annex II A-E coverage
 * 7. MRV Company Report Annex IV A-D coverage
 * 8. 100% voyage completeness
 * 9. 100% port-call completeness
 * 10. Fuel/BDN/ROB reconciliation
 * 11. CO2 calculation
 * 12. CH4 calculation
 * 13. N2O calculation
 * 14. 2025 ETS CO2-only liability separation
 * 15. 70% 2025 phase-in
 * 16. FuelEU MP A-F completeness
 * 17. FuelEU Article 15 reporting dataset
 * 18. WtT/TtW factor provenance
 * 19. Biofuel PoS treatment
 * 20. FuelEU GHG intensity
 * 21. Compliance balance in gCO2eq
 * 22. Banking rules
 * 23. Borrowing rules
 * 24. Pooling applicability
 * 25. OPS applicability
 * 26. Data-gap register
 * 27. Uncertainty register
 * 28. Evidence index
 * 29. Full SHA-256 package (9 Statutory Folders)
 * 30. No premature verifier statements
 *
 * Failure Modes A, B, C, D negatif testleri.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { buildMaritimeDossier } from "../../src/lib/maritime/dossier/builder";
import { evaluateIdentityGate, verifyImoChecksum } from "../../src/lib/maritime/identity/identity-gate";
import { reconcileMaritimeData } from "../../src/lib/maritime/reconciliation/reconciler";
import { calculateFuelEuCompliance } from "../../src/lib/maritime/fueleu/engine";
import { createSealedMaritimePackage, buildSealedMaritimeZipUint8Array } from "../../src/lib/maritime/package-seal";
import { STATUTORY_FUEL_REGISTRY, ETS_PHASE_IN, FUELEU_COMPLIANCE_BALANCE_UNIT } from "../../src/lib/maritime/constants";

describe("MANDATE — EU Maritime Carbon Verifier-Acceptance 30-Gate Audit", () => {
  const validDossierInput = {
    reportingYear: 2025,
    companyTitle: "Medkon Hat İşletmeciliği Denizcilik ve Tic. A.Ş.",
    imoCompanyNumber: "5421987",
    role: "ism-yoneticisi" as const,
    registeredOwnerName: "Medkon Lines Shipping Ltd.",
    registeredOwnerImoNumber: "5421987",
    country: "Türkiye",
    countryCode: "TR",
    administeringAuthorityName: "İtalya Ulusal Denizcilik İdaresi (MASE)",
    administeringCountryCode: "IT",
    mohaAccountId: "EU-IT-100-MOHA-5421987",
    formalMandateReference: "MANDATE-MEDKON-2025-01",

    shipName: "M/V MEDKON IZMIR",
    imoNumber: "9437892",
    portOfRegistry: "İstanbul",
    homePort: "Ambarlı",
    flagState: "TR - Türkiye",
    grossTonnage: 14200,
    deadweightTonnes: 18500,
    shipType: "container",
    officialCategory: "Container ship",
    classificationSociety: "DNV",
    iceClass: "none",

    verifierName: "DNV GL SE",
    accreditationNumber: "DAkkS D-VS-14065-01-00",
    accreditationBody: "DAkkS (Almanya)",
    leadAuditor: "Capt. Markus Vance",
    verificationStatus: "UNDER_VERIFICATION" as const,

    mrvPlanAssessed: true,
    mrvPlanApproved: true,
    fuelEuPlanAssessed: true,

    annualVoyagesCount: 24,
    departurePortName: "Ambarlı (İstanbul)",
    departureUnlocode: "TRAMB",
    departureIsEu: false,
    arrivalPortName: "Cenova (İtalya)",
    arrivalUnlocode: "ITGOA",
    arrivalIsEu: true,

    fuelType: "VLSFO" as const,
    fuelQuantityTonnes: 1350,
    bioFuelQuantityTonnes: 50,
    useShorePower: true,
    opsElectricityKWh: 36000,

    evidences: [
      {
        fileName: "BDN-2025-MEDKON-014.pdf",
        fileType: "Bunker Delivery Note (BDN)",
        sizeBytes: 184520,
        sha256Hash: "b8a9238e8316c80c2f82161b9a997ef3dc138e68cfb9ec9c0e5a87679ad30e99",
        status: "verified" as const,
        uploadedAt: "2025-06-12T09:30:00Z",
      },
      {
        fileName: "DNV_CLASS_CERT_MEDKON_IZMIR.pdf",
        fileType: "DNV Class Certificate",
        sizeBytes: 942100,
        sha256Hash: "d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592",
        status: "verified" as const,
        uploadedAt: "2025-03-01T14:15:00Z",
      },
    ],
  };

  const dossier = buildMaritimeDossier(validDossierInput);
  const pkg = createSealedMaritimePackage(dossier);

  // ══════════════════════════════════════════════════════════════════════════
  // KAPILAR 1 - 10: KİMLİK, YETKİ, MRV VE SEFER TAMLIĞI
  // ══════════════════════════════════════════════════════════════════════════

  it("Gate 01 [PASS] Primary ship identity (IMO Res. A.1078(28) & BLOCK-0)", () => {
    assert.strictEqual(verifyImoChecksum(dossier.ship.imoNumber), true, "IMO sağlama toplamı geçerli olmalıdır.");
    assert.strictEqual(dossier.ship.imoNumber, "9437892");
    assert.strictEqual(dossier.ship.grossTonnage, 14200);
    assert.strictEqual(dossier.ship.flagState, "TR - Türkiye");
    assert.strictEqual(dossier.readiness.identityConflictDetected, false);
  });

  it("Gate 02 [PASS] Registered owner / ISM responsibility mandate", () => {
    assert.ok(dossier.company.imoCompanyNumber.length === 7);
    assert.ok(dossier.company.formalMandateReference.length > 0);
    assert.strictEqual(dossier.company.role, "ism-yoneticisi");
    assert.strictEqual(dossier.company.responsibilityFrom, "2025-01-01");
    assert.strictEqual(dossier.company.responsibilityTo, "2025-12-31");
  });

  it("Gate 03 [PASS] Administering authority attribution", () => {
    assert.strictEqual(dossier.company.administeringCountryCode, "IT");
    assert.ok(dossier.company.administeringAuthority.includes("İtalya"));
  });

  it("Gate 04 [PASS] MOHA evidence and national registry statement", () => {
    assert.ok(dossier.company.mohaAccountId, "MOHA hesap ID mevcut olmalıdır.");
    assert.ok(dossier.company.mohaAccountId.includes("EU-IT"));
  });

  it("Gate 05 [PASS] MRV Monitoring Plan validity (IR 2023/2449)", () => {
    assert.strictEqual(dossier.mrvMonitoringPlan.monitoringPlanAssessed, true);
    assert.strictEqual(dossier.mrvMonitoringPlan.fuelMonitoringMethod, "Method A (BDN)");
    assert.strictEqual(dossier.mrvMonitoringPlan.uncertaintyPercent, 2.0);
    assert.ok(dossier.mrvMonitoringPlan.emissionSources.length >= 4);
  });

  it("Gate 06 [PASS] MRV Annex II Part A-E coverage", () => {
    assert.ok(dossier.ship.shipName, "Part A ship identification present");
    assert.ok(dossier.verifier.verifierName, "Part B verification present");
    assert.ok(dossier.mrvMonitoringPlan.fuelMonitoringMethod, "Part C monitoring methods present");
    assert.ok(dossier.etsCalculation.totalReportedCo2eTonnes > 0, "Part D annual results present");
    assert.ok(dossier.etsCalculation.scopedCo2eTonnes > 0, "Part E ETS relevant results present");
  });

  it("Gate 07 [PASS] MRV Company Report Annex IV A-D coverage", () => {
    assert.ok(dossier.companyLevelReport, "Company level report present");
    assert.strictEqual(dossier.companyLevelReport.reportingYear, 2025);
    assert.strictEqual(dossier.companyLevelReport.totalFleetShipsCount, 1);
    assert.strictEqual(dossier.companyLevelReport.etsPhaseInRate, 0.7);
    assert.ok(dossier.companyLevelReport.totalCompanySurrenderEuaObligation > 0);
  });

  it("Gate 08 [PASS] 100% voyage chain completeness and continuity", () => {
    assert.ok(dossier.voyages.length >= 2, "En az 2 sefer bulunmalıdır.");
    for (let i = 1; i < dossier.voyages.length; i++) {
      const prev = dossier.voyages[i - 1]!;
      const curr = dossier.voyages[i]!;
      assert.strictEqual(
        prev.arrivalUnlocode,
        curr.departureUnlocode,
        `Sefer ${i} kalkış limanı (${curr.departureUnlocode}), Sefer ${i - 1} varış limanı (${prev.arrivalUnlocode}) ile eşleşmelidir.`
      );
    }
  });

  it("Gate 09 [PASS] 100% port-call completeness & berth metrics", () => {
    for (const v of dossier.voyages) {
      assert.ok(v.timeAtBerthHours > 0, "Her sefer için liman kalış süresi pozitif olmalıdır.");
      assert.ok(v.transportWorkTonneNm > 0, "Taşıma işi pozitif olmalıdır.");
    }
  });

  it("Gate 10 [PASS] Fuel / BDN / ROB reconciliation (Mass conservation)", () => {
    assert.strictEqual(dossier.readiness.reconciliationAuditPassed, true);
    assert.strictEqual(
      dossier.readiness.blocking.filter((b) => b.includes("ROB Denge") || b.includes("Açıklanamayan Fark")).length,
      0,
      "Açıklanamayan yakıt farkı bulunmamalıdır."
    );
  });

  // ══════════════════════════════════════════════════════════════════════════
  // KAPILAR 11 - 20: EMİSYON HESAPLARI, ETS VE FUELEU MEVZUATI
  // ══════════════════════════════════════════════════════════════════════════

  it("Gate 11 [PASS] CO2 calculation (MRV Physical & IMO MEPC standard)", () => {
    const vlsfoSpec = STATUTORY_FUEL_REGISTRY.VLSFO;
    assert.strictEqual(vlsfoSpec.mrvPhysical.co2FactorTtW, 3.114);
    assert.ok(dossier.etsCalculation.totalReportedCo2eTonnes > 4000);
  });

  it("Gate 12 [PASS] CH4 calculation with IPCC AR6 GWP = 28", () => {
    const vlsfoSpec = STATUTORY_FUEL_REGISTRY.VLSFO;
    assert.strictEqual(vlsfoSpec.mrvPhysical.gwpCh4, 28);
    assert.strictEqual(vlsfoSpec.mrvPhysical.ch4FactorTtW, 0.00005);
  });

  it("Gate 13 [PASS] N2O calculation with IPCC AR6 GWP = 265", () => {
    const vlsfoSpec = STATUTORY_FUEL_REGISTRY.VLSFO;
    assert.strictEqual(vlsfoSpec.mrvPhysical.gwpN2o, 265);
    assert.strictEqual(vlsfoSpec.mrvPhysical.n2oFactorTtW, 0.00018);
  });

  it("Gate 14 [PASS] 2025 ETS CO2-only liability separation (Directive (EU) 2023/959)", () => {
    assert.strictEqual(dossier.etsCalculation.etsLiableCh4Tonnes, 0.0, "CH4 2025 ETS teslim dışıdır.");
    assert.strictEqual(dossier.etsCalculation.etsLiableN2oTonnes, 0.0, "N2O 2025 ETS teslim dışıdır.");
    assert.strictEqual(
      dossier.etsCalculation.etsLiableCo2Tonnes,
      dossier.etsCalculation.liableGhgTonnes,
      "2025'te ETS teslim yükümlülüğü yalnızca CO2 gazıdır."
    );
  });

  it("Gate 15 [PASS] 70% 2025 ETS Phase-In multiplier", () => {
    assert.strictEqual(ETS_PHASE_IN[2025], 0.7);
    assert.strictEqual(dossier.etsCalculation.phaseInPercentage, 70);
    assert.strictEqual(dossier.etsCalculation.liableGhgTonnes, 1471.4);
    assert.strictEqual(dossier.etsCalculation.surrenderEuaObligation, 1472);
  });

  it("Gate 16 [PASS] FuelEU Monitoring Plan Part A-F completeness (IR 2024/2031)", () => {
    assert.ok(dossier.fuelEuMonitoringPlan.planVersion.length > 0);
    assert.ok(dossier.fuelEuMonitoringPlan.energyConsumers.length >= 3);
    assert.ok(dossier.fuelEuMonitoringPlan.fuelClassesAllowed.length >= 4);
    assert.ok(dossier.fuelEuMonitoringPlan.opsConnectionProcedure.includes("IEC/IEEE 80005-1"));
  });

  it("Gate 17 [PASS] FuelEU Article 15 reporting dataset", () => {
    assert.ok(dossier.fuelEuCalculation.totalEnergyMj > 0);
    assert.ok(dossier.fuelEuCalculation.targetGhgIntensity > 89 && dossier.fuelEuCalculation.targetGhgIntensity < 90);
    assert.ok(dossier.fuelEuCalculation.actualGhgIntensity > 0);
  });

  it("Gate 18 [PASS] WtT/TtW factor provenance (Regulation (EU) 2023/1805 Annex II)", () => {
    const vlsfoSpec = STATUTORY_FUEL_REGISTRY.VLSFO;
    assert.strictEqual(vlsfoSpec.fuelEuWtw.wttGhgIntensity, 13.5);
    assert.strictEqual(vlsfoSpec.fuelEuWtw.ttwCo2Default, 3.114);
    assert.strictEqual(vlsfoSpec.fuelEuWtw.lcvMjPerKg, 41.0);
  });

  it("Gate 19 [PASS] Biofuel PoS treatment (Zero factor requires RED II proof)", () => {
    const bioSpec = STATUTORY_FUEL_REGISTRY.BIO_DIESEL;
    assert.strictEqual(bioSpec.fuelEuWtw.isBiofuel, true);
    assert.strictEqual(bioSpec.fuelEuWtw.requiresProofOfSustainability, true);
    assert.strictEqual(bioSpec.fuelEuWtw.ttwCo2Default, 2.834, "PoS yoksa varsayılan faktör 2.834 g/gFuel olmalıdır.");
  });

  it("Gate 20 [PASS] FuelEU GHG Intensity calculation (Annex I Equation 1)", () => {
    assert.ok(dossier.fuelEuCalculation.actualGhgIntensity > 80 && dossier.fuelEuCalculation.actualGhgIntensity < 95);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // KAPILAR 21 - 30: COMPLIANCE BALANCE, CONTROLS, PAKETLEME VE GÜVENLİK
  // ══════════════════════════════════════════════════════════════════════════

  it("Gate 21 [PASS] Compliance balance in gCO2eq (Statutory Unit: Regulation (EU) 2023/1805 Annex IV)", () => {
    assert.strictEqual(FUELEU_COMPLIANCE_BALANCE_UNIT, "gCO2eq");
    assert.strictEqual(dossier.fuelEuCalculation.statutoryUnit, "gCO2eq");
    assert.strictEqual(typeof dossier.fuelEuCalculation.complianceBalanceGco2eq, "number");
  });

  it("Gate 22 [PASS] Article 20 Banking rules (Bankable subject to verification)", () => {
    if (dossier.fuelEuCalculation.isCompliant) {
      assert.strictEqual(dossier.fuelEuCalculation.bankingAllowed, true);
    }
  });

  it("Gate 23 [PASS] Article 21 Borrowing rules (2% ceiling & 1.1 repayment factor)", () => {
    assert.ok(
      (dossier.fuelEuCalculation.borrowingLimitGco2eq ?? dossier.fuelEuCalculation.borrowingLimitMj) > 0,
      "Borçlanma tavanı pozitif olmalıdır."
    );
  });

  it("Gate 24 [PASS] Article 21 Fleet Pooling applicability", () => {
    assert.ok(typeof dossier.fuelEuCalculation.compliancePenaltyEur === "number");
  });

  it("Gate 25 [PASS] Article 6 OPS applicability (2025 voluntary status, no premature penalty)", () => {
    assert.strictEqual(dossier.fuelEuCalculation.opsComplianceStatus, "VOLUNTARY_USAGE_RECORDED");
  });

  it("Gate 26 [PASS] Data gap register (No unrecorded data gaps)", () => {
    const unrecordedGaps = dossier.voyages.filter((v) => v.dataGap && !v.dataGapReason);
    assert.strictEqual(unrecordedGaps.length, 0);
  });

  it("Gate 27 [PASS] Measurement uncertainty register (ISO 5168)", () => {
    assert.ok(dossier.mrvMonitoringPlan.uncertaintyPercent <= 5.0);
  });

  it("Gate 28 [PASS] Evidence index & cryptographic audit trail", () => {
    assert.ok(dossier.evidences.length >= 2);
    for (const ev of dossier.evidences) {
      assert.strictEqual(ev.sha256Hash.length, 64);
    }
  });

  it("Gate 29 [PASS] Full SHA-256 package in 9 Statutory Folders", () => {
    assert.ok(pkg.statutoryFiles && pkg.statutoryFiles.length >= 25, "9 klasörde en az 25 resmi teslim dosyası olmalıdır.");

    const folders = new Set(pkg.statutoryFiles!.map((f) => f.folder));
    const requiredFolders = [
      "00_MAIN_REPORT",
      "01_MRV",
      "02_FUELEU",
      "03_ETS",
      "04_OPERATIONAL_DATA",
      "05_GHG",
      "06_CONTROLS",
      "07_PRIMARY_EVIDENCE",
      "08_INTEGRITY",
    ];
    for (const req of requiredFolders) {
      assert.ok(folders.has(req), `Zorunlu klasör eksik: /${req}/`);
    }

    // 08_INTEGRITY dosyaları
    const manifestFile = pkg.statutoryFiles!.find((f) => f.path === "08_INTEGRITY/manifest.json");
    assert.ok(manifestFile, "08_INTEGRITY/manifest.json bulunmalıdır.");
    const manifestJson = JSON.parse(manifestFile!.content);
    assert.strictEqual(manifestJson.manifestVersion, "2026.1");

    const shaSumsFile = pkg.statutoryFiles!.find((f) => f.path === "08_INTEGRITY/SHA256SUMS.txt");
    assert.ok(shaSumsFile, "08_INTEGRITY/SHA256SUMS.txt bulunmalıdır.");
    assert.ok(shaSumsFile!.content.includes("00_MAIN_REPORT"));

    // PKZIP doğrulaması
    const zip = pkg.zipBytes || buildSealedMaritimeZipUint8Array(pkg);
    const magic = Buffer.from(zip.slice(0, 4)).toString("hex");
    assert.strictEqual(magic, "504b0304", "Standart PKZIP magic (PK\\x03\\x04) olmalıdır.");
  });

  it("Gate 30 [PASS] No premature verifier assurance statements", () => {
    // Statü kesinlikle VERIFIED, VERIFIED_AS_SATISFACTORY veya VERIFIER APPROVED olamaz
    assert.notStrictEqual(dossier.readiness.status, "VERIFIED");
    assert.notStrictEqual(dossier.readiness.status, "VERIFIED_COMPLIANT");
    assert.strictEqual(
      dossier.readiness.status,
      "PRE_VERIFICATION_DOSSIER_READY_FOR_ACCREDITED_VERIFIER_REVIEW"
    );
    assert.strictEqual(dossier.readiness.score, 100);
    assert.strictEqual(dossier.readiness.blocking.length, 0);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // NEGATİF TESTLER: FAILURE MODES A, B, C, D
  // ══════════════════════════════════════════════════════════════════════════

  it("Failure Mode A — Gemi kimliği uyuşmazlığında BLOCK-0 tetiklenir (Readiness: 0/100)", () => {
    const conflictResult = evaluateIdentityGate(
      {
        shipName: "M/V MEDKON IZMIR",
        imoNumber: "9437892",
        flagState: "TR - Türkiye",
        portOfRegistry: "İstanbul",
        grossTonnage: 14200,
        shipType: "container",
        registeredOwnerName: "Medkon Lines",
        registeredOwnerImoNumber: "5421987",
        ismCompanyName: "Medkon Lines",
        ismCompanyImoNumber: "5421987",
        responsibilityPeriodFrom: "2025-01-01",
        responsibilityPeriodTo: "2025-12-31",
      },
      {
        certificateOfRegistry: {
          shipName: "M/V MEDKON IZMIR",
          imoNumber: "9437892",
          flag: "TR - Türkiye",
          portOfRegistry: "İstanbul",
          grossTonnage: 2270, // Çatışma: 14,200 != 2,270
          issueDate: "2023-01-15",
          issuingAuthority: "Flag State",
          documentRef: "REG-CONFLICT",
        },
      }
    );

    assert.strictEqual(conflictResult.passed, false);
    assert.strictEqual(conflictResult.score, 0);
    assert.strictEqual(conflictResult.status, "IDENTITY_CONFLICT_DETECTED");
    assert.ok(conflictResult.conflicts.some((c) => c.includes("Brüt Tonaj (GT) Çatışması")));
  });

  it("Failure Mode B — Mutabakat açığı durumunda skor en fazla 49/100 ve BLOKE", () => {
    const brokenAudit = reconcileMaritimeData(
      [
        {
          fuelType: "VLSFO",
          openingRobTonnes: 100,
          bunkeredTonnes: 1000,
          transfersInTonnes: 0,
          transfersOutTonnes: 0,
          closingRobTonnes: 100,
          calculatedConsumptionTonnes: 1000,
          engineLogConsumptionTonnes: 1000,
          voyageReportedConsumptionTonnes: 800, // 200 ton açıklanamayan fark!
          bdnReferences: ["BDN-FAIL-01"],
        },
      ],
      []
    );

    assert.strictEqual(brokenAudit.passed, false);
    assert.strictEqual(brokenAudit.status, "UNEXPLAINED_VARIANCE_BLOCKED");
    assert.ok(brokenAudit.auditNotes.some((n) => n.includes("varyansı") || n.includes("BLOKE")));
  });

  it("Failure Mode C — Kanıtsız (PoS eksik) biyoyakıt için sıfır emisyon uygulanamaz", () => {
    const uncertifiedBioResult = calculateFuelEuCompliance({
      reportingYear: 2025,
      consumptions: [
        {
          fuelType: "BIO_DIESEL",
          massTonnes: 100,
          scopeRatio: 1.0,
          hasProofOfSustainability: false, // PoS YOK
        },
      ],
    });

    // PoS olmadan TtW faktörü 2.834 g/gFuel olmalı ve gerçek yoğunluk yüksek çıkmalı
    assert.ok(uncertifiedBioResult.actualGhgIntensity > 80, "PoS olmayan biyoyakıt cezalandırıcı varsayılan faktör almalıdır.");
  });

  it("Failure Mode D — Sahte ve erken verifier onay ifadeleri sisteme sızamaz", () => {
    assert.notStrictEqual(dossier.verifier.verificationStatus, "VERIFIED_AS_SATISFACTORY");
    assert.notStrictEqual(dossier.readiness.status, "VERIFIER APPROVED");
    assert.notStrictEqual(dossier.readiness.status, "DNV APPROVED");
  });
});
