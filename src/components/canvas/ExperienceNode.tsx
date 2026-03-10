"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import vertexShader from "@/shaders/experience/vertex.glsl";
import fragmentShader from "@/shaders/experience/fragment.glsl";

/**
 * ExperienceNode — Animated 3D orb visible at the Experience camera anchor.
 *
 * Features:
 * - Noise-displaced sphere surface (organic feel)
 * - Fresnel rim glow in accent purple
 * - Gentle scale pulse via sin(time)
 * - Transparent with additive-like glow
 */
export function ExperienceNode() {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Advance time
    uniforms.uTime.value += delta;

    // Scale pulse: 1.0 + sin(time * 2) * 0.03
    const t = uniforms.uTime.value;
    const scale = 1.0 + Math.sin(t * 2) * 0.03;
    meshRef.current.scale.setScalar(scale);

    // Slow rotation for visual interest
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x += delta * 0.05;
  });

  return (
    <mesh ref={meshRef} position={[3, 1.5, 1]}>
      <sphereGeometry args={[0.6, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
