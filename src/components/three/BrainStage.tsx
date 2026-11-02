'use client';

import dynamic from 'next/dynamic';
import type { BrainInputNode } from '@/lib/brain-geometry';
import { useCorpus } from '@/components/corpus/CorpusProvider';
import { SceneCanvas } from './SceneCanvas';
import { BrainFallback } from './BrainFallback';

const BrainCorpus = dynamic(() => import('./BrainCorpus'), { ssr: false, loading: () => null });

/** Conecta el estado del corpus con la escena 3D (y su fallback SVG). */
export function BrainStage({ nodes, titles }: { nodes: BrainInputNode[]; titles: Record<string, string> }) {
  const { activeIds, hoveredId, setHovered } = useCorpus();
  return (
    <SceneCanvas
      testId="brain"
      className="brain-stage"
      camera={{ position: [0, 0.1, 5.2], fov: 40 }}
      fallback={<BrainFallback nodes={nodes} activeIds={activeIds} />}
    >
      <BrainCorpus nodes={nodes} titles={titles} activeIds={activeIds} hoveredId={hoveredId} onHover={setHovered} />
    </SceneCanvas>
  );
}
