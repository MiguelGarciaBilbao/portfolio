/** Proyección isométrica 2D (30°) para ilustraciones SVG. */
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);

export function iso(x: number, y: number, z: number): [number, number] {
  return [(x - y) * COS, (x + y) * SIN - z];
}

const pts = (ps: [number, number][]) =>
  ps.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' ');

/** Caras visibles (superior, izquierda, derecha) de una caja isométrica. */
export function isoBox(x: number, y: number, z: number, w: number, d: number, h: number) {
  const top = pts([
    iso(x, y, z + h),
    iso(x + w, y, z + h),
    iso(x + w, y + d, z + h),
    iso(x, y + d, z + h),
  ]);
  const left = pts([
    iso(x, y + d, z + h),
    iso(x + w, y + d, z + h),
    iso(x + w, y + d, z),
    iso(x, y + d, z),
  ]);
  const right = pts([
    iso(x + w, y, z + h),
    iso(x + w, y + d, z + h),
    iso(x + w, y + d, z),
    iso(x + w, y, z),
  ]);
  return { top, left, right };
}
