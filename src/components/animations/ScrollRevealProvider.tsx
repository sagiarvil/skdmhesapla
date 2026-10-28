'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollRevealProvider — Apple Motion Architecture (Fail-Safe & Zero-Lag)
 * Scroll-Driven Reveal with Staggered Fade-Up
 *
 * 1. Sadece 'data-reveal' veya '.apple-reveal' açıkça verilmiş elemanları yönetir.
 * 2. Rastgele tüm section veya grid elemanlarını gizlemez (kırılma ve kaybolmaları engeller).
 * 3. Ekran sınırında veya içinde kalan her eleman derhal görünür hale getirilir.
 */
export function ScrollRevealProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      document.querySelectorAll('.apple-reveal').forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer?.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px 50px 0px', // Erken tetikleme ile boş ekran hissini sıfırlar
          threshold: 0.05,
        }
      );

      // Yalnızca açıkça işaretlenmiş animasyon düğümleri
      const targets = document.querySelectorAll<HTMLElement>('[data-reveal], .apple-reveal');

      targets.forEach((el) => {
        if (el.classList.contains('is-revealed')) return;

        // Viewport içinde veya üstündeyse beklemeden göster
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight || rect.bottom <= 0) {
          el.classList.add('is-revealed');
        } else {
          observer?.observe(el);
        }
      });
    };

    const timer = setTimeout(setupObserver, 50);

    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [pathname]);

  return <>{children}</>;
}
