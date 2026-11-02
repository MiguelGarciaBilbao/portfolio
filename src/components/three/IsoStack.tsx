'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { Category } from '@/content/types';
import { CATEGORY_COLOR } from './colors';

/** Zoom ortográfico según el tamaño del lienzo, para que la pila siempre quepa. */
export function useFitZoom(unitsTall: number, unitsWide: number) {
  const get = useThree((s) => s.get);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  useEffect(() => {
    const { camera } = get();
    if (!(camera instanceof THREE.OrthographicCamera)) return;
    camera.zoom = Math.min(height / unitsTall, width / unitsWide);
    camera.updateProjectionMatrix();
  }, [get, width, height, unitsTall, unitsWide]);
}

function Slab({
  id,
  category,
  label,
  index,
  selected,
  getExplode,
  onSelect,
}: {
  id: string;
  category: Category;
  label: string;
  index: number;
  selected: boolean;
  getExplode(): number;
  onSelect(id: string): void;
}) {
  const ref = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const color = CATEGORY_COLOR[category];

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    const explode = THREE.MathUtils.clamp(getExplode(), 0, 1);
    const gap = 0.32 + explode * 0.9;
    const targetY = (2 - index) * gap + (selected ? 0.12 : 0);
    const k = 1 - Math.pow(0.001, Math.min(delta, 0.05) / 0.35);
    g.position.y += (targetY - g.position.y) * k;
    if (mat.current) {
      const target = selected ? 0.9 : 0.28;
      mat.current.emissiveIntensity += (target - mat.current.emissiveIntensity) * k;
    }
  });

  return (
    <group ref={ref} position={[0, (2 - index) * 0.32, 0]}>
      <RoundedBox
        args={[2.4, 0.22, 1.6]}
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
          emissiveIntensity={selected ? 0.9 : 0.28}
          metalness={0.2}
          roughness={0.35}
          transparent
          opacity={0.92}
        />
      </RoundedBox>
      <lineSegments position={[0, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.4, 0.22, 1.6)]} />
        <lineBasicMaterial color={color} transparent opacity={selected ? 0.95 : 0.45} />
      </lineSegments>
      {/* esquina derecha en pantalla (vista desde +x+y+z): la etiqueta queda a la altura de su losa */}
      <Html position={[1.3, 0.02, -0.9]} zIndexRange={[10, 0]} className="iso-label-wrap">
        <span className="iso-label" data-active={selected ? 'true' : 'false'}>
          {label}
        </span>
      </Html>
    </group>
  );
}

export default function IsoStack({
  layers,
  selectedId,
  onSelect,
  getExplode,
}: {
  layers: { id: string; category: Category; label: string }[];
  selectedId: string;
  onSelect(id: string): void;
  getExplode(): number;
}) {
  useFitZoom(6.4, 6.6);
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 8, 3]} intensity={1.2} />
      {/* desplazada a la izquierda de pantalla para dejar sitio a las etiquetas */}
      <group position={[-0.45, 0, 0.45]}>
        {layers.map((l, i) => (
          <Slab
            key={l.id}
            {...l}
            index={i}
            selected={l.id === selectedId}
            getExplode={getExplode}
            onSelect={onSelect}
          />
        ))}
      </group>
    </>
  );
}
