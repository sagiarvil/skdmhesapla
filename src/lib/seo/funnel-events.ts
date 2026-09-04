export const FUNNEL_EVENTS = [
  "organic_scope_check_started",
  "candidate_cn_selected",
  "scope_result_viewed",
  "wizard_started",
  "wizard_scope_resolved",
  "wizard_layer_completed",
  "delegation_page_viewed",
  "delegation_value_submitted",
  "seal_intent",
  "purchase",
] as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

export const GROWTH_EVENT_ALIAS: Partial<Record<FunnelEvent, string>> = {
  organic_scope_check_started: "tool_start",
  candidate_cn_selected: "tool_step",
  scope_result_viewed: "tool_result",
  wizard_started: "tool_start",
  wizard_scope_resolved: "tool_complete",
  wizard_layer_completed: "tool_step",
  delegation_page_viewed: "cta_view",
  delegation_value_submitted: "lead_submit",
  seal_intent: "checkout_start",
  purchase: "purchase",
};

export const AI_REFERRAL_HOSTS = [
  "chatgpt.com",
  "perplexity.ai",
  "claude.ai",
  "copilot.microsoft.com",
  "gemini.google.com",
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

function id(prefix: string) {
  const value = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}_${value}`;
}

function read(storage: Storage, key: string) {
  try { return storage.getItem(key); } catch { return null; }
}
function write(storage: Storage, key: string, value: string) {
  try { storage.setItem(key, value); } catch { /* privacy mode */ }
}

function attribution() {
  const url = new URL(window.location.href);
  const referrer = document.referrer || "";
  let source = url.searchParams.get("utm_source") || "direct";
  if (!url.searchParams.get("utm_source") && referrer) {
    try {
      const host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
      source = host.includes("google.") ? "google" : host.includes("bing.") ? "bing" : host;
    } catch { source = "referral"; }
  }
  const medium = url.searchParams.get("utm_medium") ||
    (source === "direct" ? "direct" : source === "google" || source === "bing" ? "organic" : AI_REFERRAL_HOSTS.some((h) => source.includes(h)) ? "ai_referral" : "referral");
  const campaign = url.searchParams.get("utm_campaign") || "";
  const last = `${source}/${medium}${campaign ? `/${campaign}` : ""}`;
  let first = read(window.localStorage, "skdm:growth:first-touch:v1");
  if (!first) {
    first = last;
    write(window.localStorage, "skdm:growth:first-touch:v1", first);
  }
  return { traffic_source: source, medium, campaign, referrer, first_touch: first, last_touch: last };
}

function identity() {
  let anonymous = read(window.localStorage, "skdm:growth:anonymous:v1");
  if (!anonymous) { anonymous = id("au"); write(window.localStorage, "skdm:growth:anonymous:v1", anonymous); }
  let session = read(window.sessionStorage, "skdm:growth:session:v1");
  if (!session) { session = id("ss"); write(window.sessionStorage, "skdm:growth:session:v1", session); }
  return { anonymous_user_id: anonymous, session_id: session };
}

export function emitFunnelEvent(event: FunnelEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const base = {
    event_id: id("ev"),
    site: "skdmhesapla.com",
    page: window.location.pathname,
    timestamp: new Date().toISOString(),
    ...identity(),
    ...attribution(),
  };
  window.dataLayer.push({ event, ...base, ...params });
  const growthEvent = GROWTH_EVENT_ALIAS[event];
  if (growthEvent) {
    const detail = { event: growthEvent, tool_id: event.includes("scope") || event.includes("cn") ? "gtip-cn-kapsam-kontrolu" : undefined, ...base, ...params };
    window.dataLayer.push(detail);
    window.dispatchEvent(new CustomEvent("sagiarvil:growth", { detail }));
  }
}
