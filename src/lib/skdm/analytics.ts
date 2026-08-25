/**
 * SKDMHesapla — Credential & Commercial Trust Analytics Layer
 * Lightweight event tracking utility for commercial conversion and trust signal monitoring.
 */

import { emitFunnelEvent } from "@/lib/seo/funnel-events";

export type AnalyticsEventName =
  | "credential_impression"
  | "credential_open"
  | "methodology_open"
  | "credential_to_checkout"
  | "credential_verified"
  | "calculation_complete"
  | "pricing_view"
  | "checkout_start"
  | "payment_success"
  | "cbam_server_seal_download";

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

export function track(eventName: AnalyticsEventName, payload?: AnalyticsPayload): void {
  if (typeof window === "undefined") return;

  const eventData = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[Analytics]", eventName, eventData);
  }

  try {
    const customEvent = new CustomEvent("skdm_analytics", { detail: eventData });
    window.dispatchEvent(customEvent);
  } catch {
    // Ignore in legacy browsers
  }

  try {
    const w = window as unknown as { dataLayer?: Array<unknown> };
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push(eventData);
    }
  } catch {
    // Fallback safely
  }

  if (eventName === "payment_success") {
    emitFunnelEvent("purchase", payload || {});
  }
}
