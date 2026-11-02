'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { BRAIN_SEED, generateBrain, type BrainInputNode } from '@/lib/brain-geometry';
import { useSceneQuality } from './quality';
import { CATEGORY_COLOR } from './colors';

// Regla: las escenas no importan contenido ni next-intl; todo llega por props.

export { CATEGORY_COLOR };

const MAX_TILT = THREE.MathUtils.degToRad(15);

const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec3 p = position * (1.0 + 0.012 * sin(uTime * 0.8 + aSeed * 6.2831));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.6 + aSeed) * (4.0 / -mv.z);
    vAlpha = 0.22 + 0.78 * smoothstep(6.0, 3.4, -mv.z);
    vec3 mint = vec3(0.18, 0.96, 0.69);
    vec3 cyan = vec3(0.15, 0.78, 1.0);
    vec3 violet = vec3(0.545, 0.36, 0.965);
    vec3 c = mix(mint, cyan, smoothstep(-1.1, 1.1, position.x));
    vColor = mix(c, violet, smoothstep(-0.1, 0.9, position.y * 0.7 - position.z * 0.6));
  }
`;

const particleFragment = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor * 1.15, a * vAlpha);
  }
`;

const edgeVertex = /* glsl */ `
  attribute float aT;
  attribute float aPhase;
  varying float vT;
  varying float vPhase;
  void main() {
    vT = aT;
    vPhase = aPhase;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const edgeFragment = /* glsl */ `
  uniform float uTime;
  varying float vT;
  varying float vPhase;
  void main() {
    float head = fract(uTime * 0.32 + vPhase);
    float pulse = smoothstep(0.18, 0.0, abs(head - vT));
    vec3 color = mix(vec3(0.15, 0.78, 1.0), vec3(0.18, 0.96, 0.69), pulse);
    gl_FragColor = vec4(color, 0.18 + 0.75 * pulse);
  }
`;

const haloVertex = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  attribute vec3 aColor;
  attribute float aScale;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * uPixelRatio * (4.0 / -mv.z);
  }
`;

const haloFragment = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 2.2);
    gl_FragColor = vec4(vColor, a * 0.6);
  }
`;

export default function BrainCorpus({
  nodes,
  titles,
  activeIds,
  hoveredId = null,
  onHover,
}: {
  nodes: BrainInputNode[];
  titles: Record<string, string>;
  activeIds: string[];
  hoveredId?: string | null;
  onHover(id: string | null): void;
}) {
  const quality = useSceneQuality();
  const geometry = useMemo(
    () => generateBrain({ seed: BRAIN_SEED, particleCount: quality.particles, nodes }),
    [quality.particles, nodes],
  );

  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const scales = useRef<Float32Array>(new Float32Array(geometry.nodes.length).fill(1));
  const pointer = useRef({ x: 0, y: 0 });
  const activeSet = useMemo(() => new Set(activeIds), [activeIds]);
  const particleMatRef = useRef<THREE.ShaderMaterial>(null);
  const edgeMatRef = useRef<THREE.ShaderMaterial>(null);

  // Puntero de toda la ventana (no solo del canvas) para la inclinación.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const particleGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(geometry.particles, 3));
    const seeds = new Float32Array(geometry.particles.length / 3);
    for (let i = 0; i < seeds.length; i++) seeds[i] = ((i * 2654435761) % 1000) / 1000;
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    return g;
  }, [geometry]);

  const particleUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 5.4 },
      uPixelRatio: {
        value: Math.min(typeof window === 'undefined' ? 1 : window.devicePixelRatio, 2),
      },
    }),
    [],
  );

  const edgeGeo = useMemo(() => {
    const pos = new Float32Array(geometry.edges.length * 6);
    const t = new Float32Array(geometry.edges.length * 2);
    const phase = new Float32Array(geometry.edges.length * 2);
    geometry.edges.forEach(([i, j], k) => {
      pos.set(geometry.nodes[i].position, k * 6);
      pos.set(geometry.nodes[j].position, k * 6 + 3);
      t[k * 2] = 0;
      t[k * 2 + 1] = 1;
      const ph = ((k * 7919) % 97) / 97;
      phase[k * 2] = ph;
      phase[k * 2 + 1] = ph;
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aT', new THREE.BufferAttribute(t, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    return g;
  }, [geometry]);

  // Halo aditivo por nodo (sustituye al bloom de postprocesado).
  const haloGeo = useMemo(() => {
    const pos = new Float32Array(geometry.nodes.length * 3);
    const col = new Float32Array(geometry.nodes.length * 3);
    const c = new THREE.Color();
    geometry.nodes.forEach((n, i) => {
      pos.set(n.position, i * 3);
      c.set(CATEGORY_COLOR[n.category]);
      col.set([c.r, c.g, c.b], i * 3);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    g.setAttribute(
      'aScale',
      new THREE.BufferAttribute(new Float32Array(geometry.nodes.length).fill(1), 1),
    );
    return g;
  }, [geometry]);

  const haloUniforms = useMemo(
    () => ({
      uSize: { value: 46 },
      uPixelRatio: {
        value: Math.min(typeof window === 'undefined' ? 1 : window.devicePixelRatio, 2),
      },
    }),
    [],
  );

  const edgeUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useEffect(
    () => () => {
      particleGeo.dispose();
      edgeGeo.dispose();
      haloGeo.dispose();
    },
    [particleGeo, edgeGeo, haloGeo],
  );

  // Colores por instancia (categoría).
  useEffect(() => {
    const mesh = nodesRef.current;
    if (!mesh) return;
    const c = new THREE.Color();
    geometry.nodes.forEach((n, i) => mesh.setColorAt(i, c.set(CATEGORY_COLOR[n.category])));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [geometry]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    if (particleMatRef.current) particleMatRef.current.uniforms.uTime.value = time;
    if (edgeMatRef.current) edgeMatRef.current.uniforms.uTime.value = time;

    if (outer.current) outer.current.rotation.y += 0.09 * dt * (activeSet.size ? 0.35 : 1);
    if (inner.current) {
      inner.current.rotation.x += (pointer.current.y * MAX_TILT - inner.current.rotation.x) * 0.05;
      inner.current.rotation.z +=
        (-pointer.current.x * MAX_TILT * 0.6 - inner.current.rotation.z) * 0.05;
    }

    const mesh = nodesRef.current;
    if (!mesh) return;
    const haloScale = haloGeo.getAttribute('aScale') as THREE.BufferAttribute;
    const k = 1 - Math.pow(0.001, dt / 0.2); // ~200 ms
    geometry.nodes.forEach((n, i) => {
      const target = activeSet.has(n.id) ? 1.8 : n.id === hoveredId ? 1.5 : 1;
      scales.current[i] += (target - scales.current[i]) * k;
      dummy.position.set(...n.position);
      dummy.scale.setScalar(scales.current[i]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      haloScale.setX(i, (scales.current[i] - 1) * 1.6 + 1);
    });
    mesh.instanceMatrix.needsUpdate = true;
    haloScale.needsUpdate = true;
  });

  const activePoints = useMemo(
    () =>
      activeIds
        .map((id) => geometry.nodes.find((n) => n.id === id)?.position)
        .filter((p): p is [number, number, number] => Boolean(p)),
    [activeIds, geometry],
  );
  const hovered = hoveredId ? geometry.nodes.find((n) => n.id === hoveredId) : undefined;

  return (
    <>
      <group ref={outer} scale={0.84} rotation={[0, -Math.PI / 2 + 0.55, 0]}>
        <group ref={inner}>
          <points geometry={particleGeo}>
            <shaderMaterial
              ref={particleMatRef}
              vertexShader={particleVertex}
              fragmentShader={particleFragment}
              uniforms={particleUniforms}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </points>
          <lineSegments geometry={edgeGeo}>
            <shaderMaterial
              ref={edgeMatRef}
              vertexShader={edgeVertex}
              fragmentShader={edgeFragment}
              uniforms={edgeUniforms}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </lineSegments>
          {quality.bloom && (
            <points geometry={haloGeo}>
              <shaderMaterial
                vertexShader={haloVertex}
                fragmentShader={haloFragment}
                uniforms={haloUniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </points>
          )}
          <instancedMesh
            ref={nodesRef}
            args={[undefined, undefined, geometry.nodes.length]}
            onPointerMove={(e) => {
              e.stopPropagation();
              if (e.instanceId !== undefined) onHover(geometry.nodes[e.instanceId].id);
            }}
            onPointerOut={() => onHover(null)}
          >
            <sphereGeometry args={[0.028, 14, 14]} />
            <meshBasicMaterial toneMapped={false} />
          </instancedMesh>
          {activePoints.length > 1 && (
            <Line points={activePoints} color="#2EF5B0" lineWidth={1.6} transparent opacity={0.8} />
          )}
          {hovered && (
            <Html position={hovered.position} center distanceFactor={6} zIndexRange={[20, 0]}>
              <span className="brain-tooltip" data-cat={hovered.category}>
                {titles[hovered.id]}
              </span>
            </Html>
          )}
        </group>
      </group>
    </>
  );
}
