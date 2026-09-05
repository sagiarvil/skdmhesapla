/**
 * Paddle Billing overlay — public token + price ids only.
 * API key / webhook secrets asla buraya girmez.
 */

import type { SealPackageType, SealWorkflowType } from "@/lib/payment/seal-entitlement";

export const PADDLE_JS_SRC = "https://cdn.paddle.com/paddle/v2/paddle.js";
export const MARITIME_DOSSIER_SKU = "MARITIME_DOSSIER_1Y_399_USD";
export const MARITIME_DOSSIER_PADDLE_PRICE_ID = "pri_01m1rdd20amd3730r561vckwm3";

export function paddleClientToken(): string {
  return (process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "").trim();
}

export function paddleSealPriceId(): string {
  return (process.env.NEXT_PUBLIC_PADDLE_PRICE_SEALED || "").trim();
}

export function paddleMaritimePriceId(): string {
  return (process.env.NEXT_PUBLIC_PADDLE_MARITIME_PRICE_ID_399 || MARITIME_DOSSIER_PADDLE_PRICE_ID).trim();
}

export function paddleEnvironment(): "sandbox" | "production" {
  const raw = (process.env.NEXT_PUBLIC_PADDLE_ENV || "production").trim().toLowerCase();
  return raw === "sandbox" ? "sandbox" : "production";
}

function tokenLooksValid(token: string) {
  return token.startsWith("live_") || token.startsWith("test_");
}

export function isPaddleCheckoutReady(): boolean {
  return tokenLooksValid(paddleClientToken()) && paddleSealPriceId().startsWith("pri_");
}

export function isPaddleMaritimeCheckoutReady(): boolean {
  return tokenLooksValid(paddleClientToken()) && paddleMaritimePriceId().startsWith("pri_");
}

type PaddleEvent = {
  name?: string;
  data?: { id?: string; transaction_id?: string };
};

type PaddleHost = {
  Environment: { set: (env: "sandbox" | "production") => void };
  Initialize: (opts: { token: string; eventCallback?: (e: PaddleEvent) => void }) => void;
  Checkout: { open: (opts: Record<string, unknown>) => void };
};

declare global {
  interface Window {
    Paddle?: PaddleHost;
  }
}

let paddleBoot: Promise<PaddleHost> | null = null;
let eventSink: ((e: PaddleEvent) => void) | null = null;

function loadPaddleScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("browser"));
  if (window.Paddle) return Promise.resolve();
  const existing = document.querySelector(`script[src="${PADDLE_JS_SRC}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("paddle-js")));
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PADDLE_JS_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("paddle-js"));
    document.head.appendChild(script);
  });
}

function bootPaddle(): Promise<PaddleHost> {
  if (paddleBoot) return paddleBoot;
  paddleBoot = (async () => {
    await loadPaddleScript();
    const paddle = window.Paddle;
    if (!paddle) throw new Error("paddle-js");
    paddle.Environment.set(paddleEnvironment());
    paddle.Initialize({
      token: paddleClientToken(),
      eventCallback: (event) => eventSink?.(event),
    });
    return paddle;
  })();
  return paddleBoot;
}

function wireCheckoutEvents(opts: {
  onCompleted: (transactionId: string) => void;
  onClosed?: () => void;
}) {
  eventSink = (event) => {
    if (event.name === "checkout.completed") {
      const id = String(event.data?.transaction_id || event.data?.id || "").trim();
      if (id) opts.onCompleted(id);
    }
    if (event.name === "checkout.closed") opts.onClosed?.();
  };
}

export async function openPaddleSealCheckout(opts: {
  sessionId: string;
  sectorSlug: string;
  customerEmail?: string;
  workflowType?: SealWorkflowType;
  packageType?: SealPackageType;
  onCompleted: (transactionId: string) => void;
  onClosed?: () => void;
}): Promise<void> {
  if (!isPaddleCheckoutReady()) throw new Error("paddle-config");
  const paddle = await bootPaddle();
  const workflowType = opts.workflowType ?? "cbam";
  const packageType = opts.packageType ?? (workflowType === "pcf" ? "PCF_SEAL_PACKAGE_9900" : "CBAM_SEAL_PACKAGE_9900");
  wireCheckoutEvents(opts);
  const checkout: Record<string, unknown> = {
    items: [{ priceId: paddleSealPriceId(), quantity: 1 }],
    customData: {
      sessionId: opts.sessionId,
      sectorSlug: opts.sectorSlug,
      workflowType,
      packageType,
    },
    settings: {
      displayMode: "overlay",
      locale: "tr",
      allowLogout: false,
      theme: "light",
    },
  };
  if (opts.customerEmail) checkout.customer = { email: opts.customerEmail };
  paddle.Checkout.open(checkout);
}

export async function openPaddleMaritimeCheckout(opts: {
  purchaseIntentId: string;
  customerEmail?: string;
  onCompleted: (transactionId: string) => void;
  onClosed?: () => void;
}): Promise<void> {
  if (!isPaddleMaritimeCheckoutReady()) throw new Error("paddle-maritime-config");
  const paddle = await bootPaddle();
  wireCheckoutEvents(opts);
  const checkout: Record<string, unknown> = {
    items: [{ priceId: paddleMaritimePriceId(), quantity: 1 }],
    customData: {
      maritimePurchaseIntentId: opts.purchaseIntentId,
      sku: MARITIME_DOSSIER_SKU,
    },
    settings: {
      displayMode: "overlay",
      variant: "one-page",
      locale: "tr",
      allowLogout: false,
      theme: "light",
    },
  };
  if (opts.customerEmail) checkout.customer = { email: opts.customerEmail };
  paddle.Checkout.open(checkout);
}
