---
name: transitions-dev
description: Web View Transitions API and FLIP micro-interaction engine for seamless SPA-like page and component state morphing.
---

# transitions.dev View Transitions Engine

## 1. Overview
Leverages modern native browser `document.startViewTransition()` to animate DOM mutations, route changes, and modal openings without bloated JavaScript bundle weight.

## 2. Integration in `src/lib/transitions/index.ts`
- `startViewTransition(callback)`: Executes callback inside native view transition with safe fallback for unsupported browsers.
- `withViewTransition(fn)`: Wraps state updaters or navigation handlers.

## 3. CSS Customization
```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.25s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
```
