'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef } from 'react';
import type { Category } from '@/content/types';
import { useRovingTabs } from '@/components/ui/useRovingTabs';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import { IsoStackFallback } from '@/components/three/IsoStackFallback';

const IsoStack = dynamic(() => import('@/components/three/IsoStack'), {
  ssr: false,
  loading: () => null,
});

/** Progreso 0→1 de la sección en pantalla, leído por la escena en cada frame (sin re-render). */
function useExplodeProgress(ref: React.RefObject<HTMLDivElement | null>) {
  const progress = useRef(0);
  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh - r.top) / (vh + r.height); // 0 al entrar, 1 al salir
      progress.current = Math.min(1, Math.max(0, (p - 0.18) / 0.4));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [ref]);
  return useCallback(() => progress.current, []);
}

export interface StackLayerView {
  id: 'ui' | 'svc' | 'ai' | 'data' | 'cloud';
  category: Category;
  name: string;
  what: string;
  tags: string[];
  used: string[];
}

export function StackExplorer({
  layers,
  labels,
}: {
  layers: StackLayerView[];
  labels: { layers: string; used: string };
}) {
  const ids = layers.map((l) => l.id);
  const { selected, setSelected, tabProps, panelProps } = useRovingTabs(ids, 'ui', 'stack');
  const layer = layers.find((l) => l.id === selected) ?? layers[0];
  const rootRef = useRef<HTMLDivElement>(null);
  const getExplode = useExplodeProgress(rootRef);
  const sceneLayers = layers.map((l) => ({ id: l.id, category: l.category, label: l.name }));

  return (
    <div className="explorer" ref={rootRef}>
      <div className="explorer__stage">
        <SceneCanvas
          testId="stack"
          orthographic
          camera={{ position: [6, 6, 6], zoom: 70, near: 0.1, far: 100 }}
          fallback={<IsoStackFallback layers={sceneLayers} selectedId={selected} />}
        >
          <IsoStack
            layers={sceneLayers}
            selectedId={selected}
            onSelect={(id) => setSelected(id as StackLayerView['id'])}
            getExplode={getExplode}
          />
        </SceneCanvas>
      </div>
      <div className="explorer__ui">
        <div
          role="tablist"
          aria-label={labels.layers}
          aria-orientation="vertical"
          className="layer-list"
        >
          {layers.map((l, i) => (
            <button
              key={l.id}
              {...tabProps(l.id, i)}
              className="layer-list__tab"
              data-cat={l.category}
            >
              <span className="layer-list__index" aria-hidden="true">
                {i + 1}
              </span>
              {l.name}
            </button>
          ))}
        </div>
        <div {...panelProps} className="explorer__panel" data-cat={layer.category}>
          <p className="explorer__what">{layer.what}</p>
          <ul className="chip-list" aria-label={layer.name}>
            {layer.tags.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
          <h3 className="explorer__sub">{labels.used}</h3>
          <ul className="explorer__used">
            {layer.used.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
