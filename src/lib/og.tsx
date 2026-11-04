import { ImageResponse } from 'next/og';
import { generateBrain, BRAIN_SEED } from '@/lib/brain-geometry';
import { corpusNodes } from '@/content/corpus';

/**
 * Imagen Open Graph común (spec §10): fondo --bg, tres degradados de aurora,
 * título en blanco, subtítulo en --muted y el cerebro en SVG simplificado.
 * Los colores van en literal: las imágenes OG son una de las excepciones de la regla 8.
 */
export const OG_SIZE = { width: 1200, height: 630 };

const BG = '#05070f';
const INK = '#E8EEF7';
const MUTED = '#8D9AB0';
const CAT: Record<string, string> = {
  frontend: '#3FD8A0',
  backend: '#4FB3E8',
  ai: '#9A87F2',
  product: '#E8EEF7',
};

const AURORA = [
  'radial-gradient(circle at 12% 0%, rgba(63,216,160,0.34) 0%, rgba(63,216,160,0) 55%)',
  'radial-gradient(circle at 88% 10%, rgba(154,135,242,0.36) 0%, rgba(154,135,242,0) 55%)',
  'radial-gradient(circle at 60% 110%, rgba(79,179,232,0.26) 0%, rgba(79,179,232,0) 60%)',
];

function brainSvg() {
  const g = generateBrain({
    seed: BRAIN_SEED,
    particleCount: 420,
    nodes: corpusNodes.map((n) => ({ id: n.id, category: n.category })),
  });
  // misma proyección frontal (x, y) que BrainFallback
  const S = 150;
  const cx = 250;
  const cy = 200;
  const project = (x: number, y: number) => ({ x: cx + x * S, y: cy - y * S });
  const dots = [];
  for (let i = 0; i < g.particles.length; i += 3) {
    const x = g.particles[i];
    const p = project(x, g.particles[i + 1]);
    const o = 0.3 + 0.45 * ((g.particles[i + 2] + 1) / 2);
    dots.push(
      <circle
        key={`p${i}`}
        cx={p.x.toFixed(1)}
        cy={p.y.toFixed(1)}
        r="1.7"
        fill={x < 0 ? '#3FD8A0' : '#4FB3E8'}
        fillOpacity={o.toFixed(2)}
      />,
    );
  }
  const edges = g.edges.map(([i, j]) => {
    const a = project(g.nodes[i].position[0], g.nodes[i].position[1]);
    const b = project(g.nodes[j].position[0], g.nodes[j].position[1]);
    return (
      <line
        key={`e${i}-${j}`}
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke="#4FB3E8"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
    );
  });
  const nodes = g.nodes.map((n) => {
    const p = project(n.position[0], n.position[1]);
    return (
      <circle key={n.id} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="4.5" fill={CAT[n.category]} />
    );
  });
  return (
    <svg width="500" height="420" viewBox="0 0 500 420">
      {dots}
      {edges}
      {nodes}
    </svg>
  );
}

export function renderOg({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        background: BG,
        color: INK,
        fontFamily: 'Geist',
      }}
    >
      {AURORA.map((bg, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: 'flex',
            backgroundImage: bg,
          }}
        />
      ))}
      <div style={{ position: 'absolute', right: 30, top: 105, display: 'flex' }}>{brainSvg()}</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '72px 80px',
          width: 760,
          height: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, color: MUTED }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: '#3FD8A0' }} />
          {eyebrow}
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: title.length > 40 ? 58 : 76,
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
            color: INK,
          }}
        >
          {title}
        </div>
        <div style={{ marginTop: 26, fontSize: 28, lineHeight: 1.35, color: MUTED }}>
          {subtitle}
        </div>
      </div>
    </div>,
    OG_SIZE,
  );
}
