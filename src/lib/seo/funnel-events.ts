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

function readSession(key: string) {
  try { return sessionStorage.getItem(key); } catch { return null; }
}
function writeSession(key: string, value: string) {
  try { sessionStorage.setItem(key, value); } catch { /* privacy mode */ }
}
function sessionValue(key: string, create: () => string) {
  let value = readSession(key);
  if (!value) { value = create(); writeSession(key, value); }
  return value;
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
  const first = sessionValue("skdm:growth:first-touch:v1", () => last);
  return { traffic_source: source, medium, campaign, referrer, first_touch: first, last_touch: last };
}

function identity() {
  return { session_id: sessionValue("skdm:growth:session:v1", () => id("ss")) };
}

function sanitizeGrowthParams(params: Record<string, unknown>) {
  const blocked = new Set(["q", "query", "email", "name", "phone", "vkn", "taxId", "tax_id", "tcKimlik", "tc_kimlik", "address", "rawInput", "raw_input"]);
  return Object.fromEntries(Object.entries(params).filter(([key]) => !blocked.has(key)));
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
    const safeParams = sanitizeGrowthParams(params);
    const detail = { event: growthEvent, tool_id: event.includes("scope") || event.includes("cn") ? "gtip-cn-kapsam-kontrolu" : undefined, ...base, ...safeParams };
    window.dataLayer.push(detail);
    window.dispatchEvent(new CustomEvent("sagiarvil:growth", { detail }));
  }
}
