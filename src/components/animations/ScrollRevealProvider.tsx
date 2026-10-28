'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollRevealProvider — Apple Motion Architecture
 * Scroll-Driven Reveal with Staggered Fade-Up (Kademeli Kaydırma Görünürlük Animasyonu)
 *
 * 1. Fade-Up / Slide-Up: opacity 0 -> 1, translateY 24px -> 0.
 * 2. Stagger Effect: Kademeli 80ms aralıklarla domino akışı.
 * 3. Scroll-Driven: IntersectionObserver ile ekrana girdikçe tetikleme.
 * 4. Apple Motion: cubic-bezier(0.16, 1, 0.3, 1) + 60fps GPU hızlandırma.
 */
export function ScrollRevealProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // prefers-reduced-motion kontrolü (WCAG 2.2 AA erişilebilirlik)
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

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
          rootMargin: '0px 0px -40px 0px',
          threshold: 0.08,
        }
      );

      // Otomatik hedefleme: section'lar, grid çocukları, kartlar, data-reveal elemanları
      const targets = document.querySelectorAll<HTMLElement>(
        '[data-reveal], .apple-reveal, section > div, .grid > div, .grid > article, .grid > a, main > section'
      );

      // Grup bazlı 80ms stagger indeksleme
      const groupMap = new Map<HTMLElement, number>();

      targets.forEach((el) => {
        // Zaten gösterilmişse tekrar gizleme
        if (el.classList.contains('is-revealed')) return;

        // Üst kapsayıcıya göre stagger gecikmesi hesaplama (80ms kademe)
        const parent = el.parentElement;
        if (parent) {
          const count = groupMap.get(parent) || 0;
          el.style.setProperty('--stagger-delay', `${count * 80}ms`);
          groupMap.set(parent, count + 1);
        }

        el.classList.add('apple-reveal');

        // İlk viewport içindeyse hemen göster
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
          el.classList.add('is-revealed');
        } else {
          observer?.observe(el);
        }
      });
    };

    // DOM hazır olunca kur
    const timer = setTimeout(setupObserver, 60);

    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [pathname]);

  return <>{children}</>;
}
