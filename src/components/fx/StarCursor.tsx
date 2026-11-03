'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useFinePointer, useReducedMotion } from '@/lib/motion';

const StarCursorCanvas = dynamic(() => import('./StarCursorCanvas'), {
  ssr: false,
  loading: () => null,
});

/**
 * Rastro de estrellas + cursor punto/anillo. Solo con ratón y sin "reducir movimiento".
 * El canvas no entra en el JS inicial: se descarga con el primer movimiento del ratón.
 */
export function StarCursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!fine || reduced || armed) return;
    const arm = () => setArmed(true);
    window.addEventListener('pointermove', arm, { once: true, passive: true });
    return () => window.removeEventListener('pointermove', arm);
  }, [fine, reduced, armed]);

  if (!fine || reduced || !armed) return null;
  return <StarCursorCanvas />;
}
