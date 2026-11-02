import { describe, expect, test } from 'vitest';
import { BRAIN_SEED, generateBrain, insideBrain, mulberry32 } from '@/lib/brain-geometry';
import { corpusNodes } from '@/content/corpus';
import type { Category } from '@/content/types';

const nodes = corpusNodes.map(({ id, category }) => ({ id, category }));
const make = (seed = BRAIN_SEED, particleCount = 3000) => generateBrain({ seed, particleCount, nodes });

describe('mulberry32', () => {
  test('deterministic in [0,1)', () => {
    const a = mulberry32(1);
    const b = mulberry32(1);
    const xs = Array.from({ length: 50 }, () => a());
    expect(Array.from({ length: 50 }, () => b())).toEqual(xs);
    expect(xs.every((x) => x >= 0 && x < 1)).toBe(true);
  });
});

describe('generateBrain', () => {
  test('deterministic', () => {
    const a = make();
    const b = make();
    expect(Array.from(b.particles)).toEqual(Array.from(a.particles));
    expect(b.nodes).toEqual(a.nodes);
    expect(Array.from(make(2).particles)).not.toEqual(Array.from(a.particles));
  });

  test('particle count honoured', () => {
    expect(make().particles.length).toBe(3000 * 3);
  });

  test('all particles and nodes are inside the brain', () => {
    const g = make();
    for (let i = 0; i < g.particles.length; i += 3) {
      expect(insideBrain(g.particles[i], g.particles[i + 1], g.particles[i + 2])).toBe(true);
    }
    for (const n of g.nodes) expect(insideBrain(...n.position)).toBe(true);
  });

  test('nodes cluster by category', () => {
    const g = make();
    const cats: Category[] = ['frontend', 'backend', 'ai', 'product'];
    const centroid = Object.fromEntries(
      cats.map((c) => {
        const ps = g.nodes.filter((n) => n.category === c).map((n) => n.position);
        return [c, [0, 1, 2].map((k) => ps.reduce((s, p) => s + p[k], 0) / ps.length)];
      }),
    ) as Record<Category, number[]>;
    const dist = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    const ok = g.nodes.filter((n) =>
      cats.every((c) => c === n.category || dist(n.position, centroid[n.category]) < dist(n.position, centroid[c])),
    ).length;
    expect(ok / g.nodes.length).toBeGreaterThanOrEqual(0.85);
  });

  test('edges bounded and valid', () => {
    const g = make();
    expect(g.edges.length).toBeGreaterThanOrEqual(g.nodes.length);
    expect(g.edges.length).toBeLessThanOrEqual(3 * g.nodes.length);
    const seen = new Set<string>();
    for (const [i, j] of g.edges) {
      expect(i).toBeLessThan(j);
      expect(j).toBeLessThan(g.nodes.length);
      const key = `${i}-${j}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  test('node ids and order preserved', () => {
    expect(make().nodes.map((n) => n.id)).toEqual(nodes.map((n) => n.id));
  });
});

describe('insideBrain', () => {
  test('excludes the fissure, includes hemisphere centres', () => {
    expect(insideBrain(0, 0.3, 0)).toBe(false);
    expect(insideBrain(0.55, 0, 0)).toBe(true);
    expect(insideBrain(-0.55, 0, 0)).toBe(true);
  });
  test('excludes far points', () => {
    expect(insideBrain(3, 0, 0)).toBe(false);
  });
});
