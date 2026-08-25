"use client";

import { useEffect } from "react";

/**
 * Sihirbaz adımı değiştiğinde aktif içeriği sabit üst menünün altına hizalar.
 * scrollIntoView kullanmaz; layout değişiminden sonra tek, kontrollü scrollTo yapar.
 */
export function WizardAutoScroll() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>('[aria-label="Sihirbaz adımları"]');
    if (!nav) return;

    let firstMutation = true;
    let raf1 = 0;
    let raf2 = 0;

    const scrollToActiveContent = () => {
      if (firstMutation) {
        firstMutation = false;
        return;
      }
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => {
          const navNow = document.querySelector<HTMLElement>('[aria-label="Sihirbaz adımları"]');
          if (!navNow) return;
          const content = navNow.nextElementSibling as HTMLElement | null;
          if (!content) return;

          const stickyHeaders = Array.from(document.querySelectorAll<HTMLElement>('header.sticky, header[class*="sticky"]'));
          const stickyHeight = stickyHeaders.reduce((max, el) => Math.max(max, el.getBoundingClientRect().height), 0);
          const offset = Math.max(84, Math.ceil(stickyHeight) + 16);
          const top = Math.max(0, content.getBoundingClientRect().top + window.scrollY - offset);
          const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

          window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
        });
      });
    };

    const label = nav.querySelector("p");
    const observer = new MutationObserver(scrollToActiveContent);
    observer.observe(label ?? nav, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, []);

  return null;
}
