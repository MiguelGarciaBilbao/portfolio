import zlib from 'node:zlib';
import { expect, test, type Page, type Response } from '@playwright/test';

// Umbrales re-basados con Miguel (Task 12): Next 16 + React 19 ya ocupan ~136 KB gzip, así que
// 120 KB era inalcanzable. El 3D completo (three 178 + R3F 55 + drei + escenas) mide ~256 KB.
// La puerta real de rendimiento es Lighthouse móvil ≥ 90.
const INITIAL_LIMIT_KB = 175;
const THREE_LIMIT_KB = 260;

/** gzip de cada script servido a la página, por URL. */
function collectScripts(page: Page) {
  const scripts = new Map<string, number>();
  const pending: Promise<void>[] = [];
  page.on('response', (res: Response) => {
    if (res.request().resourceType() !== 'script' || !res.ok()) return;
    pending.push(
      res
        .body()
        .then((body) => void scripts.set(res.url(), zlib.gzipSync(body).length))
        .catch(() => undefined),
    );
  });
  return { scripts, settle: () => Promise.all(pending) };
}

const kb = (bytes: number) => (bytes / 1024).toFixed(1);
const total = (m: Map<string, number>, keep: (url: string) => boolean = () => true) =>
  [...m].filter(([u]) => keep(u)).reduce((a, [, b]) => a + b, 0);

test(`initial JS < ${INITIAL_LIMIT_KB}KB and 3D JS < ${THREE_LIMIT_KB}KB gzip`, async ({
  browser,
  isMobile,
}) => {
  test.skip(isMobile, 'una medición basta');

  // 1) JS inicial: sin WebGL las escenas no se montan, así que no se pide ningún chunk 3D.
  const plain = await browser.newPage();
  await plain.addInitScript(() => {
    const proto = HTMLCanvasElement.prototype as unknown as {
      getContext: (this: HTMLCanvasElement, type: string, ...args: unknown[]) => unknown;
    };
    const original = proto.getContext;
    proto.getContext = function (type, ...args) {
      return /webgl/i.test(type) ? null : original.call(this, type, ...args);
    };
  });
  const initial = collectScripts(plain);
  await plain.goto('/es');
  await plain.waitForLoadState('networkidle');
  await initial.settle();
  console.log(
    `initial JS: ${kb(total(initial.scripts))} KB gzip in ${initial.scripts.size} scripts`,
  );
  expect(total(initial.scripts)).toBeLessThan(INITIAL_LIMIT_KB * 1024);
  await plain.close();

  // 2) JS 3D: con una GPU "real" (headless = SwiftShader), todo lo que se pide de más al montar las escenas.
  const gpu = await browser.newPage();
  await gpu.addInitScript(() => {
    for (const Ctx of [WebGLRenderingContext, WebGL2RenderingContext]) {
      const original = Ctx.prototype.getParameter;
      Ctx.prototype.getParameter = function (this: WebGLRenderingContext, p: number) {
        return p === 0x9246
          ? 'ANGLE (Apple, ANGLE Metal Renderer: Apple M1 Pro)'
          : original.call(this, p);
      } as typeof original;
    }
  });
  const withScenes = collectScripts(gpu);
  await gpu.goto('/es');
  await expect(gpu.getByTestId('brain-canvas')).toBeVisible({ timeout: 15_000 });
  for (const id of ['stack', 'rag']) {
    await gpu.getByTestId(`${id}-fallback`).scrollIntoViewIfNeeded();
    await expect(gpu.getByTestId(`${id}-canvas`)).toBeVisible({ timeout: 15_000 });
  }
  await gpu.waitForLoadState('networkidle');
  await withScenes.settle();
  // fuera también lo que llega por interacción (cursor, Lenis), que no es 3D
  const isInteraction = (u: string) => !withScenes.scripts.has(u) || initial.scripts.has(u);
  const threeBytes = total(withScenes.scripts, (u) => !isInteraction(u));
  const threeCount = [...withScenes.scripts.keys()].filter((u) => !isInteraction(u)).length;
  console.log(`3D JS: ${kb(threeBytes)} KB gzip in ${threeCount} scripts`);
  expect(threeCount).toBeGreaterThan(0);
  expect(threeBytes).toBeLessThan(THREE_LIMIT_KB * 1024);
  await gpu.close();
});
