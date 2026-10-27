---
name: playwright-cli
description: Real headless browser automation, E2E testing, visual regression and DOM verification using Microsoft Playwright CLI.
---

# Playwright CLI Browser Automation Engine

## 1. Capabilities
- Full headless Chromium, WebKit, and Firefox browser execution.
- Automated screenshot capturing and visual verification.
- Mobile viewport emulation (Pixel 5, iPhone 14) and desktop testing.
- Network interception, console error logging, and performance auditing.

## 2. Execution Commands
```bash
# Run all E2E smoke tests
npx playwright test

# Run tests in headed UI mode
npx playwright test --ui

# Inspect test reports
npx playwright show-report
```

## 3. Configuration
- Main config: [`playwright.config.ts`](file:///Users/macair1/projects/skdm-hesapla/playwright.config.ts)
- Test suite: [`tests/e2e/smoke.spec.ts`](file:///Users/macair1/projects/skdm-hesapla/tests/e2e/smoke.spec.ts)
