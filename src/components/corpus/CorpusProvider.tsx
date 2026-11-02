'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { askReducer, initialAskState, type AskState } from '@/lib/ask-reducer';
import { useReducedMotion } from '@/lib/motion';

export const RETRIEVE_MS = 600;
export const TICK_MS = 16;
export const CHARS_PER_TICK = 3;

export interface CorpusItem {
  id: string;
  sources: string[];
  length: number;
}

interface CorpusContextValue {
  state: AskState;
  activeIds: string[];
  hoveredId: string | null;
  select(qaId: string): void;
  setHovered(id: string | null): void;
}

const CorpusContext = createContext<CorpusContextValue | null>(null);

export function CorpusProvider({ items, children }: { items: CorpusItem[]; children: ReactNode }) {
  const [state, dispatch] = useReducer(askReducer, initialAskState);
  const [hoveredId, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();

  // Fases: retrieving (600 ms) → answering (3 caracteres cada 16 ms) → done.
  useEffect(() => {
    const qaId = state.qaId;
    if (!qaId) return;
    if (state.status === 'retrieving') {
      const t = window.setTimeout(() => dispatch({ type: 'retrieved', qaId }), RETRIEVE_MS);
      return () => window.clearTimeout(t);
    }
    if (state.status === 'answering') {
      const t = window.setTimeout(
        () => dispatch({ type: 'tick', qaId, chars: CHARS_PER_TICK }),
        TICK_MS,
      );
      return () => window.clearTimeout(t);
    }
  }, [state]);

  const value = useMemo<CorpusContextValue>(() => {
    const current = items.find((i) => i.id === state.qaId);
    return {
      state,
      activeIds: state.status !== 'idle' && current ? current.sources : [],
      hoveredId,
      setHovered,
      select(qaId) {
        const item = items.find((i) => i.id === qaId);
        if (!item) return;
        dispatch({ type: 'select', qaId, total: item.length, instant: reduced });
      },
    };
  }, [items, state, hoveredId, reduced]);

  return <CorpusContext.Provider value={value}>{children}</CorpusContext.Provider>;
}

export function useCorpus(): CorpusContextValue {
  const ctx = useContext(CorpusContext);
  if (!ctx) throw new Error('useCorpus must be used inside <CorpusProvider>');
  return ctx;
}
