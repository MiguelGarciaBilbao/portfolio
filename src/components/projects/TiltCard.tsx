'use client';

import { useRef, type ReactNode } from 'react';

/** Inclinación 3D sutil con CSS perspective; solo con puntero fino y sin "reducir movimiento". */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={(e) => {
        if (!enabled() || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ref.current.style.setProperty('--rx', `${(-py * 7).toFixed(2)}deg`);
        ref.current.style.setProperty('--ry', `${(px * 9).toFixed(2)}deg`);
        ref.current.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`);
        ref.current.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`);
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty('--rx', '0deg');
        ref.current?.style.setProperty('--ry', '0deg');
      }}
    >
      {children}
    </div>
  );
}
