import { expect, test } from '@playwright/test';
import { corpusQA } from '../../src/content/corpus';

// El cerebro tiene que explicarse solo: leyenda de categorías y acceso a "Pregúntale a mi corpus".
test('brain stage shows a category key and a link to the corpus questions', async ({
  page,
  isMobile,
}) => {
  await page.goto('/es');
  const key = page.getByTestId('stage-key');
  await expect(key.getByRole('listitem')).toHaveCount(4);
  for (const cat of ['frontend', 'backend', 'ai', 'product']) {
    await expect(key.locator(`[data-cat="${cat}"]`)).toBeVisible();
  }
  // en una columna las preguntas quedan justo debajo y el enlace se oculta
  if (!isMobile) await expect(key.getByRole('link')).toHaveAttribute('href', '#ask');
});

// Al llegar a la sección, el corpus responde la primera pregunta sin esperar a que el visitante elija.
test('the first question answers itself when the corpus comes into view', async ({ page }) => {
  await page.goto('/es');
  const ask = page.locator('#ask');
  await ask.locator('.ask__panel').scrollIntoViewIfNeeded();
  await expect(ask.getByRole('radio', { name: corpusQA[0].question.es })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await expect(ask.locator('[data-status="done"]')).toBeVisible({ timeout: 10_000 });
});

test('a visitor choice is never overridden by the automatic question', async ({ page }) => {
  await page.goto('/es');
  const ask = page.locator('#ask');
  const qa = corpusQA.find((q) => q.id === 'looking-for')!;
  await ask.getByRole('radio', { name: qa.question.es }).click();
  await page.waitForTimeout(800);
  await expect(ask.getByRole('radio', { name: qa.question.es })).toHaveAttribute(
    'aria-checked',
    'true',
  );
});

test.describe('mobile', () => {
  test.skip(({ isMobile }) => !isMobile, 'solo móvil');

  test('questions sit in one scrollable row', async ({ page }) => {
    await page.goto('/es');
    const row = page.locator('#ask').getByRole('radiogroup');
    const box = (await row.boundingBox())!;
    expect(box.height).toBeLessThan(64);
  });

  test('brain and answer are on screen together', async ({ page }) => {
    await page.goto('/es');
    const ask = page.locator('#ask');
    await ask.getByRole('radio', { name: corpusQA[1].question.es }).click();
    await expect(ask.locator('[data-status="done"]')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.hero-grid__stage')).toBeInViewport({ ratio: 0.9 });
    await expect(ask.getByTestId('ask-answer')).toBeInViewport();
  });
});

// Momento de autor: mientras el corpus recupera, un barrido de luz cruza el cerebro.
test('retrieval sweeps a beam of light across the brain', async ({ page }) => {
  await page.goto('/es');
  const ask = page.locator('#ask');
  const sweep = () =>
    page
      .locator('.hero-grid__stage')
      .evaluate((el) => getComputedStyle(el, '::after').animationName);
  expect(await sweep()).toBe('none');
  await ask.getByRole('radio', { name: corpusQA[2].question.es }).click();
  await expect(ask.locator('[data-status="retrieving"]')).toBeVisible();
  expect(await sweep()).toBe('corpus-sweep');
});
