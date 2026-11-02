'use client';

import dynamic from 'next/dynamic';
import { useRovingTabs } from '@/components/ui/useRovingTabs';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import { RagPipelineFallback } from '@/components/three/RagPipelineFallback';

const RagPipeline = dynamic(() => import('@/components/three/RagPipeline'), {
  ssr: false,
  loading: () => null,
});

export interface RagStepView {
  id: 'sources' | 'corpus' | 'embeddings' | 'vector' | 'llm' | 'reports';
  label: string;
  detail: string;
  tech: string;
}

export function RagExplorer({
  steps,
  labels,
}: {
  steps: RagStepView[];
  labels: { steps: string; loop: string };
}) {
  const ids = steps.map((s) => s.id);
  const { selected, setSelected, tabProps, panelProps } = useRovingTabs(ids, 'corpus', 'rag');
  const index = Math.max(0, ids.indexOf(selected));
  const step = steps[index];

  return (
    <div className="explorer explorer--rag">
      <div className="explorer__stage">
        <SceneCanvas
          testId="rag"
          orthographic
          camera={{ position: [6, 6, 6], zoom: 70, near: 0.1, far: 100 }}
          fallback={<RagPipelineFallback steps={steps} activeId={selected} />}
        >
          <RagPipeline
            steps={steps.map((s) => ({ id: s.id, label: s.label }))}
            activeId={selected}
            onSelect={(id) => setSelected(id as RagStepView['id'])}
          />
        </SceneCanvas>
      </div>
      <div className="explorer__ui">
        <ol role="tablist" aria-label={labels.steps} className="step-list">
          {steps.map((s, i) => (
            <li key={s.id} role="presentation">
              <button {...tabProps(s.id, i)} className="step-list__tab">
                <span className="step-list__n" aria-hidden="true">
                  {i + 1}
                </span>
                {s.label}
              </button>
            </li>
          ))}
        </ol>
        <div {...panelProps} className="explorer__panel" data-cat="ai">
          <p className="explorer__what">{step.detail}</p>
          <p className="chip">{step.tech}</p>
        </div>
        <p className="rag-loop">
          <span aria-hidden="true" className="rag-loop__icon">
            ↺
          </span>
          {labels.loop}
        </p>
      </div>
    </div>
  );
}
