"use client";

export type StableScrollBehavior = "auto" | "smooth";

export type StableScrollOptions = {
  behavior?: StableScrollBehavior;
  focus?: boolean;
  focusSelector?: string;
  offsetExtra?: number;
  settleMs?: number;
  timeoutMs?: number;
};

const DEFAULT_OFFSET = 88;
const DEFAULT_SETTLE_MS = 1200;
const DEFAULT_TIMEOUT_MS = 1800;
const POSITION_TOLERANCE_PX = 4;

let activeRequest = 0;
let queuedFieldId: string | null = null;
let queuedFieldOptions: Omit<StableScrollOptions, "focusSelector"> | undefined;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function getAppScrollOffset(): number {
  if (!isBrowser()) return DEFAULT_OFFSET;

  const raw = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--app-scroll-offset")
    .trim();

  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : DEFAULT_OFFSET;
}

export function isOutsideStableViewport(el: HTMLElement): boolean {
  if (!isBrowser()) return false;
  const offset = getAppScrollOffset();
  const rect = el.getBoundingClientRect();
  return rect.bottom <= offset || rect.top >= window.innerHeight;
}

function reducedMotion(): boolean {
  return (
    isBrowser() &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

async function twoPaints(): Promise<void> {
  await nextFrame();
  await nextFrame();
}

function resolveNow(target: HTMLElement | string): HTMLElement | null {
  if (typeof target !== "string") return target;

  const byId = document.getElementById(target);
  if (byId) return byId;

  try {
    return document.querySelector<HTMLElement>(target);
  } catch {
    return null;
  }
}

async function waitForTarget(
  target: HTMLElement | string,
  timeoutMs: number,
): Promise<HTMLElement | null> {
  const immediate = resolveNow(target);
  if (immediate) return immediate;
  if (typeof target !== "string") return null;

  return new Promise((resolve) => {
    let done = false;

    const finish = (value: HTMLElement | null) => {
      if (done) return;
      done = true;
      observer.disconnect();
      window.clearTimeout(timer);
      resolve(value);
    };

    const observer = new MutationObserver(() => {
      const found = resolveNow(target);
      if (found) finish(found);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    const timer = window.setTimeout(() => finish(null), timeoutMs);
  });
}

function absoluteTargetTop(el: HTMLElement, offsetExtra = 0): number {
  const offset = getAppScrollOffset() + offsetExtra;
  return Math.max(
    0,
    window.scrollY + el.getBoundingClientRect().top - offset,
  );
}

function userScrollCancelEvents(cancel: () => void): () => void {
  const passive: AddEventListenerOptions = { passive: true };

  const triggerCancel = () => {
    cancel();
    try {
      window.scrollBy({ top: 0, behavior: "auto" });
    } catch {
      // Fallback ignore
    }
  };

  const onWheel = () => triggerCancel();
  const onTouch = () => triggerCancel();
  const onPointer = (event: PointerEvent) => {
    if (event.pointerType === "touch") triggerCancel();
  };
  const onKey = (event: KeyboardEvent) => {
    const keys = new Set([
      "ArrowDown",
      "ArrowUp",
      "PageDown",
      "PageUp",
      "Home",
      "End",
      " ",
    ]);
    if (keys.has(event.key)) triggerCancel();
  };

  window.addEventListener("wheel", onWheel, passive);
  window.addEventListener("touchstart", onTouch, passive);
  window.addEventListener("pointerdown", onPointer, passive);
  window.addEventListener("keydown", onKey);

  return () => {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchstart", onTouch);
    window.removeEventListener("pointerdown", onPointer);
    window.removeEventListener("keydown", onKey);
  };
}

function focusTarget(el: HTMLElement, selector?: string): void {
  const candidate =
    (selector ? el.querySelector<HTMLElement>(selector) : null) ?? el;

  if (!candidate.hasAttribute("tabindex") && candidate === el) {
    candidate.setAttribute("tabindex", "-1");
  }

  try {
    candidate.focus({ preventScroll: true });
  } catch {
    // Eski browser fallback'ta ikinci focus denemesi yapma.
  }
}

async function waitForInitialLayout(
  el: HTMLElement,
  requestId: number,
): Promise<boolean> {
  let lastTop = Number.NaN;
  let lastHeight = Number.NaN;
  let stableFrames = 0;

  for (let frame = 0; frame < 12; frame += 1) {
    await nextFrame();

    if (requestId !== activeRequest || !document.contains(el)) {
      return false;
    }

    const rect = el.getBoundingClientRect();
    const topStable =
      Number.isFinite(lastTop) && Math.abs(rect.top - lastTop) <= 0.5;
    const heightStable =
      Number.isFinite(lastHeight) && Math.abs(rect.height - lastHeight) <= 0.5;

    if (topStable && heightStable) {
      stableFrames += 1;
      if (stableFrames >= 2) return true;
    } else {
      stableFrames = 0;
    }

    lastTop = rect.top;
    lastHeight = rect.height;
  }

  return true;
}

/**
 * Site genelindeki TEK scroll entry-point.
 */
export async function stableScrollTo(
  target: HTMLElement | string,
  options: StableScrollOptions = {},
): Promise<boolean> {
  if (!isBrowser()) return false;

  const requestId = ++activeRequest;
  const {
    focus = true,
    focusSelector,
    offsetExtra = 0,
    settleMs = DEFAULT_SETTLE_MS,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  const behavior: StableScrollBehavior = reducedMotion()
    ? "auto"
    : (options.behavior ?? "smooth");

  const el = await waitForTarget(target, timeoutMs);
  if (!el || requestId !== activeRequest) return false;

  await twoPaints();
  if (requestId !== activeRequest || !document.contains(el)) return false;

  const layoutOk = await waitForInitialLayout(el, requestId);
  if (!layoutOk) return false;

  let cancelledByUser = false;
  const detachCancel = userScrollCancelEvents(() => {
    cancelledByUser = true;
  });

  try {
    window.scrollTo({
      top: absoluteTargetTop(el, offsetExtra),
      behavior,
    });

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, behavior === "smooth" ? 380 : 0);
    });

    if (
      requestId !== activeRequest ||
      cancelledByUser ||
      !document.contains(el)
    ) {
      return false;
    }

    if (focus) focusTarget(el, focusSelector);

    const started = performance.now();
    let stableFrames = 0;

    while (
      performance.now() - started < settleMs &&
      requestId === activeRequest &&
      !cancelledByUser &&
      document.contains(el)
    ) {
      await nextFrame();

      const desiredTop = getAppScrollOffset() + offsetExtra;
      const actualTop = el.getBoundingClientRect().top;
      const drift = actualTop - desiredTop;

      if (Math.abs(drift) > POSITION_TOLERANCE_PX) {
        stableFrames = 0;
        window.scrollBy({
          top: drift,
          behavior: "auto",
        });
      } else {
        stableFrames += 1;
        if (stableFrames >= 6) break;
      }
    }

    return true;
  } finally {
    detachCancel();
  }
}

export function queueStableScrollToField(
  fieldId: string,
  options: Omit<StableScrollOptions, "focusSelector"> = {},
): void {
  queuedFieldId = fieldId;
  queuedFieldOptions = options;
}

export function consumeQueuedFieldScroll(): {
  fieldId: string;
  options: Omit<StableScrollOptions, "focusSelector">;
} | null {
  if (!queuedFieldId) return null;
  const fieldId = queuedFieldId;
  const options = queuedFieldOptions ?? {};
  queuedFieldId = null;
  queuedFieldOptions = undefined;
  return { fieldId, options };
}

export function cancelStableScroll(): void {
  activeRequest += 1;
}

export function stableScrollToField(
  fieldId: string,
  options: Omit<StableScrollOptions, "focusSelector"> = {},
): Promise<boolean> {
  return stableScrollTo(`fb-${fieldId}`, {
    ...options,
    focus: true,
    focusSelector: "input, select, textarea, button",
  });
}

export function stableScrollToReveal(
  targetId: string,
  options: StableScrollOptions = {},
): Promise<boolean> {
  return stableScrollTo(targetId, {
    ...options,
    focus: options.focus ?? true,
  });
}
