import { useCallback, useSyncExternalStore } from 'react';

export type Tier = 'low' | 'medium' | 'high';

export const QUALITY: Record<Tier, { particles: number; dpr: number; bloom: boolean }> = {
  high: { particles: 5000, dpr: 2, bloom: true },
  medium: { particles: 3000, dpr: 1.5, bloom: true },
  low: { particles: 1500, dpr: 1, bloom: false },
};

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|software|mali-4|adreno \(tm\) 3/i;

/** Heurística de nivel de GPU (spec §9). Sin datos suficientes → 'medium'. */
export function classifyGpu(i: { cores?: number; memoryGb?: number; renderer?: string }): Tier {
  if (i.renderer && SOFTWARE_RENDERER.test(i.renderer)) return 'low';
  if ((i.cores !== undefined && i.cores <= 4) || (i.memoryGb !== undefined && i.memoryGb <= 4)) {
    return 'low';
  }
  if (i.cores !== undefined && i.cores >= 10 && (i.memoryGb ?? 8) >= 8) return 'high';
  return 'medium';
}

export function downgrade(t: Tier): Tier {
  return t === 'high' ? 'medium' : 'low';
}

/** matchMedia reactivo; en SSR (y en la hidratación) devuelve `false`. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function useCoarsePointer(): boolean {
  return useMediaQuery('(pointer: coarse)');
}

export function useFinePointer(): boolean {
  return useMediaQuery('(pointer: fine)');
}
