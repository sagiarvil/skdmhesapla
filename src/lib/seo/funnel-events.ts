export const FUNNEL_EVENTS = [
  "organic_scope_check_started",
  "candidate_cn_selected",
  "scope_result_viewed",
  "wizard_started",
  "wizard_layer_completed",
  "seal_intent",
  "purchase",
] as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

export const AI_REFERRAL_HOSTS = [
  "chatgpt.com",
  "perplexity.ai",
  "claude.ai",
  "copilot.microsoft.com",
] as const;

export const SEARCH_CRAWLER_UA = [
  "Googlebot",
  "bingbot",
  "OAI-SearchBot",
  "PerplexityBot",
  "Claude-SearchBot",
  "Claude-User",
] as const;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function emitFunnelEvent(event: FunnelEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
