---
target: Hero (primer viewport de la home)
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/Users/miguelgarcia/proyectos/portfolio/src/components/sections/Hero.tsx"
target_fingerprint: "sha256:5eaee1f4cf4355f0cd23594e401425cd56aaee562c94131997877329947482a2"
target_path: /Users/miguelgarcia/proyectos/portfolio/src/components/sections/Hero.tsx
timestamp: 2026-11-04T18-48-14Z
slug: src-components-sections-hero-tsx
---
Method: dual-agent (A: design review · B: detector + rendered scan)

## Design Health Score (Hero / primer viewport)

| # | Heurística | Nota | Problema clave |
|---|---|---|---|
| 1 | Visibilidad del estado | 3 | El cerebro no indica qué es ni que reacciona (tooltips solo con puntero fino) |
| 2 | Lenguaje del usuario | 3 | "nettrim · Data Intelligence Hub" no dice nada a un reclutador |
| 3 | Control y libertad | 3 | El menú móvil no se cierra con Escape ni tocando fuera |
| 4 | Consistencia | 3 | "Descargar CV" duplicado (header + hero); CSS del Hero en 3 bloques que contradicen DESIGN.md |
| 5 | Prevención de errores | 2 | Email como `mailto:` pelado: sin cliente de correo no pasa nada |
| 6 | Reconocer vs recordar | 3 | Sin leyenda de colores del cerebro |
| 7 | Flexibilidad | n/a | Landing persuasiva de un solo propósito |
| 8 | Estética y minimalismo | 3 | 6 bloques de texto antes de los CTA; rol y lead repiten "full stack" |
| 9 | Recuperación de errores | 2 | mailto / download en webviews sin alternativa |
| 10 | Ayuda | n/a | Landing |
| **Total** | | **22/32 (69 %)** | **Aceptable** |

## Veredicto de especificidad
Concepto propio (cerebro-corpus con colores por categoría), pero diferido: en el primer viewport el Hero cuenta y el 3D decora. La columna de texto sigue la plantilla de portfolio dev oscuro. Detector: 0 hallazgos en código; en render, 3 en el Hero (dark-glow del CTA, radial-halo de la aurora, contraste 4.0:1 en "Máster IA" a 1280 px por la aurora debajo) y fuera: side-tab ×2, gradient-text del email, contraste 3.7:1 en el índice violeta del RAG, ProjectArt (falso positivo).

## Priority issues
1. [P1] En móviles reales el CTA de email cae bajo el pliegue (375×667, 360×640; a 320×568 ningún CTA). e2e solo mide Pixel 7. → /impeccable adapt
2. [P1] El cerebro no demuestra nada en el primer viewport y en móvil la demo se parte (cerebro → 9 pills → respuesta, nunca juntos). → /impeccable layout + onboard
3. [P2] Render 3D en móvil sobreexpuesto (blending aditivo a DPR 2); verificar en dispositivo real. → /impeccable polish
4. [P2] Propuesta de valor redundante y sin "¿encaja?": lookingFor y "remoto" no aparecen en el Hero; en móvil se oculta Technical Lead / RAG. → /impeccable clarify
5. [P2] Jerarquía de CTA no casa con el éxito definido (email ghost y sin copia; CV duplicado). → /impeccable clarify

## Persona red flags
- Reclutador 40 s en LinkedIn webview: no ve qué busca ni "remoto"; el CV con `download` puede no hacer nada.
- Casey: "Escribirme" bajo la barra de Safari; tras tocar una pill la respuesta queda fuera de pantalla.
- Jordan: no sabe que el cerebro es interactivo ni qué significa.
- Riley: 320 px sin CTA; menú sin Escape; degradación sin WebGL y reduced-motion correcta.

## Minor
Estrellas del fondo entre palabras parecen puntuación; aria-label de la lista de estado = ubicación (oculta a videntes); rol y lead mismo tamaño; hamburguesa "☰" de texto; terminal vacía en Ask; contraste 3.7:1 en step-list__n.
