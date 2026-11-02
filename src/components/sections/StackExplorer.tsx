'use client';

import type { Category } from '@/content/types';
import { useRovingTabs } from '@/components/ui/useRovingTabs';

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
  const { selected, tabProps, panelProps } = useRovingTabs(ids, 'ui', 'stack');
  const layer = layers.find((l) => l.id === selected) ?? layers[0];

  return (
    <div className="explorer">
      <div className="explorer__stage" data-testid="stack-stage" aria-hidden="true" />
      <div className="explorer__ui">
        <div role="tablist" aria-label={labels.layers} aria-orientation="vertical" className="layer-list">
          {layers.map((l, i) => (
            <button key={l.id} {...tabProps(l.id, i)} className="layer-list__tab" data-cat={l.category}>
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
