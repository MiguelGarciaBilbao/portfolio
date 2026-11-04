import { isoBox, iso } from '@/lib/iso';

export interface RagStepNode {
  id: string;
  label: string;
}

const COLORS = ['#4FB3E8', '#3FD8A0', '#3FD8A0', '#4FB3E8', '#9A87F2', '#9A87F2'];

export function ringPositions(n: number, rx: number, ry: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.cos(a) * rx, y: Math.sin(a) * ry };
  });
}

/** Circuito RAG isométrico estático: seis bloques y el bucle informes → corpus. */
export function RagPipelineFallback({
  steps,
  activeId,
}: {
  steps: RagStepNode[];
  activeId: string;
}) {
  const ring = ringPositions(steps.length, 120, 120);
  const S = 34;
  const path = ring
    .map((p, i) => {
      const [x, y] = iso(p.x, p.y, 10);
      return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg viewBox="-220 -160 440 320" className="iso-fallback" aria-hidden="true" focusable="false">
      <path
        d={`${path} Z`}
        fill="none"
        stroke="#4FB3E8"
        strokeOpacity={0.4}
        strokeDasharray="5 6"
      />
      {steps.map((s, i) => {
        const p = ring[i];
        const on = s.id === activeId;
        const c = COLORS[i % COLORS.length];
        const f = isoBox(p.x - S / 2, p.y - S / 2, on ? 10 : 0, S, S, on ? 30 : 20);
        const [lx, ly] = iso(p.x, p.y, on ? 52 : 40);
        return (
          <g key={s.id} data-step={s.id} data-active={on ? 'true' : 'false'} opacity={on ? 1 : 0.7}>
            <polygon points={f.left} fill={c} fillOpacity={0.15} stroke={c} strokeOpacity={0.6} />
            <polygon points={f.right} fill={c} fillOpacity={0.28} stroke={c} strokeOpacity={0.6} />
            <polygon points={f.top} fill={c} fillOpacity={on ? 0.6 : 0.3} stroke={c} />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              fill="#E8EEF7"
              fontSize={11}
              fontFamily="var(--font-mono)"
            >
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
