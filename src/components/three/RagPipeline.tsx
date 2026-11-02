'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneQuality } from './quality';
import { useFitZoom } from './IsoStack';

const COLORS = ['#26C6FF', '#2EF5B0', '#2EF5B0', '#26C6FF', '#8B5CF6', '#8B5CF6'];
const RX = 2.1;
const RZ = 2.1;

function Block({
  id,
  label,
  position,
  color,
  active,
  onSelect,
}: {
  id: string;
  label: string;
  position: [number, number, number];
  color: string;
  active: boolean;
  onSelect(id: string): void;
}) {
  const ref = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.001, Math.min(delta, 0.05) / 0.35);
    if (ref.current) ref.current.position.y += ((active ? 0.22 : 0) - ref.current.position.y) * k;
    if (mat.current) mat.current.emissiveIntensity += ((active ? 1 : 0.3) - mat.current.emissiveIntensity) * k;
  });
  return (
    <group position={position}>
      <group ref={ref}>
        <RoundedBox
          args={[0.7, 0.36, 0.7]}
          radius={0.05}
          smoothness={3}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = '')}
        >
          <meshStandardMaterial
            ref={mat}
            color="#0b1020"
            emissive={color}
            emissiveIntensity={active ? 1 : 0.3}
            roughness={0.35}
            metalness={0.2}
          />
        </RoundedBox>
        <Html position={[0, 0.48, 0]} center zIndexRange={[10, 0]}>
          <span className="iso-label iso-label--center" data-active={active ? 'true' : 'false'}>
            {label}
          </span>
        </Html>
      </group>
    </group>
  );
}

export default function RagPipeline({
  steps,
  activeId,
  onSelect,
}: {
  steps: { id: string; label: string }[];
  activeId: string;
  onSelect(id: string): void;
}) {
  useFitZoom(5.4, 6.2);
  const quality = useSceneQuality();
  const count = quality.tier === 'low' ? 60 : 120;

  const positions = useMemo(
    () =>
      steps.map((_, i) => {
        const a = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
        return [Math.cos(a) * RX, 0, Math.sin(a) * RZ] as [number, number, number];
      }),
    [steps],
  );
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(positions.map((p) => new THREE.Vector3(p[0], 0.05, p[2])), true),
    [positions],
  );
  const curveGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(curve.getPoints(200)), [curve]);

  const particles = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(() => Array.from({ length: count }, (_, i) => i / count), [count]);
  const loopStart = (steps.length - 1) / steps.length; // tramo informes → corpus
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const colorA = useMemo(() => new THREE.Color('#26C6FF'), []);
  const colorB = useMemo(() => new THREE.Color('#8B5CF6'), []);

  useFrame((state) => {
    const mesh = particles.current;
    if (!mesh) return;
    const t0 = state.clock.elapsedTime * 0.045;
    offsets.forEach((o, i) => {
      const t = (o + t0) % 1;
      curve.getPointAt(t, tmp);
      dummy.position.copy(tmp);
      dummy.scale.setScalar(0.6 + 0.4 * Math.sin((t * 40 + i) % Math.PI));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, t > loopStart ? colorB : colorA);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 8, 3]} intensity={1.2} />
      <line>
        <primitive object={curveGeo} attach="geometry" />
        <lineBasicMaterial color="#26C6FF" transparent opacity={0.35} />
      </line>
      <instancedMesh ref={particles} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      {steps.map((s, i) => (
        <Block
          key={s.id}
          id={s.id}
          label={s.label}
          position={positions[i]}
          color={COLORS[i % COLORS.length]}
          active={s.id === activeId}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}
