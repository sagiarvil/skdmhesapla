import { expect, test, type Page } from "@playwright/test";

async function appOffset(page: Page): Promise<number> {
  return page.evaluate(() => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--app-scroll-offset")
      .trim();

    const n = Number.parseFloat(raw);
    return Number.isFinite(n) ? n : 88;
  });
}

async function expectTargetLocked(
  page: Page,
  selector: string,
  tolerance = 8,
) {
  const target = page.locator(selector).first();
  await expect(target).toBeVisible();

  await page.waitForFunction(
    ({ sel, tol }) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--app-scroll-offset")
        .trim();
      const offset = Number.parseFloat(raw);
      const desired = Number.isFinite(offset) ? offset : 88;
      return Math.abs(el.getBoundingClientRect().top - desired) <= tol;
    },
    { sel: selector, tol: tolerance },
    { timeout: 5_000 },
  );

  const y = await target.evaluate((el) => el.getBoundingClientRect().top);
  const offset = await appOffset(page);

  expect(
    Math.abs(y - offset),
    `target top=${y}, offset=${offset}`,
  ).toBeLessThanOrEqual(tolerance);
}

test.describe("Stable scroll architecture", () => {
  test("PCF next step lands exactly at flow target", async ({ page }) => {
    await page.goto("/karbon-raporu/");

    await page
      .getByRole("button", { name: /Raporu hazırlamaya başla/i })
      .click();

    await expectTargetLocked(page, "[data-flow-viewport]");
  });

  test("PCF forward and back remain locked", async ({ page }) => {
    await page.goto("/karbon-raporu/");

    await page
      .getByRole("button", { name: /Raporu hazırlamaya başla/i })
      .click();

    await expectTargetLocked(page, "[data-flow-viewport]");

    const next = page.getByRole("button", { name: /Devam/i }).last();
    await next.click();
    await expectTargetLocked(page, "[data-flow-viewport]");

    const back = page.getByRole("button", { name: /Geri/i }).last();
    await back.click();
    await expectTargetLocked(page, "[data-flow-viewport]");
  });

  test("manual user scroll cancels layout correction ownership", async ({
    page,
  }) => {
    await page.goto("/karbon-raporu/");

    await page
      .getByRole("button", { name: /Raporu hazırlamaya başla/i })
      .click();

    await page.mouse.wheel(0, 500);
    const afterManual = await page.evaluate(() => window.scrollY);

    await page.waitForTimeout(900);

    const finalY = await page.evaluate(() => window.scrollY);

    expect(Math.abs(finalY - afterManual)).toBeLessThan(80);
  });

  test("mobile menu returns to previous scroll position", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "mobile-only body lock");

    await page.goto("/tedarikci-verisi/");
    await page.evaluate(() => window.scrollTo(0, 900));

    const before = await page.evaluate(() => window.scrollY);

    await page.getByRole("button", { name: /^Menü$/i }).click();

    await expect(page.locator("#mobil-menu")).toBeVisible();

    await page.getByRole("button", { name: /^Kapat$/i }).click();

    await page.waitForFunction(
      (expected) => Math.abs(window.scrollY - expected) <= 2,
      before,
      { timeout: 2_000 },
    );

    const after = await page.evaluate(() => window.scrollY);

    expect(Math.abs(after - before)).toBeLessThanOrEqual(2);
  });

  test("header offset CSS variable matches sticky header", async ({
    page,
  }) => {
    await page.goto("/");

    const values = await page.evaluate(() => {
      const header = document.querySelector<HTMLElement>("[data-app-header]");
      if (!header) return null;

      const headerHeight = header.getBoundingClientRect().height;

      const offset = Number.parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--app-scroll-offset")
          .trim(),
      );

      return { headerHeight, offset };
    });

    expect(values).not.toBeNull();
    expect(values!.offset).toBeGreaterThan(values!.headerHeight);
    expect(values!.offset - values!.headerHeight).toBeGreaterThanOrEqual(12);
    expect(values!.offset - values!.headerHeight).toBeLessThanOrEqual(30);
  });

  test("CBAM wizard step change lands at flow target", async ({ page }) => {
    await page.goto("/hesapla/demir-celik/");

    const continueButton = page
      .getByRole("button", { name: /Devam|Başla/i })
      .last();

    await continueButton.click();
    await expectTargetLocked(page, "[data-flow-viewport]");
  });
});
