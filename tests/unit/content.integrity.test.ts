import { describe, expect, test } from 'vitest';
import * as profileMod from '@/content/profile';
import * as experienceMod from '@/content/experience';
import * as educationMod from '@/content/education';
import * as stackMod from '@/content/stack';
import * as metricsMod from '@/content/metrics';
import * as projectsMod from '@/content/projects';
import * as ragMod from '@/content/rag';
import * as corpusMod from '@/content/corpus';

const allContent = {
  ...profileMod,
  ...experienceMod,
  ...educationMod,
  ...stackMod,
  ...metricsMod,
  ...projectsMod,
  ...ragMod,
  ...corpusMod,
};

type Problem = string;

function walkLocalized(value: unknown, path: string, problems: Problem[]) {
  if (Array.isArray(value)) {
    value.forEach((v, i) => walkLocalized(v, `${path}[${i}]`, problems));
    return;
  }
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if ('es' in obj && 'en' in obj) {
      const { es, en } = obj;
      if (typeof es === 'string' || typeof en === 'string') {
        if (typeof es !== 'string' || !es.trim()) problems.push(`${path}.es empty`);
        if (typeof en !== 'string' || !en.trim()) problems.push(`${path}.en empty`);
      } else if (Array.isArray(es) || Array.isArray(en)) {
        if (!Array.isArray(es) || !Array.isArray(en) || es.length !== en.length) {
          problems.push(`${path} es/en array length mismatch`);
        } else {
          es.forEach((v, i) => walkLocalized(v, `${path}.es[${i}]`, problems));
          en.forEach((v, i) => walkLocalized(v, `${path}.en[${i}]`, problems));
          [...es, ...en].forEach((v, i) => {
            if (typeof v === 'string' && !v.trim()) problems.push(`${path}[${i}] empty string`);
          });
        }
      } else {
        walkLocalized(es, `${path}.es`, problems);
        walkLocalized(en, `${path}.en`, problems);
      }
      return;
    }
    for (const [k, v] of Object.entries(obj)) walkLocalized(v, `${path}.${k}`, problems);
  }
}

describe('content integrity', () => {
  test('metrics match the CV exactly', () => {
    expect(metricsMod.metrics.map((m) => [m.id, m.value, m.prefix ?? ''])).toEqual([
      ['years', 5, ''],
      ['team', 5, ''],
      ['incidents', 30, '−'],
      ['legacyModules', 8, ''],
      ['phpModules', 20, '+'],
    ]);
  });

  test('every localized string is non-empty in both locales', () => {
    const problems: Problem[] = [];
    for (const [name, value] of Object.entries(allContent)) {
      if (typeof value !== 'function') walkLocalized(value, name, problems);
    }
    expect(problems).toEqual([]);
  });

  test('project slugs are the three spec slugs', () => {
    expect(projectsMod.projects.map((p) => p.slug).sort()).toEqual([
      'rag-esg',
      'tfm-hipoglucemia',
      'web-components-oem',
    ]);
  });

  test('projects have parallel ES/EN sections with an architecture section and diagram labels', () => {
    for (const p of projectsMod.projects) {
      expect(p.sections.es.map((s) => s.id)).toEqual(p.sections.en.map((s) => s.id));
      expect(p.sections.es.some((s) => s.id === 'architecture')).toBe(true);
      expect(p.diagramLabels.es.length).toBeGreaterThan(1);
      expect(p.diagramLabels.es.length).toBe(p.diagramLabels.en.length);
    }
  });

  test('getProject returns undefined for unknown slug', () => {
    expect(projectsMod.getProject('foo')).toBeUndefined();
    expect(projectsMod.getProject('rag-esg')?.slug).toBe('rag-esg');
  });

  test('no phone number in content', () => {
    const json = JSON.stringify(allContent);
    expect(json).not.toContain('680');
    expect(json).not.toContain('+34');
  });

  test('stack has 5 layers in order', () => {
    expect(stackMod.stackLayers.map((l) => l.id)).toEqual(['ui', 'svc', 'ai', 'data', 'cloud']);
  });

  test('rag has the 6 spec steps in order', () => {
    expect(ragMod.ragSteps.map((s) => s.id)).toEqual([
      'sources',
      'corpus',
      'embeddings',
      'vector',
      'llm',
      'reports',
    ]);
  });

  test('corpus has ~60 nodes with spec distribution', () => {
    const { corpusNodes } = corpusMod;
    expect(corpusNodes.length).toBeGreaterThanOrEqual(56);
    expect(corpusNodes.length).toBeLessThanOrEqual(64);
    const target = { frontend: 16, backend: 16, ai: 16, product: 12 } as const;
    for (const [cat, n] of Object.entries(target)) {
      const count = corpusNodes.filter((c) => c.category === cat).length;
      expect(Math.abs(count - n), `${cat}: ${count}`).toBeLessThanOrEqual(2);
    }
    const ids = corpusNodes.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const node of corpusNodes) {
      expect(node.id).toMatch(/^(frontend|backend|ai|product)-[a-z0-9-]+$/);
      expect(node.id.startsWith(`${node.category}-`)).toBe(true);
    }
  });

  test('qa ids are the nine spec questions', () => {
    expect(corpusMod.corpusQA.map((q) => q.id)).toEqual([
      'ai-production',
      'cloud',
      'leadership',
      'angular',
      'legacy',
      'backend',
      'clients',
      'studying',
      'looking-for',
    ]);
  });

  test('every qa source exists and count is 2..5', () => {
    const ids = new Set(corpusMod.corpusNodes.map((n) => n.id));
    for (const qa of corpusMod.corpusQA) {
      expect(qa.sources.length, qa.id).toBeGreaterThanOrEqual(2);
      expect(qa.sources.length, qa.id).toBeLessThanOrEqual(5);
      for (const s of qa.sources) expect(ids.has(s), `${qa.id} → ${s}`).toBe(true);
    }
  });

  test('every project slug has at least one node', () => {
    for (const slug of ['rag-esg', 'tfm-hipoglucemia', 'web-components-oem']) {
      expect(
        corpusMod.corpusNodes.some((n) => 'project' in n.href && n.href.project === slug),
        slug,
      ).toBe(true);
    }
  });
});
