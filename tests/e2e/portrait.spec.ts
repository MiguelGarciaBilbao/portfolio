import { expect, test } from '@playwright/test';

const ALT = {
  es: /Retrato de Miguel García Bilbao/,
  en: /Portrait of Miguel García Bilbao/,
} as const;

const VIDEO = /retrato-constelacion\.(webm|mp4)/;

for (const locale of ['es', 'en'] as const) {
  test(`contact shows the constellation portrait /${locale}`, async ({ page }) => {
    await page.goto(`/${locale}`);
    const img = page.locator('#contact').getByRole('img', { name: ALT[locale] });
    await expect(img).toHaveCount(1);
    await img.scrollIntoViewIfNeeded();
    await expect(img).toBeVisible();
    // diferida: se descarga al acercarse a Contacto
    await expect
      .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth))
      .toBeGreaterThan(0);
  });
}

// El vídeo pesa ~1 MB: no se pide hasta que Contacto está cerca.
test('portrait video is not requested before reaching contact', async ({ page }) => {
  const hits: string[] = [];
  page.on('request', (r) => {
    if (VIDEO.test(r.url())) hits.push(r.url());
  });
  await page.goto('/es');
  await page.waitForLoadState('networkidle');
  expect(hits).toEqual([]);
});

// Momento de autor: al llegar, la constelación se dibuja una vez sobre la foto fija.
test('portrait plays the constellation once when it comes into view', async ({ page }) => {
  await page.goto('/es');
  const portrait = page.getByTestId('portrait');
  await portrait.scrollIntoViewIfNeeded();
  await expect(portrait.locator('video')).toHaveAttribute('aria-hidden', 'true');
  await expect(portrait).toHaveAttribute('data-state', 'playing', { timeout: 8000 });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('portrait stays still and never loads the video', async ({ page }) => {
    const hits: string[] = [];
    page.on('request', (r) => {
      if (VIDEO.test(r.url())) hits.push(r.url());
    });
    await page.goto('/es');
    const portrait = page.getByTestId('portrait');
    await portrait.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await expect(portrait.locator('video')).toHaveCount(0);
    expect(hits).toEqual([]);
  });
});
