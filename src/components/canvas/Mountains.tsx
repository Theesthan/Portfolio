"use client";

import { Suspense, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";

/**
 * Procedural mountain fallback — cone-based silhouettes.
 * Used when GLTF models are not yet available.
 */
function ProceduralMountain({
  position,
  scale,
  rotation = 0,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: number;
}) {
  return (
    <mesh position={position} rotation={[0, rotation, 0]} castShadow>
      <coneGeometry args={[scale[0], scale[1], 6]} />
      <meshStandardMaterial
        color="#0d001a"
        roughness={1}
        metalness={0}
        flatShading
      />
    </mesh>
  );
}

/**
 * GLTF-based mountain loader with procedural fallback.
 * Attempts to load mountain.glb; if absent, renders cone geometry.
 */
function MountainModel({
  position,
  scale,
  rotation = 0,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: number;
}) {
  const groupRef = useRef<Group>(null);

  try {
    const { scene } = useGLTF("/assets/models/mountain.glb");

    return (
      <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
        <primitive
          object={scene.clone()}
          scale={scale}
          castShadow
          receiveShadow
        />
      </group>
    );
  } catch {
    // GLTF not available — use procedural fallback
    return (
      <ProceduralMountain
        position={position}
        scale={scale}
        rotation={rotation}
      />
    );
  }
}

/**
 * Mountains — 2 stylized mountain silhouettes in the background.
 * Positioned to create depth against the foggy purple sky.
 */
export function Mountains() {
  return (
    <Suspense
      fallback={
        <>
          <ProceduralMountain
            position={[-4, -0.5, -10]}
            scale={[3, 6, 3]}
          />
          <ProceduralMountain
            position={[3, -0.5, -12]}
            scale={[2, 4.5, 2]}
            rotation={0.4}
          />
        </>
      }
    >
      <MountainModel position={[-4, -0.5, -10]} scale={[3, 4, 3]} />
      <MountainModel
        position={[3, -0.5, -12]}
        scale={[2, 3, 2]}
        rotation={0.4}
      />
      {/* Smaller background mountain for additional depth */}
      <ProceduralMountain
        position={[8, -0.5, -18]}
        scale={[2.5, 5, 2.5]}
        rotation={-0.3}
      />
    </Suspense>
  );
}
