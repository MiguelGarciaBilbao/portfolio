# Miguel García Bilbao · Portfolio

Bilingual (ES / EN) portfolio of Miguel Alejandro García Bilbao, Senior Software Engineer (full stack & applied AI).

**Live:** _URL added after the first Vercel deploy_

## What's inside

- **Brain-shaped corpus**: a WebGL point cloud where every node is a piece of experience. "Pregúntale a mi corpus" ("ask my corpus") answers scripted questions and lights up the nodes it "retrieves".
- **Exploded stack**: an isometric, scroll-driven breakdown of the stack layers.
- **RAG pipeline**: the Data Intelligence Hub pipeline drawn as a loop, from sources to reports and back to the corpus.
- **Project pages** with architecture diagrams, JSON-LD, `hreflang` and per-page Open Graph images.

Every 3D scene has a static SVG fallback with the same layout. Text never depends on WebGL. The site respects `prefers-reduced-motion` and touch pointers. Scenes are lazy-loaded once the page is idle and are skipped on software-rendered WebGL.

## Stack

Next.js 16 (App Router, static generation) · React 19 · TypeScript · Tailwind CSS 4 · three.js + React Three Fiber + drei · next-intl (localized pathnames) · Lenis · Vitest · Playwright + axe.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server on http://localhost:3000 |
| `npm run build` / `npm run start` | Production build / serve it on http://localhost:3100 |
| `npm run lint` · `npm run typecheck` | ESLint · `next typegen && tsc --noEmit` |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end, accessibility and JS-budget tests (Playwright, desktop + mobile) |

## Configuration

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public origin used for canonical URLs, `hreflang`, sitemap and Open Graph. Set it in Vercel (Production and Preview). |

## Content

All content lives in `src/content/` (typed `Localized<T>`), sourced only from the CVs. `messages/*.json` holds UI microcopy only.
