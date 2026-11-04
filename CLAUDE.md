@AGENTS.md

# Portfolio · Miguel García Bilbao

Portfolio bilingüe (ES/EN) en Next.js 16 (App Router, SSG) con estética "Aurora boreal" y escenas 3D (React Three Fiber). Objetivo: captar reclutadores y posicionar en buscadores junto al CV.

- Producción: https://miguel-garcia-bilbao.vercel.app (Vercel, proyecto `portfolio`; `NEXT_PUBLIC_SITE_URL` en Production y Preview). Repo: https://github.com/MiguelGarciaBilbao/portfolio
- Spec (autoridad): `docs/superpowers/specs/2026-11-02-portfolio-design.md`
- Plan: `docs/superpowers/plans/2026-11-02-portfolio.md`
- Fuentes de contenido: `docs/CV_*.pdf` y `docs/portfolio_miguel_garcia_bilbao.html`

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | servidor de desarrollo (http://localhost:3000) |
| `npm run build` / `npm run start` | build de producción / servirla en http://localhost:3100 |
| `npm run lint` · `npm run typecheck` | ESLint · `tsc --noEmit` |
| `npm test` | Vitest (`tests/unit`) |
| `npm run test:e2e` | Playwright (`tests/e2e`, proyectos `chromium` y `mobile`; levanta build+start) |
| `npm run format` | Prettier |

## Mapa

```
src/app/[locale]/            layout, home, proyectos/[slug], opengraph-image
src/app/{sitemap,robots}.ts
src/i18n/                    routing (pathnames localizados), navigation, request
src/proxy.ts                 Next 16: sustituye a middleware.ts (next-intl)
src/content/                 ÚNICA fuente de verdad del contenido (Localized<T>)
src/components/sections/     Server Components de cada sección
src/components/three/        escenas R3F (solo cliente, carga diferida + fallback)
src/components/fx/           Aurora, LensCursor, SmoothScroll, Reveal, CountUp
src/lib/                     seo, motion (tiers GPU), brain-geometry, ask-reducer
messages/{es,en}.json        solo microcopy de UI
```

## Reglas (no negociables)

1. **No inventar datos.** Todo texto con significado sale de los CVs o del HTML de referencia en `docs/`. Nada de cifras, tecnologías o logros que no estén ahí.
2. **No publicar el teléfono** en la web.
3. **El contenido solo se edita en `src/content/`** (tipado `Localized<T>`). `messages/*.json` es solo para la microcopy de la UI.
4. **Las escenas 3D (`src/components/three/`) no importan `next-intl` ni `@/content`**: los datos llegan solo por props.
5. **Toda escena tiene fallback** estático con el mismo layout. Los canvas llevan `aria-hidden="true"`. El texto nunca depende de WebGL.
6. **Presupuesto de JS:** < 175 KB gzip antes de cargar escenas; 3D completo < 260 KB gzip (`tests/e2e/budget.spec.ts`). Re-basados con Miguel el 2026-11-03 sobre lo medido (Next 16 + React ≈ 136 KB por sí solos). No relajarlos más sin su visto bueno.
7. Respetar `prefers-reduced-motion` y el puntero táctil (sin lente del cursor ni Lenis).
8. Tokens de color en `src/app/globals.css` (`@theme`). No hardcodear colores fuera de ahí salvo en shaders y en imágenes OG.
