import { expect, test } from '@playwright/test';

test('stack tabs: arrow keys change panel and panel lists tags', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard');
  await page.goto('/es');
  const stack = page.locator('#stack');
  const tabs = stack.getByRole('tab');
  await expect(tabs).toHaveCount(5);
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
  await tabs.first().focus();
  await page.keyboard.press('ArrowRight');
  const services = stack.getByRole('tab', { name: 'Servicios' });
  await expect(services).toHaveAttribute('aria-selected', 'true');
  await expect(services).toBeFocused();
  await expect(stack.getByRole('tabpanel')).toContainText('.NET / C#');
  await page.keyboard.press('ArrowLeft');
  await expect(stack.getByRole('tab', { name: 'Interfaz' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.keyboard.press('ArrowLeft'); // wraps to last
  await expect(stack.getByRole('tab', { name: 'Cloud y entrega' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('stack tab click works on touch', async ({ page }) => {
  await page.goto('/en');
  const stack = page.locator('#stack');
  await stack.getByRole('tab', { name: 'Applied AI' }).click();
  await expect(stack.getByRole('tabpanel')).toContainText('Synthetic data');
});

test('rag steps selectable and loop text visible', async ({ page }) => {
  await page.goto('/es');
  const rag = page.locator('#ai');
  await expect(rag.getByRole('tab')).toHaveCount(6);
  await expect(rag.getByRole('tab', { name: /Corpus/ })).toHaveAttribute('aria-selected', 'true');
  await rag.getByRole('tab', { name: /Respuesta con LLM/ }).click();
  await expect(rag.getByRole('tabpanel')).toContainText('Amazon Bedrock');
  await expect(rag).toContainText('Cada informe vuelve al corpus');
});

test('project cards link to localized project urls', async ({ page }) => {
  await page.goto('/en');
  const cards = page.locator('#projects').getByRole('link');
  await expect(cards).toHaveCount(3);
  await expect(cards.first()).toHaveAttribute('href', '/en/projects/rag-esg');
  await page.goto('/es');
  await expect(page.locator('#projects').getByRole('link').first()).toHaveAttribute(
    'href',
    '/es/proyectos/rag-esg',
  );
});
