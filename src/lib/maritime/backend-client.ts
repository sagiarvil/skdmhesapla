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

export async function lockMaritimePreparation(context: MaritimeWorkspaceContext) {
  return request<{ versionId: string; snapshotHash: string; status: "locked"; readiness: { ready: boolean; missing: string[] } }>("/lock", {
    method: "POST",
    body: JSON.stringify({ context }),
  });
}
