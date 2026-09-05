/**
 * EU Denizcilik Karbon Uyumu — Mühürlü Denetime Hazırlık Paketi ve ZIP Üreticisi
 *
 * 6 Resmi Teslimat Dosyası (EU ETS & FuelEU & MRV):
 * 1. Pro Uyum Raporu (TR PDF) — Türkçe Genişletilmiş Denetim Raporu
 * 2. Compliance Dossier (EN PDF) — Resmi İngilizce Akredite Denetçi Raporu
 * 3. THETIS-MRV Schema v2 (XML) — EMSA IR 2023/2449 Şeması
 * 4. FuelEU Maritime Uyum Bakiyesi (JSON) — Annex IV Veri Paketi
 * 5. Sefer ve BDN Denetim Kütüğü (CSV) — UTF-8 BOM RFC 4180
 * 6. Kriptografik Bütünlük Manifestosu (JSON) — SHA-256 Kök ve Dosya İmzaları
 *
 * Deterministik PKZIP (STORE) formatı: Ek bağımlılık olmadan standart binary üretir.
 */

import crypto from "crypto";
import type { MaritimeComplianceDossier } from "./dossier/schema";
import { generateMaritimePdfBytes } from "./pdf/maritimeReportPdf";
import { generateThetisMrvXml } from "./mrv/thetis-xml-generator";
import { generateFuelEuReportJson } from "./fueleu/fueleu-export";
import { generateVoyageBdnCsv } from "./voyage/ledger-csv";
import { generateIntegrityManifest } from "./evidence/manifest-generator";
import { generateStatutoryPackageFiles, type StatutoryFileEntry } from "./dossier/statutory-package";

export interface MaritimePackageFileEntry {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  content: string; // Base64 for binary (PDF), UTF-8 for text (XML/JSON/CSV)
  contentEncoding: "base64" | "utf8";
}

export interface SealedMaritimePackageOutput {
  packageId: string;
  reportingYear: number;
  shipName: string;
  imoNumber: string;
  companyName: string;
  timestamp: string;
  masterHash: string;
  files: MaritimePackageFileEntry[];
  statutoryFiles?: StatutoryFileEntry[];
  manifesto: Record<string, unknown>;
  zipBytes?: Uint8Array;
  zipFilename?: string;
  dossier: MaritimeComplianceDossier;
}

/** CRC-32 (ZIP uyumlu) */
function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c ^= bytes[i]!;
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function u16(n: number): Uint8Array {
  const b = new Uint8Array(2);
  b[0] = n & 0xff;
  b[1] = (n >>> 8) & 0xff;
  return b;
}

function u32(n: number): Uint8Array {
  const b = new Uint8Array(4);
  b[0] = n & 0xff;
  b[1] = (n >>> 8) & 0xff;
  b[2] = (n >>> 16) & 0xff;
  b[3] = (n >>> 24) & 0xff;
  return b;
}

function concatBytes(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}

export function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

export function base64ToBytes(base64: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(base64, "base64"));
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function sealedMaritimeFileBytes(file: MaritimePackageFileEntry): Uint8Array {
  if (file.contentEncoding === "base64") {
    return base64ToBytes(file.content);
  }
  return new TextEncoder().encode(file.content);
}

function hashBytes(bytes: Uint8Array): string {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function hashText(text: string): string {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

/**
 * 6 dosyayı PKZIP (STORE) standart formatında birleştirir.
 */
export function buildSealedMaritimeZipUint8Array(pkg: SealedMaritimePackageOutput): Uint8Array {
  // If statutory 9-folder files are available, pack them to produce the statutory folder tree
  const entries = (pkg.statutoryFiles && pkg.statutoryFiles.length > 0)
    ? pkg.statutoryFiles.map((sf) => ({
        filename: sf.path,
        mimeType: sf.mimeType,
        sizeBytes: sf.sizeBytes,
        sha256: sf.sha256,
        content: sf.content,
        contentEncoding: sf.contentEncoding,
        dataBytes: sf.bytes,
      }))
    : pkg.files.map((f) => ({
        ...f,
        dataBytes: sealedMaritimeFileBytes(f),
      }));

  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of entries) {
    const nameBytes = encoder.encode(file.filename);
    const dataBytes = file.dataBytes;
    const crc = crc32(dataBytes);
    const size = dataBytes.length;

    const localHeader = concatBytes([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0), // STORE
      u16(0),
      u16(0),
      u32(crc),
      u32(size),
      u32(size),
      u16(nameBytes.length),
      u16(0),
      nameBytes,
    ]);

    localParts.push(localHeader, dataBytes);

    const centralHeader = concatBytes([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(size),
      u32(size),
      u16(nameBytes.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      nameBytes,
    ]);
    centralParts.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  }

  const localBlob = concatBytes(localParts);
  const centralBlob = concatBytes(centralParts);

  const endRecord = concatBytes([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(entries.length),
    u16(entries.length),
    u32(centralBlob.length),
    u32(localBlob.length),
    u16(0),
  ]);

  return concatBytes([localBlob, centralBlob, endRecord]);
}

/**
 * Verilen dosya (dossier) nesnesinden mühürlü 6 parçalı paketi üretir.
 */
export function createSealedMaritimePackage(
  dossier: MaritimeComplianceDossier,
  opts?: { packageId?: string; timestamp?: string }
): SealedMaritimePackageOutput {
  const reportingYear = dossier.reportingYear;
  const imoNumber = dossier.ship.imoNumber;
  const shipClean = dossier.ship.shipName.replace(/[^a-zA-Z0-9]/g, "_");
  const packageId = opts?.packageId || `MAR-${reportingYear}-${imoNumber}`;
  const timestamp = opts?.timestamp || dossier.generatedAt;

  // 1. TR PDF
  const trPdfBytes = generateMaritimePdfBytes(dossier, "tr");
  const trPdfFilename = `${shipClean}_EU_Uyum_Raporu_${reportingYear}_TR.pdf`;
  const trPdfHash = hashBytes(trPdfBytes);

  // 2. EN PDF
  const enPdfBytes = generateMaritimePdfBytes(dossier, "en");
  const enPdfFilename = `${shipClean}_EU_Compliance_Report_${reportingYear}_EN.pdf`;
  const enPdfHash = hashBytes(enPdfBytes);

  // 3. THETIS-MRV Schema v2 XML
  const thetisXmlStr = generateThetisMrvXml(dossier);
  const thetisXmlFilename = `THETIS_MRV_${imoNumber}_${reportingYear}.xml`;
  const thetisXmlHash = hashText(thetisXmlStr);

  // 4. FuelEU Report JSON
  const fuelEuJsonStr = generateFuelEuReportJson(dossier);
  const fuelEuJsonFilename = `FUELEU_MARITIME_${imoNumber}_${reportingYear}.json`;
  const fuelEuJsonHash = hashText(fuelEuJsonStr);

  // 5. Voyage & BDN CSV (RFC 4180 with UTF-8 BOM)
  const ledgerCsvStr = generateVoyageBdnCsv(dossier);
  const ledgerCsvFilename = `SEFER_VE_BDN_KUTUGU_${imoNumber}_${reportingYear}.csv`;
  const ledgerCsvHash = hashText(ledgerCsvStr);

  // 6. Cryptographic Integrity Manifest
  const manifestMap: Record<string, string> = {
    [trPdfFilename]: trPdfHash,
    [enPdfFilename]: enPdfHash,
    [thetisXmlFilename]: thetisXmlHash,
    [fuelEuJsonFilename]: fuelEuJsonHash,
    [ledgerCsvFilename]: ledgerCsvHash,
  };

  const manifestStr = generateIntegrityManifest(dossier, manifestMap);
  const manifestFilename = `BUTUNLUK_MANIFESTOSU_${imoNumber}_${reportingYear}.json`;
  const manifestHash = hashText(manifestStr);
  const manifestoObj = JSON.parse(manifestStr) as Record<string, unknown>;

  const files: MaritimePackageFileEntry[] = [
    {
      filename: trPdfFilename,
      mimeType: "application/pdf",
      sizeBytes: trPdfBytes.length,
      sha256: trPdfHash,
      content: bytesToBase64(trPdfBytes),
      contentEncoding: "base64",
    },
    {
      filename: enPdfFilename,
      mimeType: "application/pdf",
      sizeBytes: enPdfBytes.length,
      sha256: enPdfHash,
      content: bytesToBase64(enPdfBytes),
      contentEncoding: "base64",
    },
    {
      filename: thetisXmlFilename,
      mimeType: "application/xml",
      sizeBytes: new TextEncoder().encode(thetisXmlStr).length,
      sha256: thetisXmlHash,
      content: thetisXmlStr,
      contentEncoding: "utf8",
    },
    {
      filename: fuelEuJsonFilename,
      mimeType: "application/json",
      sizeBytes: new TextEncoder().encode(fuelEuJsonStr).length,
      sha256: fuelEuJsonHash,
      content: fuelEuJsonStr,
      contentEncoding: "utf8",
    },
    {
      filename: ledgerCsvFilename,
      mimeType: "text/csv;charset=utf-8;",
      sizeBytes: new TextEncoder().encode(ledgerCsvStr).length,
      sha256: ledgerCsvHash,
      content: ledgerCsvStr,
      contentEncoding: "utf8",
    },
    {
      filename: manifestFilename,
      mimeType: "application/json",
      sizeBytes: new TextEncoder().encode(manifestStr).length,
      sha256: manifestHash,
      content: manifestStr,
      contentEncoding: "utf8",
    },
  ];

  // Master Hash: SHA-256 over all 6 files' hashes
  const masterPayload = files.map((f) => `${f.filename}:${f.sha256}`).join("|");
  const masterHash = `sha256:${hashText(masterPayload)}`;
  const statutoryFiles = generateStatutoryPackageFiles(dossier);

  const pkg: SealedMaritimePackageOutput = {
    packageId,
    reportingYear,
    shipName: dossier.ship.shipName,
    imoNumber,
    companyName: dossier.company.companyName,
    timestamp,
    masterHash,
    files,
    statutoryFiles,
    manifesto: manifestoObj,
    zipFilename: `${packageId}-${shipClean}-Muhurlu-Uyum-Paketi.zip`,
    dossier,
  };

  pkg.zipBytes = buildSealedMaritimeZipUint8Array(pkg);
  return pkg;
}

/** Tarayıcıda dosya veya ZIP indirme tetikleyicisi */
export function triggerMaritimeBrowserDownload(
  bytes: Uint8Array,
  filename: string,
  mime: string
) {
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

export function downloadMaritimePackageZip(pkg: SealedMaritimePackageOutput): boolean {
  if (!pkg.zipBytes) {
    pkg.zipBytes = buildSealedMaritimeZipUint8Array(pkg);
  }
  triggerMaritimeBrowserDownload(
    pkg.zipBytes,
    pkg.zipFilename || `${pkg.packageId}.zip`,
    "application/zip"
  );
  return true;
}

export function downloadMaritimePackageFile(
  pkg: SealedMaritimePackageOutput,
  filename: string
): boolean {
  const file = pkg.files.find((f) => f.filename === filename);
  if (!file) return false;
  triggerMaritimeBrowserDownload(
    sealedMaritimeFileBytes(file),
    file.filename,
    file.mimeType
  );
  return true;
}
