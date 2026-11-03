import { expect, test } from '@playwright/test';

const PAGES = [
  { es: '/es/proyectos/rag-esg', en: '/en/projects/rag-esg' },
  { es: '/es/proyectos/tfm-hipoglucemia', en: '/en/projects/tfm-hipoglucemia' },
  { es: '/es/proyectos/web-components-oem', en: '/en/projects/web-components-oem' },
];

test('each project page renders in both locales with one h1 and breadcrumb', async ({ page }) => {
  for (const p of PAGES) {
    for (const [locale, url] of Object.entries(p)) {
      const res = await page.goto(url);
      expect(res?.status(), url).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('h1')).toHaveCount(1);
      const crumbs = page.getByRole('navigation', {
        name: locale === 'es' ? 'Migas de pan' : 'Breadcrumb',
      });
      await expect(crumbs.getByRole('link')).toHaveCount(2);
      await expect(crumbs.locator('[aria-current="page"]')).toHaveText(
        await page.locator('h1').innerText(),
      );
      await expect(page.getByTestId('project-diagram')).toBeVisible();
    }
  }
});

test('lang switch on project page keeps the project', async ({ page }) => {
  await page.goto('/es/proyectos/rag-esg');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/projects\/rag-esg$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('link', { name: 'ES', exact: true }).click();
  await expect(page).toHaveURL(/\/es\/proyectos\/rag-esg$/);
});

test('unknown slug and unknown locale return 404', async ({ request }) => {
  expect((await request.get('/es/proyectos/foo')).status()).toBe(404);
  expect((await request.get('/en/projects/foo')).status()).toBe(404);
  expect((await request.get('/fr')).status()).toBe(404);
  // rutas que no pasan por el proxy (matcher) no deben acabar en 500
  for (const path of ['/wp-login.php', '/foo.php', '/cv', '/cvfoo', '/api', '/_vercel']) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

test('lang switch hrefs are correct on a direct visit to an EN project page', async ({
  page,
  request,
}) => {
  // en el HTML del servidor (sin hidratar) y en el DOM ya hidratado
  const html = await (await request.get('/en/projects/rag-esg')).text();
  expect(html).toContain('href="/es/proyectos/rag-esg"');
  await page.goto('/en/projects/rag-esg');
  const switcher = page.locator('.lang-switch');
  await expect(switcher.getByRole('link', { name: 'ES', exact: true })).toHaveAttribute(
    'href',
    '/es/proyectos/rag-esg',
  );
  await expect(switcher.getByRole('link', { name: 'EN', exact: true })).toHaveAttribute(
    'href',
    '/en/projects/rag-esg',
  );
});

test('next project CTA cycles through projects', async ({ page }) => {
  await page.goto(PAGES[2].es);
  await page.getByRole('link', { name: /Siguiente proyecto/ }).click();
  await expect(page).toHaveURL(new RegExp(`${PAGES[0].es}$`));
  await page.getByRole('link', { name: /Siguiente proyecto/ }).click();
  await expect(page).toHaveURL(new RegExp(`${PAGES[1].es}$`));
});

test('og image responds as png', async ({ request }) => {
  for (const url of [
    '/es/opengraph-image',
    '/en/opengraph-image',
    '/es/proyectos/rag-esg/opengraph-image',
  ]) {
    const res = await request.get(url);
    expect(res.status(), url).toBe(200);
    expect(res.headers()['content-type'], url).toContain('image/png');
  }
});

test('project pages declare og:image and hreflang alternates', async ({ page, request }) => {
  await page.goto(PAGES[0].en);
  const og = page.locator('meta[property="og:image"]').first();
  await expect(og).toHaveAttribute('content', /opengraph-image/);
  // la URL emitida (no una supuesta) es la que piden los crawlers
  const url = new URL((await og.getAttribute('content'))!);
  const res = await request.get(url.pathname + url.search);
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('image/png');
  await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
    'href',
    /\/es\/proyectos\/rag-esg$/,
  );
});

test('project JSON-LD is CreativeWork with author', async ({ page }) => {
  await page.goto(PAGES[0].es);
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const data = blocks.flatMap((b) => {
    const j = JSON.parse(b);
    return Array.isArray(j) ? j : [j];
  });
  const work = data.find((d) => d['@type'] === 'CreativeWork');
  expect(work).toBeTruthy();
  expect(work.author.name).toBe('Miguel Alejandro García Bilbao');
  expect(data.some((d) => d['@type'] === 'BreadcrumbList')).toBe(true);
});

test('project page shows no phone number', async ({ page }) => {
  for (const p of PAGES) {
    await page.goto(p.es);
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/\+?34[\s-]?\d{3}/);
    expect(text).not.toMatch(/\b6\d{2}[\s-]?\d{3}[\s-]?\d{3}\b/);
  }
});
