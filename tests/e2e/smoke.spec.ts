import { test, expect } from '@playwright/test';

test.describe('SKDM Platform Core Smoke Tests', () => {
  test('Ana sayfa basarili sekilde yuklenmeli ve baslik icermeli', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SKDMHesapla/i);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('text=CBAM').first()).toBeVisible();
  });

  test('Gorsel Kokpit rotasi erisilebilir olmali', async ({ page }) => {
    await page.goto('/gorsel-kokpit/');
    await expect(page).toHaveTitle(/Görsel Karbon/i);
    await expect(page.locator('#brandHomeLink')).toBeVisible();
  });
});
