import type { Category } from '@/content/types';
import { CATEGORY_COLOR } from './colors';
import { isoBox, iso } from '@/lib/iso';

const COLOR = CATEGORY_COLOR;

export interface IsoLayer {
  id: string;
  category: Category;
  label: string;
}

/** Despiece isométrico estático (mismo orden y colores que la escena 3D). */
export function IsoStackFallback({
  layers,
  selectedId,
}: {
  layers: IsoLayer[];
  selectedId: string;
}) {
  const W = 150;
  const D = 100;
  const H = 14;
  const GAP = 46;
  return (
    <svg viewBox="-150 -150 420 330" className="iso-fallback" aria-hidden="true" focusable="false">
      {[...layers].reverse().map((l, ri) => {
        const i = layers.length - 1 - ri;
        const z = (layers.length - 1 - i) * GAP - 80;
        const f = isoBox(-W / 2, -D / 2, z, W, D, H);
        const on = l.id === selectedId;
        const c = COLOR[l.category];
        const [lx, ly] = iso(W / 2, -D / 2, z + H / 2);
        return (
          <g
            key={l.id}
            data-layer={l.id}
            data-active={on ? 'true' : 'false'}
            opacity={on ? 1 : 0.62}
          >
            <polygon points={f.left} fill={c} fillOpacity={0.12} stroke={c} strokeOpacity={0.5} />
            <polygon points={f.right} fill={c} fillOpacity={0.2} stroke={c} strokeOpacity={0.5} />
            <polygon
              points={f.top}
              fill={c}
              fillOpacity={on ? 0.42 : 0.18}
              stroke={c}
              strokeWidth={on ? 1.6 : 1}
            />
            <line x1={lx} y1={ly} x2={lx + 26} y2={ly} stroke={c} strokeOpacity={0.6} />
            <text x={lx + 32} y={ly + 4} fill="#E8EEF7" fontSize={12} fontFamily="var(--font-mono)">
              {l.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
