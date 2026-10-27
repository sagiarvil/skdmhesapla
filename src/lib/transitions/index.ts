'use client';

/**
 * transitions.dev — Web View Transitions API Helper & Morphing Engine
 * Native document.startViewTransition API ile tarayıcı seviyesinde kesintisiz sayfa/bileşen geçişleri.
 */

export function startViewTransition(updateCallback: () => void | Promise<void>): void {
  if (typeof document !== 'undefined' && 'startViewTransition' in document) {
    (document as unknown as { startViewTransition: (cb: () => void | Promise<void>) => void }).startViewTransition(updateCallback);
  } else {
    // Fallback for browsers without View Transitions API
    const res = updateCallback();
    if (res instanceof Promise) {
      res.catch(console.error);
    }
  }
}

/**
 * withViewTransition — Navigasyon veya durum güncellemelerini sarmalayan yardımcı
 */
export function withViewTransition<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => void {
  return (...args: Parameters<T>) => {
    startViewTransition(() => {
      fn(...args);
    });
  };
}
