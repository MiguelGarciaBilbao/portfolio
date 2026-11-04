import { expect, test } from '@playwright/test';

// Lente de observatorio: el cursor nativo se queda; un halo tenue detrás del contenido lo sigue.
test('observatory lens follows the mouse and keeps the native cursor', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'desktop only');
  await page.goto('/es');
  const lens = page.getByTestId('lens');
  // se arma con el primer pointermove tras hidratar: un usuario real sigue moviendo el ratón
  let x = 400;
  await expect(async () => {
    await page.mouse.move((x += 7), 300);
    await expect(lens).toHaveAttribute('data-on', 'true', { timeout: 500 });
  }).toPass();
  await page.mouse.move(500, 320);
  await expect(async () => {
    const box = (await lens.boundingBox())!;
    expect(Math.abs(box.x + box.width / 2 - 500)).toBeLessThan(4);
    expect(Math.abs(box.y + box.height / 2 - 320)).toBeLessThan(4);
  }).toPass();
  const cursor = await page.evaluate(() => getComputedStyle(document.body).cursor);
  expect(cursor).not.toBe('none');
  await expect(lens).toHaveAttribute('aria-hidden', 'true');
});

test('lens gathers over interactive elements', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop only');
  await page.goto('/es');
  const lens = page.getByTestId('lens');
  let x = 400;
  await expect(async () => {
    await page.mouse.move((x += 7), 300);
    await expect(lens).toHaveAttribute('data-on', 'true', { timeout: 500 });
  }).toPass();
  await page.locator('#hero .btn--primary').hover();
  await expect(lens).toHaveAttribute('data-focus', 'true');
});

test('no lens on touch', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'touch only');
  await page.goto('/es');
  await page.waitForLoadState('networkidle');
  await expect(page.getByTestId('lens')).toHaveCount(0);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('no lens with reduced motion', async ({ page }) => {
    await page.goto('/es');
    await page.waitForLoadState('networkidle');
    await page.mouse.move(200, 200);
    await expect(page.getByTestId('lens')).toHaveCount(0);
  });
});

test('aurora background is present and decorative', async ({ page }) => {
  await page.goto('/es');
  await expect(page.getByTestId('aurora')).toHaveAttribute('aria-hidden', 'true');
});
