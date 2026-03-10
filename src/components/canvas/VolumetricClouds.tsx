"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CloudPlane {
  position: [number, number, number];
  scale: [number, number, number];
  opacity: number;
  speed: number;
  phase: number;
}

/**
 * Volumetric Clouds — layered alpha-blended planes
 * drifting slowly across the sky to create atmospheric depth.
 * Falls back to procedural alpha planes when cloud_alpha.png is unavailable.
 */
export function VolumetricClouds() {
  const groupRef = useRef<THREE.Group>(null);

  const clouds = useMemo<CloudPlane[]>(
    () => [
      { position: [-6, 6, -18], scale: [10, 5, 1], opacity: 0.25, speed: 0.08, phase: 0 },
      { position: [4, 8, -22], scale: [12, 5, 1], opacity: 0.2, speed: 0.05, phase: 1.5 },
      { position: [-2, 10, -25], scale: [14, 6, 1], opacity: 0.15, speed: 0.06, phase: 3.0 },
      { position: [8, 7, -20], scale: [9, 4, 1], opacity: 0.3, speed: 0.07, phase: 4.2 },
      { position: [-8, 11, -23], scale: [11, 5, 1], opacity: 0.18, speed: 0.04, phase: 5.8 },
      { position: [2, 9, -26], scale: [13, 5, 1], opacity: 0.12, speed: 0.09, phase: 2.1 },
      { position: [-4, 12, -28], scale: [16, 7, 1], opacity: 0.1, speed: 0.03, phase: 0.7 },
    ],
    []
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const children = groupRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const cloud = children[i];
      const data = clouds[i];
      // Slow horizontal drift with unique phase
      cloud.position.x =
        data.position[0] +
        Math.sin(clock.elapsedTime * data.speed + data.phase) * 3;
      // Very subtle vertical bob
      cloud.position.y =
        data.position[1] +
        Math.sin(clock.elapsedTime * data.speed * 0.5 + data.phase) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <mesh
          key={i}
          position={cloud.position}
          scale={cloud.scale}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#2d005f"
            transparent
            opacity={cloud.opacity}
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
