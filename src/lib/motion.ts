import { useCallback, useSyncExternalStore } from 'react';

export type Tier = 'low' | 'medium' | 'high';

export const QUALITY: Record<Tier, { particles: number; dpr: number; bloom: boolean }> = {
  high: { particles: 5000, dpr: 2, bloom: true },
  medium: { particles: 3000, dpr: 1.5, bloom: true },
  low: { particles: 1500, dpr: 1, bloom: false },
};

/** GPUs antiguas o débiles: se monta la escena, pero en calidad baja. */
const WEAK_GPU = /mali-4|adreno \(tm\) 3/i;
/** Rasterizadores por software: sin GPU real, la escena bloquea el hilo principal. */
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render driver/i;

/** true si WebGL lo pinta la CPU (SwiftShader, llvmpipe, WARP…): en ese caso no se monta 3D. */
export function isSoftwareRenderer(renderer?: string): boolean {
  return !!renderer && SOFTWARE_RENDERER.test(renderer);
}

/** Heurística de nivel de GPU (spec §9). Sin datos suficientes → 'medium'. */
export function classifyGpu(i: { cores?: number; memoryGb?: number; renderer?: string }): Tier {
  if (i.renderer && (isSoftwareRenderer(i.renderer) || WEAK_GPU.test(i.renderer))) return 'low';
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
