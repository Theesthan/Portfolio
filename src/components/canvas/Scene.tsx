"use client";

import { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  AdaptiveDpr,
  PerformanceMonitor,
  Preload,
} from "@react-three/drei";
import * as THREE from "three";

interface SceneProps {
  children: React.ReactNode;
}

/**
 * Root R3F Canvas — full-screen immersive WebGL environment.
 * Sets up renderer, camera, fog, HDRI environment, and perf monitors.
 */
export function Scene({ children }: SceneProps) {
  const dprRef = useRef<[number, number]>([1, 2]);

  return (
    <Canvas
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.8,
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: "high-performance",
      }}
      camera={{
        fov: 60,
        near: 0.1,
        far: 200,
        position: [0, 2.5, 8],
      }}
      shadows
      dpr={dprRef.current}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
    >
      {/* Adaptive DPR: reduces pixel ratio on slow devices */}
      <AdaptiveDpr pixelated />

      {/* Auto-degrade quality when FPS drops below threshold */}
      <PerformanceMonitor
        onDecline={() => {
          dprRef.current = [1, 1];
        }}
        onIncline={() => {
          dprRef.current = [1, 2];
        }}
      />

      {/* Scene background & atmosphere */}
      <color attach="background" args={["#0a0012"]} />
      <fogExp2 attach="fog" args={["#1a0035", 0.035]} />

      {/* HDRI environment for global illumination (drei preset — no file needed) */}
      <Suspense fallback={null}>
        <Environment preset="night" background={false} />
      </Suspense>

      {/* Lighting */}
      <SceneLighting />

      {/* Phase 2+ child components (terrain, models, particles, etc.) */}
      {children}

      {/* Eagerly preload all drei-managed assets */}
      <Preload all />
    </Canvas>
  );
}

/**
 * Scene lighting rig:
 * - Low-intensity purple ambient fill
 * - Soft directional rim light from upper-left
 * - A point light component for cursor-following will be added in Phase 4
 */
function SceneLighting() {
  return (
    <>
      {/* Purple-tinted ambient fill */}
      <ambientLight color="#2d005f" intensity={0.3} />

      {/* Directional rim light — soft purple tint, upper-left */}
      <directionalLight
        color="#b06dff"
        intensity={0.8}
        position={[-5, 10, -5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />

      {/* Secondary fill from below-right for depth */}
      <pointLight
        color="#6a3fa0"
        intensity={0.4}
        position={[5, -2, 3]}
        distance={30}
        decay={2}
      />
    </>
  );
}
