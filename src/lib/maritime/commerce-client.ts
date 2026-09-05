import { authFetch } from "@/lib/api/auth-fetch";
import type { MaritimeWorkspaceContext } from "./backend-client";

export const MARITIME_DOSSIER_SKU = "MARITIME_DOSSIER_1Y_399_USD" as const;
export const MARITIME_DOSSIER_PRICE_USD = 399;
export const MARITIME_DOSSIER_PADDLE_PRICE_ID = "pri_01m1rdd20amd3730r561vckwm3" as const;

export type MaritimePurchaseIntent = {
  alreadyPaid: boolean;
  intentId?: string;
  entitlementId?: string;
  snapshotHash: string;
  expiresAt?: string;
  sku?: string;
};

export type MaritimeCommerceStatus = {
  paid: boolean;
  snapshotHash?: string;
  dossierId?: string;
  transactionId?: string;
};

async function json<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!response.ok || !body) throw new Error(body?.message || "Denizcilik ödeme işlemi tamamlanamadı.");
  return body;
}

export async function createMaritimePurchaseIntent(
  context: MaritimeWorkspaceContext,
  checkpointVersionId: string,
  snapshotHash: string,
): Promise<MaritimePurchaseIntent> {
  const response = await authFetch("/api/maritime-commerce/intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context, checkpointVersionId, snapshotHash }),
  });
  const body = await json<{ ok: true } & MaritimePurchaseIntent>(response);
  return body;
}

export async function getMaritimePurchaseIntentStatus(intentId: string) {
  const response = await authFetch(`/api/maritime-commerce/intent-status?intentId=${encodeURIComponent(intentId)}`);
  return json<{ ok: true; intentId: string; status: string; transactionId: string | null; snapshotHash: string }>(response);
}

export async function finalizeMaritimePurchase(intentId: string) {
  const response = await authFetch("/api/maritime-commerce/finalize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intentId }),
  });
  return json<{ ok: true; dossierId: string; snapshotHash: string; transactionId: string }>(response);
}

export async function getMaritimeCommerceStatus(year: number): Promise<MaritimeCommerceStatus> {
  const response = await authFetch(`/api/maritime-commerce/status?year=${encodeURIComponent(String(year))}`);
  const body = await json<{ ok: true } & MaritimeCommerceStatus>(response);
  return body;
}

export async function loadPaidMaritimeDossier(year: number, snapshotHash?: string) {
  const q = new URLSearchParams({ year: String(year) });
  if (snapshotHash) q.set("snapshotHash", snapshotHash);
  const response = await authFetch(`/api/maritime-commerce/snapshot?${q.toString()}`);
  const body = await json<{ ok: true; dossier: Record<string, unknown> }>(response);
  return body.dossier;
}

export async function downloadPaidMaritimeJson(year: number, snapshotHash?: string) {
  const q = new URLSearchParams({ year: String(year) });
  if (snapshotHash) q.set("snapshotHash", snapshotHash);
  const response = await authFetch(`/api/maritime-commerce/download?${q.toString()}`);
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message || "Satın alınan dosya indirilemedi.");
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = url;
    const disposition = response.headers.get("Content-Disposition") || "";
    const match = /filename="([^"]+)"/.exec(disposition);
    a.download = match?.[1] || `maritime-preparation-${snapshotHash?.slice(0, 12) || "paid"}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}
