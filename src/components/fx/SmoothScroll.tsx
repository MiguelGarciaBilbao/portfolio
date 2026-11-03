'use client';

import { useEffect } from 'react';
import { useFinePointer, useReducedMotion } from '@/lib/motion';

/** Eventos que indican intención de desplazarse: hasta entonces Lenis no se descarga. */
const INTENT = ['wheel', 'keydown', 'pointerdown'] as const;

/** Lenis solo en escritorio y sin "reducir movimiento" (spec §4.2), cargado al primer gesto. */
export function SmoothScroll() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!fine || reduced) return;
    let destroyed = false;
    let cleanup = () => {};
    const start = () => {
      INTENT.forEach((e) => window.removeEventListener(e, start));
      import('lenis').then(({ default: Lenis }) => {
        if (destroyed) return;
        const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 }, autoRaf: true });
        cleanup = () => lenis.destroy();
      });
    };
    INTENT.forEach((e) => window.addEventListener(e, start, { passive: true }));
    return () => {
      destroyed = true;
      INTENT.forEach((e) => window.removeEventListener(e, start));
      cleanup();
    };
  }, [fine, reduced]);

  return null;
}
