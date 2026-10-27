---
name: gsap
description: GSAP (GreenSock Animation Platform) and ScrollTrigger architecture for Next.js, React, and modern web applications.
---

# GSAP Animation & ScrollTrigger Engine

## 1. Core Principles
- Always register plugins (`ScrollTrigger`, `useGSAP`) only on the client side (`typeof window !== 'undefined'`).
- Use `@gsap/react` `useGSAP` hook for automatic memory cleanup, context scoping, and React 18/19 compatibility.
- Prefer GPU-accelerated transforms (`transform: translate3d`, `opacity`, `scale`) over layout properties (`top`, `left`, `width`).

## 2. Helper Hooks in `src/lib/gsap/index.ts`
- `useGsapFadeIn(options)`: Staggered entrance for list of children.
- `useGsapScrollReveal(options)`: ScrollTrigger-based reveal when scrolled into view.

## 3. Usage Example
```tsx
'use client';
import { useGsapScrollReveal, useGsapFadeIn } from '@/lib/gsap';

export function FeaturesSection() {
  const scrollRef = useGsapScrollReveal({ triggerStart: 'top 80%' });
  const fadeRef = useGsapFadeIn({ stagger: 0.15 });

  return (
    <section ref={scrollRef}>
      <div ref={fadeRef}>
        <div className="card">Adım 1</div>
        <div className="card">Adım 2</div>
      </div>
    </section>
  );
}
```
