---
name: designlang
description: Automated design token extractor and CSS variable auditor. Dissects color palettes, typography scales, spacing, shadows, and radii.
---

# designlang Token Analysis Engine

## 1. Capabilities
- Parses `tailwind.config.*`, CSS custom properties (`--var`), and DOM styles.
- Extracts design language tokens into machine-readable `design-tokens.json`.
- Detects inconsistent hardcoded hex values vs design token usage.

## 2. CLI Execution
```bash
node scripts/designlang-analyzer.mjs
# or
npm run engine:tokens
```
