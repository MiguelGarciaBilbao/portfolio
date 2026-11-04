// Fondo de aurora: degradados con CSS (sin WebGL) + campo de estrellas estático + grano.

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const rand = lcg(20260);
const STARS = Array.from({ length: 120 }, () => ({
  x: +(rand() * 100).toFixed(2),
  y: +(rand() * 100).toFixed(2),
  r: +(0.4 + rand() * 1.1).toFixed(2),
  o: +(0.15 + rand() * 0.55).toFixed(2),
}));

export function Aurora() {
  return (
    <div className="aurora" aria-hidden="true" data-testid="aurora">
      <div className="aurora__blob aurora__blob--1" />
      <div className="aurora__blob aurora__blob--2" />
      <div className="aurora__blob aurora__blob--3" />
      <div className="aurora__blob aurora__blob--4" />
      <svg className="aurora__stars" preserveAspectRatio="none">
        {STARS.map((s, i) => (
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="#E8EEF7" opacity={s.o} />
        ))}
      </svg>
      <svg className="aurora__grain">
        <filter id="aurora-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#aurora-grain)" />
      </svg>
    </div>
  );
}
