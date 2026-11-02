import { expect, test } from '@playwright/test';
import { corpusQA, corpusNodes } from '../../src/content/corpus';

test('question chips are a keyboard radiogroup', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard');
  await page.goto('/es');
  const group = page.locator('#ask').getByRole('radiogroup');
  const radios = group.getByRole('radio');
  await expect(radios).toHaveCount(corpusQA.length);
  await radios.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(radios.nth(1)).toBeFocused();
  await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
});

test('selecting a question shows the full answer and source links', async ({ page }) => {
  await page.goto('/es');
  const ask = page.locator('#ask');
  const qa = corpusQA.find((q) => q.id === 'cloud')!;
  await ask.getByRole('radio', { name: qa.question.es }).click();
  await expect(ask.locator('[data-status="done"]')).toBeVisible({ timeout: 10_000 });
  await expect(ask.getByTestId('ask-answer')).toHaveText(qa.answer.es);
  const sources = ask.getByTestId('ask-sources').getByRole('link');
  await expect(sources).toHaveCount(qa.sources.length);
  const first = corpusNodes.find((n) => n.id === qa.sources[0])!;
  await expect(sources.first()).toHaveText(first.title.es);
});

test('rapid switching shows only the last answer', async ({ page }) => {
  await page.goto('/es');
  const ask = page.locator('#ask');
  await ask.getByRole('radio', { name: corpusQA[0].question.es }).click();
  await page.waitForTimeout(100);
  await ask.getByRole('radio', { name: corpusQA[1].question.es }).click();
  await expect(ask.locator('[data-status="done"]')).toBeVisible({ timeout: 10_000 });
  await expect(ask.getByTestId('ask-answer')).toHaveText(corpusQA[1].answer.es);
  await expect(ask.getByTestId('ask-sources').getByRole('link')).toHaveCount(
    corpusQA[1].sources.length,
  );
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('answer appears instantly', async ({ page }) => {
    await page.goto('/es');
    const ask = page.locator('#ask');
    await ask.getByRole('radio', { name: corpusQA[2].question.es }).click();
    await expect(ask.locator('[data-status="done"]')).toBeVisible({ timeout: 300 });
    await expect(ask.getByTestId('ask-answer')).toHaveText(corpusQA[2].answer.es);
  });
});

test('disclaimer present in both locales', async ({ page }) => {
  await page.goto('/es');
  await expect(page.locator('#ask')).toContainText('la recuperación es una visualización');
  await page.goto('/en');
  await expect(page.locator('#ask')).toContainText('the retrieval is a visualisation');
});

// El paso por tiempo está cubierto en unit (charsForTick); aquí, la regresión real que se vio:
// en móvil la respuesta tardaba >10 s (ideal ~2,3 s). Margen amplio por la carga de workers.
test('answer finishes in bounded wall time on a slow CPU', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'regresión observada en móvil');
  const cdp = await page.context().newCDPSession(page);
  await page.goto('/es');
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const ask = page.locator('#ask');
  const qa = corpusQA.find((q) => q.id === 'studying')!; // la respuesta más larga (~1,7 s ideal)
  const t0 = Date.now();
  await ask.getByRole('radio', { name: qa.question.es }).click();
  await expect(ask.locator('[data-status="done"]')).toBeVisible({ timeout: 15_000 });
  expect(Date.now() - t0).toBeLessThan(5_500);
  await expect(ask.getByTestId('ask-answer')).toHaveText(qa.answer.es);
});
