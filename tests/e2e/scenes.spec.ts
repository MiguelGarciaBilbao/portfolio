import { expect, test, type Page } from '@playwright/test';
import { corpusQA } from '../../src/content/corpus';

function trackConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

async function disableWebGL(page: Page) {
  await page.addInitScript(() => {
    const proto = HTMLCanvasElement.prototype as unknown as {
      getContext: (this: HTMLCanvasElement, type: string, ...args: unknown[]) => unknown;
    };
    const original = proto.getContext;
    proto.getContext = function (type, ...args) {
      if (/webgl/i.test(type)) return null;
      return original.call(this, type, ...args);
    };
  });
}

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
  });
}

test('brain canvas mounts on desktop', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop');
  const errors = trackConsoleErrors(page);
  await page.goto('/es');
  await expect(page.getByTestId('brain-canvas')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('brain-canvas').locator('canvas')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('webgl unavailable → fallback, no console errors', async ({ page }) => {
  await disableWebGL(page);
  const errors = trackConsoleErrors(page);
  await page.goto('/es');
  await scrollThrough(page);
  await page.waitForTimeout(800);
  for (const id of ['brain', 'stack', 'rag']) {
    await expect(page.getByTestId(`${id}-fallback`)).toBeVisible();
    await expect(page.getByTestId(`${id}-canvas`)).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('fallback only', async ({ page }) => {
    await page.goto('/es');
    await page.waitForTimeout(1500);
    await expect(page.getByTestId('brain-fallback')).toBeVisible();
    await expect(page.getByTestId('brain-canvas')).toHaveCount(0);
  });
});

test('answering a question highlights nodes in fallback', async ({ page }) => {
  await disableWebGL(page);
  await page.goto('/es');
  const qa = corpusQA.find((q) => q.id === 'cloud')!;
  await page.locator('#ask').getByRole('radio', { name: qa.question.es }).click();
  await expect(page.getByTestId('brain-fallback').locator('[data-active="true"]')).toHaveCount(
    qa.sources.length,
  );
});

test('canvas is aria-hidden', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop');
  await page.goto('/es');
  await expect(page.getByTestId('brain-canvas')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('brain-canvas')).toHaveAttribute('aria-hidden', 'true');
});

test('stack and rag canvases mount when scrolled into view', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop');
  const errors = trackConsoleErrors(page);
  await page.goto('/es');
  for (const id of ['stack', 'rag']) {
    await page.getByTestId(`${id}-fallback`).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(`${id}-canvas`)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId(`${id}-canvas`)).toHaveAttribute('aria-hidden', 'true');
  }
  expect(errors).toEqual([]);
});

test('selecting a stack tab updates the active slab in the fallback', async ({ page }) => {
  await disableWebGL(page);
  await page.goto('/es');
  const stack = page.locator('#stack');
  const fallback = page.getByTestId('stack-fallback');
  await expect(fallback.locator('[data-active="true"]')).toHaveAttribute('data-layer', 'ui');
  await stack.getByRole('tab', { name: 'Datos' }).click();
  await expect(fallback.locator('[data-active="true"]')).toHaveAttribute('data-layer', 'data');
});

test('selecting a rag step updates the active block in the fallback', async ({ page }) => {
  await disableWebGL(page);
  await page.goto('/es');
  const fallback = page.getByTestId('rag-fallback');
  await expect(fallback.locator('[data-active="true"]')).toHaveAttribute('data-step', 'corpus');
  await page.locator('#ai').getByRole('tab', { name: /Capa vectorial/ }).click();
  await expect(fallback.locator('[data-active="true"]')).toHaveAttribute('data-step', 'vector');
});

test('scene fallbacks fill their stage (no collapsed boxes)', async ({ page }) => {
  await disableWebGL(page);
  await page.goto('/es');
  for (const id of ['brain', 'stack', 'rag']) {
    const box = await page.getByTestId(`${id}-fallback`).boundingBox();
    expect(box, id).not.toBeNull();
    expect(box!.height, `${id} height`).toBeGreaterThan(300);
    expect(box!.width, `${id} width`).toBeGreaterThan(300);
  }
});
