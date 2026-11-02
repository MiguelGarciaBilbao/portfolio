# Portfolio Miguel García Bilbao — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un portfolio bilingüe ES/EN en Next.js 16 con estética "Aurora boreal": un cerebro-corpus 3D, "Pregúntale a mi corpus" (con respuestas ya escritas), un despiece isométrico del stack, el pipeline RAG y tres páginas de proyecto. Todo optimizado para SEO y listo para Vercel.

**Architecture:** App Router con SSG para todas las rutas, next-intl con pathnames localizados y un `proxy.ts`. El contenido tipado vive en `src/content/` como única fuente de verdad. Las secciones son Server Components que renderizan todo el texto y montan las escenas R3F como islas de cliente, con carga diferida y fallback SVG pregenerado. Las escenas reciben datos solo por props.

**Tech Stack:** next@16.4, react@19.3, TypeScript strict, tailwindcss@4.3, next-intl@4.14, three@0.187, @react-three/fiber@9.8, @react-three/drei@10.7, @react-three/postprocessing@3.2, motion@14, lenis@1.3, vitest@4, @playwright/test@1.64, @axe-core/playwright@4.14.

**Spec:** `docs/superpowers/specs/2026-11-02-portfolio-design.md`. Léelo entero antes de empezar; las referencias "§N" apuntan a sus secciones.

## Global Constraints

- **Gestor de paquetes:** npm. Node 24.
- **Directorio del proyecto:** la raíz `/Users/miguelgarcia/proyectos/portfolio`. Usa alias `@/*` para `src/*`.
- **Locales:** `['es', 'en']`, con `es` por defecto. Las rutas de proyecto son `/es/proyectos/[slug]` y `/en/projects/[slug]`.
- **Slugs:** `rag-esg`, `tfm-hipoglucemia`, `web-components-oem`.
- **IDs de ancla de la home** (iguales en los dos idiomas): `hero`, `ask`, `metrics`, `stack`, `ai`, `projects`, `experience`, `education`, `contact`.
- **Colores:**

  | Token | Valor |
  |---|---|
  | `--bg` | `#05070f` |
  | `--bg-2` | `#0b1020` |
  | `--ink` | `#E8F1FF` |
  | `--muted` | `#8A9BB8` |
  | `--line` | `rgba(232,241,255,.12)` |
  | `--mint` | `#2EF5B0` |
  | `--cyan` | `#26C6FF` |
  | `--violet` | `#8B5CF6` |
  | Texto sobre el degradado CTA | `#04121a` |

- **Fuentes:** Archivo, variable con eje `wdth`, y JetBrains Mono, ambas con `next/font/google`.
- **Colores por categoría:** frontend → mint, backend → cyan, ai → violet, product → ink.
- **No inventar datos.** Todo texto con significado sale de `docs/CV_Miguel_Garcia_Bilbao_2026_v2.pdf` (ES), de `docs/CV_Miguel_Garcia_Bilbao_2026_EN.pdf` (EN) o de `docs/portfolio_miguel_garcia_bilbao.html`. Sin cifras, tecnologías ni logros que no estén ahí.
- **No publicar** el teléfono en la web.
- **Contenido:** el que tiene significado vive solo en `src/content/*.ts` como `Localized<T>`. `messages/*.json` es solo para la microcopy de la UI.
- **Escenas 3D:** en `src/components/three/` no se importa `next-intl` ni `@/content`. Los datos llegan solo por props.
- **Fallback:** toda escena tiene un fallback estático con el mismo layout. Sus `<canvas>` llevan `aria-hidden="true"`.
- **URL del sitio:** `NEXT_PUBLIC_SITE_URL`, con `http://localhost:3000` por defecto.
- **Niveles de calidad:**

  | Nivel | Partículas | DPR | Bloom |
  |---|---|---|---|
  | high | 5000 | 2 | sí |
  | medium | 3000 | 1,5 | sí |
  | low | 1500 | 1 | no |

- **Presupuesto de JS** antes de que se carguen las escenas: < 120 KB gzip. Chunk 3D: < 220 KB gzip. Si se supera, **para e informa**; no relajes el límite.
- **Commits:** frecuentes, en formato Conventional Commits y terminando con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Cambio de idioma en una página de proyecto.** Desde `/es/proyectos/rag-esg`, el LangSwitch debe llevar a `/en/projects/rag-esg`, no a un 404 ni a la home. El test va en la Task 11.
2. **Slug o locale desconocidos.** `/es/proyectos/foo` y `/fr` deben devolver 404, sin error 500. El test va en la Task 11.
3. **Clics rápidos en "Pregúntale a mi corpus".** Si se elige otra pregunta mientras la anterior aún se escribe, solo debe mostrarse la última respuesta completa y sus fuentes, sin mezclar texto. Los tests van en la Task 8 (reducer) y en la Task 8 (E2E).
4. **WebGL no disponible.** Si `getContext('webgl2'|'webgl')` devuelve `null`, se muestra el fallback SVG de las tres escenas, sin crash ni errores en consola. El test va en la Task 9.
5. **Puntero táctil.** En móvil emulado no se monta el canvas del cursor de estrellas y el cursor nativo no se oculta. El test va en la Task 4.

---

## File Structure

```
.claude/settings.json            T1  plugins + permisos del proyecto
CLAUDE.md                        T1  reglas y comandos
.gitignore, .prettierrc          T1
vitest.config.ts                 T1
playwright.config.ts             T1
public/cv/miguel-garcia-bilbao-{es,en}.pdf   T1
messages/{es,en}.json            T3
src/i18n/routing.ts              T3  defineRouting + pathnames
src/i18n/navigation.ts           T3  createNavigation(routing)
src/i18n/request.ts              T3  getRequestConfig
src/proxy.ts                     T3
src/app/layout.tsx               T3  root mínimo (devuelve children)
src/app/not-found.tsx            T3
src/app/[locale]/layout.tsx      T3  html/body, fuentes, providers, Header, FX
src/app/[locale]/page.tsx        T7  compone la home
src/app/[locale]/proyectos/[slug]/page.tsx              T11
src/app/[locale]/opengraph-image.tsx                    T11
src/app/[locale]/proyectos/[slug]/opengraph-image.tsx   T11
src/app/sitemap.ts, src/app/robots.ts                   T5
src/app/globals.css              T4  @theme tokens, base, foco
src/content/types.ts             T2
src/content/{profile,experience,education,stack,metrics,projects,rag}.ts  T2
src/content/corpus.ts            T2b
src/lib/site.ts                  T5  siteUrl()
src/lib/seo.ts                   T5
src/lib/motion.ts                T4  classifyGpu, QUALITY, hooks
src/lib/brain-geometry.ts        T6
src/lib/ask-reducer.ts           T8
src/components/ui/{Header,LangSwitch,SkipLink,Button,Chip,JsonLd}.tsx  T3/T5/T7
src/components/fx/{Aurora,StarCursor,SmoothScroll,Reveal,CountUp}.tsx  T4
src/components/sections/{Hero,Metrics,Experience,Education,Contact}.tsx T7
src/components/sections/{StackSection,RagSection,Projects}.tsx         T7b
src/components/sections/AskCorpus.tsx, src/components/corpus/CorpusProvider.tsx  T8
src/components/three/SceneCanvas.tsx, BrainCorpus.tsx, BrainFallback.tsx        T9
src/components/three/{IsoStack,IsoStackFallback,RagPipeline,RagPipelineFallback}.tsx  T10
src/components/projects/{ProjectDiagram,ProjectArt}.tsx                 T7b/T11
tests/unit/*.test.ts, tests/e2e/*.spec.ts
```

---

### Task 1: Scaffold, herramientas y configuración de Claude

**Files:**
- Create: everything create-next-app genera, `.claude/settings.json`, `CLAUDE.md`, `.gitignore`, `.prettierrc`, `vitest.config.ts`, `playwright.config.ts`, `tests/unit/sanity.test.ts`, `tests/e2e/smoke.spec.ts`, `public/cv/*.pdf`

**Interfaces:**
- Produces:
  - Scripts npm: `dev`, `build`, `start` (con `-p 3100`), `lint`, `typecheck` (`tsc --noEmit`), `test` (`vitest run`), `test:e2e` (`playwright test`), `format`.
  - Playwright `baseURL: http://localhost:3100`, con `webServer: npm run build && npm run start`.
  - Proyectos de Playwright: `chromium` y `mobile` (dispositivo `Pixel 7`).

- [ ] **Step 1: Generar el proyecto en el scratchpad y moverlo a la raíz**

  `create-next-app` rechaza un directorio no vacío, porque `docs/` y `.superpowers/` ya están en la raíz.

  Run:
  `npx create-next-app@16.4.4 <scratchpad>/scaffold --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --turbopack --no-git --yes`

  Después, copia el contenido a la raíz con `rsync -a --exclude node_modules <scratchpad>/scaffold/ ./` y ejecuta `npm install`.

  Expected: `package.json` en la raíz con `next@16.4.x`, `react@19.3.x` y `tailwindcss@4.x`.

- [ ] **Step 2: Instalar las dependencias**

  ```
  npm i next-intl@^4.14 three@^0.187 @react-three/fiber@^9.8 @react-three/drei@^10.7 @react-three/postprocessing@^3.2 motion@^14 lenis@^1.3
  npm i -D @types/three vitest@^4 @vitejs/plugin-react jsdom @testing-library/react @playwright/test@^1.64 @axe-core/playwright prettier
  npx playwright install chromium
  ```

- [ ] **Step 3: Configurar las herramientas**

  - **`vitest.config.ts`:**
    - `environment: 'node'`, con `jsdom` por archivo mediante comentario.
    - `include: ['tests/unit/**/*.test.{ts,tsx}']`.
    - Alias `@` → `src`.
  - **`playwright.config.ts`:** como se indica en Interfaces.
  - **`.gitignore`:** añade `.superpowers/`, `.DS_Store`, `.env*.local`, `playwright-report/` y `test-results/`.
  - **`tsconfig`:** `strict: true`.
  - **Los CV:** copia `docs/CV_Miguel_Garcia_Bilbao_2026_v2.pdf` → `public/cv/miguel-garcia-bilbao-es.pdf` y `docs/CV_Miguel_Garcia_Bilbao_2026_EN.pdf` → `public/cv/miguel-garcia-bilbao-en.pdf`.

- [ ] **Step 4: Configurar Claude en el proyecto**

  - **`.claude/settings.json`:**
    ```json
    {
      "enabledPlugins": {
        "frontend-design@claude-plugins-official": true,
        "typescript-lsp@claude-plugins-official": true
      },
      "permissions": {
        "allow": ["Bash(npm run:*)", "Bash(npx vitest:*)", "Bash(npx playwright:*)", "Bash(git status:*)", "Bash(git diff:*)", "Bash(git log:*)"]
      }
    }
    ```
  - **`typescript-language-server`:** si `which typescript-language-server` no devuelve nada, ejecuta `npm i -g typescript-language-server typescript`. Lo pide el README del plugin.
  - **`CLAUDE.md`:**
    - Los comandos npm.
    - El mapa de §3.2 del spec.
    - Las reglas de Global Constraints (no inventar datos, contenido solo en `src/content/`, las escenas no importan el contenido, todo fallback obligatorio, presupuesto de JS).
    - Una línea indicando que el spec y el plan viven en `docs/superpowers/`.

- [ ] **Step 5: Escribir los tests de humo**

  - `tests/unit/sanity.test.ts`: `expect(1 + 1).toBe(2)`.
  - `tests/e2e/smoke.spec.ts`: `test('cv pdfs are served')`. Por cada locale, comprueba que `request.get('/cv/miguel-garcia-bilbao-<locale>.pdf')` responde 200 y que `content-type` contiene `application/pdf`.

- [ ] **Step 6: Verificar**

  Run: `npm run lint && npm run typecheck && npm test && npm run test:e2e -- --project=chromium`

  Expected: todo PASS.

- [ ] **Step 7: Commit**

  ```bash
  git init -b main && git add -A && git commit -m "chore: scaffold Next.js 16 portfolio with tooling and Claude config"
  ```

  Incluye `docs/` (el spec y el plan).

---

### Task 2: Modelo de contenido (perfil, experiencia, formación, stack, métricas, proyectos, RAG)

**Files:**
- Create: `src/content/types.ts`, `profile.ts`, `experience.ts`, `education.ts`, `stack.ts`, `metrics.ts`, `projects.ts`, `rag.ts`
- Test: `tests/unit/content.integrity.test.ts`

**Interfaces:**
- Produces (`types.ts`):
  ```ts
  export type Locale = 'es' | 'en';
  export const LOCALES: readonly Locale[] = ['es', 'en'];
  export type Localized<T> = Record<Locale, T>;
  export type Category = 'frontend' | 'backend' | 'ai' | 'product';
  export type SectionId = 'hero'|'ask'|'metrics'|'stack'|'ai'|'projects'|'experience'|'education'|'contact';
  export type ProjectSlug = 'rag-esg' | 'tfm-hipoglucemia' | 'web-components-oem';
  ```
- **`profile.ts`:** `profile: { name: string; fullName: string; role: Localized<string>; lead: Localized<string>; body: Localized<string>; email: string; linkedin: string; github: string; location: Localized<string>; status: Localized<string[]>; lookingFor: Localized<string>; cv: Localized<string> }`. Las rutas de `cv` son `/cv/miguel-garcia-bilbao-es.pdf` y `/cv/miguel-garcia-bilbao-en.pdf`.
- **`experience.ts`:** `experience: { id: string; period: Localized<string>; title: Localized<string>; org: string; place: Localized<string>; groups: { heading?: Localized<string>; bullets: Localized<string[]> }[] }[]`. Va en orden cronológico inverso; los ids son `nettrim`, `softeca-lead` y `softeca-graduate`.
- **`education.ts`:** `education: { id: string; title: Localized<string>; org: string; period: Localized<string>; detail?: Localized<string> }[]` y `languages: Localized<string>`.
- **`stack.ts`:** `stackLayers: { id: 'ui'|'svc'|'ai'|'data'|'cloud'; category: Category; name: Localized<string>; what: Localized<string>; tags: string[]; used: Localized<string[]> }[]`. Son 5 capas en este orden; `ui`, `svc` y `ai` se copian del array `LAYERS` del HTML de referencia, y `data` y `cloud` salen de "Habilidades técnicas" del CV.
- **`metrics.ts`:** `metrics: { id: 'years'|'team'|'incidents'|'legacyModules'|'phpModules'; value: number; prefix?: string; suffix: Localized<string>; label: Localized<string> }[]`.
- **`projects.ts`:** `projects: Project[]` y `getProject(slug: string): Project | undefined`. Usa la interfaz `Project` de §7.1 del spec, más `cardLine: Localized<string>`.
- **`rag.ts`:** `ragSteps: { id: 'sources'|'corpus'|'embeddings'|'vector'|'llm'|'reports'; label: Localized<string>; detail: Localized<string> }[]`, con el texto de §5.05 del spec y del HTML.

- [ ] **Step 1: Escribir los tests que deben fallar**

  `tests/unit/content.integrity.test.ts`:
  - `'metrics match the CV exactly'`: `metrics.map(m => [m.id, m.value, m.prefix ?? ''])` es igual a `[['years',5,''],['team',5,''],['incidents',30,'−'],['legacyModules',8,''],['phpModules',20,'+']]`.
  - `'every localized string is non-empty in both locales'`: recorre todos los exports de `src/content` y, en cada objeto con las claves `es` y `en`, ambas no están vacías (si son arrays, tienen la misma longitud y no tienen strings vacíos).
  - `'project slugs are the three spec slugs'`: `projects.map(p => p.slug).sort()` es igual a `['rag-esg','tfm-hipoglucemia','web-components-oem']`.
  - `'getProject returns undefined for unknown slug'`: `getProject('foo') === undefined`.
  - `'no phone number in content'`: `JSON.stringify` de todos los exports no contiene `680` ni `+34`.
  - `'stack has 5 layers in order'`: los ids son `['ui','svc','ai','data','cloud']`.

- [ ] **Step 2: Ejecutar los tests**

  Run: `npx vitest run tests/unit/content.integrity.test.ts`

  Expected: FAIL (los módulos no existen).

- [ ] **Step 3: Escribir los archivos de contenido**

  El texto ES/EN de experiencia, perfil y contacto se toma literalmente del HTML de referencia, que ya tiene ambas versiones. Lo que solo está en un CV se toma de ese CV y del otro.

  Proyectos: cada uno tiene 4–5 `sections` (Contexto · Qué hice · Arquitectura · Stack · Resultados), solo con los hechos de la tabla de §6 del spec. Si no hay datos para "Resultados" o "Qué aprendí", **omite** la sección; no la rellenes.

- [ ] **Step 4: Ejecutar los tests**

  Run: `npx vitest run tests/unit/content.integrity.test.ts`

  Expected: PASS.

- [ ] **Step 5: Commit**

  `git commit -m "feat(content): typed bilingual content model from CV"`

---

### Task 2b: Corpus (nodos del cerebro y preguntas y respuestas)

**Files:**
- Create: `src/content/corpus.ts`
- Modify: `tests/unit/content.integrity.test.ts`

**Interfaces:**
- Consumes: `Category`, `Localized`, `SectionId` y `ProjectSlug` de la Task 2.
- Produces:
  ```ts
  export interface CorpusNode { id: string; category: Category; title: Localized<string>;
    href: { section: SectionId } | { project: ProjectSlug }; source: 'cv' | 'project' | 'education' }
  export interface CorpusQA { id: string; question: Localized<string>; answer: Localized<string>; sources: string[] }
  export const corpusNodes: CorpusNode[];
  export const corpusQA: CorpusQA[];
  ```

- [ ] **Step 1: Añadir los tests que deben fallar**

  En `content.integrity.test.ts`:
  - `'corpus has ~60 nodes with spec distribution'`:
    - El total está entre 56 y 64.
    - Recuento por categoría, con ±2 sobre {frontend 16, backend 16, ai 16, product 12}.
    - Los ids son únicos y cumplen `/^(frontend|backend|ai|product)-[a-z0-9-]+$/`.
    - Cada id empieza por su `category`.
  - `'qa ids are the nine spec questions'`: los ids son `['ai-production','cloud','leadership','angular','legacy','backend','clients','studying','looking-for']`.
  - `'every qa source exists and count is 2..5'`.
  - `'every project slug has at least one node'`.

- [ ] **Step 2: Ejecutar los tests**

  Run: `npx vitest run tests/unit/content.integrity.test.ts`

  Expected: FAIL.

- [ ] **Step 3: Escribir `corpus.ts`**

  - **Nodos:** uno por bullet del CV, por habilidad agrupada, por proyecto y por formación (§7.3 del spec).
  - **Respuestas:** 2–4 frases en primera persona ("He…"), construidas solo con hechos de sus `sources`. Las preguntas son las de la tabla de §7.2 del spec. La respuesta a `looking-for` usa `profile.lookingFor`.

- [ ] **Step 4: Ejecutar los tests**

  Run: `npx vitest run tests/unit/content.integrity.test.ts`

  Expected: PASS.

- [ ] **Step 5: Commit**

  `git commit -m "feat(content): brain corpus nodes and scripted Q&A"`

---

### Task 3: i18n, routing, layout base y Header

**Files:**
- Create: `messages/es.json`, `messages/en.json`, `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/i18n/request.ts`, `src/proxy.ts`, `src/app/[locale]/layout.tsx`, `src/app/not-found.tsx`, `src/components/ui/{Header,LangSwitch,SkipLink}.tsx`
- Modify: `next.config.ts` (plugin `createNextIntlPlugin('./src/i18n/request.ts')`), `src/app/layout.tsx` (root que solo devuelve `children`), mover `src/app/page.tsx` → borrar
- Test: `tests/unit/messages.parity.test.ts`, `tests/e2e/i18n.spec.ts`

**Interfaces:**
- Produces:
  ```ts
  // routing.ts
  export const routing = defineRouting({
    locales: ['es', 'en'], defaultLocale: 'es',
    pathnames: { '/': '/', '/proyectos/[slug]': { es: '/proyectos/[slug]', en: '/projects/[slug]' } }
  });
  // navigation.ts
  export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
  ```
  - `proxy.ts`: `export default createMiddleware(routing)`, con matcher `'/((?!api|_next|_vercel|cv|.*\\..*).*)'`.
  - `[locale]/layout.tsx`:
    - Exporta `generateStaticParams` (los locales) y llama a `setRequestLocale`.
    - Si el locale no es válido, llama a `notFound()`.
    - `<html lang={locale}>`.
    - Las fuentes se exponen como variables CSS `--font-archivo` y `--font-mono`.
  - `messages/*.json`, claves de primer nivel: `nav`, `hero`, `ask`, `metrics`, `stack`, `rag`, `projects`, `experience`, `education`, `contact`, `common`.
  - `Header`:
    - Navegación a `#stack`, `#ai`, `#projects`, `#experience` y `#contact`.
    - Botón de CV con `profile.cv[locale]`.
    - En móvil (< 768 px), la navegación va en un `<details>` con un botón accesible.
  - `LangSwitch`: cliente. Usa `usePathname()` y `useParams()` de next-intl y `router.replace({ pathname, params }, { locale: other })`.

- [ ] **Step 1: Escribir los tests que deben fallar**

  - `messages.parity.test.ts`: `'es and en have identical key sets'`, con un aplanado recursivo de las claves.
  - `i18n.spec.ts`:
    - `'/ redirects to /es by default'`.
    - `'/ redirects to /en with Accept-Language en'`: con `test.use({ locale: 'en-US' })`.
    - `'html lang matches locale'`.
    - `'lang switch on home goes to /en and back'`.
    - `'skip link focuses main'`: Tab, Enter y luego `#main` enfocado.

- [ ] **Step 2: Ejecutar los tests**

  Run: `npx vitest run tests/unit/messages.parity.test.ts && npm run test:e2e -- i18n --project=chromium`

  Expected: FAIL.

- [ ] **Step 3: Implementar**

  Implementa routing, proxy, request config, el layout y el Header. Usa un `page.tsx` provisional en `[locale]` con `<main id="main"><h1>{profile.name}</h1></main>`.

- [ ] **Step 4: Ejecutar los tests**

  Run: el mismo comando del Step 2.

  Expected: PASS.

- [ ] **Step 5: Commit**

  `git commit -m "feat(i18n): next-intl routing with localized pathnames, proxy, header and lang switch"`

---

### Task 4: Sistema visual y efectos globales

**Files:**
- Create: `src/app/globals.css` (sustituye al del scaffold), `src/lib/motion.ts`, `src/components/fx/{Aurora,StarCursor,SmoothScroll,Reveal,CountUp}.tsx`
- Modify: `src/app/[locale]/layout.tsx` (monta `Aurora`, `StarCursor` y `SmoothScroll`)
- Test: `tests/unit/motion.test.ts`, `tests/e2e/fx.spec.ts`

**Interfaces:**
- Produces (`motion.ts`):
  ```ts
  export type Tier = 'low' | 'medium' | 'high';
  export const QUALITY: Record<Tier, { particles: number; dpr: number; bloom: boolean }>; // valores de Global Constraints
  export function classifyGpu(i: { cores?: number; memoryGb?: number; renderer?: string }): Tier;
  export function downgrade(t: Tier): Tier;          // high→medium→low→low
  export function useReducedMotion(): boolean;        // matchMedia('(prefers-reduced-motion: reduce)'), SSR=false
  export function useCoarsePointer(): boolean;        // matchMedia('(pointer: coarse)')
  ```
  - `Reveal`: `({ children, delay?: number, as?: 'div'|'section'|'li' })`. Usa Motion `whileInView`, `once`, `y: 16 → 0` y `opacity`. Con "reducir movimiento" no anima.
  - `CountUp`: `({ value: number, prefix?: string, suffix?: string })`. Renderiza el valor final en el SSR (para el SEO y sin JS) y anima de 0 a `value` al entrar en pantalla, salvo con "reducir movimiento".
  - `StarCursor`: el canvas lleva `data-testid="star-cursor"`. No se monta si `useCoarsePointer() || useReducedMotion()`.
  - Clases de utilidad en `globals.css`:
    - `@theme` con todos los tokens de Global Constraints, más `--font-sans: var(--font-archivo)` y `--font-mono`.
    - `.display`: `font-stretch: 118%`, peso 780 y `letter-spacing: -0.035em`.
    - `.cta-gradient`.
    - `:focus-visible`: outline de 2 px en mint con offset de 3 px.
    - `html { scroll-padding-top: 72px }`.

- [ ] **Step 1: Escribir los tests que deben fallar**

  `motion.test.ts`:
  - `classifyGpu({ renderer: 'Google SwiftShader' })` es `'low'`.
  - `classifyGpu({ cores: 4, memoryGb: 8 })` es `'low'`.
  - `classifyGpu({ cores: 8, memoryGb: 8 })` es `'medium'`.
  - `classifyGpu({ cores: 12, memoryGb: 16, renderer: 'Apple M2' })` es `'high'`.
  - `classifyGpu({})` es `'medium'`.
  - `downgrade('low')` es `'low'`.
  - `QUALITY.low` es igual a `{ particles: 1500, dpr: 1, bloom: false }`.

  `fx.spec.ts`:
  - `'star cursor mounts on desktop'`: en `chromium`, `[data-testid=star-cursor]` está en el DOM.
  - `'no star cursor on touch'` (Review Focus 5): en `mobile`, el elemento tiene count 0, y `getComputedStyle(document.body).cursor` no es `'none'`.
  - `'no star cursor with reduced motion'`.

- [ ] **Step 2: Ejecutar los tests**

  Run: `npx vitest run tests/unit/motion.test.ts && npm run test:e2e -- fx`

  Expected: FAIL.

- [ ] **Step 3: Implementar**

  - **`classifyGpu`, reglas en orden:**
    1. Si `renderer` coincide con `/swiftshader|llvmpipe|software|mali-4|adreno \(tm\) 3/i`, devuelve `low`.
    2. Si `cores ≤ 4` o `memoryGb ≤ 4`, devuelve `low`.
    3. Si `cores ≥ 10` y `memoryGb ≥ 8` (cuando falte `memoryGb`, trátalo como 8), devuelve `high`.
    4. Si los datos no bastan para decidir, devuelve `medium`. Es el caso de `{}` y de `{ cores: 8, memoryGb: 8 }`.
  - **`StarCursor`:**
    - Pool fijo de 60 partículas.
    - Cada estrella dura 700 ms, con un tamaño de 2–6 px y deriva aleatoria.
    - Se dibuja con `requestAnimationFrame` y se detiene cuando no hay partículas vivas.
    - El punto (6 px) y el anillo (28 px) son elementos DOM movidos con `transform`; el anillo escala ×1,6 sobre `a, button, [data-cursor]`.
    - El cursor nativo se oculta solo con la clase `.has-star-cursor` en `<html>`, y `input, textarea, select { cursor: auto }`.
  - **`Aurora`:** cuatro `div` con degradados radiales en mint, cyan y violet, `filter: blur(60px)` y `@keyframes` de 24–40 s que animan `transform`. Encima van un SVG de estrellas estático, con 120 puntos de semilla fija, y un SVG de grano con opacidad 0,04. Con `prefers-reduced-motion`, `animation: none`.
  - **`SmoothScroll`:** Lenis con `lerp: 0.1`; no se inicializa con "reducir movimiento" ni con puntero táctil.

- [ ] **Step 4: Ejecutar los tests**

  Run: el mismo comando del Step 2.

  Expected: PASS.

- [ ] **Step 5: Commit**

  `git commit -m "feat(fx): aurora tokens, star cursor, smooth scroll, reveal and count-up"`

---

### Task 5: SEO (metadatos, JSON-LD, sitemap, robots)

**Files:**
- Create: `src/lib/site.ts`, `src/lib/seo.ts`, `src/components/ui/JsonLd.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`
- Modify: `src/app/[locale]/layout.tsx` (`metadataBase`) y la página provisional (`generateMetadata`)
- Test: `tests/unit/seo.test.ts`

**Interfaces:**
- Consumes: `getPathname` (T3); `profile`, `education`, `experience` y `projects` (T2).
- Produces:
  ```ts
  export function siteUrl(): string; // NEXT_PUBLIC_SITE_URL sin barra final, default 'http://localhost:3000'
  export type AppHref = { pathname: '/' } | { pathname: '/proyectos/[slug]'; params: { slug: ProjectSlug } };
  export function alternatesFor(href: AppHref, locale: Locale): { canonical: string; languages: Record<'es'|'en'|'x-default', string> };
  export function buildMetadata(a: { locale: Locale; href: AppHref; title: string; description: string }): Metadata;
  export function personJsonLd(locale: Locale): Record<string, unknown>;
  export function projectJsonLd(slug: ProjectSlug, locale: Locale): Record<string, unknown>[]; // [CreativeWork, BreadcrumbList]
  export function JsonLd({ data }: { data: object | object[] }): JSX.Element; // <script type="application/ld+json">, escapa '<' como <
  ```

- [ ] **Step 1: Escribir los tests que deben fallar**

  `seo.test.ts`, con `vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.dev/')`:
  - `alternatesFor({pathname:'/proyectos/[slug]', params:{slug:'rag-esg'}}, 'en')` devuelve `{ canonical: 'https://example.dev/en/projects/rag-esg', languages: { es: 'https://example.dev/es/proyectos/rag-esg', en: 'https://example.dev/en/projects/rag-esg', 'x-default': 'https://example.dev/es/proyectos/rag-esg' } }`.
  - `alternatesFor({pathname:'/'}, 'es').canonical` es `'https://example.dev/es'`.
  - `personJsonLd('es')`:
    - Coincide con `{ '@context': 'https://schema.org', '@type': 'Person', name: 'Miguel Alejandro García Bilbao' }`.
    - `sameAs` contiene `profile.linkedin` y `profile.github`.
    - `alumniOf` tiene longitud 2.
    - `worksFor.name` es `'nettrim technology'`.
    - No tiene la propiedad `telephone`.
  - `projectJsonLd('tfm-hipoglucemia','en')[1].itemListElement` tiene longitud 3 (Home › Projects › Title).
  - `buildMetadata(...).openGraph.locale` es `'es_ES'` o `'en_GB'`.
  - `sitemap()`: 8 entradas (2 de la home y 6 de proyectos), y cada una tiene `alternates.languages` con `es` y `en`.

- [ ] **Step 2: Ejecutar los tests**

  Run: `npx vitest run tests/unit/seo.test.ts`

  Expected: FAIL.

- [ ] **Step 3: Implementar**

  - **Títulos de la home:** los de §8 del spec.
  - **Descripciones:** derivadas de `profile.lead` (≤ 160 caracteres).
  - **Twitter:** `twitter.card: 'summary_large_image'`.
  - **`robots.ts`:** `{ rules: [{ userAgent: '*', allow: '/' }], sitemap: siteUrl() + '/sitemap.xml' }`.

- [ ] **Step 4: Ejecutar los tests**

  Run: el mismo comando del Step 2.

  Expected: PASS.

- [ ] **Step 5: Commit**

  `git commit -m "feat(seo): metadata, hreflang alternates, JSON-LD, sitemap and robots"`

---

### Task 6: Generador de geometría del cerebro (función pura)

**Files:**
- Create: `src/lib/brain-geometry.ts`
- Test: `tests/unit/brain-geometry.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface BrainInputNode { id: string; category: Category }
  export interface BrainGeometry {
    particles: Float32Array;                       // xyz intercalado, length = particleCount*3
    nodes: { id: string; category: Category; position: [number, number, number] }[];
    edges: [number, number][];                     // índices en nodes, i<j, sin duplicados
  }
  export function mulberry32(seed: number): () => number;
  export function insideBrain(x: number, y: number, z: number): boolean;
  export function generateBrain(o: { seed: number; particleCount: number; nodes: BrainInputNode[]; k?: number /*=3*/ }): BrainGeometry;
  export const LOBES: Record<Category, [number, number, number]>;
  export const BRAIN_SEED = 1499;
  ```

- [ ] **Step 1: Escribir los tests que deben fallar**

  - `'deterministic'`: dos llamadas con `seed: 1499` dan `particles` y `nodes` iguales con `toEqual`; con `seed: 2` dan `particles` distintos.
  - `'all particles and nodes are inside the brain'`: `insideBrain` es true para cada xyz.
  - `'particle count honoured'`: `particles.length === 3000 * 3`.
  - `'nodes cluster by category'`: para cada nodo, la distancia al centroide de su categoría es menor que la distancia al de cualquier otra categoría, en al menos el 85 % de los nodos.
  - `'edges bounded and valid'`: `nodes.length ≤ edges.length ≤ 3 * nodes.length`; todos cumplen `i < j < nodes.length` y no hay pares duplicados.
  - `'insideBrain excludes the fissure'`: `insideBrain(0, 0.3, 0)` es false e `insideBrain(0.55, 0, 0)` es true.

- [ ] **Step 2: Ejecutar los tests**

  Run: `npx vitest run tests/unit/brain-geometry.test.ts`

  Expected: FAIL.

- [ ] **Step 3: Implementar**

  Los tests no determinan la forma, así que esta es la geometría:
  - **Hemisferios:** dos elipsoides con centro `(±0.55, 0, 0)` y radios `(0.85, 0.7, 1.0)`. Deforma la superficie con `r * (1 + 0.06*sin(7x)*sin(6y)*sin(5z))` para insinuar circunvoluciones.
  - **Cisura:** excluye `|x| < 0.05` cuando `y > -0.35`.
  - **Tronco:** cilindro vertical de radio 0,18 con centro `(0, -0.75, -0.25)` y altura de `-1.2` a `-0.4` en y.
  - **Partículas:** muestreo por rechazo en la caja `[-1.45,1.45]×[-1.25,0.75]×[-1.05,1.05]`, con `mulberry32(seed)`.
  - **Lóbulos (`LOBES`):**

    | Categoría | Centro |
    |---|---|
    | frontend | `[-0.65, 0.2, 0.45]` |
    | backend | `[0.65, 0.2, 0.45]` |
    | ai | `[0, 0.4, -0.45]` |
    | product | `[0, -0.1, 0.15]` |

    El lóbulo de product cae en la cisura, así que sus nodos se rechazan ahí y acaban a ambos lados.
  - **Nodos:** rechazo dentro de una esfera de radio 0,38 alrededor de su lóbulo y dentro de `insideBrain`. Si no salen en 500 intentos, se amplía el radio a 0,6.
  - **Aristas:** kNN (k = 3) por fuerza bruta entre los nodos, con pares normalizados `i < j` y un `Set` para deduplicar.

- [ ] **Step 4: Ejecutar los tests**

  Run: el mismo comando del Step 2.

  Expected: PASS.

- [ ] **Step 5: Commit**

  `git commit -m "feat(brain): deterministic brain-shaped point cloud with clustered corpus nodes"`

---

### Task 7: Secciones estáticas de la home (hero, métricas, trayectoria, formación, contacto)

**Files:**
- Create: `src/components/sections/{Hero,Metrics,Experience,Education,Contact}.tsx`, `src/components/ui/{Button,Chip,CopyEmail}.tsx`
- Modify: `src/app/[locale]/page.tsx` (composición real, `generateMetadata` y `<JsonLd data={personJsonLd(locale)} />`)
- Test: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: el contenido de T2, `Reveal` y `CountUp` de T4, `buildMetadata` y `personJsonLd` de T5.
- Produces:
  - Cada sección es `({ locale }: { locale: Locale })`, es un Server Component y lleva `<section id=... aria-labelledby=...>`.
  - `Hero` acepta `aside?: ReactNode`, el hueco del cerebro (T9). Mientras tanto no se pasa nada.
  - `page.tsx` deja hueco para `AskCorpus`, `StackSection`, `RagSection` y `Projects` en el orden de §5 del spec.
  - `CopyEmail` (cliente): `navigator.clipboard.writeText`, con feedback en `aria-live="polite"`.

- [ ] **Step 1: Escribir los tests que deben fallar**

  `home.spec.ts`, para `/es` y `/en`:
  - `'exactly one h1 with full name'`.
  - `'hero shows role and three CTAs above the fold'`: el viewport es 390×844 en `mobile`; los botones Proyectos, CV y Email son `toBeInViewport()`.
  - `'metrics render final values without JS'`: con `javaScriptEnabled: false`, el texto contiene `−30` y `+20`.
  - `'experience lists three roles and expands'`: el clic en el primer `summary` muestra su bullet "RAG".
  - `'cv button links to locale pdf'`.
  - `'copy email shows confirmation'`: con permisos de portapapeles concedidos.
  - `'person JSON-LD present and parseable'`.
  - `'no phone number in page'`: el HTML no contiene `680 53`.

- [ ] **Step 2: Ejecutar los tests**

  Run: `npm run test:e2e -- home`

  Expected: FAIL.

- [ ] **Step 3: Implementar las secciones**

  Antes de escribir el JSX, invoca la skill `frontend-design:frontend-design` para pulir la composición, con la dirección fijada en el spec (§4 y §5.01, 03, 07–09).

  - **Hero:** grid `1.1fr 0.9fr` en ≥ 1024 px y una columna en móvil. Título `.display` con `clamp(46px, 7.4vw, 100px)`. Chips de estado en mono, con un punto de color animado.
  - **Experiencia:** línea vertical con `scaleY` ligado a `useScroll` de Motion. Es una isla cliente mínima, `TimelineLine`, dentro de `Experience.tsx`.

- [ ] **Step 4: Ejecutar los tests**

  Run: `npm run test:e2e -- home && npm run typecheck`

  Expected: PASS.

- [ ] **Step 5: Commit**

  `git commit -m "feat(home): hero, metrics, experience, education and contact sections"`

---

### Task 7b: Secciones interactivas en HTML (stack, RAG, proyectos)

**Files:**
- Create: `src/components/sections/{StackSection,RagSection,Projects}.tsx`, `src/components/sections/StackExplorer.tsx` (cliente), `src/components/sections/RagExplorer.tsx` (cliente), `src/components/projects/ProjectArt.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Test: `tests/e2e/explorers.spec.ts`

**Interfaces:**
- Consumes: `stackLayers` y `ragSteps` de T2.
- Produces:
  - `StackExplorer`: `({ layers, locale, scene?: (s: { selectedId: string; onSelect(id: string): void }) => ReactNode })`.
    - La lista de capas es un `role="tablist"` con botones `role="tab"` y `aria-selected`; el panel es `role="tabpanel"`.
    - La selección por defecto es `ui`.
    - Teclado: ←/→/↑/↓ cambian de capa.
  - `RagExplorer`: la misma forma, con `steps`, la selección por defecto `corpus` y el mismo patrón ARIA.
  - `ProjectArt`: `({ kind: 'rag'|'timeseries'|'oem', size?: 'card'|'hero' })`. SVG isométrico puro.
    - En `oem`, las piezas se separan con CSS `:hover` / `:focus-within` del padre.
    - En `timeseries`, la curva lleva un umbral de 70 mg/dL rotulado *solo* como "umbral de hipoglucemia", sin datos reales.
  - Tarjetas de `Projects`:
    - Enlazan con `<Link href={{ pathname: '/proyectos/[slug]', params: { slug } }}>`.
    - Inclinación con CSS `perspective` y Motion `useMotionValue`, solo con `(pointer: fine)`.

- [ ] **Step 1: Escribir los tests que deben fallar**

  `explorers.spec.ts`:
  - `'stack tabs: arrow keys change panel and panel lists tags'`: el foco va a la primera tab; con ArrowRight, `aria-selected` pasa a "Servicios" y el panel contiene ".NET / C#".
  - `'rag steps selectable and loop text visible'`.
  - `'project cards link to localized project urls'`: en `/en`, el `href` de la tarjeta es `/en/projects/rag-esg`.

- [ ] **Step 2: Ejecutar los tests**

  Run: `npm run test:e2e -- explorers`

  Expected: FAIL.

- [ ] **Step 3: Implementar**

  Implementa los componentes. El hueco `scene` se queda vacío hasta la Task 10.

- [ ] **Step 4: Ejecutar los tests**

  Run: el mismo comando del Step 2.

  Expected: PASS.

- [ ] **Step 5: Commit**

  `git commit -m "feat(home): accessible stack and RAG explorers and project cards"`

---

### Task 8: "Pregúntale a mi corpus" (estado e interfaz)

**Files:**
- Create: `src/lib/ask-reducer.ts`, `src/components/corpus/CorpusProvider.tsx`, `src/components/sections/AskCorpus.tsx`
- Modify: `src/app/[locale]/page.tsx` (envolver `Hero` y `AskCorpus` en `CorpusProvider`)
- Test: `tests/unit/ask-reducer.test.ts`, `tests/e2e/ask.spec.ts`

**Interfaces:**
- Consumes: `corpusQA` y `corpusNodes` de T2b, `useReducedMotion` de T4.
- Produces:
  ```ts
  export type AskState = { status: 'idle'|'retrieving'|'answering'|'done'; qaId: string|null; shown: number; total: number };
  export type AskAction =
    | { type: 'select'; qaId: string; total: number; instant?: boolean }
    | { type: 'retrieved'; qaId: string } | { type: 'tick'; qaId: string; chars: number } | { type: 'reset' };
  export const initialAskState: AskState;
  export function askReducer(s: AskState, a: AskAction): AskState;
  // CorpusProvider
  export function useCorpus(): { state: AskState; activeIds: string[]; hoveredId: string|null;
    select(qaId: string): void; setHovered(id: string|null): void };
  ```
  - `activeIds` son los `sources` de la pregunta actual mientras `status !== 'idle'`.
  - Tiempos: la fase `retrieving` dura 600 ms; después, `tick` cada 16 ms con 3 caracteres.
  - Con "reducir movimiento", `select` se lanza con `instant: true`.

- [ ] **Step 1: Escribir los tests que deben fallar**

  `ask-reducer.test.ts`:
  - `select` desde idle da `{ status: 'retrieving', qaId: 'cloud', shown: 0 }`.
  - `retrieved` con el `qaId` actual da `answering`; con otro `qaId` (obsoleto) no cambia el estado (Review Focus 3).
  - `tick` acumula `shown` hasta `total` y entonces pasa a `done`; `shown` nunca supera `total`.
  - `tick` con un `qaId` obsoleto no cambia el estado.
  - `select` durante `answering` (otra pregunta) da `qaId` nuevo, `shown: 0` y `retrieving` (Review Focus 3).
  - `select` con `instant: true` da `{ status: 'done', shown: total }`.

  `ask.spec.ts`:
  - `'question chips are a keyboard radiogroup'`.
  - `'selecting a question shows the full answer and source links'`: espera a que `[data-status=done]` sea visible; los enlaces de fuente tienen el `href` del nodo.
  - `'rapid switching shows only the last answer'` (Review Focus 3): clic en la pregunta 1, a los 100 ms clic en la 2, y al terminar el texto es exactamente el de `corpusQA[1].answer.es`.
  - `'reduced motion shows answer instantly'`.
  - `'disclaimer present'`.

- [ ] **Step 2: Ejecutar los tests**

  Run: `npx vitest run tests/unit/ask-reducer.test.ts && npm run test:e2e -- ask`

  Expected: FAIL.

- [ ] **Step 3: Implementar**

  - **Respuesta:** región `aria-live="polite"`. Para no saturar a los lectores de pantalla, el texto que se va escribiendo lleva `aria-hidden`, y un nodo `sr-only` con la respuesta completa se actualiza al llegar a `done`.
  - **Prompt:** la línea de "prompt" en mono es `> query: "<pregunta>"`.
  - **Disclaimer:** el de §5.02 del spec, en `messages`.

- [ ] **Step 4: Ejecutar los tests**

  Run: el mismo comando del Step 2.

  Expected: PASS.

- [ ] **Step 5: Commit**

  `git commit -m "feat(corpus): scripted ask-my-corpus with retrieval phases and a11y"`

---

### Task 9: `SceneCanvas` y cerebro 3D

**Files:**
- Create: `src/components/three/{SceneCanvas,BrainCorpus,BrainFallback,BrainStage}.tsx`
- Modify: `src/app/[locale]/page.tsx` (columna `sticky` con `BrainStage`, que cubre `Hero` y `AskCorpus`)
- Test: `tests/e2e/scenes.spec.ts`

**Interfaces:**
- Consumes: `generateBrain`, `BRAIN_SEED` y `LOBES` de T6; `classifyGpu`, `downgrade`, `QUALITY` y `useReducedMotion` de T4; `useCorpus` de T8.
- Produces:
  ```tsx
  export function hasWebGL(): boolean; // try getContext('webgl2') ?? getContext('webgl') en un canvas temporal
  export function SceneCanvas(p: { fallback: ReactNode; children: ReactNode; className?: string;
    camera?: CanvasProps['camera']; orthographic?: boolean; testId: string }): JSX.Element;
  export function useSceneQuality(): { tier: Tier; particles: number; dpr: number; bloom: boolean };
  export function BrainCorpus(p: { nodes: BrainInputNode[]; titles: Record<string, string>;
    activeIds: string[]; onHover(id: string | null): void }): JSX.Element;
  export function BrainFallback(p: { nodes: BrainInputNode[]; activeIds?: string[] }): JSX.Element; // SVG, servidor o cliente
  ```
  - `SceneCanvas` renderiza siempre el `fallback`, en un contenedor con `data-testid={testId + '-fallback'}`. Monta el `<Canvas>` encima, con `data-testid={testId + '-canvas'}`, solo si se cumplen todas estas condiciones:
    - `hasWebGL()`.
    - No hay "reducir movimiento".
    - La sección es visible (`IntersectionObserver` con `rootMargin: '200px'`).
    - `requestIdleCallback` ya ha disparado.
  - El fallback se oculta con `opacity` cuando el canvas emite `onCreated`.
  - El `<Canvas>` se importa con `next/dynamic` y `ssr: false`, y lleva `aria-hidden`.
  - `frameloop` es `'always'` cuando la escena es visible y la pestaña está visible, y `'never'` en otro caso.
  - Calidad: el tier inicial sale de `classifyGpu` con `navigator.hardwareConcurrency`, `navigator.deviceMemory` y el renderer de `WEBGL_debug_renderer_info`. drei `PerformanceMonitor` llama a `downgrade` en `onDecline`.
  - `BrainStage` (cliente) conecta `useCorpus()` con `SceneCanvas`, con `BrainCorpus` y su fallback `BrainFallback`.

- [ ] **Step 1: Escribir los tests que deben fallar**

  `scenes.spec.ts`:
  - `'brain canvas mounts on desktop'`: tras hacer scroll a `#hero`, `[data-testid=brain-canvas]` está visible.
  - `'webgl unavailable → fallback, no console errors'` (Review Focus 4):
    - `page.addInitScript` sobreescribe `HTMLCanvasElement.prototype.getContext` para que devuelva `null` con `webgl`, `webgl2` y `experimental-webgl`.
    - Se recorre la home haciendo scroll hasta el final.
    - Se comprueba que `brain-fallback` está visible y no hay `brain-canvas`.
    - Los `consoleErrors` están vacíos.
    - Una vez hecha la Task 10, el mismo test cubre también `stack-*` y `rag-*`.
  - `'reduced motion → fallback only'`.
  - `'answering a question highlights nodes in fallback'`: con WebGL desactivado, tras seleccionar `cloud`, el número de `[data-active=true]` en el SVG del fallback es igual a `sources.length`.

- [ ] **Step 2: Ejecutar los tests**

  Run: `npm run test:e2e -- scenes`

  Expected: FAIL.

- [ ] **Step 3: Implementar**

  - **Partículas:** `THREE.Points` con `ShaderMaterial`:
    - Tamaño `gl_PointSize = size * (300.0 / -mvPosition.z)`.
    - Color mezclado entre mint, cyan y violet según la posición x/y.
    - Alpha por profundidad.
  - **Nodos:** `instancedMesh` de esferas de radio 0,035, con el color de su categoría y escala ×1,8 si el nodo está en `activeIds` (lerp de 200 ms).
  - **Aristas:** `LineSegments` con opacidad 0,18. El pulso es un uniform `uTime` que modula el alpha a lo largo de cada segmento.
  - **Haz:** entre los nodos activos, `Line` de drei en mint con opacidad 0,8.
  - **Rotación:** `y += 0.0015` por frame; inclinación ±15° hacia el puntero, con damping de 0,05.
  - **Hover:** con raycast en el instanced mesh, `onHover(id)` y un tooltip `Html` de drei con `titles[id]`.
  - **Postprocesado:** `EffectComposer` con `Bloom`, intensidad 0,9, `luminanceThreshold` 0,2 y `mipmapBlur`, solo si `bloom`.
  - **`BrainFallback`:** proyección ortográfica (x, y) de `generateBrain({ seed: BRAIN_SEED, particleCount: 900, nodes })`, con `<circle>` y `data-active`.
  - **Móvil:** el `BrainStage` va bajo el hero con una altura de 60 vh y sin `sticky`.

- [ ] **Step 4: Ejecutar los tests y la build**

  Run: `npm run test:e2e -- scenes && npm run build`

  Expected: PASS, y la build sin warnings de SSR por `window`.

- [ ] **Step 5: Commit**

  `git commit -m "feat(three): lazy SceneCanvas with quality tiers and interactive brain-corpus"`

---

### Task 10: Escenas isométricas (`IsoStack` y `RagPipeline`)

**Files:**
- Create: `src/components/three/{IsoStack,IsoStackFallback,RagPipeline,RagPipelineFallback}.tsx`
- Modify: `StackExplorer` y `RagExplorer` (pasar `scene`), `tests/e2e/scenes.spec.ts`

**Interfaces:**
- Consumes: `SceneCanvas` y `useSceneQuality` de T9; las props `scene` de T7b.
- Produces:
  ```tsx
  export function IsoStack(p: { layers: { id: string; category: Category; label: string }[];
    selectedId: string; onSelect(id: string): void; getExplode(): number /*0..1*/ }): JSX.Element;
  export function RagPipeline(p: { steps: { id: string; label: string }[]; activeId: string; onSelect(id: string): void }): JSX.Element;
  ```
  Los dos fallbacks son SVG isométricos con las mismas etiquetas, y la capa o el paso seleccionado lleva `data-active`.

- [ ] **Step 1: Ampliar los tests de escenas**

  - `'stack and rag canvases mount when scrolled into view'`.
  - Extiende `'webgl unavailable → fallback'` a `stack-fallback` y `rag-fallback`.
  - `'selecting a stack tab updates the active slab in the fallback'`.

- [ ] **Step 2: Ejecutar los tests**

  Run: `npm run test:e2e -- scenes`

  Expected: FAIL en los tests nuevos.

- [ ] **Step 3: Implementar**

  - **Cámara:** `OrthographicCamera` con rotación `[-Math.atan(1/Math.SQRT2), Math.PI/4, 0]`, es decir, 35,264° / 45°.
  - **`IsoStack`:**
    - Losas: `RoundedBox` de drei de 2,4 × 0,22 × 1,6.
    - Separación vertical de `0.32 + explode * 0.9`.
    - `getExplode` se lee en `useFrame` y sale de `useScroll({ target: section, offset: ['start end', 'end start'] })` de Motion.
    - La cara superior es emisiva en el color de su categoría y la seleccionada brilla el doble.
    - Las etiquetas son `Text` de drei en JetBrains Mono.
  - **`RagPipeline`:**
    - Seis bloques en elipse sobre el plano y una `CatmullRomCurve3` cerrada que los recorre.
    - Partículas: 120 instancias (60 en `low`) que avanzan por `t` a lo largo de la curva.
    - El tramo Informes → Corpus va en violet para marcar el bucle.

- [ ] **Step 4: Ejecutar los tests**

  Run: `npm run test:e2e -- scenes`

  Expected: PASS.

- [ ] **Step 5: Commit**

  `git commit -m "feat(three): isometric exploded stack and RAG pipeline scenes"`

---

### Task 11: Páginas de proyecto e imágenes Open Graph

**Files:**
- Create: `src/app/[locale]/proyectos/[slug]/page.tsx`, `src/components/projects/ProjectDiagram.tsx`, `src/app/[locale]/opengraph-image.tsx`, `src/app/[locale]/proyectos/[slug]/opengraph-image.tsx`
- Test: `tests/e2e/projects.spec.ts`

**Interfaces:**
- Consumes: `getProject` y `projects` de T2, `ProjectArt` de T7b, `buildMetadata` y `projectJsonLd` de T5, `Link` de T3.
- Produces:
  - En la página: `generateStaticParams()` devuelve los 6 pares `{ locale, slug }` y `export const dynamicParams = false`. Si el slug no existe, `notFound()`.
  - `ProjectDiagram`: `({ kind: 'rag'|'timeseries'|'oem', locale })`. Es un SVG de arquitectura con etiquetas localizadas que salen de props (los textos llegan desde la página).
  - Imágenes Open Graph: `ImageResponse` de 1200×630, con fondo `--bg`, tres degradados radiales de aurora, el nombre o el título del proyecto en blanco y el rol en `--muted`.

- [ ] **Step 1: Escribir los tests que deben fallar**

  `projects.spec.ts`:
  - `'each project page renders in both locales with one h1 and breadcrumb'`.
  - `'lang switch on project page keeps the project'` (Review Focus 1): desde `/es/proyectos/rag-esg`, el clic en EN lleva a la URL `/en/projects/rag-esg`, y luego de vuelta.
  - `'unknown slug and unknown locale return 404'` (Review Focus 2): `request.get('/es/proyectos/foo')` y `request.get('/fr')` devuelven 404.
  - `'next project CTA cycles through projects'`: el último proyecto enlaza con el primero.
  - `'og image responds as png'`: `/es/opengraph-image` devuelve 200 con `image/png`.
  - `'project JSON-LD is CreativeWork with author'`.

- [ ] **Step 2: Ejecutar los tests**

  Run: `npm run test:e2e -- projects`

  Expected: FAIL.

- [ ] **Step 3: Implementar**

  Sigue la plantilla de §6 del spec. Las secciones se renderizan desde `project.sections[locale]`, sin texto fijo en el JSX.

- [ ] **Step 4: Ejecutar los tests**

  Run: `npm run test:e2e -- projects && npx vitest run`

  Expected: PASS.

- [ ] **Step 5: Commit**

  `git commit -m "feat(projects): static bilingual project pages, diagrams and OG images"`

---

### Task 12: Accesibilidad, presupuesto de rendimiento y revisión de diseño

**Files:**
- Create: `tests/e2e/a11y.spec.ts`, `tests/e2e/budget.spec.ts`
- Modify: los archivos que señalen las auditorías

**Interfaces:**
- Consumes: todo lo anterior.

- [ ] **Step 1: Escribir los tests de auditoría**

  - `a11y.spec.ts`: `AxeBuilder` (`@axe-core/playwright`) con las etiquetas `wcag2a`, `wcag2aa` y `wcag21aa` en `/es`, `/en` y `/es/proyectos/rag-esg`. Espera 0 violaciones de impacto `serious` o `critical`.
  - `budget.spec.ts`, `'initial JS < 120KB gzip before scenes load'`:
    - Carga `/es` y escucha `page.on('response')` con `resourceType() === 'script'` hasta `networkidle`, sin hacer scroll.
    - Suma `zlib.gzipSync(await res.body()).length` de cada script, excepto de los chunks que contienen `three` o `@react-three`.
    - Comprueba que el total es menor de `120 * 1024`.
    - Hace un segundo cálculo con los chunks 3D tras hacer scroll al final y comprueba que son menos de `220 * 1024`.

- [ ] **Step 2: Ejecutar las auditorías y corregir**

  Run: `npm run test:e2e -- a11y budget`

  Corrige lo que falle. Si se supera el presupuesto de JS, aplica `optimizePackageImports` y comprueba las importaciones dinámicas. Si aun así no se cumple, **para e informa a Miguel con las cifras**; no cambies el umbral.

- [ ] **Step 3: Revisión de diseño**

  Invoca `design:accessibility-review` y `design:design-critique` sobre `npm run start`, con capturas de `/es` en escritorio y en móvil. Aplica las correcciones que encajen con el spec.

- [ ] **Step 4: Ejecutar Lighthouse en móvil**

  Run: `npx lighthouse http://localhost:3100/es --form-factor=mobile --screenEmulation.mobile --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=<scratchpad>/lh.json --chrome-flags="--headless"`

  Expected: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100, LCP < 2500 ms y CLS < 0,05. Si no se cumple, informa de las cifras.

- [ ] **Step 5: Verificación completa y commit**

  Run: `npm run lint && npm run typecheck && npm test && npm run test:e2e`

  Expected: todo PASS.

  `git commit -m "test: a11y and JS budget audits; polish from design review"`

---

### Task 13: Despliegue en Vercel (con Miguel)

**Files:**
- Modify: `CLAUDE.md` (URL de producción), `README.md` (descripción, stack, comandos y enlace)

- [ ] **Step 1: Checklist previa**

  Invoca `engineering:deploy-checklist`. Confirma con Miguel tres cosas:
  - El nombre del repo (propuesto: `MiguelGarciaBilbao/portfolio`).
  - Que el teléfono sigue sin publicarse.
  - Que el contenido de los proyectos le vale.

- [ ] **Step 2: Repo en GitHub**

  Pide confirmación antes, porque publica el código. Después ejecuta `gh repo create MiguelGarciaBilbao/portfolio --public --source . --push`.

- [ ] **Step 3: Proyecto en Vercel**

  Miguel importa el repo en Vercel, o usa `npx vercel link` y `npx vercel --prod` con su sesión (`! npx vercel login`). Define `NEXT_PUBLIC_SITE_URL` en Production y Preview con la URL asignada y vuelve a desplegar.

- [ ] **Step 4: Verificar en producción**

  - `curl -sI <url>/` devuelve 307 a `/es`.
  - `<url>/sitemap.xml` tiene 8 URLs con la URL de producción.
  - Lighthouse en móvil contra producción cumple los criterios de la Task 12.

- [ ] **Step 5: Después del despliegue (Miguel)**

  Miguel da de alta el sitio en Google Search Console, envía el sitemap y añade la URL al CV y a LinkedIn. Cierra con el commit de `README.md` y `CLAUDE.md` y `git push`.
