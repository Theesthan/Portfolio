"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, ChromaticAberrationEffect } from "postprocessing";
import * as THREE from "three";
import { usePortfolioStore } from "@/store/portfolioStore";

/** Base and spike chromatic aberration offsets */
const CA_BASE = new THREE.Vector2(0.002, 0.002);
const CA_SPIKE = new THREE.Vector2(0.006, 0.006);
const CA_LERP_SPEED = 3.0;

/**
 * PostProcessing — Cinematic post-processing pipeline.
 *
 * Features:
 * - Bloom: glow on emissive/bright elements (intensity 1.5)
 * - ChromaticAberration: subtle edge distortion, spikes during camera transitions
 * - Vignette: darkened edges framing the scene
 *
 * Must be placed inside <Canvas> as a child of <Scene>.
 */
export function PostProcessing() {
  const caRef = useRef<ChromaticAberrationEffect>(null);
  const cameraTransitioning = usePortfolioStore(
    (s) => s.cameraTransitioning
  );
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);

  // Animate CA offset — spike during transitions, settle back to base
  useFrame((_, delta) => {
    if (!caRef.current || reducedMotion) return;

    const target = cameraTransitioning ? CA_SPIKE : CA_BASE;
    const current = caRef.current.offset;
    const speed = CA_LERP_SPEED * delta;

    current.x += (target.x - current.x) * Math.min(speed, 1);
    current.y += (target.y - current.y) * Math.min(speed, 1);
  });

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        ref={caRef}
        blendFunction={BlendFunction.NORMAL}
        offset={CA_BASE}
        radialModulation={false}
        modulationOffset={0.15}
      />
      <Vignette darkness={0.5} offset={0.3} />
    </EffectComposer>
  );
}
