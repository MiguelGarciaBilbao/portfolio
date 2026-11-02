'use client';

import { useCallback, useRef, useState, type KeyboardEvent } from 'react';

/** Patrón WAI-ARIA Tabs con selección automática y foco itinerante (←/→/↑/↓, Inicio/Fin). */
export function useRovingTabs<T extends string>(ids: readonly T[], initial: T, idPrefix: string) {
  const [selected, setSelected] = useState<T>(initial);
  const refs = useRef(new Map<T, HTMLButtonElement | null>());

  const focusAt = useCallback(
    (index: number) => {
      const id = ids[(index + ids.length) % ids.length];
      setSelected(id);
      refs.current.get(id)?.focus();
    },
    [ids],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: ids.length - 1,
    };
    if (e.key in keys) {
      e.preventDefault();
      focusAt(keys[e.key]);
    }
  };

  const tabProps = (id: T, index: number) => ({
    id: `${idPrefix}-tab-${id}`,
    role: 'tab' as const,
    type: 'button' as const,
    'aria-selected': selected === id,
    'aria-controls': `${idPrefix}-panel`,
    tabIndex: selected === id ? 0 : -1,
    ref: (el: HTMLButtonElement | null) => {
      refs.current.set(id, el);
    },
    onClick: () => setSelected(id),
    onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => onKeyDown(e, index),
  });

  const panelProps = {
    id: `${idPrefix}-panel`,
    role: 'tabpanel' as const,
    'aria-labelledby': `${idPrefix}-tab-${selected}`,
    tabIndex: 0,
  };

  return { selected, setSelected, tabProps, panelProps };
}
