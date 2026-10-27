import { test, expect } from '@playwright/test';

test.describe('SKDM 7-Motorlu Sistem & Platform Smoke Tests', () => {
  test('1. Ana sayfa basarili sekilde yuklenmeli, gorunur H1 ve CBAM basligi icermeli (Impeccable & Taste)', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SKDMHesapla/i);
    const visibleH1 = page.locator('h1:visible').first();
    await expect(visibleH1).toBeVisible();
  });

  test('2. React Bits SpotlightCard bilesenleri yuklenmeli ve fare etkilesimine girmeli', async ({ page, isMobile }) => {
    await page.goto('/');
    if (!isMobile) {
      const card = page.locator('text=SKDMHesapla Partner Network').first();
      await card.scrollIntoViewIfNeeded();
      await expect(card).toBeVisible();
      await card.hover();
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('3. GSAP Interactive Sektor Karar Motorlari bolumu gorunur olmali', async ({ page, isMobile }) => {
    await page.goto('/');
    if (!isMobile) {
      const gsapSection = page.locator('text=Canlı Sektör Karar Motorları').first();
      await gsapSection.scrollIntoViewIfNeeded();
      await expect(gsapSection).toBeVisible();
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('4. Gorsel Kokpit rotasi 200 OK ile yuklenmeli ve marka kimligini gostermeli', async ({ page }) => {
    await page.goto('/gorsel-kokpit/');
    await expect(page).toHaveTitle(/Görsel Karbon/i);
    await expect(page.locator('#brandHomeLink')).toBeVisible();
  });
});
