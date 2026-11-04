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

  // Si la fila de preguntas está al borde de la pantalla, al tocar una la página se coloca
  // para que la pregunta y su respuesta se lean juntas bajo el cerebro fijo.
  test('tapping a question keeps the question and its answer on screen together', async ({
    page,
  }) => {
    await page.goto('/es');
    const ask = page.locator('#ask');
    const row = ask.getByRole('radiogroup');
    await row.scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      const r = document.querySelector('.ask__questions')!.getBoundingClientRect();
      window.scrollBy(0, r.bottom - innerHeight + 4);
    });
    const qa = corpusQA[3];
    await ask.getByRole('radio', { name: qa.question.es }).click();
    await expect(ask.locator('.ask__panel')).toHaveAttribute('data-status', 'done', {
      timeout: 15_000,
    });
    await expect(async () => {
      const stageBottom = await page
        .locator('.hero-grid__stage')
        .evaluate((el) => el.getBoundingClientRect().bottom);
      const vh = await page.evaluate(() => innerHeight);
      const pill = (await ask.getByRole('radio', { name: qa.question.es }).boundingBox())!;
      const answer = (await ask.getByTestId('ask-answer').boundingBox())!;
      expect(pill.y).toBeGreaterThanOrEqual(stageBottom - 1);
      expect(pill.y + pill.height).toBeLessThanOrEqual(vh);
      expect(answer.y).toBeGreaterThanOrEqual(stageBottom - 1);
      expect(answer.y + 48).toBeLessThanOrEqual(vh);
    }).toPass({ timeout: 3000 });
  });
});

// Sin saltos: el panel mide siempre lo que la respuesta más larga, sea cual sea la elegida.
test('the answer panel keeps its height whatever the answer', async ({ page }) => {
  await page.goto('/es');
  const ask = page.locator('#ask');
  const panel = ask.locator('.ask__panel');
  await panel.scrollIntoViewIfNeeded();
  const byLength = [...corpusQA].sort((a, b) => a.answer.es.length - b.answer.es.length);
  const heights: number[] = [];
  for (const qa of [byLength[0], byLength[byLength.length - 1], byLength[1]]) {
    await ask.getByRole('radio', { name: qa.question.es }).click();
    await expect(panel).toHaveAttribute('data-status', 'done', { timeout: 15_000 });
    heights.push((await panel.boundingBox())!.height);
  }
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
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
