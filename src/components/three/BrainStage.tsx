'use client';

import dynamic from 'next/dynamic';
import { memo } from 'react';
import type { BrainInputNode } from '@/lib/brain-geometry';
import { useCorpus } from '@/components/corpus/CorpusProvider';
import { SceneCanvas } from './SceneCanvas';
import { BrainFallback } from './BrainFallback';

// memo: el estado del corpus cambia en cada tick de escritura, pero cerebro y fallback
// solo dependen de nodos activos/hover, que mantienen su referencia mientras tanto.
const BrainCorpus = memo(
  dynamic(() => import('./BrainCorpus'), { ssr: false, loading: () => null }),
);
const Fallback = memo(BrainFallback);

/** Conecta el estado del corpus con la escena 3D (y su fallback SVG). */
export function BrainStage({
  nodes,
  titles,
}: {
  nodes: BrainInputNode[];
  titles: Record<string, string>;
}) {
  const { activeIds, hoveredId, setHovered } = useCorpus();
  return (
    <SceneCanvas
      testId="brain"
      className="brain-stage"
      camera={{ position: [0, 0.1, 5.2], fov: 40 }}
      fallback={<Fallback nodes={nodes} activeIds={activeIds} />}
    >
      <BrainCorpus
        nodes={nodes}
        titles={titles}
        activeIds={activeIds}
        hoveredId={hoveredId}
        onHover={setHovered}
      />
    </SceneCanvas>
  );
}
