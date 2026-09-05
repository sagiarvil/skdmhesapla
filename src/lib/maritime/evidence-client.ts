import { getFirebaseAuth } from "@/lib/firebase/client";
import type { MaritimeWorkspaceContext } from "./backend-client";

export type MaritimeEvidenceDocument = {
  evidenceId: string;
  documentType: string;
  documentLabel: string;
  legalBasis: string[];
  originalName: string;
  contentType: string;
  size: number;
  documentDate: string;
  sourceName: string;
  sourceReference: string;
  notes: string;
  supports: string[];
  linkedVoyageIds: string[];
  linkedFuelIds: string[];
  supportRevision: number;
  supportDataHash: string | null;
  sha256: string;
  crc32c: string | null;
  md5Hash: string | null;
  storageGeneration: string | null;
  evidenceChainHash: string;
  previousEvidenceChainHash: string | null;
  retention: Record<string, unknown>;
  finalizedAt: string;
  finalizedBy: string;
  integrityStatus: string;
};

export type MaritimeEvidenceRegistryItem = {
  key: string;
  label: string;
  legalBasis: string[];
  defaultSupports: string[];
  criticality: "core" | "conditional" | string;
};

export type MaritimeEvidenceList = {
  context: MaritimeWorkspaceContext;
  documents: MaritimeEvidenceDocument[];
  coverage: Record<string, number>;
  manifestHash: string;
  chainHead: string | null;
  registry: MaritimeEvidenceRegistryItem[];
};

export type MaritimeEvidenceUploadMetadata = {
  documentType: string;
  documentDate: string;
  sourceName: string;
  sourceReference?: string;
  notes?: string;
  supports: string[];
  linkedVoyageIds?: string[];
  linkedFuelIds?: string[];
};

export class MaritimeEvidenceError extends Error {
  code: string;
  status: number;
  missing?: string[];
  constructor(message: string, code: string, status: number, missing?: string[]) {
    super(message);
    this.name = "MaritimeEvidenceError";
    this.code = code;
    this.status = status;
    this.missing = missing;
  }
}

async function token() {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user || user.isAnonymous) throw new MaritimeEvidenceError("Kanıt kasası için üye girişi gerekli.", "AUTH_REQUIRED", 401);
  return user.getIdToken();
}

async function parseFailure(response: Response): Promise<never> {
  let body: { message?: string; code?: string; missing?: string[] } = {};
  try { body = await response.json(); } catch { /* ignore */ }
  throw new MaritimeEvidenceError(body.message || "Kanıt servisi isteği başarısız.", body.code || "EVIDENCE_API_ERROR", response.status, body.missing);
}

async function jsonRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const idToken = await token();
  const response = await fetch(`/api/maritime/evidence${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
      ...(init.headers || {}),
    },
  });
  if (!response.ok) return parseFailure(response);
  const body = await response.json() as T & { ok?: boolean };
  if (!body || body.ok === false) throw new MaritimeEvidenceError("Kanıt servisi geçersiz yanıt verdi.", "EVIDENCE_RESPONSE_INVALID", 502);
  return body as T;
}

function contextQuery(context: MaritimeWorkspaceContext) {
  return new URLSearchParams({
    companyId: context.companyId,
    fleetId: context.fleetId,
    shipId: context.shipId,
    year: String(context.year),
  });
}

export async function listMaritimeEvidence(context: MaritimeWorkspaceContext): Promise<MaritimeEvidenceList> {
  return jsonRequest<MaritimeEvidenceList & { ok: true }>(`/documents?${contextQuery(context).toString()}`);
}

function mimeFromName(file: File) {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    pdf: "application/pdf",
    txt: "text/plain",
    log: "text/plain",
    csv: "text/csv",
    xml: "application/xml",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
  };
  return ext ? map[ext] || "application/octet-stream" : "application/octet-stream";
}

async function uploadChunkWithRetry(
  context: MaritimeWorkspaceContext,
  evidenceId: string,
  index: number,
  chunk: Blob,
  maxAttempts = 3,
) {
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const idToken = await token();
      const response = await fetch(`/api/maritime/evidence/uploads/${encodeURIComponent(evidenceId)}/chunks/${index}`, {
        method: "PUT",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/octet-stream",
          "X-Maritime-Company-Id": context.companyId,
          "X-Maritime-Fleet-Id": context.fleetId,
          "X-Maritime-Ship-Id": context.shipId,
          "X-Maritime-Year": String(context.year),
        },
        body: chunk,
      });
      if (!response.ok) await parseFailure(response);
      return;
    } catch (error) {
      lastError = error;
      if (error instanceof MaritimeEvidenceError && error.status >= 400 && error.status < 500 && error.status !== 409) throw error;
      if (attempt < maxAttempts) await new Promise((resolve) => window.setTimeout(resolve, attempt * 700));
    }
  }
  throw lastError instanceof Error ? lastError : new MaritimeEvidenceError("Belge parçası yüklenemedi.", "CHUNK_UPLOAD_FAILED", 502);
}

export async function uploadMaritimeEvidence(
  context: MaritimeWorkspaceContext,
  file: File,
  metadata: MaritimeEvidenceUploadMetadata,
  onProgress?: (percent: number) => void,
): Promise<MaritimeEvidenceDocument> {
  const contentType = mimeFromName(file);
  const session = await jsonRequest<{
    ok: true;
    evidenceId: string;
    expectedChunks: number;
    chunkBytes: number;
    maxFileBytes: number;
  }>("/uploads", {
    method: "POST",
    body: JSON.stringify({
      context,
      ...metadata,
      originalName: file.name,
      contentType,
      size: file.size,
    }),
  });

  if (file.size > session.maxFileBytes) throw new MaritimeEvidenceError("Dosya izin verilen kanıt boyutunu aşıyor.", "EVIDENCE_SIZE_INVALID", 413);
  onProgress?.(0);
  for (let index = 0; index < session.expectedChunks; index += 1) {
    const start = index * session.chunkBytes;
    const end = Math.min(file.size, start + session.chunkBytes);
    await uploadChunkWithRetry(context, session.evidenceId, index, file.slice(start, end));
    onProgress?.(Math.round(((index + 1) / session.expectedChunks) * 90));
  }

  const finalized = await jsonRequest<{ ok: true; evidence: MaritimeEvidenceDocument }>(`/uploads/${encodeURIComponent(session.evidenceId)}/finalize`, {
    method: "POST",
    body: JSON.stringify({ context }),
  });
  onProgress?.(100);
  return finalized.evidence;
}

export async function verifyMaritimeEvidence(context: MaritimeWorkspaceContext, evidenceId: string) {
  return jsonRequest<{ ok: true; evidenceId: string; sha256: string; size: number; verifiedAt: string; match: true }>(`/documents/${encodeURIComponent(evidenceId)}/verify`, {
    method: "POST",
    body: JSON.stringify({ context }),
  });
}

export async function downloadMaritimeEvidence(context: MaritimeWorkspaceContext, evidence: MaritimeEvidenceDocument) {
  const idToken = await token();
  const response = await fetch(`/api/maritime/evidence/documents/${encodeURIComponent(evidence.evidenceId)}/content?${contextQuery(context).toString()}`, {
    method: "GET",
    cache: "no-store",
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (!response.ok) await parseFailure(response);
  const blob = await response.blob();
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = evidence.originalName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(href);
}
