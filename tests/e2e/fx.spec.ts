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
  const btn = page.locator('#hero .btn--primary');
  await btn.hover();
  await expect(lens).toHaveAttribute('data-focus', 'true');
  // al recogerse sigue centrada en el puntero (la escala no puede arrastrar la posición)
  const b = (await btn.boundingBox())!;
  await expect(async () => {
    const l = (await lens.boundingBox())!;
    expect(Math.abs(l.x + l.width / 2 - (b.x + b.width / 2))).toBeLessThan(4);
    expect(Math.abs(l.y + l.height / 2 - (b.y + b.height / 2))).toBeLessThan(4);
  }).toPass();
});

// la aurora es opaca: si pintase encima, la lente no se vería
test('lens paints above the aurora', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop only');
  await page.goto('/es');
  const z = await page.evaluate(() => [
    Number(getComputedStyle(document.querySelector('.aurora')!).zIndex),
    Number(getComputedStyle(document.querySelector('.lens')!).zIndex),
  ]);
  expect(z[1]).toBeGreaterThan(z[0]);
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

// Para quien abre las herramientas de desarrollo: una firma con el repo y el contacto.
for (const locale of ['es', 'en'] as const) {
  test(`console signature points to the repo and email (${locale})`, async ({ page }) => {
    const lines: string[] = [];
    page.on('console', (m) => lines.push(m.text()));
    await page.goto(`/${locale}`);
    await expect
      .poll(() => lines.join('\n'))
      .toContain('https://github.com/MiguelGarciaBilbao/portfolio');
    expect(lines.join('\n')).toContain('miguel99bilbao@gmail.com');
    expect(lines.join('\n')).not.toMatch(/\+?\d[\d\s]{8,}/);
  });
}
