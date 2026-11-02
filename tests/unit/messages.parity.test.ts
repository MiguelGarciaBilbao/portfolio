import { expect, test } from 'vitest';
import es from '../../messages/es.json';
import en from '../../messages/en.json';

function keys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? keys(v as Record<string, unknown>, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );
}

test('es and en have identical key sets', () => {
  expect(keys(en).sort()).toEqual(keys(es).sort());
  expect(keys(es).length).toBeGreaterThan(10);
});
