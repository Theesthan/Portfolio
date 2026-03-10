"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import terrainVertexShader from "@/shaders/terrain/vertex.glsl";
import terrainFragmentShader from "@/shaders/terrain/fragment.glsl";

/**
 * Terrain — noise-displaced ground plane with dark purple gradient.
 * Custom ShaderMaterial bypasses scene fog, so fog is baked into fragment shader.
 */
export function Terrain() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorLow: { value: new THREE.Color("#0a0012") },
      uColorHigh: { value: new THREE.Color("#1a0035") },
      uFogColor: { value: new THREE.Color("#1a0035") },
      uFogDensity: { value: 0.035 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.5, 0]}
      receiveShadow
    >
      <planeGeometry args={[50, 50, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={terrainVertexShader}
        fragmentShader={terrainFragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
