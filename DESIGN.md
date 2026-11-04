---
name: Miguel García Bilbao · Portfolio
description: Portfolio bilingüe bajo una aurora boreal: el trabajo de Miguel se observa como instrumentos en un cielo nocturno.
colors:
  night: "#05070f"
  night-raised: "#0c1220"
  starlight: "#e8eef7"
  dusk-muted: "#8d9ab0"
  hairline: "rgba(232, 238, 247, 0.12)"
  aurora-mint: "#3fd8a0"
  aurora-cyan: "#4fb3e8"
  aurora-violet: "#9a87f2"
  on-aurora: "#04121a"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.9rem, 5.6vw, 6.25rem)"
    fontWeight: 780
    lineHeight: 0.94
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 118"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 4.2vw, 3.25rem)"
    fontWeight: 720
    lineHeight: 1.02
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 108"
  lead:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 430
    lineHeight: 1.45
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.78rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0"
rounded:
  index: "8px"
  tab: "14px"
  panel: "20px"
  card: "24px"
  stage: "28px"
  pill: "999px"
spacing:
  gutter: "clamp(20px, 4vw, 40px)"
  wrap: "1240px"
  section: "clamp(80px, 12vw, 152px)"
  header: "64px"
components:
  button-primary:
    backgroundColor: "{colors.aurora-mint}"
    textColor: "{colors.on-aurora}"
    rounded: "{rounded.pill}"
    padding: "0 1.25rem"
    height: "46px"
  button-ghost:
    backgroundColor: "{colors.night-raised}"
    textColor: "{colors.starlight}"
    rounded: "{rounded.pill}"
    padding: "0 1.25rem"
    height: "46px"
  button-sm:
    rounded: "{rounded.pill}"
    padding: "0 0.95rem"
    height: "36px"
  chip:
    backgroundColor: "{colors.night-raised}"
    textColor: "{colors.starlight}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.3rem 0.7rem"
  question-pill:
    backgroundColor: "{colors.night-raised}"
    textColor: "{colors.starlight}"
    rounded: "{rounded.pill}"
    padding: "9px 14px"
  question-pill-selected:
    backgroundColor: "{colors.aurora-mint}"
    textColor: "{colors.on-aurora}"
    rounded: "{rounded.pill}"
  explorer-tab:
    textColor: "{colors.dusk-muted}"
    rounded: "{rounded.tab}"
    padding: "12px 16px"
  explorer-tab-selected:
    backgroundColor: "{colors.night-raised}"
    textColor: "{colors.starlight}"
    rounded: "{rounded.tab}"
  project-card:
    backgroundColor: "{colors.night-raised}"
    textColor: "{colors.starlight}"
    rounded: "{rounded.card}"
    padding: "22px 22px 24px"
  explorer-panel:
    backgroundColor: "{colors.night-raised}"
    rounded: "{rounded.panel}"
    padding: "24px"
  scene-stage:
    backgroundColor: "{colors.night-raised}"
    rounded: "{rounded.stage}"
    height: "480px"
---

# Design System: Miguel García Bilbao · Portfolio

## Overview

**Creative North Star: "El observatorio nocturno"**

La web es un cielo de noche sobre el que se observa el trabajo de Miguel. La aurora (degradados radiales desenfocados en menta, cian y violeta, a la deriva lenta), un campo de estrellas estático y un grano sutil son el ambiente: están siempre detrás, nunca delante del contenido. Lo que se observa son instrumentos: el corpus con forma de cerebro, el stack desplegado en isométrico y el bucle del pipeline RAG. Cada escena es una demostración del perfil, no un adorno.

La interfaz que rodea esos instrumentos es cristal luminoso: superficies translúcidas del azul noche elevado, bordes de un pelo de luz, esquinas muy redondeadas y brillo de acento reservado a lo interactivo. La tipografía hace el trabajo de jerarquía con Archivo ensanchado y apretado en los titulares y JetBrains Mono para todo lo que suena a máquina (etiquetas, chips, prompts). La densidad es baja: secciones con mucho aire vertical, una columna de lectura corta y un único escenario 3D por sección.

Todo el contenido existe sin el cielo. Sin WebGL, con "reducir movimiento" o con puntero táctil, la aurora se queda quieta, la lente del cursor y el scroll suave desaparecen, y cada escena muestra un fallback estático con el mismo layout.

**Key Characteristics:**
- Fondo casi negro azulado con aurora fija detrás; nunca un fondo plano ni claro.
- Tres acentos con significado: menta = frontend y CTA, cian = backend y cloud, violeta = IA.
- Cristal translúcido + borde de 1 px como forma de elevación, en vez de sombras.
- Acentos sobrios y sólidos: sin degradados de acento ni neón.
- Titulares en Archivo con eje de anchura (108–120 %) y tracking negativo.
- Mono para lo técnico; sans para lo humano.
- El 3D es contenido demostrativo con fallback, nunca decoración.

## Colors

Una noche azul profunda con tres luces de aurora sobrias (poca saturación, nada de neón) que codifican el tipo de trabajo.

### Primary
- **Menta aurora** (aurora-mint): el acento principal. Relleno sólido del CTA y de la pregunta seleccionada, foco (`outline` de 2 px), cursor del "prompt", enlaces de llamada a la acción en tarjetas y categoría *frontend* en los nodos del cerebro.

### Secondary
- **Cian aurora** (aurora-cyan): halo interno de escenarios y tarjetas, líneas del pipeline, categoría *backend/cloud*.

### Tertiary
- **Violeta aurora** (aurora-violet): IA. Paso activo del pipeline RAG, estado "recuperando" del corpus, blob de aurora de la derecha y halo de contacto.

### Neutral
- **Noche** (night): fondo de la página y base de la aurora.
- **Noche elevada** (night-raised): base de toda superficie de cristal, siempre mezclada con transparencia (40–70 %) para que la aurora se intuya detrás.
- **Luz de estrella** (starlight): texto principal y categoría *producto*.
- **Crepúsculo** (dusk-muted): texto secundario, metadatos y pestañas no seleccionadas (contraste AA sobre la noche).
- **Pelo de luz** (hairline): bordes y divisores de 1 px.
- **Tinta sobre aurora** (on-aurora): texto sobre cualquier relleno de acento (CTA menta, índice violeta del RAG).

### Named Rules
**The Meaningful Light Rule.** Cada acento significa una categoría (frontend, backend, IA) y se reutiliza con el mismo significado en nodos, listas y escenas mediante `data-cat` / `--node`. Un acento no se usa como color decorativo arbitrario.

**The Sober Light Rule.** Los acentos se usan sólidos y con halos cortos; nada de degradados de acento en botones ni en texto. La aurora del fondo se mantiene tenue (opacidad 0.26).

**The Token Source Rule.** Los colores viven solo en el `@theme` de `src/app/globals.css`. Fuera de ahí se permiten valores literales únicamente en shaders y en imágenes OG.

## Typography

**Display Font:** Archivo variable (eje `wdth`), con system-ui como fallback
**Body Font:** Archivo al 100 % de anchura
**Label/Mono Font:** JetBrains Mono, con ui-monospace / Menlo

**Character:** una grotesca ancha y prieta que suena a ingeniería con voz propia, acompañada de una mono para lo que la máquina "dice".

### Hierarchy
- **Display**: nombre del Hero y titular de contacto (este último sube hasta 8.5rem). Siempre con `text-wrap: balance`.
- **Headline**: títulos de sección.
- **Title**: títulos de tarjeta de proyecto y respuestas destacadas.
- **Lead**: entradilla del Hero y descripción del explorador; máx. 38–40ch.
- **Body**: texto corrido; columnas de 52–62ch con `text-wrap: pretty`.
- **Label**: chips, índices de pasos, prompts y etiquetas técnicas.
- **Métricas**: Archivo 760 al 120 % de anchura, `tabular-nums`, `clamp(1.9rem, 3.4vw, 2.6rem)`.

Escala ≈ 1.25 sobre una base de 17 px (`--step--1` a `--step-4` y `--step-display`).

### Named Rules
**The Stretch for Voice Rule.** La anchura crece con la jerarquía (100 % en texto, 108 % en títulos, 112 % en secciones, 118–120 % en display y métricas) y el tracking se aprieta en la misma proporción. El texto corrido nunca se ensancha.

**The Machine Speaks Mono Rule.** JetBrains Mono solo para lo que es técnico o generado: chips de tecnología, numeración de pasos, prompts y fuentes del corpus.

## Layout

Una columna contenida de `1240px` con márgenes fluidos (`clamp(20px, 4vw, 40px)`) y secciones con mucho aire vertical (`clamp(80px, 12vw, 152px)`). El header fijo mide 64 px y desplaza el scroll de las anclas.

- **Hero:** a partir de 1024 px, dos columnas (1.1fr texto / 0.9fr escenario), con el escenario 3D *sticky* a pantalla completa. En móvil se apila, el cuerpo del Hero se oculta y los CTA se estiran a todo el ancho.
- **Exploradores (stack y RAG):** escenario + UI en dos columnas (1.05fr / 0.95fr) a partir de 1024 px; apilados por debajo.
- **Proyectos:** tres columnas a partir de 900 px.
- **Breakpoints usados:** 640, 720, 768, 900 y 1024 px.

**The One Stage Rule.** Como mucho un escenario 3D por sección, y solo se monta cuando la sección es visible.

## Elevation & Depth

La profundidad no viene de sombras proyectadas, sino de capas de cristal: superficies de *noche elevada* translúcidas sobre la aurora, con `backdrop-filter: blur` en el header (14 px) y en el panel del corpus (10 px), y un borde de *pelo de luz*. Las únicas "sombras" son halos de luz de color: el resplandor bajo el CTA, el brillo de los puntos de nodo y los degradados radiales internos de escenarios y tarjetas.

**The Glow Not Shadow Rule.** Una superficie se eleva con translucidez y borde, no con `box-shadow` oscura. El halo de color se reserva a lo interactivo (CTA, nodos, fuentes del corpus).

## Shapes

Formas suaves y orgánicas, como luz difusa. Lo interactivo pequeño es píldora (999 px); los contenedores se redondean más cuanto más grandes son: índices 8 px, pestañas 14 px, paneles 20–22 px, tarjetas 24 px y escenarios 28 px. Los puntos de nodo son círculos de 6–8 px con halo.

**The Bigger Is Softer Rule.** El radio crece con el tamaño del contenedor; nunca se mezclan esquinas rectas con esta familia.

## Components

### Buttons
- **Carácter:** píldoras de luz.
- **Shape:** píldora (999 px), 46 px de alto (36 px en la variante pequeña del header).
- **Primary:** menta sólido con texto *tinta sobre aurora* y un halo menta corto debajo; en hover se aclara un poco hacia luz de estrella.
- **Ghost:** cristal de noche elevada al 40 % con borde de luz de estrella al 28 %; en hover el borde pasa a luz de estrella pleno.
- **Active:** baja 1 px. Transiciones de 0.25 s con `ease-out-soft`.

### Chips
- **Style:** píldora de cristal (noche elevada al 55 %) con borde *pelo de luz* y texto en mono.
- **Fuentes del corpus:** el borde y un punto con halo toman el color de su categoría (`--node`).

### Question pills ("Pregúntale a mi corpus")
- **Unselected:** cristal con borde menta al 32 %; hover a menta pleno.
- **Selected:** menta sólido como el CTA, texto *tinta sobre aurora* en 600.

### Cards / Containers
- **Project card:** radio 24 px, cristal de noche elevada al 70 % con un halo cian que sigue al puntero (`--mx`/`--my`) y una ligera inclinación 3D; en hover/foco el borde toma menta al 45 %. Arte del proyecto en 16:10 arriba, "ver proyecto" en menta al pie.
- **Scene stage:** radio 28 px, borde *pelo de luz*, halo cian al 10 % sobre noche elevada; 360 px de alto mínimo (480 px desde 1024 px).
- **Explorer panel:** radio 20 px, cristal al 60 %, borde *pelo de luz* con el borde superior teñido del color de la categoría.

### Navigation
- **Header:** fijo, 64 px, cristal de noche al 62 % con `blur(14px) saturate(140%)` y borde inferior *pelo de luz*. Enlaces en crepúsculo que pasan a luz de estrella en hover.
- **Móvil:** el menú se pliega en un `<details>`; el cambio de idioma (ES/EN) se mantiene visible.

### Explorer tabs (stack y RAG)
- Lista vertical de pestañas de 14 px de radio con índice mono de 26 px. Seleccionada: texto luz de estrella, cristal al 70 % y borde *pelo de luz*; el índice se rellena con el color de la categoría (stack) o con violeta (pasos del RAG).

### Signature: Aurora
Capa fija detrás de todo: degradado radial de noche, cuatro blobs desenfocados (70 px, opacidad 0.26, `mix-blend-mode: screen`) que derivan entre 28 y 46 s, estrellas en canvas 2D y grano al 5 %. Con "reducir movimiento" se queda quieta.

### Signature: Barrido de recuperación
El único momento de movimiento con autoría: mientras el corpus "recupera fragmentos" (600 ms), una banda de luz menta → cian → violeta cruza el cerebro de izquierda a derecha (`mix-blend-mode: screen`, máscara elíptica para que no se vean bordes de caja, curva simétrica). Solo CSS (`:has()` sobre el estado del panel). Con "reducir movimiento" no aparece.

### Signature: Lente de observatorio (cursor)
El cursor nativo se mantiene siempre. Detrás del contenido y encima de la aurora, un halo tenue (420 px, menta al 14 % → cian al 7 %, `mix-blend-mode: screen`) sigue al ratón sin retardo y aviva el cielo bajo el puntero; sobre enlaces y botones se recoge al 42 %, como una lente que enfoca. Solo con puntero fino y sin "reducir movimiento"; sin canvas.

## Do's and Don'ts

### Do:
- **Do** construir cada superficie nueva como cristal: noche elevada con transparencia, borde *pelo de luz* y el radio que le toque por tamaño.
- **Do** reutilizar los acentos con su significado (menta frontend/CTA, cian backend, violeta IA) a través de `data-cat` y `--node`.
- **Do** reservar el menta sólido para la acción principal y el estado seleccionado.
- **Do** dar a toda escena 3D un fallback estático con el mismo layout y `aria-hidden` en el canvas.
- **Do** respetar `prefers-reduced-motion` y el puntero táctil en cualquier movimiento nuevo.

### Don't:
- **Don't** poner fondos claros o planos; la aurora siempre se intuye detrás.
- **Don't** usar sombras oscuras proyectadas para elevar superficies.
- **Don't** introducir colores fuera del `@theme` de `globals.css` (salvo shaders e imágenes OG).
- **Don't** usar la mono para texto corrido ni ensanchar Archivo en el cuerpo de texto.
- **Don't** añadir efectos que no cuenten algo del trabajo de Miguel.

- **Don't** marcar paneles con un borde lateral grueso de color (side-tab); la categoría se expresa con el punto de nodo, el índice relleno o un borde superior teñido de 1 px.
- **Don't** usar texto con degradado (`background-clip: text`) ni degradados de acento en botones; el énfasis viene del peso, el tamaño o un subrayado menta.

### Excepciones de marca en el detector
La aurora del fondo (`radial-halo`) y el halo de color bajo el CTA principal (`dark-glow`) son la identidad del observatorio: están silenciados en `.impeccable/config.json`.
