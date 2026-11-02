'use client';

// Chunk diferido: aquí (y en las escenas) es donde entran three / R3F / drei.
import type { ReactNode } from 'react';
import { Canvas, type CanvasProps } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';

export default function SceneRuntime({
  children,
  camera,
  orthographic,
  dpr,
  frameloop,
  onReady,
  onDecline,
}: {
  children: ReactNode;
  camera?: CanvasProps['camera'];
  orthographic?: boolean;
  dpr: number;
  frameloop: 'always' | 'never';
  onReady(): void;
  onDecline(): void;
}) {
  return (
    <Canvas
      camera={camera}
      orthographic={orthographic}
      dpr={[1, dpr]}
      frameloop={frameloop}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        onReady();
      }}
    >
      <PerformanceMonitor onDecline={onDecline} />
      {children}
    </Canvas>
  );
}
