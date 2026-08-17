"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { stableScrollTo } from "@/lib/ui/stable-scroll";

function decodedHash(): string {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) return "";

  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function HashScrollController() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const run = () => {
      const id = decodedHash();
      if (!id) return;

      void stableScrollTo(id, {
        behavior: "smooth",
        focus: true,
        timeoutMs: 2200,
      });
    };

    let second = 0;
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(run);
    });

    const onHashChange = () => run();
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.cancelAnimationFrame(first);
      if (second) window.cancelAnimationFrame(second);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname]);

  return null;
}
