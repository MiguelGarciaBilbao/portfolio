'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { CanvasProps } from '@react-three/fiber';
import { classifyGpu, downgrade, useReducedMotion, type Tier } from '@/lib/motion';
import { qualityFor, SceneQualityContext } from './quality';
import { probeWebGL } from './webgl';

export { hasWebGL } from './webgl';
export { useSceneQuality } from './quality';

const SceneRuntime = dynamic(() => import('./SceneRuntime'), { ssr: false, loading: () => null });

function initialTier(renderer?: string): Tier {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return classifyGpu({ cores: nav.hardwareConcurrency, memoryGb: nav.deviceMemory, renderer });
}

/**
 * Isla 3D: siempre pinta `fallback` (mismo layout, SSR) y monta el <Canvas> encima solo si
 * hay WebGL, no hay "reducir movimiento", la sección es visible y el navegador está ocioso.
 */
export function SceneCanvas({
  fallback,
  children,
  className,
  camera,
  orthographic,
  testId,
}: {
  fallback: ReactNode;
  children: ReactNode;
  className?: string;
  camera?: CanvasProps['camera'];
  orthographic?: boolean;
  testId: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [mount, setMount] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [tier, setTier] = useState<Tier>(() =>
    typeof window === 'undefined' ? 'medium' : initialTier(probeWebGL().renderer),
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const probe = probeWebGL();
    if (!probe.ok) return;

    let idle = 0;
    const io = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((e) => e.isIntersecting);
        setVisible(isVisible);
        if (isVisible && !idle) {
          const ric =
            window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
          idle = ric(() => setMount(true)) as number;
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    const onVis = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduced]);

  const quality = qualityFor(tier);
  const active = mount && !reduced;

  return (
    <div ref={ref} className={['scene', className].filter(Boolean).join(' ')}>
      <div
        className="scene__fallback"
        data-testid={`${testId}-fallback`}
        data-hidden={ready ? 'true' : 'false'}
      >
        {fallback}
      </div>
      {active && (
        <div className="scene__canvas" data-testid={`${testId}-canvas`} aria-hidden="true">
          <SceneQualityContext.Provider value={quality}>
            <SceneRuntime
              camera={camera}
              orthographic={orthographic}
              dpr={quality.dpr}
              frameloop={visible && pageVisible ? 'always' : 'never'}
              onReady={() => setReady(true)}
              onDecline={() => setTier((t) => downgrade(t))}
            >
              {children}
            </SceneRuntime>
          </SceneQualityContext.Provider>
        </div>
      )}
    </div>
  );
}
