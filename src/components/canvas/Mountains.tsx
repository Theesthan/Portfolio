"use client";

/**
 * Procedural mountain silhouette — cone-based geometry.
 * No external GLTF models required.
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
 * Mountains — Stylized mountain silhouettes in the background.
 * Procedural cone geometry positioned to create depth against the foggy purple sky.
 */
export function Mountains() {
  return (
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
      {/* Smaller background mountain for additional depth */}
      <ProceduralMountain
        position={[8, -0.5, -18]}
        scale={[2.5, 5, 2.5]}
        rotation={-0.3}
      />
    </>
  );
}
