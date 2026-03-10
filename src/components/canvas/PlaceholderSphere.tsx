"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

/**
 * Temporary test sphere to confirm canvas renders correctly.
 * Rotates slowly. Will be removed after Phase 1 verification.
 */
export function PlaceholderSphere() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.3;
    meshRef.current.rotation.x += delta * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[0, 1, 0]} castShadow receiveShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#b06dff"
        roughness={0.3}
        metalness={0.6}
        emissive="#6a3fa0"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}
