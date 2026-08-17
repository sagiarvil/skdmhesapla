/**
 * SKDMHesapla — Credential & Commercial Trust Analytics Layer
 * Lightweight event tracking utility for commercial conversion and trust signal monitoring.
 */

export type AnalyticsEventName =
  | "credential_impression"
  | "credential_open"
  | "methodology_open"
  | "credential_to_checkout"
  | "credential_verified"
  | "calculation_complete"
  | "pricing_view"
  | "checkout_start"
  | "payment_success";

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

export function track(eventName: AnalyticsEventName, payload?: AnalyticsPayload): void {
  if (typeof window === "undefined") return;

  const eventData = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  // 1. Console debug log in non-production
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[Analytics]", eventName, eventData);
  }

  // 2. Custom window event dispatch for QA / automated listeners
  try {
    const customEvent = new CustomEvent("skdm_analytics", { detail: eventData });
    window.dispatchEvent(customEvent);
  } catch {
    // Ignore in legacy browsers
  }

  // 3. Optional integration with window.dataLayer (GTM/GA4) if present
  try {
    const w = window as unknown as { dataLayer?: Array<unknown> };
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push(eventData);
    }
  } catch {
    // Fallback safely
  }
}
