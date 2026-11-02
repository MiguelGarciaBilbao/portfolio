import type { Category } from '@/content/types';

/**
 * Generador determinista de la nube de puntos del cerebro (spec §5.01, plan Task 6).
 * Función pura: la usan la escena 3D (BrainCorpus) y el fallback SVG (BrainFallback),
 * así ambos dibujan exactamente el mismo cerebro.
 */

export interface BrainInputNode {
  id: string;
  category: Category;
}

export interface BrainGeometry {
  /** xyz intercalado, length = particleCount * 3 */
  particles: Float32Array;
  nodes: { id: string; category: Category; position: [number, number, number] }[];
  /** índices en `nodes`, i < j, sin duplicados */
  edges: [number, number][];
}

export const BRAIN_SEED = 1499;

export const LOBES: Record<Category, [number, number, number]> = {
  frontend: [-0.65, 0.2, 0.45],
  backend: [0.65, 0.2, 0.45],
  ai: [0, 0.4, -0.45],
  product: [0, -0.1, 0.15],
};

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HEMI_X = 0.55;
const RADII: [number, number, number] = [0.85, 0.7, 1.0];
const BOX = { x: [-1.45, 1.45], y: [-1.25, 0.75], z: [-1.05, 1.05] } as const;

/** Distancia normalizada al hemisferio más cercano (1 = superficie deformada). */
function hemisphereLevel(x: number, y: number, z: number): number {
  const wobble = 1 + 0.06 * Math.sin(7 * x) * Math.sin(6 * y) * Math.sin(5 * z);
  const level = (cx: number) =>
    Math.sqrt(((x - cx) / RADII[0]) ** 2 + (y / RADII[1]) ** 2 + (z / RADII[2]) ** 2) / wobble;
  return Math.min(level(-HEMI_X), level(HEMI_X));
}

function inStem(x: number, y: number, z: number): boolean {
  return y >= -1.2 && y <= -0.4 && Math.hypot(x, z + 0.25) < 0.18;
}

export function insideBrain(x: number, y: number, z: number): boolean {
  if (inStem(x, y, z)) return true;
  if (Math.abs(x) < 0.05 && y > -0.35) return false; // cisura interhemisférica
  return hemisphereLevel(x, y, z) < 1;
}

function sampleBox(rand: () => number): [number, number, number] {
  return [
    BOX.x[0] + rand() * (BOX.x[1] - BOX.x[0]),
    BOX.y[0] + rand() * (BOX.y[1] - BOX.y[0]),
    BOX.z[0] + rand() * (BOX.z[1] - BOX.z[0]),
  ];
}

function sampleNear(
  rand: () => number,
  center: [number, number, number],
  radius: number,
): [number, number, number] {
  // punto uniforme en una esfera por rechazo en el cubo
  for (;;) {
    const p: [number, number, number] = [rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1];
    if (p[0] ** 2 + p[1] ** 2 + p[2] ** 2 <= 1) {
      return [center[0] + p[0] * radius, center[1] + p[1] * radius, center[2] + p[2] * radius];
    }
  }
}

export function generateBrain(o: {
  seed: number;
  particleCount: number;
  nodes: BrainInputNode[];
  k?: number;
}): BrainGeometry {
  const rand = mulberry32(o.seed);
  const k = o.k ?? 3;

  // Partículas: ~70 % en la "corteza" (cerca de la superficie) para que se lea la forma.
  const particles = new Float32Array(o.particleCount * 3);
  let n = 0;
  while (n < o.particleCount) {
    // redondeo a float32 antes de validar: lo que se guarda es lo que se comprueba
    const [x, y, z] = sampleBox(rand).map(Math.fround) as [number, number, number];
    if (!insideBrain(x, y, z)) continue;
    const wantShell = rand() < 0.7;
    if (wantShell && !inStem(x, y, z) && hemisphereLevel(x, y, z) < 0.78) continue;
    particles[n * 3] = x;
    particles[n * 3 + 1] = y;
    particles[n * 3 + 2] = z;
    n++;
  }

  // Nodos documento agrupados por lóbulo según su categoría.
  const nodes = o.nodes.map((node) => {
    const lobe = LOBES[node.category];
    let position: [number, number, number] | null = null;
    for (let attempt = 0; attempt < 1000 && !position; attempt++) {
      const p = sampleNear(rand, lobe, attempt < 500 ? 0.38 : 0.6);
      if (insideBrain(...p)) position = p;
    }
    return { id: node.id, category: node.category, position: position ?? [HEMI_X, 0, 0] };
  });

  // Aristas: k vecinos más cercanos, pares normalizados i < j y deduplicados.
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  nodes.forEach((a, i) => {
    const nearest = nodes
      .map((b, j) => ({
        j,
        d:
          (a.position[0] - b.position[0]) ** 2 +
          (a.position[1] - b.position[1]) ** 2 +
          (a.position[2] - b.position[2]) ** 2,
      }))
      .filter(({ j }) => j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, k);
    for (const { j } of nearest) {
      const pair: [number, number] = i < j ? [i, j] : [j, i];
      const key = `${pair[0]}-${pair[1]}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push(pair);
      }
    }
  });

  return { particles, nodes, edges };
}
