'use client';

import { useEffect, useRef } from 'react';
import { useFinePointer, useReducedMotion } from '@/lib/motion';

const INTERACTIVE = 'a, button, summary, [role="tab"], [role="radio"], [data-cursor]';

/**
 * Lente de observatorio: un halo tenue, detrás del contenido y encima de la aurora, que sigue al
 * ratón y aviva el cielo bajo el puntero. El cursor nativo no se toca. Sobre lo clicable, la lente
 * se recoge (enfoca). Solo con ratón y sin "reducir movimiento".
 */
export function LensCursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lens = ref.current;
    if (!fine || reduced || !lens) return;
    let raf = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      raf = 0;
      lens.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (lens.dataset.on !== 'true') {
        paint();
        lens.dataset.on = 'true';
      } else if (!raf) {
        raf = requestAnimationFrame(paint);
      }
    };
    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      lens.dataset.focus = el?.closest?.(INTERACTIVE) ? 'true' : 'false';
    };
    const onLeave = () => {
      lens.dataset.on = 'false';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return <div ref={ref} className="lens" aria-hidden="true" data-testid="lens" data-on="false" />;
}
