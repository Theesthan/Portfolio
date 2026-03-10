import { Vector3 } from "three";
import type { CameraAnchor, Section } from "@/types";

/**
 * Camera anchor positions for each portfolio section.
 * Sourced from PRD.md Section 4.2.
 *
 * Navigation between anchors is handled by GSAP cubic‑ease
 * transitions in the CameraRig component.
 */
export const CAMERA_ANCHORS: Record<Section, CameraAnchor> = {
  hero: {
    position: new Vector3(0, 2.5, 8),
    target: new Vector3(0, 1, 0),
    ease: "power3.inOut",
    duration: 2.0,
  },
  about: {
    position: new Vector3(-3, 3, 5),
    target: new Vector3(-1, 1, 0),
    ease: "expo.inOut",
    duration: 2.2,
  },
  experience: {
    position: new Vector3(3, 2, 4),
    target: new Vector3(1.5, 0.5, 0),
    ease: "power4.inOut",
    duration: 2.4,
  },
  projects: {
    position: new Vector3(0, 5, 2),
    target: new Vector3(0, 0, -2),
    ease: "circ.inOut",
    duration: 2.6,
  },
} as const;

/**
 * Camera position for the cinematic load sequence opening shot.
 * Close-up on the cat model before pulling back to the hero anchor.
 */
export const LOAD_CAMERA_START: CameraAnchor = {
  position: new Vector3(-1.5, 0.8, 0),
  target: new Vector3(-1.5, 0.5, -3),
  ease: "power2.inOut",
  duration: 1.0,
} as const;
