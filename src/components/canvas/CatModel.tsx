"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import * as THREE from "three";

/**
 * Procedural cat fallback — simple box-based cat silhouette.
 * Used when the GLTF model is not yet available.
 */
function ProceduralCat() {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);

  // Idle tail wag animation
  useEffect(() => {
    if (!tailRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(tailRef.current!.rotation, {
        z: 0.3,
        duration: 1.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, []);

  // Gentle breathing (scale pulse)
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const breathe = Math.sin(clock.elapsedTime * 2) * 0.005;
    groupRef.current.scale.y = 0.5 + breathe;
  });

  return (
    <group
      ref={groupRef}
      position={[-1.5, -0.1, -3]}
      rotation={[0, Math.PI, 0]}
      scale={[0.5, 0.5, 0.5]}
    >
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.6, 0.4, 1.0]} />
        <meshStandardMaterial color="#0d001a" roughness={0.8} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.8, -0.4]} castShadow>
        <boxGeometry args={[0.45, 0.4, 0.45]} />
        <meshStandardMaterial color="#0d001a" roughness={0.8} />
      </mesh>

      {/* Left Ear */}
      <mesh position={[-0.15, 1.1, -0.4]} castShadow>
        <coneGeometry args={[0.08, 0.2, 4]} />
        <meshStandardMaterial color="#0d001a" roughness={0.8} />
      </mesh>

      {/* Right Ear */}
      <mesh position={[0.15, 1.1, -0.4]} castShadow>
        <coneGeometry args={[0.08, 0.2, 4]} />
        <meshStandardMaterial color="#0d001a" roughness={0.8} />
      </mesh>

      {/* Tail */}
      <mesh ref={tailRef} position={[0, 0.6, 0.6]} castShadow>
        <cylinderGeometry args={[0.03, 0.02, 0.7, 8]} />
        <meshStandardMaterial color="#0d001a" roughness={0.8} />
      </mesh>

      {/* Front legs */}
      <mesh position={[-0.15, 0.15, -0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#0d001a" roughness={0.8} />
      </mesh>
      <mesh position={[0.15, 0.15, -0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#0d001a" roughness={0.8} />
      </mesh>

      {/* Back legs */}
      <mesh position={[-0.15, 0.15, 0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#0d001a" roughness={0.8} />
      </mesh>
      <mesh position={[0.15, 0.15, 0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#0d001a" roughness={0.8} />
      </mesh>

      {/* Emissive eye glow (visible as silhouette accent) */}
      <mesh position={[-0.1, 0.85, -0.63]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial
          color="#b06dff"
          emissive="#b06dff"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[0.1, 0.85, -0.63]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial
          color="#b06dff"
          emissive="#b06dff"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
}

/**
 * Cat Model — The scene's focal point.
 * A small cat facing away from the camera, looking toward the mountains.
 * Uses GLTF model if available, otherwise falls back to procedural geometry.
 * Currently renders procedural cat — swap to GLTFCat when .glb is ready.
 */
export function CatModel() {
  return <ProceduralCat />;
}
