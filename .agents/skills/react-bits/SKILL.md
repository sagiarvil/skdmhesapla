---
name: react-bits
description: Animated, accessible, production-ready React components inspired by reactbits.dev. Provides SplitText, BlurText, SpotlightCard, DecryptedText, and particle effects.
---

# React Bits Animation & Component Engine

## 1. Overview
React Bits provides lightweight, performant, accessible animation primitives built on top of `framer-motion` and Tailwind CSS.

## 2. Available Components in `src/components/react-bits/`
- **SplitText:** Word/letter by word staggered entrance animation with spring physics.
- **BlurText:** Smooth blur-to-clear entrance animation for hero headers and key metrics.
- **SpotlightCard:** Interactive card with dynamic mouse-following radial spotlight glow border.
- **DecryptedText:** Cyberpunk character-decryption text reveal with random symbol shuffling.

## 3. Usage Example
```tsx
import { SplitText, SpotlightCard, BlurText, DecryptedText } from '@/components/react-bits';

export function HeroFeature() {
  return (
    <SpotlightCard spotlightColor="rgba(20, 105, 75, 0.25)">
      <BlurText text="AB CBAM 2026 Canlı Hesaplama" className="text-2xl font-black" />
      <SplitText text="Fabrikanızın verilerini 15 dakikada resmi beyana dönüştürün." />
      <DecryptedText text="SEAL-2026-VERIFIED" speed={30} />
    </SpotlightCard>
  );
}
```
