/**
 * Paddle Billing overlay — public token + price id only.
 * API key / webhook secret asla buraya girmez.
 */

export const PADDLE_JS_SRC = "https://cdn.paddle.com/paddle/v2/paddle.js";

export function paddleClientToken(): string {
  return (process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "").trim();
}

export function paddleSealPriceId(): string {
  return (process.env.NEXT_PUBLIC_PADDLE_PRICE_SEALED || "").trim();
}

export function paddleEnvironment(): "sandbox" | "production" {
  const raw = (process.env.NEXT_PUBLIC_PADDLE_ENV || "production").trim().toLowerCase();
  return raw === "sandbox" ? "sandbox" : "production";
}

export function isPaddleCheckoutReady(): boolean {
  const token = paddleClientToken();
  const priceId = paddleSealPriceId();
  const tokenOk = token.startsWith("live_") || token.startsWith("test_");
  return tokenOk && priceId.startsWith("pri_");
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

export async function openPaddleSealCheckout(opts: {
  sessionId: string;
  sectorSlug: string;
  customerEmail?: string;
  onCompleted: (transactionId: string) => void;
  onClosed?: () => void;
}): Promise<void> {
  if (!isPaddleCheckoutReady()) {
    throw new Error("paddle-config");
  }
  const paddle = await bootPaddle();
  eventSink = (event) => {
    if (event.name === "checkout.completed") {
      const id = String(event.data?.transaction_id || event.data?.id || "").trim();
      if (id) opts.onCompleted(id);
    }
    if (event.name === "checkout.closed") opts.onClosed?.();
  };
  const checkout: Record<string, unknown> = {
    items: [{ priceId: paddleSealPriceId(), quantity: 1 }],
    customData: {
      sessionId: opts.sessionId,
      sectorSlug: opts.sectorSlug,
      packageType: "SEAL_PACKAGE_9900",
    },
    settings: {
      displayMode: "overlay",
      locale: "tr",
      allowLogout: false,
      theme: "light",
    },
  };
  if (opts.customerEmail) {
    checkout.customer = { email: opts.customerEmail };
  }
  paddle.Checkout.open(checkout);
}
