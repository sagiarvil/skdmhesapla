import { calculatePcf } from "../../src/lib/pcf/calculator";
import { PCF_FACTORS } from "../../src/lib/pcf/factors";
import { pcfPremiumCoverageGaps } from "../../src/lib/pcf/release-gate";
import { pcfReportPdfBytes } from "../../src/lib/pcf/report";
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
  {
    id: "test-packaging",
    kind: "packaging",
    labelTr: "Test ambalaj",
    labelEn: "Test packaging",
    materialIds: ["cardboard"],
    aliases: [],
    geographies: ["TR"],
    activityUnit: "kg",
    kgCo2ePerActivityUnit: 1,
    boundary: "cradle-to-gate",
    gwpBasis: "test",
    quality: "official_generic",
    reviewStatus: "approved",
    buyerReadyEligible: true,
    source: src,
    limitations: [],
  },
  {
    id: "test-electricity",
    kind: "electricity",
    labelTr: "Türkiye dağıtım elektrik",
    labelEn: "TR distribution electricity",
    materialIds: ["electricity-grid"],
    aliases: [],
    geographies: ["TR"],
    activityUnit: "kWh",
    kgCo2ePerActivityUnit: 0.5,
    boundary: "scope2-location-based",
    gwpBasis: "test",
    quality: "official_generic",
    reviewStatus: "approved",
    buyerReadyEligible: true,
    connectionType: "distribution",
    source: src,
    limitations: [],
  },
  {
    id: "test-gas",
    kind: "fuel",
    labelTr: "Doğalgaz test",
    labelEn: "Natural gas test",
    materialIds: ["natural-gas"],
    aliases: [],
    geographies: ["TR"],
    activityUnit: "Nm3",
    kgCo2ePerActivityUnit: 2,
    boundary: "combustion-only",
    gwpBasis: "test",
    quality: "official_generic",
    reviewStatus: "approved",
    buyerReadyEligible: true,
    source: src,
    limitations: [],
  },
  {
    id: "test-stale",
    kind: "material",
    labelTr: "Bayat malzeme",
    labelEn: "Stale material",
    materialIds: ["stale-material"],
    aliases: [],
    geographies: ["TR"],
    activityUnit: "kg",
    kgCo2ePerActivityUnit: 9,
    boundary: "cradle-to-gate",
    gwpBasis: "test",
    quality: "official_generic",
    reviewStatus: "approved",
    buyerReadyEligible: true,
    source: { ...src, nextReviewAt: "2026-01-01" },
    limitations: [],
  },
  {
    id: "test-wrong-unit",
    kind: "material",
    labelTr: "Yanlış birim",
    labelEn: "Wrong unit",
    materialIds: ["unit-mismatch"],
    aliases: [],
    geographies: ["TR"],
    activityUnit: "kWh",
    kgCo2ePerActivityUnit: 1,
    boundary: "cradle-to-gate",
    gwpBasis: "test",
    quality: "official_generic",
    reviewStatus: "approved",
    buyerReadyEligible: true,
    source: src,
    limitations: [],
  },
  {
    id: "test-proxy",
    kind: "material",
    labelTr: "Vekil",
    labelEn: "Proxy",
    materialIds: ["proxy-material"],
    aliases: [],
    geographies: ["TR"],
    activityUnit: "kg",
    kgCo2ePerActivityUnit: 3,
    boundary: "cradle-to-gate",
    gwpBasis: "test",
    quality: "proxy",
    reviewStatus: "estimate_only",
    buyerReadyEligible: false,
    source: src,
    limitations: ["Vekil kayıt."],
  },
];

const INPUT: PcfInput = {
  reportId: "PCF-TEST-001",
  createdAt: "2026-08-17T12:00:00.000Z",
  companyName: "Test A.Ş.",
  facilityName: "Test Tesisi",
  country: "TR",
  buyerName: "Buyer GmbH",
  productName: "Test ürün",
  cnCode: "9999",
  reportingPeriodStart: "2026-01-01",
  reportingPeriodEnd: "2026-12-31",
  functionalUnit: "1 adet",
  productionQuantityForPeriod: 100,
  allocationShare: 0.5,
  allocationMethod: "Kütle bazlı tahsis",
  materials: [
    { id: "m1", materialId: "test-material", label: "Test malzeme", quantityKgPerFunctionalUnit: 3, origin: "primary" },
  ],
  packaging: [
    { id: "p1", materialId: "cardboard", label: "Karton", quantityKgPerFunctionalUnit: 1, origin: "recycled" },
  ],
  electricity: { consumptionKwhForPeriod: 1000, connectionType: "distribution", geography: "TR" },
  fuels: [
    { id: "f1", fuelId: "natural-gas", label: "Doğalgaz", quantityForPeriod: 100, activityUnit: "Nm3", geography: "TR" },
  ],
  evidence: { productionRecord: true, electricityInvoice: true, fuelInvoice: true, materialEvidenceCount: 2 },
};

const r = calculatePcf(INPUT, REGISTRY);
assert(r.status === "buyer_ready", `buyer_ready bekleniyordu, gelen=${r.status}`);
assert(Math.abs(r.upstreamMaterialKgCo2ePerFunctionalUnit - 6) < 1e-9, "malzeme 6 olmalı");
assert(Math.abs(r.packagingKgCo2ePerFunctionalUnit - 1) < 1e-9, "ambalaj 1 olmalı");
assert(Math.abs(r.scope2KgCo2ePerFunctionalUnit - 2.5) < 1e-9, "scope2 2.5 olmalı");
assert(Math.abs(r.scope1KgCo2ePerFunctionalUnit - 1) < 1e-9, "scope1 1 olmalı");
assert(Math.abs(r.totalKgCo2ePerFunctionalUnit - 10.5) < 1e-9, "toplam 10.5 olmalı");

const r2 = calculatePcf(INPUT, REGISTRY);
assert(JSON.stringify(r) === JSON.stringify(r2), "aynı girdi + registry bit-bit aynı JSON sonucu üretmeli");

const bad = calculatePcf({ ...INPUT, productionQuantityForPeriod: 0 }, REGISTRY);
assert(bad.status === "blocked", "üretim sıfırsa blocked olmalı");

const missingFactor = calculatePcf(
  { ...INPUT, materials: [{ ...INPUT.materials[0]!, materialId: "unknown-material" }] },
  REGISTRY,
);
assert(missingFactor.status === "blocked", "faktör yoksa sayı uydurmak yerine blocked olmalı");
assert(missingFactor.findings.some((f) => f.code === "PCF_FACTOR_NOT_RESOLVED"), "factor not resolved finding bekleniyor");
assert(missingFactor.totalKgCo2ePerFunctionalUnit === 0 || missingFactor.contributions.every((c) => c.id !== "m1"), "bilinmeyen malzeme için 0 faktör yazılmaz");

const declaredSupplier = calculatePcf(
  {
    ...INPUT,
    materials: [
      {
        ...INPUT.materials[0]!,
        materialId: "unknown-material",
        supplierFactor: {
          valueKgCo2ePerKg: 1.5,
          sourceTitle: "Supplier PCF",
          sourceDocumentId: "SUP-001",
          issuedAt: "2026-01-01",
          thirdPartyVerified: false,
          boundary: "cradle-to-gate",
          evidenceRef: "internal://evidence/SUP-001",
        },
      },
    ],
  },
  REGISTRY,
);
assert(declaredSupplier.status === "estimated", "doğrulanmamış tedarikçi faktörü estimated olmalı");

const verifiedSupplier = calculatePcf(
  {
    ...INPUT,
    materials: [
      {
        ...INPUT.materials[0]!,
        materialId: "unknown-material",
        supplierFactor: {
          valueKgCo2ePerKg: 1.5,
          sourceTitle: "Verified EPD",
          sourceDocumentId: "EPD-001",
          issuedAt: "2026-01-01",
          thirdPartyVerified: true,
          boundary: "cradle-to-gate",
          evidenceRef: "internal://evidence/EPD-001",
        },
      },
    ],
  },
  REGISTRY,
);
assert(verifiedSupplier.status === "buyer_ready", `doğrulanmış tedarikçi + kanıt buyer_ready olmalı, gelen=${verifiedSupplier.status}`);

const stale = calculatePcf(
  { ...INPUT, materials: [{ ...INPUT.materials[0]!, materialId: "stale-material" }] },
  REGISTRY,
);
assert(stale.status === "blocked", "bayat faktör seçilmemeli");
assert(stale.findings.some((f) => f.code === "PCF_FACTOR_NOT_RESOLVED"), "stale factor not resolved");

const unitMismatch = calculatePcf(
  { ...INPUT, materials: [{ ...INPUT.materials[0]!, materialId: "unit-mismatch" }] },
  REGISTRY,
);
assert(unitMismatch.status === "blocked", "birim uyuşmazlığında blocked");
assert(unitMismatch.findings.some((f) => f.code === "PCF_UNIT_MISMATCH"), "unit mismatch finding");

const proxy = calculatePcf(
  { ...INPUT, materials: [{ ...INPUT.materials[0]!, materialId: "proxy-material" }] },
  REGISTRY,
);
assert(proxy.status === "estimated", `proxy buyer_ready olamaz, gelen=${proxy.status}`);
assert(proxy.findings.some((f) => f.code === "PCF_PROXY_USED"), "proxy finding");

const unknownConnection = calculatePcf(
  { ...INPUT, electricity: { consumptionKwhForPeriod: 1000, connectionType: "unknown", geography: "TR" } },
  REGISTRY,
);
assert(unknownConnection.status === "blocked", "bilinmeyen elektrik bağlantısı dağıtım varsaymaz");
assert(
  unknownConnection.findings.some((f) => f.code === "PCF_ELECTRICITY_CONNECTION_UNKNOWN"),
  "unknown connection finding",
);

const missingFuel = calculatePcf(
  {
    ...INPUT,
    fuels: [{ id: "f2", fuelId: "diesel", label: "Dizel", quantityForPeriod: 10, activityUnit: "litre", geography: "TR" }],
  },
  REGISTRY,
);
assert(missingFuel.status === "blocked", "yakıt faktörü yoksa blocked; 0 yazılmaz");
assert(missingFuel.findings.some((f) => f.code === "PCF_FACTOR_NOT_RESOLVED"), "fuel factor not resolved");
assert(missingFuel.scope1KgCo2ePerFunctionalUnit === 0, "yakıt emisyonu uydurulmaz");

const dist = calculatePcf(
  {
    ...INPUT,
    materials: [],
    packaging: [],
    fuels: [],
    electricity: { consumptionKwhForPeriod: 1000, connectionType: "distribution", geography: "TR" },
    evidence: { productionRecord: true, electricityInvoice: true, fuelInvoice: false, materialEvidenceCount: 0 },
  },
  PCF_FACTORS,
);
assert(dist.status === "buyer_ready" || dist.status === "estimated" || dist.status === "blocked", "EVÇED dağıtım çözülmeli");
assert(dist.contributions.some((c) => c.factor.factorId === "evced-tr-electricity-distribution-2023"), "dağıtım faktörü 0.469");
assert(Math.abs((dist.contributions.find((c) => c.id === "electricity")?.factor.kgCo2ePerActivityUnit ?? 0) - 0.469) < 1e-12, "EVÇED distribution 0.469");

const trans = calculatePcf(
  {
    ...INPUT,
    materials: [],
    packaging: [],
    fuels: [],
    electricity: { consumptionKwhForPeriod: 1000, connectionType: "transmission", geography: "TR" },
    evidence: { productionRecord: true, electricityInvoice: true, fuelInvoice: false, materialEvidenceCount: 0 },
  },
  PCF_FACTORS,
);
assert(trans.contributions.some((c) => c.factor.factorId === "evced-tr-electricity-transmission-2023"), "iletim faktörü 0.436");
assert(Math.abs((trans.contributions.find((c) => c.id === "electricity")?.factor.kgCo2ePerActivityUnit ?? 0) - 0.436) < 1e-12, "EVÇED transmission 0.436");

const legacyAlu = calculatePcf(
  {
    ...INPUT,
    materials: [{ id: "m1", materialId: "aluminium", label: "Alüminyum", quantityKgPerFunctionalUnit: 1, origin: "primary" }],
    packaging: [],
    electricity: undefined,
    fuels: [],
  },
  PCF_FACTORS,
);
assert(legacyAlu.status === "blocked", "2025 DEFRA alüminyum stale/estimate-only seçilmez");

const pdf = pcfReportPdfBytes(INPUT, r);
const pdfText = new TextDecoder("latin1").decode(pdf);
assert(pdf.byteLength > 500, "PDF boş olamaz");
assert(pdfText.includes("Report ID"), "PDF Report ID");
assert(pdfText.includes("PCF-TEST-001"), "PDF report id değeri");
assert(pdfText.includes("cradle-to-gate") || pdfText.includes("CRADLE") || pdfText.includes("System boundary"), "PDF boundary");
assert(/ISO 14067 certified/i.test(pdfText) === false, "PDF ISO certified iddiası yasak");
assert(/accredited verified/i.test(pdfText) === false, "PDF accredited verified iddiası yasak");
assert(/official CBAM/i.test(pdfText) === false, "PDF resmi CBAM iddiası yasak");
assert(r.contributions.every((c) => Boolean(c.factor.source.version && c.factor.source.publisher)), "her faktörde source+version");

const gaps = pcfPremiumCoverageGaps(PCF_FACTORS, "2026-08-17T00:00:00.000Z");
assert(gaps.length > 0, "premium coverage seed halinde bilinçli olarak eksik kalır");

console.log("PCF CORE TESTS PASSED");
