# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Reclutadores técnicos y hiring managers de puestos de ingeniería de software con IA aplicada o de frontend senior. Muchos abren la web desde el móvil, a menudo desde el enlace del CV o de LinkedIn, y le dedican menos de un minuto: tienen que entender quién es Miguel y si encaja antes de cerrar la pestaña.

## Product Purpose

Portfolio bilingüe (ES/EN) de Miguel Alejandro García Bilbao, Senior Software Engineer · Full Stack & IA aplicada (LLM · RAG). Existe para captar la atención de reclutadores y posicionar a Miguel en buscadores junto con su CV.

Cuenta como éxito cualquiera de estas acciones del visitante:
- escribirle por email (la vía de contacto preferida),
- descargar el CV en PDF,
- abrir su LinkedIn o su GitHub,
- leer una página de proyecto.

En los primeros 5 segundos, sin hacer scroll, tienen que verse el nombre, el rol, la propuesta de valor y los tres CTA (proyectos, CV, email).

## Positioning

Demostrar, no contar. La propia web es la prueba del perfil: un corpus con forma de cerebro que "recupera" nodos al hacerle preguntas, el pipeline RAG del Data Intelligence Hub dibujado como un bucle y el stack desplegado en isométrico enseñan el perfil Full Stack + IA aplicada en vez de limitarse a listarlo.

## Operating Context

- Se llega desde el CV, LinkedIn o un buscador; la visita es corta y a menudo en el móvil.
- Rutas `/es` y `/en` con pathnames localizados; home larga y una página por proyecto (`rag-esg`, `tfm-hipoglucemia`, `web-components-oem`).
- CV descargable en `/cv/miguel-garcia-bilbao-{es,en}.pdf`.
- Producción: https://miguel-garcia-bilbao.vercel.app (Vercel, estático).

## Capabilities and Constraints

- Next.js 16 (App Router, SSG), React 19, Tailwind 4, next-intl, React Three Fiber. Ver `CLAUDE.md` para las reglas completas.
- "Pregúntale a mi corpus" usa respuestas ya escritas; no hay LLM ni API detrás.
- Todo el contenido vive en `src/content/` (`Localized<T>`); `messages/*.json` es solo microcopy de UI.
- Las escenas 3D reciben los datos por props, tienen fallback estático con el mismo layout y `aria-hidden` en el canvas. El texto nunca depende de WebGL.
- Presupuesto de JS: < 175 KB gzip antes de las escenas y < 260 KB con el 3D completo. No se relaja sin el visto bueno de Miguel.
- Objetivo Lighthouse móvil: Performance ≥ 90, SEO = 100, Accessibility ≥ 95, Best Practices ≥ 95; LCP < 2,5 s, CLS ≈ 0.
- Fuera de alcance por ahora: RAG real con LLM, blog, CMS, formulario de contacto con backend, analítica de pago, foto.

## Brand Commitments

- Nombre público: Miguel García Bilbao (completo: Miguel Alejandro García Bilbao).
- La dirección visual existente ("Aurora boreal", oscura) es la incumbente; los tokens viven en `src/app/globals.css` (`@theme`).

## Evidence on Hand

- CVs y HTML de referencia en `docs/` (los originales con datos personales están fuera de git); CVs públicos sin teléfono en `public/cv/`.
- Tres proyectos reales: RAG ESG (nettrim · Data Intelligence Hub), TFM de hipoglucemia y Web Components OEM.
- No hay testimonios, clientes, foto ni cifras fuera de los CVs. **No se inventa nada**: ninguna cifra, tecnología o logro que no esté en `docs/`.
- **Nunca se publica el teléfono.**

## Product Principles

1. Lo esencial (nombre, rol, propuesta, CTA) se entiende en menos de un minuto y en el móvil.
2. La web demuestra el perfil con su propia construcción; los efectos tienen que contar algo del trabajo de Miguel, no decorar.
3. Fidelidad absoluta al CV: cada dato es verificable en las fuentes.
4. Rápida y accesible aunque haya 3D: el contenido nunca depende de WebGL ni del movimiento.
5. Bilingüe de verdad: ES y EN con la misma calidad y ambos indexables.

## Accessibility & Inclusion

Respetar `prefers-reduced-motion` y los punteros táctiles (sin cursor de estrellas ni scroll suave). Todo el contenido legible sin WebGL. Auditoría con axe en los e2e.
