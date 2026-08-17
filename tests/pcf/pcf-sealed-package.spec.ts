import { calculatePcf } from "../../src/lib/pcf/calculator";
import { createPcfSealedPackage } from "../../src/lib/pcf/package-seal";
import {
  PCF_FORBIDDEN_CBAM_FILENAMES,
  PCF_SEALED_PACKAGE_FILE_COUNT,
  PCF_SEALED_PACKAGE_FILES,
} from "../../src/lib/pcf/package-manifest";
import type { PcfFactorRecord, PcfInput } from "../../src/lib/pcf/types";

function assert(cond: unknown, message: string): asserts cond {
  if (!cond) throw new Error(message);
}

const src = {
  publisher: "TEST",
  title: "Test fixture",
  version: "1",
  referenceYear: 2026,
  reviewedAt: "2026-08-17",
  nextReviewAt: "2027-08-17",
  sourceUrl: "https://example.test/factor",
  licence: "test-only",
  sourceType: "other" as const,
};

const REGISTRY: readonly PcfFactorRecord[] = [
  {
    id: "test-material",
    kind: "material",
    labelTr: "Test malzeme",
    labelEn: "Test material",
    materialIds: ["test-material"],
    aliases: [],
    geographies: ["TR"],
    activityUnit: "kg",
    kgCo2ePerActivityUnit: 2,
    boundary: "cradle-to-gate",
    gwpBasis: "test",
    quality: "official_generic",
    reviewStatus: "approved",
    buyerReadyEligible: true,
    source: src,
    limitations: [],
  },
];

const INPUT: PcfInput = {
  reportId: "PCF-TEST-SEAL",
  createdAt: "2026-08-17T12:00:00.000Z",
  companyName: "Test A.Ş.",
  facilityName: "Test Tesisi",
  country: "TR",
  productName: "Test ürün",
  reportingPeriodStart: "2026-01-01",
  reportingPeriodEnd: "2026-12-31",
  functionalUnit: "1 adet",
  productionQuantityForPeriod: 100,
  allocationShare: 1,
  allocationMethod: "Tek hat",
  materials: [
    { id: "m1", materialId: "test-material", label: "Test malzeme", quantityKgPerFunctionalUnit: 3, origin: "primary" },
  ],
  packaging: [],
  fuels: [],
  evidence: { productionRecord: true, electricityInvoice: true, fuelInvoice: true, materialEvidenceCount: 1 },
};

const result = calculatePcf(INPUT, REGISTRY);
assert(result.status === "buyer_ready", `buyer_ready bekleniyordu ${result.status}`);

let blockedThrew = false;
try {
  createPcfSealedPackage(INPUT, { ...result, status: "blocked" }, { sessionId: "s1", createdAt: INPUT.createdAt, packageId: "PCF-SEAL-20260817-TEST0001" });
} catch {
  blockedThrew = true;
}
assert(blockedThrew, "blocked PCF ZIP üretmez");

const meta = { sessionId: "s1", createdAt: "2026-08-17T12:00:00.000Z", packageId: "PCF-SEAL-20260817-TEST0001" };
const pkg = createPcfSealedPackage(INPUT, result, meta);
assert(pkg.files.length === PCF_SEALED_PACKAGE_FILE_COUNT, "8 dosya");
assert(
  pkg.files.every((f, i) => f.filename === PCF_SEALED_PACKAGE_FILES[i].filename),
  "dosya sırası SSOT",
);
assert(pkg.files.every((f) => /^[a-f0-9]{64}$/.test(f.sha256)), "her dosyanın SHA-256 değeri var");
for (const forbidden of PCF_FORBIDDEN_CBAM_FILENAMES) {
  assert(!pkg.files.some((f) => f.filename === forbidden), `CBAM dosyası yok: ${forbidden}`);
}
assert(!pkg.files.some((f) => /Communication-Template|De-Minimis|Dogrulayici-Calisma/i.test(f.filename)), "CBAM isimleri yok");
assert(pkg.zipBytes.length > 100, "ZIP boş değil");
assert(pkg.masterHash.startsWith("sha256:"), "master hash");

const pkg2 = createPcfSealedPackage(INPUT, result, meta);
assert(pkg.masterHash === pkg2.masterHash, "master hash deterministik");
assert(pkg.zipBytes.length === pkg2.zipBytes.length, "ZIP boyutu deterministik");
assert(Buffer.from(pkg.zipBytes).equals(Buffer.from(pkg2.zipBytes)), "ZIP bayt-bit eşit");

const estimated = calculatePcf(
  { ...INPUT, evidence: { ...INPUT.evidence, productionRecord: false } },
  REGISTRY,
);
assert(estimated.status === "estimated", "kanıt eksik estimated");
const estPkg = createPcfSealedPackage(INPUT, estimated, meta);
assert(estPkg.manifesto.reportStatus === "estimated", "estimated etiketi pakette kalır");

console.log("pcf-sealed-package: PASS");
