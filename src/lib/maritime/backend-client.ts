import { getFirebaseAuth } from "@/lib/firebase/client";
import type { MaritimePreparationFile } from "./types";

export type MaritimeWorkspaceContext = {
  companyId: string;
  fleetId: string;
  shipId: string;
  year: number;
};

export type MaritimeFileState = {
  context: MaritimeWorkspaceContext;
  revision: number;
  status: "draft" | "locked" | string;
  dataHash: string | null;
  rulesetId?: string;
  lockedAt?: string | null;
  lastSnapshotHash?: string | null;
  file: MaritimePreparationFile | null;
};

export type MaritimeReportSummary = {
  context: MaritimeWorkspaceContext;
  shipName: string;
  imoNumber: string;
  reportingYear: number;
  status: string;
  revision: number;
  rulesetId: string;
  dataHash: string | null;
  lastSnapshotHash: string | null;
  updatedAt: string | null;
  active: boolean;
  demoSeedKey?: string | null;
  demoScenario?: string | null;
};

export class MaritimeBackendError extends Error {
  code: string;
  status: number;
  currentRevision?: number;
  missing?: string[];
  constructor(message: string, code: string, status: number, extra?: { currentRevision?: number; missing?: string[] }) {
    super(message);
    this.name = "MaritimeBackendError";
    this.code = code;
    this.status = status;
    this.currentRevision = extra?.currentRevision;
    this.missing = extra?.missing;
  }
}

async function token() {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user || user.isAnonymous) throw new MaritimeBackendError("Denizcilik çalışma dosyası için üye girişi gerekli.", "AUTH_REQUIRED", 401);
  return user.getIdToken();
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const idToken = await token();
  const response = await fetch(`/api/maritime${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
      ...(init.headers || {}),
    },
  });
  let body: unknown = null;
  try { body = await response.json(); } catch { /* fail below */ }
  if (!response.ok || !body || typeof body !== "object" || !(body as { ok?: boolean }).ok) {
    const e = (body || {}) as { message?: string; code?: string; currentRevision?: number; missing?: string[] };
    throw new MaritimeBackendError(e.message || "Denizcilik sunucu kaydı başarısız.", e.code || "MARITIME_API_ERROR", response.status, e);
  }
  return body as T;
}

export async function loadMaritimeWorkspace(year: number): Promise<{ context: MaritimeWorkspaceContext; role: string; fileState: MaritimeFileState; retentionPolicy: Record<string, unknown> }> {
  return request(`/workspace?year=${encodeURIComponent(String(year))}`);
}

export async function listMaritimeFiles(): Promise<{ companyId: string; fleetId: string; reports: MaritimeReportSummary[] }> {
  return request("/files");
}

export async function activateMaritimeFile(context: MaritimeWorkspaceContext): Promise<{ context: MaritimeWorkspaceContext }> {
  return request("/activate", { method: "POST", body: JSON.stringify({ context }) });
}

export async function createMaritimeFile(year: number): Promise<{ context: MaritimeWorkspaceContext; revision: number }> {
  return request("/files", { method: "POST", body: JSON.stringify({ year }) });
}

export async function saveMaritimeFile(context: MaritimeWorkspaceContext, file: MaritimePreparationFile, expectedRevision: number) {
  return request<{ context: MaritimeWorkspaceContext; revision: number; dataHash: string; status: string; unchanged: boolean }>("/file", {
    method: "PUT",
    body: JSON.stringify({ context, file, expectedRevision }),
  });
}

export async function reloadMaritimeFile(context: MaritimeWorkspaceContext): Promise<MaritimeFileState> {
  const q = new URLSearchParams({ companyId: context.companyId, fleetId: context.fleetId, shipId: context.shipId, year: String(context.year) });
  return request<MaritimeFileState & { ok: true }>(`/file?${q.toString()}`);
}

export async function createMaritimeCheckpoint(context: MaritimeWorkspaceContext) {
  return request<{ versionId: string; snapshotHash: string; status: string; readiness: { ready: boolean; missing: string[] } }>("/checkpoint", {
    method: "POST",
    body: JSON.stringify({ context }),
  });
}

export type MaritimeVersionRecord = {
  versionId?: string; type?: string; snapshotHash?: string; sourceHash?: string; sourceRevision?: number; createdAt?: string; evidenceManifestHash?: string | null; evidenceChainHead?: string | null; evidenceDocumentCount?: number; readiness?: { ready?: boolean; missing?: string[] };
};

export type MaritimeAuditRecord = {
  eventId?: string; action?: string; at?: string; actorRole?: string; revision?: number; dataHash?: string; snapshotHash?: string; evidenceManifestHash?: string; evidenceChainHead?: string; evidenceDocumentCount?: number;
};

export async function listMaritimeVersions(context: MaritimeWorkspaceContext) {
  const q = new URLSearchParams({ companyId: context.companyId, fleetId: context.fleetId, shipId: context.shipId, year: String(context.year) });
  return request<{ ok: true; versions: MaritimeVersionRecord[] }>(`/versions?${q.toString()}`);
}

export async function listMaritimeAudit(context: MaritimeWorkspaceContext) {
  const q = new URLSearchParams({ companyId: context.companyId, fleetId: context.fleetId, shipId: context.shipId, year: String(context.year) });
  return request<{ ok: true; events: MaritimeAuditRecord[] }>(`/audit?${q.toString()}`);
}

export async function lockMaritimePreparation(context: MaritimeWorkspaceContext) {
  return request<{ versionId: string; snapshotHash: string; status: "locked"; readiness: { ready: boolean; missing: string[] } }>("/lock", {
    method: "POST",
    body: JSON.stringify({ context }),
  });
}
