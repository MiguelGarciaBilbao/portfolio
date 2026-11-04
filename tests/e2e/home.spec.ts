import { expect, test } from '@playwright/test';

const SEEKING = {
  es: {
    text: /Busco puestos de IA aplicada o de frontend senior/,
    where: 'Burgos, España · en remoto',
  },
  en: { text: /Looking for applied AI or senior frontend roles/, where: 'Burgos, Spain · remote' },
} as const;

const CTA = {
  es: { projects: 'Ver proyectos', cv: 'Descargar CV', email: 'Escribirme' },
  en: { projects: 'See projects', cv: 'Download CV', email: 'Email me' },
} as const;

for (const locale of ['es', 'en'] as const) {
  test.describe(`home /${locale}`, () => {
    test('exactly one h1 with the name', async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toContainText('Miguel García Bilbao');
    });

    test('hero shows role and three CTAs above the fold', async ({ page }) => {
      await page.goto(`/${locale}`);
      const hero = page.locator('#hero');
      await expect(hero.getByText(/Senior Software Engineer/).first()).toBeInViewport();
      for (const name of Object.values(CTA[locale])) {
        await expect(hero.getByRole('link', { name, exact: true })).toBeInViewport();
      }
    });

    // Móviles pequeños y viewports recortados por la barra de Safari / webview de LinkedIn
    for (const viewport of [
      { width: 375, height: 667 },
      { width: 360, height: 640 },
      { width: 390, height: 664 },
      { width: 320, height: 568 },
    ]) {
      test(`three CTAs above the fold at ${viewport.width}×${viewport.height}`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.goto(`/${locale}`);
        const hero = page.locator('#hero');
        for (const name of Object.values(CTA[locale])) {
          const link = hero.getByRole('link', { name, exact: true });
          await expect(link).toBeInViewport({ ratio: 1 });
        }
      });
    }

    // Lo que busca, dónde y la dirección de correo, a la vista en el primer viewport
    for (const viewport of [
      { width: 375, height: 667 },
      { width: 360, height: 640 },
      { width: 1280, height: 720 },
    ]) {
      test(`hero says what he looks for and shows the email at ${viewport.width}×${viewport.height}`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.goto(`/${locale}`);
        const hero = page.locator('#hero');
        await expect(hero.getByText(SEEKING[locale].text)).toBeInViewport({ ratio: 1 });
        await expect(hero.getByText(SEEKING[locale].where)).toBeInViewport({ ratio: 1 });
        await expect(hero.getByText('miguel99bilbao@gmail.com', { exact: true })).toBeInViewport({
          ratio: 1,
        });
        await expect(
          hero.getByRole('button', { name: locale === 'es' ? 'Copiar email' : 'Copy email' }),
        ).toBeInViewport({ ratio: 1 });
      });
    }

    test('name fits in two lines on a 375 px phone', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`/${locale}`);
      const lines = await page.locator('h1').evaluate((h) => {
        const lh = parseFloat(getComputedStyle(h).lineHeight);
        return Math.round(h.getBoundingClientRect().height / lh);
      });
      expect(lines).toBe(2);
    });

    test('experience lists three roles and expands', async ({ page }) => {
      await page.goto(`/${locale}`);
      const exp = page.locator('#experience');
      await expect(exp.locator('article')).toHaveCount(3);
      const first = exp.locator('details').first();
      await first.locator('summary').click();
      await expect(first.getByText(/RAG/).first()).toBeVisible();
    });

    test('cv button links to locale pdf', async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(
        page.locator('#hero').getByRole('link', { name: CTA[locale].cv, exact: true }),
      ).toHaveAttribute('href', `/cv/miguel-garcia-bilbao-${locale}.pdf`);
    });

    test('person JSON-LD present and parseable', async ({ page }) => {
      await page.goto(`/${locale}`);
      const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
      const data = JSON.parse(raw ?? '{}');
      expect(data['@type']).toBe('Person');
      expect(data.name).toBe('Miguel Alejandro García Bilbao');
    });

    test('no phone number in page', async ({ page }) => {
      await page.goto(`/${locale}`);
      expect(await page.content()).not.toContain('680 53');
    });

    test('education and contact sections render', async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.locator('#education')).toContainText('UAX');
      await expect(page.locator('#contact')).toContainText('miguel99bilbao@gmail.com');
    });
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('metrics render final values', async ({ page }) => {
    await page.goto('/es');
    const metrics = page.locator('#metrics');
    await expect(metrics).toContainText('−30');
    await expect(metrics).toContainText('+20');
  });
});

test('copy email shows confirmation', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/es');
  await page.locator('#contact').getByRole('button', { name: 'Copiar email' }).click();
  await expect(page.locator('#contact').getByText('Email copiado')).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'miguel99bilbao@gmail.com',
  );
});

test('hero copy email button copies the address', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/es');
  const hero = page.locator('#hero');
  await hero.getByRole('button', { name: 'Copiar email' }).click();
  await expect(hero.getByText('Email copiado')).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'miguel99bilbao@gmail.com',
  );
});

test('mobile menu closes after choosing a section', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'menú móvil');
  await page.goto('/es');
  const menu = page.locator('details.site-header__menu');
  await menu.locator('summary').click();
  await expect(menu).toHaveAttribute('open', '');
  await menu.getByRole('link', { name: 'Proyectos' }).click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(menu).not.toHaveAttribute('open');
});
