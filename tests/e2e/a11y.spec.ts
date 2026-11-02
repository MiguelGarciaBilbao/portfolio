import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const url of ['/es', '/en', '/es/proyectos/rag-esg', '/en/projects/tfm-hipoglucemia']) {
  test(`no serious or critical axe violations on ${url}`, async ({ page }) => {
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    const bad = violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
      }));
    expect(bad).toEqual([]);
  });
}
