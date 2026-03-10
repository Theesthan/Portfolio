"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import particleVertexShader from "@/shaders/particles/vertex.glsl";
import particleFragmentShader from "@/shaders/particles/fragment.glsl";

const PARTICLE_COUNT = 5000;
const BOUNDS = { x: 50, y: 20, z: 50 };

/**
 * Particle Field — 5000 floating dust particles distributed
 * throughout the scene with noise-based drift animation.
 * Color gradient from deep purple (low) to lavender (high).
 */
export function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);
    const ph = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Random position within bounding box, centered at origin
      pos[i3] = (Math.random() - 0.5) * BOUNDS.x;
      pos[i3 + 1] = (Math.random() - 0.5) * BOUNDS.y + BOUNDS.y * 0.25;
      pos[i3 + 2] = (Math.random() - 0.5) * BOUNDS.z;

      // Random size variation
      sz[i] = Math.random() * 2.0 + 0.5;

      // Random phase offset for unique drift per particle
      ph[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, sizes: sz, phases: ph };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: 0.3 },
      uColorLow: { value: new THREE.Color("#6a3fa0") },
      uColorHigh: { value: new THREE.Color("#dcc6ff") },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          args={[phases, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
