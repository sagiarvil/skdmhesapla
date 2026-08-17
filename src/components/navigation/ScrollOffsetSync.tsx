"use client";

import { useEffect } from "react";

const EXTRA_GAP_PX = 16;
const FALLBACK_HEADER_PX = 72;

export function ScrollOffsetSync() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>("[data-app-header]");

    const update = () => {
      const headerHeight =
        header?.getBoundingClientRect().height ?? FALLBACK_HEADER_PX;

      const visualTop = window.visualViewport?.offsetTop ?? 0;

      const offset = Math.ceil(headerHeight + EXTRA_GAP_PX + visualTop);

      root.style.setProperty("--app-scroll-offset", `${offset}px`);
    };

    update();

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;

    if (header && resizeObserver) {
      resizeObserver.observe(header);
    }

    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  return null;
}
