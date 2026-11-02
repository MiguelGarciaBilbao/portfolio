'use client';

import { useEffect } from 'react';
import { useFinePointer, useReducedMotion } from '@/lib/motion';

/** Lenis solo en escritorio y sin "reducir movimiento" (spec §4.2). */
export function SmoothScroll() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!fine || reduced) return;
    let destroyed = false;
    let cleanup = () => {};
    import('lenis').then(({ default: Lenis }) => {
      if (destroyed) return;
      const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 }, autoRaf: true });
      cleanup = () => lenis.destroy();
    });
    return () => {
      destroyed = true;
      cleanup();
    };
  }, [fine, reduced]);

  return null;
}
