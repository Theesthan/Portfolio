"use client";

import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import * as THREE from "three";
import { usePortfolioStore } from "@/store/portfolioStore";
import { CAMERA_ANCHORS, LOAD_CAMERA_START } from "@/lib/cameraAnchors";

/**
 * CameraRig — Drives cinematic GSAP transitions between section anchors.
 *
 * On activeSection change:
 *   1. Tweens camera.position along a smooth ease curve
 *   2. Tweens a lookAt target vector simultaneously
 *   3. Adds subtle idle float when resting
 *
 * Must be placed inside <Canvas> as a child of <Scene>.
 */
export function CameraRig() {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 1, 0));
  const tweensRef = useRef<gsap.core.Tween[]>([]);
  const activeSection = usePortfolioStore((s) => s.activeSection);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);
  const isLoading = usePortfolioStore((s) => s.isLoading);
  const setCameraTransitioning = usePortfolioStore(
    (s) => s.setCameraTransitioning
  );
  const hasRevealedRef = useRef(false);

  // Initialize camera to cat close-up (load position) on mount
  useEffect(() => {
    camera.position.copy(LOAD_CAMERA_START.position);
    targetRef.current.copy(LOAD_CAMERA_START.target);
    camera.lookAt(targetRef.current);
  }, [camera]);

  // Cinematic pull-back: cat close-up → hero when loading completes
  useEffect(() => {
    if (isLoading || hasRevealedRef.current) return;
    hasRevealedRef.current = true;

    const heroAnchor = CAMERA_ANCHORS.hero;
    setCameraTransitioning(true);

    const posProxy = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
    const targetProxy = {
      x: targetRef.current.x,
      y: targetRef.current.y,
      z: targetRef.current.z,
    };

    const posTween = gsap.to(posProxy, {
      x: heroAnchor.position.x,
      y: heroAnchor.position.y,
      z: heroAnchor.position.z,
      duration: 2.5,
      ease: "power3.inOut",
      onUpdate: () => {
        camera.position.set(posProxy.x, posProxy.y, posProxy.z);
      },
      onComplete: () => setCameraTransitioning(false),
    });

    const targetTween = gsap.to(targetProxy, {
      x: heroAnchor.target.x,
      y: heroAnchor.target.y,
      z: heroAnchor.target.z,
      duration: 2.5,
      ease: "power3.inOut",
      onUpdate: () => {
        targetRef.current.set(targetProxy.x, targetProxy.y, targetProxy.z);
        camera.lookAt(targetRef.current);
      },
    });

    tweensRef.current = [posTween, targetTween];
  }, [isLoading, camera, setCameraTransitioning]);

  // Animate camera on section change
  useEffect(() => {
    const anchor = CAMERA_ANCHORS[activeSection];

    // Kill any in-flight tweens to prevent overlap
    tweensRef.current.forEach((t) => t.kill());
    tweensRef.current = [];

    const duration = reducedMotion ? 0.3 : anchor.duration;
    const ease = reducedMotion ? "power1.out" : anchor.ease;

    // Signal post-processing to spike chromatic aberration
    setCameraTransitioning(true);

    // Proxy objects for GSAP to tween (can't tween Vector3 directly)
    const posProxy = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
    const targetProxy = {
      x: targetRef.current.x,
      y: targetRef.current.y,
      z: targetRef.current.z,
    };

    const posTween = gsap.to(posProxy, {
      x: anchor.position.x,
      y: anchor.position.y,
      z: anchor.position.z,
      duration,
      ease,
      onUpdate: () => {
        camera.position.set(posProxy.x, posProxy.y, posProxy.z);
      },
      onComplete: () => {
        setCameraTransitioning(false);
      },
    });

    const targetTween = gsap.to(targetProxy, {
      x: anchor.target.x,
      y: anchor.target.y,
      z: anchor.target.z,
      duration,
      ease,
      onUpdate: () => {
        targetRef.current.set(targetProxy.x, targetProxy.y, targetProxy.z);
        camera.lookAt(targetRef.current);
      },
    });

    tweensRef.current = [posTween, targetTween];

    return () => {
      posTween.kill();
      targetTween.kill();
    };
  }, [activeSection, camera, reducedMotion, setCameraTransitioning]);

  // Subtle idle float — gentle sine wave on Y axis
  useFrame(({ clock }) => {
    if (reducedMotion) return;
    camera.position.y += Math.sin(clock.elapsedTime * 0.3) * 0.0005;
  });

  return null;
}
