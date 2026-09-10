/**
 * EU Denizcilik Karbon Uyumu — Kriptografik Kanıt Zinciri & SHA-256 Mühürleme
 * BDN, Jurnal (Logbook), Kalibrasyon ve Sürdürülebilirlik belgeleri için
 * değişmezlik ve doğrulama motoru.
 */

import type { EvidenceDocument, EvidenceDocumentType } from "../types";

/**
 * Tarayıcı veya Node ortamında ArrayBuffer veya Buffer üzerinden SHA-256 hash hesaplar.
 */
export async function computeSha256(data: ArrayBuffer | Uint8Array | string): Promise<string> {
  let buffer: Uint8Array;
  if (typeof data === "string") {
    buffer = new TextEncoder().encode(data);
  } else if (data instanceof Uint8Array) {
    buffer = data;
  } else {
    buffer = new Uint8Array(data);
  }

  // Web Crypto API (Tarayıcı ve modern Node.js)
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer as unknown as BufferSource);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Node.js fallback
  try {
    const nodeCrypto = await import("crypto");
    return nodeCrypto.createHash("sha256").update(buffer).digest("hex");
  } catch {
    throw new Error("Kriptografik SHA-256 motoru bulunamadı.");
  }
}

export interface CreateEvidenceParams {
  id?: string;
  vesselId: string;
  reportingYear: number;
  fileName: string;
  fileType: EvidenceDocumentType;
  mimeType: string;
  sizeBytes: number;
  fileData: ArrayBuffer | Uint8Array;
  storagePath: string;
  supportingRecordType: "fuel_consumption" | "voyage" | "berth" | "general";
  supportingRecordId?: string;
  uploadedBy: string;
}

/**
 * Belge dosyasını okuyup SHA-256 mühürlü EvidenceDocument kaydına dönüştürür.
 */
export async function createEvidenceRecord(
  params: CreateEvidenceParams
): Promise<EvidenceDocument> {
  const sha256Hash = await computeSha256(params.fileData);

  const evidenceDoc: EvidenceDocument = {
    id: params.id || `EVD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    vesselId: params.vesselId,
    reportingYear: params.reportingYear,
    fileName: params.fileName,
    fileType: params.fileType,
    mimeType: params.mimeType,
    sizeBytes: params.sizeBytes,
    sha256Hash,
    storagePath: params.storagePath,
    supportingRecordType: params.supportingRecordType,
    supportingRecordId: params.supportingRecordId,
    uploadedAt: new Date().toISOString(),
    uploadedBy: params.uploadedBy,
  };

  return evidenceDoc;
}

/**
 * Belgenin hash'ini mevcut dosya verisiyle kıyaslayarak bütünlük doğrulaması (integrity check) yapar.
 */
export async function verifyEvidenceIntegrity(
  evidence: EvidenceDocument,
  fileData: ArrayBuffer | Uint8Array
): Promise<boolean> {
  const currentHash = await computeSha256(fileData);
  return currentHash.toLowerCase() === evidence.sha256Hash.toLowerCase();
}

/**
 * Bir raporlama yılı için tüm kanıt belgelerinin bileşik SHA-256 mühür özetini (Merkle root benzeri zincir) üretir.
 */
export async function computeEvidenceChainManifestHash(
  evidences: EvidenceDocument[]
): Promise<string> {
  const sortedHashes = evidences
    .map((e) => `${e.fileType}:${e.fileName}:${e.sha256Hash}`)
    .sort()
    .join("\n");

  return computeSha256(sortedHashes);
}
