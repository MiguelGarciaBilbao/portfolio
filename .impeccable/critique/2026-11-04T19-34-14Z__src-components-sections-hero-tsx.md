---
target: Hero + Pregúntale a mi corpus (build bdb6a38)
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/Users/miguelgarcia/proyectos/portfolio/src/components/sections/Hero.tsx"
target_fingerprint: "sha256:0f2e761706d9c2caf4c83916cee5bd8e337158244f27cfc2e5dd9b34664d6346"
target_path: /Users/miguelgarcia/proyectos/portfolio/src/components/sections/Hero.tsx
timestamp: 2026-11-04T19-34-14Z
slug: src-components-sections-hero-tsx
---
Method: dual-agent (A: design review · B: detector + rendered scan), build local de bdb6a38

## Design Health Score (Hero + Ask)
| # | Heurística | Nota | Problema clave |
|---|---|---|---|
| 1 | Visibilidad del estado | 2 | Barrido imperceptible; en móvil la respuesta se escribe fuera de pantalla |
| 2 | Lenguaje del usuario | 3 | "corpus", "query:" pueden despistar a un reclutador no técnico |
| 3 | Control y libertad | 3 | La respuesta automática cede ante la elección del visitante |
| 4 | Consistencia | 3 | CV duplicado; el enlace de la leyenda compite como 4.º CTA |
| 5 | Prevención de errores | 3 | Email del Hero sin dirección visible ni copiar |
| 6 | Reconocer vs recordar | 3 | En móvil la fila de preguntas queda bajo el cerebro al leer |
| 7 | Flexibilidad | n/a | Landing persuasiva |
| 8 | Estética y minimalismo | 3 | Muro de 9 pills en escritorio; rol y entradilla repiten "full stack" |
| 9 | Recuperación de errores | 3 | mailto fallido sin feedback |
| 10 | Ayuda | n/a | Landing |
| **Total** | | **23/32 (72 %)** | **Bueno** |

## Veredicto
Escritorio: autoría propia (cerebro que ilumina las fuentes citadas, prompt mono, chips enlazados, leyenda). Móvil: el pliegue sigue siendo intercambiable; la prueba queda debajo. Detector: Hero limpio; desaparecen contraste, side-tab y gradient-text; solo avisos tipográficos fuera del Hero y ProjectArt (falso positivo).

## Priority issues
1. [P1] Cerebro 3D en móvil saturado (gl_PointSize en píxeles de dispositivo, cámara fija) → adapt
2. [P1] Falta "qué busco / dónde / remoto" en el pliegue (textos ya existen) → clarify
3. [P2] Email: CTA más débil, mailto sin dirección ni copiar → harden
4. [P2] Coreografía Ask en móvil: pregunta y respuesta nunca juntas; la respuesta se escribe fuera de pantalla → layout
5. [P2] Barrido imperceptible y el panel salta de altura (CLS) → animate

## Persona red flags
Reclutador móvil: pasa el pliegue en 1 s, pero no ve abierto a / rol / remoto / LinkedIn. Casey: medio viewport de cerebro fijo; respuesta fuera de pantalla. Riley: panel rebota hasta 146 px; Safari SE real (320×460) recorta los CTA.

## Minor
Punto medio colgando en el rol; h1 en 3 líneas a 375; lente casi invisible (y se recoge detrás del botón); estado "Máster IA" el texto más pequeño; hamburguesa y ES/EN de 40 px; franja entre header y cerebro fijo en móvil.
