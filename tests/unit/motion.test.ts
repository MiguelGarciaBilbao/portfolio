import { describe, expect, test } from 'vitest';
import { classifyGpu, downgrade, isSoftwareRenderer, QUALITY } from '@/lib/motion';

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

describe('isSoftwareRenderer', () => {
  test('software rasterizers are detected', () => {
    expect(
      isSoftwareRenderer(
        'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (LLVM 10.0.0)), SwiftShader driver)',
      ),
    ).toBe(true);
    expect(isSoftwareRenderer('llvmpipe (LLVM 15.0.7, 256 bits)')).toBe(true);
    expect(isSoftwareRenderer('ANGLE (Microsoft, Microsoft Basic Render Driver Direct3D11)')).toBe(
      true,
    );
  });
  test('real GPUs, including old mobile ones, are not', () => {
    expect(isSoftwareRenderer('ANGLE (Apple, ANGLE Metal Renderer: Apple M1 Pro)')).toBe(false);
    expect(isSoftwareRenderer('Mali-G78')).toBe(false);
    expect(isSoftwareRenderer('Mali-400 MP')).toBe(false);
    expect(isSoftwareRenderer(undefined)).toBe(false);
  });
});
