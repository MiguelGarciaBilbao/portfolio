import { describe, expect, test } from 'vitest';
import * as profileMod from '@/content/profile';
import * as experienceMod from '@/content/experience';
import * as educationMod from '@/content/education';
import * as stackMod from '@/content/stack';
import * as metricsMod from '@/content/metrics';
import * as projectsMod from '@/content/projects';
import * as ragMod from '@/content/rag';

const allContent = {
  ...profileMod,
  ...experienceMod,
  ...educationMod,
  ...stackMod,
  ...metricsMod,
  ...projectsMod,
  ...ragMod,
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
});
