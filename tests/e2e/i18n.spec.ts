import { expect, test } from '@playwright/test';

test.describe('i18n default locale', () => {
  test.use({ locale: 'fr-FR' });
  test('/ redirects to /es by default', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/es$/);
  });
});

test.describe('i18n routing', () => {
  test('/es is served directly', async ({ page }) => {
    const res = await page.goto('/es');
    expect(res?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('html lang matches locale', async ({ page }) => {
    await page.goto('/es');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await page.goto('/en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('lang switch on home goes to /en and back', async ({ page }) => {
    await page.goto('/es');
    await page.getByRole('link', { name: 'EN', exact: true }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.getByRole('link', { name: 'ES', exact: true }).click();
    await expect(page).toHaveURL(/\/es$/);
  });

  test('skip link focuses main', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard only');
    await page.goto('/es');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: /saltar al contenido/i });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });
});

test.describe('i18n Accept-Language', () => {
  test.use({ locale: 'en-US' });
  test('/ redirects to /en with Accept-Language en', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en$/);
  });
});
