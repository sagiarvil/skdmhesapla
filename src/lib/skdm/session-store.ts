/**
 * G-22: 10 sn otomatik taslak.
 * 1) localStorage — anında
 * 2) Firestore istemci (anon auth) — birincil uzak yol
 * 3) POST /api/skdm-sessions — CF yedek (admin)
 */

import { doc, setDoc } from "firebase/firestore";
import { ensureAnonymousUser, getFirestoreDb } from "@/lib/firebase/client";
import { authFetch } from "@/lib/api/auth-fetch";

export type GoodRow = { id: string; category: string; cn: string; route: string };
export type ProcessRow = { id: string; name: string; included: string[] };
export type StreamRow = {
  method: string;
  name: string;
  ad: number;
  unit: string;
  ncv: string;
  processId?: string;
};
export type PrecRow = {
  name: string;
  total: number;
  internal: number;
  other: number;
  source: string;
  see: number;
};

export type SkdmSessionDraft = {
  sessionId: string;
  sectorSlug: string;
  ownerUid?: string;
  createdAt?: string;
  updatedAt: string;
  step: number;
  triage?: string;
  fieldValues: Record<string, string>;
  skippedFields: string[];
  goods: GoodRow[];
  processes: ProcessRow[];
  streams: StreamRow[];
  precs: PrecRow[];
  dProcesses?: { a: number; b: number; c: number; d: number };
  ePurchPrec?: { total: number; internal: number; other: number }[];
  status: "draft";
};

const KEY_PREFIX = "skdm_session_draft:";

function storageKey(sectorSlug: string) {
  return `${KEY_PREFIX}${sectorSlug}`;
}

export function loadSessionDraft(sectorSlug: string): SkdmSessionDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(sectorSlug));
    if (!raw) return null;
    return JSON.parse(raw) as SkdmSessionDraft;
  } catch {
    return null;
  }
}

/** GATE-6 (RM-007): tüm sektör taslaklarından en güncelini döndürür. */
export function loadLatestSessionDraft(): SkdmSessionDraft | null {
  if (typeof window === "undefined") return null;
  let latest: SkdmSessionDraft | null = null;
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(KEY_PREFIX)) continue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const draft = JSON.parse(raw) as SkdmSessionDraft;
      if (!latest || (draft.updatedAt || "") > (latest.updatedAt || "")) latest = draft;
    } catch {
      // bozuk anahtar yok sayılır
    }
  }
  return latest;
}

async function saveRemoteFirestore(draft: SkdmSessionDraft & { ownerUid: string }): Promise<boolean> {
  const db = getFirestoreDb();
  await setDoc(
    doc(db, "skdm_sessions", draft.sessionId),
    {
      ...draft,
      engineHint: "skdm-calc-v2026.1",
    },
    { merge: true }
  );
  return true;
}

async function saveRemoteApi(draft: SkdmSessionDraft): Promise<boolean> {
  // K-03: owner kimliği gövdede taşınmaz; sunucu Bearer token'dan türetir.
  const { ownerUid: _ownerUid, ...body } = draft;
  const res = await authFetch("/api/skdm-sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.ok;
}

export async function saveSessionDraft(
  draft: SkdmSessionDraft
): Promise<{ remoteOk: boolean; via: "firestore" | "api" | "local" }> {
  if (typeof window === "undefined") return { remoteOk: false, via: "local" };
  const next: SkdmSessionDraft = {
    ...draft,
    updatedAt: new Date().toISOString(),
    status: "draft",
    createdAt: draft.createdAt || new Date().toISOString(),
  };
  localStorage.setItem(storageKey(draft.sectorSlug), JSON.stringify(next));

  try {
    const user = await ensureAnonymousUser();
    const withOwner = { ...next, ownerUid: user.uid };
    localStorage.setItem(storageKey(draft.sectorSlug), JSON.stringify(withOwner));
    await saveRemoteFirestore(withOwner);
    return { remoteOk: true, via: "firestore" };
  } catch (err) {
    console.warn("[skdm] firestore taslak yazımı tamamlanmadı, API yedek deneniyor", err);
    try {
      const ok = await saveRemoteApi(next);
      return { remoteOk: ok, via: ok ? "api" : "local" };
    } catch (err2) {
      console.warn("[skdm] API taslak yazımı tamamlanmadı", err2);
      return { remoteOk: false, via: "local" };
    }
  }
}

export function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `ses-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Resmi şablon: en fazla P1–P10. */
export const MAX_PROCESSES = 10;
