import type { Vector3 } from "three";

/** A portfolio project with metadata */
export interface Project {
  /** Unique identifier (1-indexed) */
  id: number;
  /** Display name */
  name: string;
  /** One-line description of the project */
  description: string;
  /** Technology stack tags */
  stack: string[];
  /** Category label */
  type: string;
  /** Accent color for card theming (hex string) */
  color: string;
}

/** A predefined camera anchor for a portfolio section */
export interface CameraAnchor {
  /** World-space position of the camera */
  position: Vector3;
  /** World-space point the camera looks at */
  target: Vector3;
  /** GSAP easing string */
  ease: string;
  /** Transition duration in seconds */
  duration: number;
}

/** An interest / skill tag displayed on the hero section */
export interface InterestTag {
  /** Display label */
  label: string;
  /** Short descriptor shown in expanded tooltip */
  description: string;
}

/** All navigable sections in the portfolio */
export type Section = "hero" | "about" | "experience" | "projects";

/** Section ordering for sequential navigation */
export const SECTION_ORDER: readonly Section[] = [
  "hero",
  "about",
  "experience",
  "projects",
] as const;
