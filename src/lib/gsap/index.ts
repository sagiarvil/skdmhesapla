'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Client-side only ScrollTrigger registration
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };

/**
 * useGsapFadeIn — Standart element giriş animasyonu
 */
export function useGsapFadeIn(options: {
  delay?: number;
  duration?: number;
  y?: number;
  stagger?: number;
} = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      gsap.from(containerRef.current.children, {
        opacity: 0,
        y: options.y ?? 20,
        duration: options.duration ?? 0.6,
        delay: options.delay ?? 0.1,
        stagger: options.stagger ?? 0.1,
        ease: 'power2.out',
      });
    },
    { scope: containerRef }
  );

  return containerRef;
}

/**
 * useGsapScrollReveal — ScrollTrigger ile görünür olunca tetiklenen animasyon
 */
export function useGsapScrollReveal(options: {
  triggerStart?: string;
  duration?: number;
  y?: number;
} = {}) {
  const elementRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!elementRef.current) return;
      gsap.from(elementRef.current, {
        scrollTrigger: {
          trigger: elementRef.current,
          start: options.triggerStart ?? 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: options.y ?? 30,
        duration: options.duration ?? 0.8,
        ease: 'power3.out',
      });
    },
    { scope: elementRef }
  );

  return elementRef;
}
