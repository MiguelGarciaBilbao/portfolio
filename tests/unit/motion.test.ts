import { describe, expect, test } from 'vitest';
import { classifyGpu, downgrade, QUALITY } from '@/lib/motion';

describe('classifyGpu', () => {
  test('software renderers are low', () => {
    expect(classifyGpu({ renderer: 'Google SwiftShader' })).toBe('low');
    expect(classifyGpu({ cores: 16, memoryGb: 32, renderer: 'llvmpipe (LLVM 15)' })).toBe('low');
  });
  test('4 cores is low even with 8GB', () => {
    expect(classifyGpu({ cores: 4, memoryGb: 8 })).toBe('low');
  });
  test('8 cores / 8GB is medium', () => {
    expect(classifyGpu({ cores: 8, memoryGb: 8 })).toBe('medium');
  });
  test('12 cores / 16GB Apple M2 is high', () => {
    expect(classifyGpu({ cores: 12, memoryGb: 16, renderer: 'Apple M2' })).toBe('high');
  });
  test('unknown hardware is medium', () => {
    expect(classifyGpu({})).toBe('medium');
  });
});

describe('quality tiers', () => {
  test('downgrade steps down and floors at low', () => {
    expect(downgrade('high')).toBe('medium');
    expect(downgrade('medium')).toBe('low');
    expect(downgrade('low')).toBe('low');
  });
  test('QUALITY values match the spec', () => {
    expect(QUALITY.high).toEqual({ particles: 5000, dpr: 2, bloom: true });
    expect(QUALITY.medium).toEqual({ particles: 3000, dpr: 1.5, bloom: true });
    expect(QUALITY.low).toEqual({ particles: 1500, dpr: 1, bloom: false });
  });
});
