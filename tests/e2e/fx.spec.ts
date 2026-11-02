import { expect, test } from '@playwright/test';

test('star cursor mounts on desktop', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop only');
  await page.goto('/es');
  await page.mouse.move(200, 200);
  await expect(page.getByTestId('star-cursor')).toHaveCount(1);
});

test('no star cursor on touch', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'touch only');
  await page.goto('/es');
  await page.waitForLoadState('networkidle');
  await expect(page.getByTestId('star-cursor')).toHaveCount(0);
  const cursor = await page.evaluate(() => getComputedStyle(document.body).cursor);
  expect(cursor).not.toBe('none');
  await expect(page.locator('html')).not.toHaveClass(/has-star-cursor/);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('no star cursor with reduced motion', async ({ page }) => {
    await page.goto('/es');
    await page.waitForLoadState('networkidle');
    await page.mouse.move(200, 200);
    await expect(page.getByTestId('star-cursor')).toHaveCount(0);
  });
});

test('aurora background is present and decorative', async ({ page }) => {
  await page.goto('/es');
  await expect(page.getByTestId('aurora')).toHaveAttribute('aria-hidden', 'true');
});
