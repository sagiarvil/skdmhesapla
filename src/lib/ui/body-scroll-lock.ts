"use client";

import { useEffect } from "react";

type BodySnapshot = {
  scrollY: number;
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
  overflow: string;
  paddingRight: string;
};

let lockCount = 0;
let snapshot: BodySnapshot | null = null;

function lockBody(): void {
  if (typeof window === "undefined") return;

  lockCount += 1;
  if (lockCount > 1) return;

  const body = document.body;
  const scrollY = window.scrollY;
  const scrollbarWidth = Math.max(
    0,
    window.innerWidth - document.documentElement.clientWidth,
  );

  snapshot = {
    scrollY,
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overflow: body.style.overflow,
    paddingRight: body.style.paddingRight,
  };

  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "hidden";

  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

function unlockBody(): void {
  if (typeof window === "undefined") return;
  if (lockCount === 0) return;

  lockCount -= 1;
  if (lockCount > 0) return;

  const saved = snapshot;
  snapshot = null;
  if (!saved) return;

  const body = document.body;

  body.style.position = saved.position;
  body.style.top = saved.top;
  body.style.left = saved.left;
  body.style.right = saved.right;
  body.style.width = saved.width;
  body.style.overflow = saved.overflow;
  body.style.paddingRight = saved.paddingRight;

  window.requestAnimationFrame(() => {
    window.scrollTo({
      top: saved.scrollY,
      behavior: "auto",
    });
  });
}

export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    lockBody();
    return () => unlockBody();
  }, [active]);
}
