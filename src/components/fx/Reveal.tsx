'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type Tag = 'div' | 'section' | 'li';

/** Aparición al entrar en pantalla (una vez). CSS hace el resto; con "reducir movimiento" no anima. */
export function Reveal({
  children,
  delay = 0,
  as = 'div',
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: Tag;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = as as 'div';
  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      className={['reveal', className].filter(Boolean).join(' ')}
      data-visible={visible ? 'true' : 'false'}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Comp>
  );
}
