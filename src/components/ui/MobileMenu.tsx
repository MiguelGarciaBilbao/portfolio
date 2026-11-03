'use client';

import { useRef, type ReactNode } from 'react';

/** Menú móvil nativo (<details>) que se cierra al elegir una sección: el ancla no lo cierra sola. */
export function MobileMenu({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <details
      ref={ref}
      className="site-header__menu"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a')) ref.current?.removeAttribute('open');
      }}
    >
      <summary aria-label={label}>
        <span aria-hidden="true">☰</span>
      </summary>
      <nav aria-label={label}>{children}</nav>
    </details>
  );
}
