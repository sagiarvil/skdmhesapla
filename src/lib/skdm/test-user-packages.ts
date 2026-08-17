/**
 * teb232@gmail.com test kullanıcısı — 2 sektör, eksiksiz register + mühürlü paket.
 * Deterministik: sabit packageId/timestamp → aynı masterHash / ZIP.
 */
import { calculateSkdmLiability, type SkdmCalculationInput } from "./calculator";
import {
  createSealedAuditPackage,
  sealedFileBytes,
  type SealRegisterSnapshot,
  type SealedPackageOutput,
} from "./package-seal";

export const TEST_USER_EMAIL = "teb232@gmail.com";

export type TestSeedHistoryItem = {
  packageId: string;
  sectorSlug: string;
  sectorName: string;
  zipFilename: string;
  masterHash: string;
  importerCostEur: number;
  sealedAt: string;
  quarter: string;
  productionVolume: number;
  unit: string;
};

type Fixture = {
  packageId: string;
  sealedAt: string;
  sectorSlug: string;
  sectorName: string;
  calc: SkdmCalculationInput;
  registers: SealRegisterSnapshot;
};

const FIRMA = "TEB Metal & Alüminyum San. Tic. A.Ş.";
const VKN = "25403091318";

const FIXTURES: Fixture[] = [
  {
    packageId: "SEAL-2026-DC-7782",
    sealedAt: "2026-08-16T14:30:00.000Z",
    sectorSlug: "demir-celik",
    sectorName: "Demir-Çelik Üretimi",
    calc: {
      sectorId: "iron-steel",
      productionVolume: 1250,
      year: 2026,
      importerAnnualVolumeStatus: "over50",
      useCustomEmissions: true,
      customDirectEmission: 1.42,
      customIndirectEmission: 0, // Annex II only-direct — fatura dışı
      etsQuarter: "2026-Q1",
      euEtsPriceEur: 75.4,
      trEtsNettingEur: 0, // Pilot 2026–2027 kilitli
      hasVerificationEvidence: true,
    },
    registers: {
      sessionId: "sess-teb-dc-7782",
      sectorSlug: "demir-celik",
      goods: [
        { id: "g1", category: "Yassı çelik / sac", cn: "7208 39 00", route: "BF-BOF" },
        { id: "g2", category: "İnşaat demiri (nervürlü)", cn: "7214 20 00", route: "EAF" },
      ],
      processes: [
        { id: "p1", name: "Sinter / yükleme", included: ["sinter", "hammadde"] },
        { id: "p2", name: "BF-BOF sıcak hadde", included: ["yuksek-firin", "konverter", "hadde"] },
        { id: "p3", name: "EAF ergitme", included: ["ark-firini", "dokum"] },
      ],
      streams: [
        { method: "Combustion", name: "Doğalgaz", ad: 1850, unit: "GJ", ncv: "48.5", processId: "p2" },
        { method: "Combustion", name: "Kok / kömür", ad: 920, unit: "GJ", ncv: "28.2", processId: "p2" },
        { method: "MassBalance", name: "Proses CO2 (konverter)", ad: 410, unit: "tCO2e", ncv: "-", processId: "p2" },
        { method: "Combustion", name: "Doğalgaz (EAF yardımcı)", ad: 240, unit: "GJ", ncv: "48.5", processId: "p3" },
      ],
      precs: [
        { name: "Demir cevheri pelet", total: 980, internal: 0, other: 980, source: "Dış tedarikçi", see: 0.08 },
        { name: "Hurda çelik", total: 420, internal: 120, other: 300, source: "Karma", see: 0.02 },
        { name: "Ferroalyaj", total: 55, internal: 0, other: 55, source: "Dış tedarikçi", see: 1.15 },
      ],
      dProcesses: { a: 1250, b: 1100, c: 100, d: 50 },
      fieldValues: {
        vFirma: FIRMA,
        vkn: VKN,
        tesisAdiEN: "TEB Metal Iron & Steel Works — Gebze",
        tonaj: "1250",
        yil: "2026",
        mahsup: "0",
        unlocode: "TRGEB",
        yetkili: "Ahmet Yılmaz",
        eposta: TEST_USER_EMAIL,
      },
    },
  },
  {
    packageId: "SEAL-2026-AL-9914",
    sealedAt: "2026-08-17T01:15:00.000Z",
    sectorSlug: "aluminyum",
    sectorName: "Alüminyum Üretimi",
    calc: {
      sectorId: "aluminum",
      productionVolume: 480,
      year: 2026,
      importerAnnualVolumeStatus: "over50",
      useCustomEmissions: true,
      customDirectEmission: 1.55,
      customIndirectEmission: 0.0,
      etsQuarter: "2026-Q1",
      euEtsPriceEur: 75.4,
      trEtsNettingEur: 0,
      hasVerificationEvidence: true,
    },
    registers: {
      sessionId: "sess-teb-al-9914",
      sectorSlug: "aluminyum",
      goods: [
        { id: "g1", category: "Alüminyum külçe / biyel", cn: "7601 10 00", route: "Primary" },
        { id: "g2", category: "Ekstrüzyon profil", cn: "7604 21 00", route: "Extrusion" },
      ],
      processes: [
        { id: "p1", name: "Elektroliz (Hall-Héroult)", included: ["anot", "elektroliz"] },
        { id: "p2", name: "Döküm / biyel", included: ["dokum", "homojenizasyon"] },
        { id: "p3", name: "Ekstrüzyon", included: ["pres", "yaslandirma"] },
      ],
      streams: [
        { method: "MassBalance", name: "Anot proses emisyonu", ad: 620, unit: "tCO2e", ncv: "-", processId: "p1" },
        { method: "Combustion", name: "Doğalgaz (döküm)", ad: 310, unit: "GJ", ncv: "48.5", processId: "p2" },
        { method: "Combustion", name: "Doğalgaz (ekstrüzyon)", ad: 95, unit: "GJ", ncv: "48.5", processId: "p3" },
      ],
      precs: [
        { name: "Alumina (Al2O3)", total: 920, internal: 0, other: 920, source: "Dış tedarikçi", see: 0.45 },
        { name: "Önceden pişirilmiş anot", total: 180, internal: 40, other: 140, source: "Karma", see: 0.35 },
        { name: "Hurda alüminyum", total: 60, internal: 25, other: 35, source: "Karma", see: 0.05 },
      ],
      dProcesses: { a: 480, b: 420, c: 40, d: 20 },
      fieldValues: {
        vFirma: FIRMA,
        vkn: VKN,
        tesisAdiEN: "TEB Metal Aluminium Casting — Gebze",
        tonaj: "480",
        yil: "2026",
        mahsup: "0",
        unlocode: "TRGEB",
        yetkili: "Ahmet Yılmaz",
        eposta: TEST_USER_EMAIL,
      },
    },
  },
];

const cache = new Map<string, SealedPackageOutput>();

export function getTestSealedPackage(packageId: string): SealedPackageOutput | null {
  const fx = FIXTURES.find((f) => f.packageId === packageId);
  if (!fx) return null;
  const hit = cache.get(packageId);
  if (hit) return hit;
  const result = calculateSkdmLiability(fx.calc);
  if (result.readinessScore < 100) {
    throw new Error(`Test paket ${packageId}: readiness ${result.readinessScore}`);
  }
  const pkg = createSealedAuditPackage(result, fx.registers, {
    packageId: fx.packageId,
    timestamp: fx.sealedAt,
  });
  cache.set(packageId, pkg);
  return pkg;
}

export function buildTestSeedHistory(): TestSeedHistoryItem[] {
  return FIXTURES.map((fx) => {
    const result = calculateSkdmLiability(fx.calc);
    const pkg = getTestSealedPackage(fx.packageId)!;
    return {
      packageId: fx.packageId,
      sectorSlug: fx.sectorSlug,
      sectorName: fx.sectorName,
      zipFilename: pkg.zipFilename || `${fx.packageId}-Muhurlu-Denetime-Hazirlik-Paketi.zip`,
      masterHash: pkg.masterHash,
      importerCostEur: Math.round(result.importerCostEur * 100) / 100,
      sealedAt: fx.sealedAt,
      quarter: fx.calc.etsQuarter || "2026-Q1",
      productionVolume: fx.calc.productionVolume,
      unit: "ton",
    };
  });
}

/** ZIP veya tek dosya indirme (tarayıcı). */
export function triggerBrowserDownload(bytes: Uint8Array, filename: string, mime: string) {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  const blob = new Blob([copy], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadTestPackageZip(packageId: string): boolean {
  const pkg = getTestSealedPackage(packageId);
  if (!pkg?.zipBytes) return false;
  triggerBrowserDownload(
    pkg.zipBytes,
    pkg.zipFilename || `${packageId}.zip`,
    "application/zip"
  );
  return true;
}

export function downloadTestPackageFile(packageId: string, filename: string): boolean {
  const pkg = getTestSealedPackage(packageId);
  const file = pkg?.files.find((f) => f.filename === filename);
  if (!file) return false;
  triggerBrowserDownload(sealedFileBytes(file), file.filename, file.mimeType);
  return true;
}

export function listTestPackageFilenames(packageId: string): string[] {
  return getTestSealedPackage(packageId)?.files.map((f) => f.filename) || [];
}
