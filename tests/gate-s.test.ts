import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateSkdmLiability } from "../src/lib/skdm/calculator";
import { createSealedAuditPackage } from "../src/lib/skdm/package-seal";
import {
  validateSealRegisterSnapshot,
  SealRegisterValidationError,
} from "../src/lib/skdm/registerValidation";

const streams = [
  { method: "Combustion", name: "Doğalgaz", ad: 1850, unit: "GJ", ncv: "48.5", processId: "p2" },
];
const gecerliPrecs = [
  { name: "Demir cevheri pelet", total: 980, internal: 0, other: 980, see: 0.08 },
];

function baseResult() {
  return calculateSkdmLiability({
    sectorId: "iron-steel",
    productionVolume: 1250,
    year: 2026,
    importerAnnualVolumeStatus: "over50", // hazırlık skoru %100 için gerekli
    useCustomEmissions: true,
    hasVerificationEvidence: true,
    streams,
    precursors: [{ name: "Demir cevheri pelet", total: 980, see: 0.08 }],
  });
}

describe("GATE-S — register doğrulaması", () => {
  it("precs.internal eksikse net hata fırlatır, ham TypeError DEĞİL", () => {
    const bozukPrecs = [{ name: "Demir cevheri pelet", total: 980, see: 0.08 }];
    assert.throws(
      () => validateSealRegisterSnapshot({ precs: bozukPrecs }),
      SealRegisterValidationError,
    );
  });

  it("hata mesajı bozuk satırı ve alanı işaret eder", () => {
    const bozukPrecs = [{ name: "Ferroalyaj", total: 55, see: 1.15 }];
    try {
      validateSealRegisterSnapshot({ precs: bozukPrecs });
      assert.fail("Beklenen hata fırlatılmadı");
    } catch (error) {
      assert.ok(error instanceof SealRegisterValidationError);
      assert.equal(error.hatalar[0].bolum, "precs");
      assert.ok(error.hatalar.some((item) => item.alan === "internal"));
      assert.match(error.message, /Ferroalyaj/);
    }
  });

  it("internal + other, total'a eşit değilse yakalar", () => {
    const tutmayanPrecs = [
      { name: "Hurda çelik", total: 420, internal: 100, other: 300, see: 0.02 },
    ];
    assert.throws(
      () => validateSealRegisterSnapshot({ precs: tutmayanPrecs }),
      /internal\+other/,
    );
  });

  it("geçerli veriyle sorun çıkarmaz", () => {
    assert.doesNotThrow(() => validateSealRegisterSnapshot({ precs: gecerliPrecs }));
  });

  it("uçtan uca: bozuk precs ile mühürleme SealRegisterValidationError ile durur", () => {
    const result = baseResult();
    const bozukPrecs = [{ name: "Demir cevheri pelet", total: 980, see: 0.08 }];
    assert.throws(
      () =>
        createSealedAuditPackage(result, {
          sessionId: "test",
          sectorSlug: "demir-celik",
          streams: streams as any,
          precs: bozukPrecs as any,
          dProcesses: { a: 1250, b: 1100, c: 100, d: 50 },
          fieldValues: {
            vFirma: "Test Kişi",
            tesisAdiTR: "Test Kişi",
            isletmeTuru: "sahis",
            vkn: "25403091318",
            tesisAdiEN: "Test Facility",
            eposta: "test@example.com",
          },
        }),
      SealRegisterValidationError,
    );
  });

  it("uçtan uca: geçerli veriyle mühürleme tamamlanır", () => {
    const result = baseResult();
    const pkg = createSealedAuditPackage(result, {
      sessionId: "test-ok",
      sectorSlug: "demir-celik",
      streams: streams as any,
      precs: gecerliPrecs as any,
      dProcesses: { a: 1250, b: 1100, c: 100, d: 50 },
      fieldValues: {
        vFirma: "Test Kişi",
        tesisAdiTR: "Test Kişi",
        isletmeTuru: "sahis",
        vkn: "25403091318",
        tesisAdiEN: "Test Facility",
        eposta: "test@example.com",
      },
    });
    assert.ok(pkg.files.length > 0);
    assert.match(pkg.masterHash, /^sha256:/);
  });
});
