'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  askReducer,
  charsForTick,
  initialAskState,
  TICK_MS,
  type AskState,
} from '@/lib/ask-reducer';
import { useReducedMotion } from '@/lib/motion';

export const RETRIEVE_MS = 600;

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

const EMPTY: string[] = [];

const CorpusContext = createContext<CorpusContextValue | null>(null);

export function CorpusProvider({ items, children }: { items: CorpusItem[]; children: ReactNode }) {
  const [state, dispatch] = useReducer(askReducer, initialAskState);
  const [hoveredId, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();
  // inicio de la fase "answering" de la pregunta actual (para avanzar por tiempo real, no por ticks)
  const answering = useRef<{ qaId: string; t0: number } | null>(null);

  // Fases: retrieving (600 ms) → answering (3 caracteres cada 16 ms de reloj) → done.
  // El avance se calcula con el tiempo transcurrido: si el dispositivo va lento o un render tarda,
  // se escriben más caracteres por tick y la duración total no se dispara.
  useEffect(() => {
    const qaId = state.qaId;
    if (!qaId) return;
    if (state.status === 'retrieving') {
      const t = window.setTimeout(() => dispatch({ type: 'retrieved', qaId }), RETRIEVE_MS);
      return () => window.clearTimeout(t);
    }
    if (state.status === 'answering') {
      if (answering.current?.qaId !== qaId) answering.current = { qaId, t0: performance.now() };
      const { t0 } = answering.current;
      const shown = state.shown;
      const t = window.setTimeout(() => {
        dispatch({ type: 'tick', qaId, chars: charsForTick(performance.now() - t0, shown) });
      }, TICK_MS);
      return () => window.clearTimeout(t);
    }
    answering.current = null;
  }, [state]);

  // Los nodos activos solo cambian al cambiar de pregunta: misma referencia durante la escritura,
  // así el cerebro (y sus 900 puntos del fallback) no se re-renderiza en cada tick.
  const isIdle = state.status === 'idle';
  const activeIds = useMemo(() => {
    const current = items.find((i) => i.id === state.qaId);
    return !isIdle && current ? current.sources : EMPTY;
  }, [items, state.qaId, isIdle]);

  const value = useMemo<CorpusContextValue>(() => {
    return {
      state,
      activeIds,
      hoveredId,
      setHovered,
      select(qaId) {
        const item = items.find((i) => i.id === qaId);
        if (!item) return;
        dispatch({ type: 'select', qaId, total: item.length, instant: reduced });
      },
    };
  }, [items, state, activeIds, hoveredId, reduced]);

  return <CorpusContext.Provider value={value}>{children}</CorpusContext.Provider>;
}

export function useCorpus(): CorpusContextValue {
  const ctx = useContext(CorpusContext);
  if (!ctx) throw new Error('useCorpus must be used inside <CorpusProvider>');
  return ctx;
}
