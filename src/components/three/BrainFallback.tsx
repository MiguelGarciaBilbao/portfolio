import { BRAIN_SEED, generateBrain, type BrainInputNode } from '@/lib/brain-geometry';
import { CATEGORY_COLOR } from './colors';

const COLOR = CATEGORY_COLOR;

// Misma geometría que la escena 3D (misma semilla), proyectada en ortográfica sobre (x, y).
const cache = new Map<string, ReturnType<typeof generateBrain>>();
function geometryFor(nodes: BrainInputNode[]) {
  const key = nodes.map((n) => n.id).join('|');
  let g = cache.get(key);
  if (!g) {
    g = generateBrain({ seed: BRAIN_SEED, particleCount: 900, nodes });
    cache.set(key, g);
  }
  return g;
}

export function BrainFallback({
  nodes,
  activeIds = [],
}: {
  nodes: BrainInputNode[];
  activeIds?: string[];
}) {
  const g = geometryFor(nodes);
  const active = new Set(activeIds);
  const dots: React.ReactElement[] = [];
  for (let i = 0; i < g.particles.length; i += 3) {
    const x = g.particles[i];
    const y = -g.particles[i + 1];
    const z = g.particles[i + 2];
    dots.push(
      <circle
        key={i}
        cx={x.toFixed(3)}
        cy={y.toFixed(3)}
        r={0.011}
        fill={x < 0 ? '#3FD8A0' : '#4FB3E8'}
        opacity={(0.25 + 0.45 * ((z + 1) / 2)).toFixed(2)}
      />,
    );
  }
  return (
    <svg
      viewBox="-1.65 -0.95 3.3 2.4"
      className="brain-fallback"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id="brain-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.025" />
        </filter>
      </defs>
      <g>{dots}</g>
      <g stroke="#4FB3E8" strokeOpacity={0.22} strokeWidth={0.006}>
        {g.edges.map(([i, j]) => (
          <line
            key={`${i}-${j}`}
            x1={g.nodes[i].position[0]}
            y1={-g.nodes[i].position[1]}
            x2={g.nodes[j].position[0]}
            y2={-g.nodes[j].position[1]}
          />
        ))}
      </g>
      <g>
        {g.nodes.map((n) => {
          const on = active.has(n.id);
          return (
            <circle
              key={n.id}
              data-node={n.id}
              data-active={on ? 'true' : 'false'}
              cx={n.position[0]}
              cy={-n.position[1]}
              r={on ? 0.055 : 0.03}
              fill={COLOR[n.category]}
              filter={on ? 'url(#brain-glow)' : undefined}
              className="brain-fallback__node"
            />
          );
        })}
      </g>
    </svg>
  );
}
