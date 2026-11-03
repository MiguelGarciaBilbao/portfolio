# Portfolio de Miguel García Bilbao — Diseño

- **Fecha:** 2026-11-02
- **Estado:** pendiente de revisión por Miguel
- **Fuentes de contenido:** `docs/CV_Miguel_Garcia_Bilbao_2026_v2.pdf` (ES), `docs/CV_Miguel_Garcia_Bilbao_2026_EN.pdf` (EN), `docs/portfolio_miguel_garcia_bilbao.html` (versión anterior bilingüe)

## 1. Objetivo y criterios de éxito

**Objetivo:** captar la atención de reclutadores técnicos y posicionar a Miguel en buscadores junto con su CV, con un portfolio visualmente memorable que *demuestre* su perfil (Full Stack + IA aplicada con RAG) en lugar de solo contarlo.

**Público:** reclutadores y hiring managers de puestos de ingeniería de software con IA aplicada o frontend senior. Muchos lo abrirán desde el móvil y le dedicarán menos de un minuto.

**Criterios de éxito:**
1. En los primeros 5 segundos, sin hacer scroll, se ven el nombre, el rol, la propuesta de valor y los tres CTA (proyectos, CV, email).
2. Lighthouse móvil: Performance ≥ 90, SEO = 100, Accessibility ≥ 95, Best Practices ≥ 95. LCP < 2,5 s y CLS ≈ 0.
3. Cada página es indexable en ES y EN, con metadatos, `hreflang`, JSON-LD e imagen Open Graph propios.
4. Todo el contenido es legible sin WebGL o con "reducir movimiento".
5. Ningún dato aparece en el portfolio si no está en los CVs o en el HTML de referencia.

**Decisiones tomadas en el brainstorming:**

| Tema | Decisión |
|---|---|
| Idiomas | Bilingüe ES/EN con rutas `/es` y `/en` |
| Estética | Oscura con aurora; dirección "A · Aurora boreal, split" |
| Proyectos | Tres: RAG ESG, TFM hipoglucemia, Web Components OEM |
| Estructura | Home larga y una página por proyecto |
| "Modo IA" | "Pregúntale a mi corpus" con respuestas ya escritas (sin API) |
| Enfoque técnico | Next.js 16 + React Three Fiber + drei + postprocessing + Motion + Lenis |
| Foto | Sin foto en la v1 |
| Dominio | `*.vercel.app` de momento, configurable con `NEXT_PUBLIC_SITE_URL` |

**Fuera de alcance en la v1:** RAG real con LLM, blog, CMS, formulario de contacto con backend, analítica de pago y foto.

## 2. Stack técnico

Versiones vigentes a 2026-11-02:

| Pieza | Paquete |
|---|---|
| Framework | `next@16.4` (App Router, React Server Components, SSG), `react@19.3`, TypeScript estricto |
| Estilos | `tailwindcss@4.3`, con los tokens de diseño en CSS (`@theme`) |
| i18n | `next-intl@4.14` (proxy de locale, `getTranslations` en el servidor) |
| 3D | `three@0.187`, `@react-three/fiber@9.8`, `@react-three/drei@10.7`, `@react-three/postprocessing@3.2` |
| Animación | `motion@14` para la UI y `lenis@1.3` para el scroll suave |
| Fuentes | `next/font/google`: Archivo (variable, con eje de anchura) y JetBrains Mono |
| Tests | Vitest para lógica y contenido, Playwright para E2E de humo |
| Calidad | ESLint (config de Next), `tsc --noEmit`, Prettier |
| Hosting | Vercel (estático en la CDN, previsualizaciones por PR) |

## 3. Arquitectura

### 3.1 Rutas

```
/                                  → proxy (antes middleware): redirige a /es o /en según Accept-Language (por defecto /es)
/[locale]                          → home (SSG)
/es/proyectos/[slug]               → página de proyecto (SSG, generateStaticParams)
/en/projects/[slug]                → ídem en inglés (pathnames localizados de next-intl)
/cv/miguel-garcia-bilbao-es.pdf    → copia de docs/CV_..._v2.pdf en public/
/cv/miguel-garcia-bilbao-en.pdf    → copia de docs/CV_..._EN.pdf en public/
/sitemap.xml, /robots.txt          → app/sitemap.ts, app/robots.ts
opengraph-image                    → app/[locale]/opengraph-image.tsx y app/[locale]/proyectos/[slug]/opengraph-image.tsx (next/og)
```

Slugs, iguales en los dos idiomas para simplificar:
- `rag-esg`
- `tfm-hipoglucemia`
- `web-components-oem`

### 3.2 Estructura de carpetas

```
src/
  app/
    [locale]/
      layout.tsx          # <html lang>, fuentes, providers (intl, Lenis), Header, StarCursor, Aurora
      page.tsx            # home: compone las secciones
      proyectos/[slug]/page.tsx
      opengraph-image.tsx
    sitemap.ts
    robots.ts
  i18n/                   # routing.ts (locales, pathnames), request.ts
  proxy.ts                # Next 16: sustituye a middleware.ts (next-intl)
  content/                # ÚNICA fuente de verdad del contenido (tipada)
    types.ts              # Localized<T> = { es: T; en: T }
    profile.ts
    experience.ts
    education.ts
    stack.ts
    projects.ts
    metrics.ts
    corpus.ts             # nodos del cerebro + preguntas y respuestas
  components/
    sections/             # Server Components: Hero, AskCorpus, Metrics, Stack, RagFlow,
                          # Projects, Experience, Education, Contact
    three/                # Client-only: BrainCorpus, IsoStack, RagPipeline, SceneCanvas
    fx/                   # StarCursor, Aurora, Reveal, CountUp
    ui/                   # Button, Chip, LangSwitch, Header, SkipLink
  lib/
    seo.ts                # buildMetadata(), personJsonLd(), projectJsonLd()
    motion.ts             # useReducedMotion, useGpuTier (calidad baja, media o alta)
    brain-geometry.ts     # generador determinista de puntos y aristas del cerebro (función pura)
messages/es.json, messages/en.json   # solo microcopy de la UI (nav, botones, labels)
public/cv/*.pdf
tests/unit/*, tests/e2e/*
```

### 3.3 Reglas de aislamiento

1. **El contenido manda.** Todo texto con significado vive en `src/content/*.ts` como `Localized<T>`, y TypeScript da error si falta un idioma. `messages/*.json` es solo para la microcopy de la UI.
2. **Las secciones son Server Components.** Renderizan todo el texto en HTML y montan las escenas 3D como islas de cliente con `next/dynamic` y `ssr: false`, y solo cuando la sección entra en pantalla (IntersectionObserver).
3. **Las escenas 3D son "tontas".** Reciben datos por props (`nodes`, `activeIds`, `layers`, `activeStep`) y emiten eventos (`onNodeHover`, `onLayerSelect`). No importan next-intl ni el contenido.
4. **Toda escena tiene fallback.** Sin WebGL, con `prefers-reduced-motion` o con GPU de nivel bajo y sin interacción, se muestra una imagen estática (SVG o WebP pregenerado) con el mismo layout. El texto nunca depende de la escena.
5. **Un `<Canvas>` por escena,** montado solo cuando la sección es visible. `frameloop="demand"` o pausa cuando no se ve o la pestaña está oculta.

### 3.4 Flujo de datos de "Pregúntale a mi corpus"

```
corpus.ts ── nodes[] ─────────────▶ BrainCorpus (props: nodes, activeIds)
          └─ qa[] ──▶ AskCorpus (cliente) ── estado: selectedQuestionId
                          │ al seleccionar:
                          │ 1. fase "retrieve": activeIds = qa.sources (≈600 ms; el cerebro ilumina y une los nodos)
                          │ 2. fase "answer": la respuesta se escribe con efecto máquina de escribir (accesible: aria-live="polite")
                          │ 3. fase "cite": chips de fuente → enlace a #seccion o /proyectos/slug
```

`BrainCorpus` y `AskCorpus` comparten el estado mediante un store mínimo de React (context + `useState`) en un client component, `CorpusProvider`, que envuelve las secciones 01 y 02.

## 4. Sistema visual

### 4.1 Tokens

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#05070f` | fondo |
| `--bg-2` | `#0b1020` | superficies elevadas o de cristal (con transparencia) |
| `--ink` | `#E8F1FF` | texto principal |
| `--muted` | `#8A9BB8` | texto secundario (contraste AA sobre `--bg`) |
| `--line` | `rgba(232,241,255,.12)` | bordes |
| `--mint` | `#2EF5B0` | acento 1: CTA principal, frontend |
| `--cyan` | `#26C6FF` | acento 2: backend y cloud |
| `--violet` | `#8B5CF6` | acento 3: IA |
| Degradado CTA | `linear-gradient(90deg, mint, cyan)` | botón principal (texto `#04121a`) |

**Tipografía:**
- *Titulares:* Archivo con `font-stretch` 112–125 %, peso 700–800 y tracking negativo, en tamaño fluido con `clamp()`.
- *Texto:* Archivo al 100 %, 17–18 px.
- *Etiquetas técnicas, chips y "prompts":* JetBrains Mono.

### 4.2 Efectos globales

- **Aurora:** capa `fixed` detrás del contenido con 3–4 degradados radiales desenfocados que se animan lentamente con CSS (`transform` y `opacity`, sin WebGL). Encima hay un campo de estrellas en canvas 2D estático y un grano SVG sutil. Con "reducir movimiento" la aurora se queda quieta.
- **StarCursor:**
  - Elementos: un punto (6 px) y un anillo (28 px), que se agranda sobre `a, button, [data-cursor]`.
  - Rastro: estrellas de 4 puntas (2–6 px) en los colores de la aurora. Cada una dura unos 700 ms, se desplaza un poco y se desvanece.
  - Dibujo: canvas 2D a pantalla completa con `pointer-events: none`, máximo 60 partículas y reutilización de objetos para no generar basura.
  - Se desactiva con `(pointer: coarse)` o `prefers-reduced-motion`.
  - Nunca oculta el cursor nativo en `input`, `textarea` ni `select`.
- **Reveal:** las secciones aparecen escalonadas al entrar en pantalla (Motion `whileInView`, `once`), con un desplazamiento de 16 px y opacidad.
- **Lenis:** scroll suave en escritorio. Se desactiva con "reducir movimiento", y los enlaces de ancla son compatibles.

## 5. Home: secciones

### 00 · Header
Cristal fijo arriba (`backdrop-blur`). Contiene:
- Marca "MGB".
- Navegación: Stack · IA · Proyectos · Trayectoria · Contacto.
- `LangSwitch` (ES|EN): mantiene la ruta equivalente.
- Botón "Descargar CV": PDF del idioma actual.

En móvil la navegación pasa a un menú desplegable. Hay un `SkipLink` al principio.

### 01 · Hero (split)
- **Izquierda:**
  - H1 "Miguel García Bilbao".
  - Rol: *Senior Software Engineer · Full Stack & IA aplicada (LLM · RAG)*.
  - Lead (del HTML): "Cinco años llevando a producción aplicaciones con Angular, .NET y Java, y ahora también los sistemas de IA que hay detrás."
  - CTA: Ver proyectos (principal, degradado), Descargar CV y Email.
  - Chips de estado: "Ahora: nettrim · Data Intelligence Hub" y "Máster IA · UAX, nov 2026".
- **Derecha:** `BrainCorpus`.
  - **Geometría:** unas 5 000 partículas de fondo muestreadas de forma determinista dentro de un volumen de dos hemisferios (elipsoides deformados con ruido y una cisura central) y un pequeño tronco. Son `THREE.Points` con un shader de tamaño y atenuación por profundidad.
  - **Nodos documento:** unos 60, cada uno vinculado a un `CorpusNode` (§7). Son más grandes y brillantes y se colorean por categoría: frontend menta, backend/cloud cian, IA violeta, producto/liderazgo `--ink`.
  - **Sinapsis:** las aristas unen cada nodo con sus k vecinos más cercanos (k = 3), en `LineSegments` con opacidad baja. Por ellas viajan pulsos, calculados en el shader con un uniform de tiempo.
  - **Interacción:** el cerebro rota lentamente y gira ±15° según el ratón (con inercia). Al pasar sobre un nodo aparece un tooltip HTML (drei `Html`) con su título.
  - **Nodos activos** (`activeIds`): escalan ×1,8, brillan con bloom y se unen con un haz.
  - **Postprocesado:** bloom solo en calidad media o alta.
  - **Calidad por dispositivo:**

    | Nivel | Partículas | DPR |
    |---|---|---|
    | Alta | 5 000 | 2 |
    | Media | 3 000 | 1,5 |
    | Baja | 1 500 | 1, sin bloom |

- **Comportamiento con scroll:** el cerebro está en un contenedor `sticky` que abarca las secciones 01 y 02.
- **Móvil:** el cerebro va debajo del texto, a menor tamaño y sin hover.

### 02 · Pregúntale a mi corpus
- Título y subtítulo: "Mi experiencia, indexada como un corpus. Elige una pregunta y mira qué recupera."
- Chips de preguntas sugeridas (§7.2), navegables con teclado como un `radiogroup`.
- Panel de respuesta con tres fases (retrieve → answer → cite), una línea de "prompt" en mono (`> query: "..."`) y chips de fuente enlazados.
- Aviso discreto: "Respuestas escritas por mí a partir de mi CV; la recuperación es una visualización." Es la verdad y evita que alguien crea que hay un LLM detrás.

### 03 · Métricas
Franja con `CountUp` al entrar en pantalla. Todas las cifras salen del CV:

| Cifra | Qué representa |
|---|---|
| 5 años | experiencia full stack |
| 5 devs | equipo liderado |
| −30 % | incidencias y tiempos |
| 8 módulos | migración legacy |
| +20 módulos | migración PHP → Angular + .NET |

### 04 · Despiece del stack (`IsoStack`)
- **Introducción:** retoma la del HTML ("En Softeca diseñé una librería de Web Components para despiezar piezas OEM en SVG. Aquí uso la misma idea…").
- **Escena:** cinco losas isométricas (cámara ortográfica a 35,264°/45°) con bordes en `--line`, cara superior con un degradado del color de su categoría y la etiqueta en mono.
- **Capas:** Interfaz, Servicios, IA aplicada, Datos, Cloud & DevOps. El contenido viene de `stack.ts`, derivado del HTML y de "Habilidades técnicas" del CV.
- **Animación:** el progreso del scroll por la sección (0→1) separa las capas verticalmente, en "vista explosionada".
- **Interacción:** al hacer clic o pulsar Enter sobre una capa (o en su botón HTML equivalente de la lista lateral), se selecciona. El panel muestra "qué es", las tecnologías como chips y "dónde lo he usado".
- **Fallback:** SVG isométrico estático y la misma lista de botones.

### 05 · Cómo funciona el RAG (`RagPipeline`)
- **Pasos:** seis bloques isométricos en circuito: Fuentes + OSINT → Corpus → Embeddings (Hugging Face) → Capa vectorial → LLM (Amazon Bedrock) → Informes ESG (doble materialidad, IROs, PAO, huella hídrica).
- **Bucle:** una flecha de vuelta "↺ cada informe vuelve al corpus".
- **Animación:** partículas que recorren el circuito (instanced mesh siguiendo una curva).
- **Interacción:** los pasos se pueden seleccionar (con lista HTML equivalente) y cada uno tiene una explicación de 1–2 frases del HTML o el CV.
- **Confidencialidad:** el texto deja claro que es una arquitectura general, sin datos de clientes.

### 06 · Proyectos
- **Tarjetas:** tres, con inclinación 3D al pasar el ratón (CSS `perspective` + Motion, sin WebGL) y una mini-ilustración isométrica en SVG/CSS:
  - **RAG ESG:** bloques del pipeline.
  - **TFM hipoglucemia:** curva de glucosa con un umbral y la predicción marcada.
  - **Web Components OEM:** una pieza SVG que se despieza al pasar el ratón.
- **Contenido de cada tarjeta:** título, una línea de problema, de 3 a 5 chips de stack y un enlace a la página del proyecto.

### 07 · Trayectoria
- **Estructura:** timeline vertical con los tres puestos del CV (nettrim; Softeca TL; Softeca Graduados), con fechas y modalidad.
- **Animación:** una línea con el degradado de la aurora se "dibuja" según el progreso del scroll.
- **Detalle:** cada puesto se expande con un `<details>` mejorado y accesible para ver los bullets del CV.

### 08 · Formación
Máster en IA (UAX, marzo–noviembre de 2026, con el TFM), Grado en Ingeniería Informática (UBU, 2017–2021), Advanced Angular v18 (Imagina Formación) e idiomas (español nativo, inglés B2).

### 09 · Contacto
- "¿Hablamos?" con el texto del HTML ("Busco puestos de ingeniería de software con IA aplicada o de frontend senior…").
- Email con botón "copiar" y feedback accesible.
- Enlaces: CV ES/EN, LinkedIn, GitHub.
- Pie: © 2026 Miguel Alejandro García Bilbao.
- Fuera del alcance de la v1:
  - Formulario de contacto.
  - Teléfono: está en el CV, pero no se publica en la web para evitar spam. **Pendiente de confirmar con Miguel.**

## 6. Páginas de proyecto

**Plantilla común:**
1. Migas de pan.
2. Cabecera con título, subtítulo, rol, periodo y empresa o universidad, junto a la ilustración isométrica grande.
3. Secciones: Contexto/problema · Qué hice · Arquitectura (diagrama SVG) · Stack · Resultados · Qué aprendí *(solo si hay datos)*.
4. CTA "Siguiente proyecto" y enlace a contacto.

Cada página tiene su metadata, Open Graph, JSON-LD (`CreativeWork` + `BreadcrumbList`) y `hreflang`.

**Contenido** (solo datos del CV o el HTML; lo marcado como *ampliable* son huecos que Miguel puede rellenar más adelante y que en la v1 no aparecen):

| Slug | Hechos disponibles | Ampliable |
|---|---|---|
| `rag-esg` | Pipeline RAG en Python para consultoría ESG en nettrim (Data Intelligence Hub, feb 2026–hoy): corpus documental, embeddings, capa vectorial y respuesta con LLM (Amazon Bedrock). Modelos de Hugging Face en el procesamiento. Corpus enriquecido con OSINT. Informes que se retroalimentan (doble materialidad, IROs, PAO, huella hídrica). | Volumen del corpus, base vectorial concreta, métricas de calidad o tiempos |
| `tfm-hipoglucemia` | TFM del Máster IA (UAX, marzo–noviembre de 2026): predicción personalizada de eventos de hipoglucemia con modelos de series temporales sobre datos de monitorización continua de glucosa (CGM). En el máster, además: transformers, LLMs, RAG y datos sintéticos. | Dataset, modelos comparados, métricas, horizonte de predicción, repo |
| `web-components-oem` | Softeca (2022–2026): diseño de una librería de Web Components para una aplicación de despiece gráfico de piezas OEM con imágenes SVG interactivas. Integrada en SPAs Angular con backends .NET/Java. | Nº de componentes, tecnología (Lit, Stencil o nativo), capturas anonimizadas |

## 7. Modelo de contenido

### 7.1 Tipos (resumen)

```ts
type Locale = 'es' | 'en';
type Localized<T> = Record<Locale, T>;
type Category = 'frontend' | 'backend' | 'ai' | 'product';

interface CorpusNode {
  id: string;
  category: Category;
  title: Localized<string>;
  href: string;                              // '#stack' | '/proyectos/rag-esg' ...
  source: 'cv' | 'project' | 'education';
}

interface CorpusQA {
  id: string;
  question: Localized<string>;
  answer: Localized<string>;                 // 2–4 frases
  sources: CorpusNode['id'][];               // 2–5 nodos; un test garantiza que existen
}

interface Project {
  slug: string;
  title: Localized<string>;
  summary: Localized<string>;
  role: Localized<string>;
  period: Localized<string>;
  org: string;
  stack: string[];
  sections: Localized<{ heading: string; body: string[] }[]>;
  diagram: 'rag' | 'timeseries' | 'oem';
}
```

### 7.2 Preguntas sugeridas (v1)

| # | Pregunta (ES) | Fuentes principales |
|---|---|---|
| 1 | ¿Ha llevado IA a producción? | RAG nettrim, Bedrock, Hugging Face, OSINT |
| 2 | ¿Qué experiencia tiene en cloud? | AWS (Bedrock, S3, ECS), Azure, Docker, CI/CD |
| 3 | ¿Ha liderado equipos? | TL Softeca (5 devs, Scrum), code review |
| 4 | ¿Qué nivel tiene en Angular? | Angular 2+ → v20, Signals, NgRx, SSR, Web Components |
| 5 | ¿Ha hecho migraciones de legacy? | 8 módulos −30 %, más de 20 módulos PHP |
| 6 | ¿Y backend? | .NET/C#, Java Spring, Node.js, PostgreSQL |
| 7 | ¿Cómo trabaja con negocio y clientes? | Interlocución con clientes, requisitos, demos |
| 8 | ¿Qué está estudiando? | Máster IA UAX, TFM hipoglucemia |
| 9 | ¿Qué busca ahora? | IA aplicada o frontend senior, remoto desde España |

### 7.3 Nodos del corpus

Hay unos 60 nodos, uno por bullet del CV, habilidad agrupada, proyecto y formación, repartidos aproximadamente así: frontend 16, backend/cloud 16, IA 16, producto/liderazgo 12. A cada nodo se le asigna una posición dentro del cerebro con el generador determinista (`brain-geometry.ts`, semilla fija), agrupando los nodos de la misma categoría en "lóbulos" cercanos.

## 8. SEO

- **Metadatos:** `buildMetadata({ locale, path, title, description })` en `lib/seo.ts` genera `title`, `description`, `alternates.canonical`, `alternates.languages` (es, en, x-default → /es), Open Graph, Twitter card y `metadataBase` desde `NEXT_PUBLIC_SITE_URL`.
- **Títulos:**
  - **Home ES:** "Miguel García Bilbao · Senior Software Engineer · IA aplicada (RAG, LLM) · Angular · .NET".
  - **Home EN:** el equivalente en inglés.
  - **Proyectos:** "{Proyecto} · Miguel García Bilbao".
- **JSON-LD:**
  - **Home:** `Person` con `name`, `jobTitle`, `email`, `url`, `sameAs` [LinkedIn, GitHub], `knowsAbout` [...], `alumniOf` [UAX, UBU], `worksFor` nettrim technology y `address` Burgos, ES.
  - **Proyectos:** `CreativeWork` (author → Person) y `BreadcrumbList`.
- **Rastreo:** `sitemap.ts` con todas las rutas en los dos idiomas y `alternates`, y `robots.ts` que lo permite todo y enlaza el sitemap.
- **Imágenes Open Graph:** con `next/og` (1200×630), con la aurora, el nombre y el rol (o el título del proyecto) y el cerebro en versión SVG simplificada.
- **HTML:** semántico (`header`, `main`, `section[aria-labelledby]`, `article`, `footer`) y un único `h1` por página.

## 9. Rendimiento y degradación

| Condición | Comportamiento |
|---|---|
| Carga inicial | HTML y CSS de servidor; LCP = H1 del hero. Escenas importadas con `dynamic` tras `requestIdleCallback` o al hacerse visibles. |
| Sin WebGL | Imagen estática (SVG/WebP) de cada escena; interacciones HTML intactas. |
| `prefers-reduced-motion` | Sin aurora animada, sin Lenis, sin rastro de estrellas, escenas en una pose fija; "Pregúntale a mi corpus" muestra la respuesta sin efecto máquina de escribir. |
| GPU de nivel bajo (heurística: `navigator.hardwareConcurrency`, `deviceMemory`, renderer de WebGL y FPS medidos los primeros 2 s) | Calidad "baja" (§5.01), sin postprocesado. |
| Pestaña oculta o escena fuera de pantalla | `frameloop` en pausa. |
| Móvil táctil | Sin cursor personalizado, sin hover en el cerebro, inclinación de tarjetas desactivada. |

**Presupuesto de JavaScript:**
- Fuera de las escenas 3D: < 175 KB gzip *(re-basado el 2026-11-03: el framework ya ocupa ≈ 136 KB; antes 120 KB)*.
- JS 3D completo (three, R3F, drei y escenas): < 260 KB gzip, cargado de forma diferida *(re-basado el 2026-11-03; antes 220 KB)*.
- Lo verifico con `@next/bundle-analyzer`.

**Recursos:**
- Las fuentes, con `next/font` (self-hosted, `display: swap`).
- Los PDFs no se precargan.

## 10. Accesibilidad

- Contraste AA en todo el texto, comprobado con los tokens de §4.1.
- Todo es operable con teclado: chips de preguntas, capas del stack, pasos del RAG, trayectoria y selector de idioma. El foco es visible (anillo menta de 2 px).
- Los `<canvas>` llevan `aria-hidden="true"`; cada escena tiene su equivalente en HTML.
- La respuesta del corpus va en una región `aria-live="polite"`.
- Hay `lang` correcto en `<html>`, y en los enlaces al otro idioma se usa `hreflang`.
- Auditoría final con la skill `design:accessibility-review` y axe en Playwright.

## 11. Testing

**Vitest (unit):**
- `content.integrity.test.ts`:
  - Cada `CorpusQA.sources` existe en los nodos.
  - Cada nodo tiene `es` y `en` no vacíos.
  - Los slugs son únicos y tienen página.
  - Las cifras de métricas coinciden con una lista explícita sacada del CV.
- `messages.parity.test.ts`: `es.json` y `en.json` tienen las mismas claves.
- `brain-geometry.test.ts`:
  - Con la misma semilla, salen los mismos puntos.
  - Todos los puntos caen dentro del volumen.
  - Los nodos de una categoría quedan agrupados.
  - El número de aristas está acotado.
- `seo.test.ts`: `buildMetadata` genera `canonical` y `alternates` correctos y el JSON-LD `Person` es válido según la forma esperada.

**Playwright (E2E de humo, Chromium y móvil emulado):**
- `/` redirige a `/es`; `/en` carga; el selector de idioma mantiene la ruta equivalente.
- Las tres páginas de proyecto cargan en los dos idiomas y tienen un único `h1`.
- "Pregúntale a mi corpus": al seleccionar una pregunta aparecen la respuesta y sus fuentes, y las fuentes navegan.
- Los enlaces de los CV devuelven 200 y `application/pdf`.
- Con `reducedMotion: 'reduce'`: se ve todo el contenido y no hay errores en consola.
- axe sin violaciones serias ni críticas en la home y en una página de proyecto.

**Scripts:** `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`, `analyze`.

## 12. Herramientas de Claude en el proyecto

- `CLAUDE.md` con los comandos, el mapa de la arquitectura (§3) y estas reglas:
  - El contenido solo se edita en `src/content/`.
  - Nunca se inventan datos del CV.
  - Las escenas 3D no importan el contenido.
  - Toda escena tiene fallback.
- Plugins del proyecto (`.claude/settings.json` → `enabledPlugins`): `frontend-design@claude-plugins-official` y `typescript-lsp@claude-plugins-official`.
- Permisos del proyecto: `npm run *`, `npx playwright *`, `npx vitest *` y git de solo lectura.
- Skills en el flujo:
  - `frontend-design` al implementar la UI.
  - `design:accessibility-review` y `design:design-critique` al cerrar.
  - `engineering:deploy-checklist` antes de Vercel.
- `.gitignore`: `node_modules`, `.next`, `.superpowers/`, `.DS_Store`, `.env*.local`, `playwright-report`, `test-results`.

## 13. Despliegue

1. Repo git local (rama `main`) y luego repo en GitHub (`MiguelGarciaBilbao/portfolio`, nombre por confirmar).
2. Proyecto en Vercel importado desde GitHub (framework Next.js), con `NEXT_PUBLIC_SITE_URL` en Production y Preview.
3. Previsualización por cada PR; producción en cada push a `main`.
4. Después del primer despliegue:
   - Lighthouse móvil sobre la URL de producción, contra los criterios de §1.
   - Alta en Google Search Console y envío del sitemap.
   - Añadir la URL al CV y a LinkedIn.

Los pasos que requieren la cuenta de Miguel (GitHub, Vercel, Search Console) se hacen con él.

## 14. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| El 3D penaliza el rendimiento en móvil | Carga diferida, niveles de calidad, pausa fuera de pantalla, presupuesto de bundle verificado |
| Estética de "IA genérica" | Paleta y tipografía propias (Archivo ancho), escenas atadas a su historia real (despiece OEM, RAG ESG, corpus) |
| Alguien cree que el chat es un LLM real | Aviso explícito en §5.02 |
| Contenido inventado o inflado | Regla en `CLAUDE.md` y test de métricas contra la lista del CV; huecos marcados como *ampliable* |
| Confidencialidad de nettrim y Softeca | Solo arquitectura general y lo que ya está en el CV público; sin datos ni capturas de clientes |
| Divergencia entre los idiomas | Tipos `Localized<T>` y test de paridad |

## 15. Puntos abiertos (no bloquean el plan)

- ¿Publicar el teléfono en la web? Por defecto **no**.
- Nombre del repo de GitHub y, más adelante, dominio propio.
- Material ampliable de los tres proyectos (§6).
