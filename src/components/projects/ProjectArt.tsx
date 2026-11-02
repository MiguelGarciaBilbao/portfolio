import { isoBox, iso } from '@/lib/iso';

type Kind = 'rag' | 'timeseries' | 'oem';

function Box({
  x,
  y,
  z,
  w,
  d,
  h,
  color,
  className,
}: {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color: string;
  className?: string;
}) {
  const f = isoBox(x, y, z, w, d, h);
  return (
    <g className={className}>
      <polygon points={f.left} fill={color} fillOpacity={0.18} stroke={color} strokeOpacity={0.7} />
      <polygon
        points={f.right}
        fill={color}
        fillOpacity={0.32}
        stroke={color}
        strokeOpacity={0.7}
      />
      <polygon points={f.top} fill={color} fillOpacity={0.55} stroke={color} />
    </g>
  );
}

function RagArt() {
  // Seis bloques del pipeline en anillo; el último vuelve al corpus.
  const colors = ['#26C6FF', '#2EF5B0', '#2EF5B0', '#26C6FF', '#8B5CF6', '#8B5CF6'];
  const ring = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.cos(a) * 62, y: Math.sin(a) * 62 };
  });
  const path = ring
    .map((p, i) => {
      const [sx, sy] = iso(p.x + 12, p.y + 12, 14);
      return `${i === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`;
    })
    .join(' ');
  return (
    <g transform="translate(160 118)">
      <path
        d={`${path} Z`}
        fill="none"
        stroke="#8B5CF6"
        strokeDasharray="4 5"
        strokeOpacity={0.8}
      />
      {ring.map((p, i) => (
        <Box key={i} x={p.x} y={p.y} z={0} w={24} d={24} h={14 + (i % 3) * 6} color={colors[i]} />
      ))}
    </g>
  );
}

function TimeseriesArt({ thresholdLabel }: { thresholdLabel: string }) {
  // Curva ilustrativa (sin datos reales) con el umbral de hipoglucemia de 70 mg/dL.
  const ys = [118, 132, 126, 104, 92, 98, 120, 140, 128, 106, 88, 76, 70, 74, 96, 112];
  const toY = (v: number) => 210 - v;
  const d = ys.map((v, i) => `${i === 0 ? 'M' : 'L'}${24 + i * 18},${toY(v)}`).join(' ');
  return (
    <g>
      <line x1={20} x2={300} y1={toY(70)} y2={toY(70)} stroke="#8B5CF6" strokeDasharray="5 5" />
      <text x={24} y={toY(70) + 18} fill="#8A9BB8" fontSize={11}>
        {thresholdLabel}
      </text>
      <path d={d} fill="none" stroke="url(#ts-grad)" strokeWidth={3} strokeLinecap="round" />
      <path
        d={`M${24 + 11 * 18},${toY(88)} L${24 + 15 * 18},${toY(58)}`}
        stroke="#2EF5B0"
        strokeWidth={2}
        strokeDasharray="2 6"
        strokeLinecap="round"
      />
      <circle cx={24 + 12 * 18} cy={toY(70)} r={6} fill="#8B5CF6" />
      <defs>
        <linearGradient id="ts-grad" x1="0" x2="1">
          <stop offset="0" stopColor="#26C6FF" />
          <stop offset="1" stopColor="#2EF5B0" />
        </linearGradient>
      </defs>
    </g>
  );
}

function OemArt() {
  // Pieza en tres partes que se separan al pasar el ratón (CSS: .project-card:hover .oem-*).
  return (
    <g transform="translate(160 150)">
      <Box className="oem-base" x={-40} y={-40} z={0} w={80} d={80} h={18} color="#26C6FF" />
      <Box className="oem-mid" x={-28} y={-28} z={18} w={56} d={56} h={16} color="#2EF5B0" />
      <Box className="oem-top" x={-14} y={-14} z={34} w={28} d={28} h={22} color="#8B5CF6" />
    </g>
  );
}

export function ProjectArt({
  kind,
  size = 'card',
  thresholdLabel = '',
}: {
  kind: Kind;
  size?: 'card' | 'hero';
  thresholdLabel?: string;
}) {
  return (
    <svg
      viewBox="0 0 320 220"
      className={`project-art project-art--${size}`}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {kind === 'rag' && <RagArt />}
      {kind === 'timeseries' && <TimeseriesArt thresholdLabel={thresholdLabel} />}
      {kind === 'oem' && <OemArt />}
    </svg>
  );
}
