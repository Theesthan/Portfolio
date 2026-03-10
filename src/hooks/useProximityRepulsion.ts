import { useRef, useCallback, useEffect } from "react";
import { useSpring, useMotionValue, type MotionValue } from "framer-motion";

/** Radius (px) within which tags start repelling from the cursor */
const REPEL_RADIUS = 120;

/** Maximum repulsion force magnitude (px) */
const REPEL_STRENGTH = 40;

interface RepulsionResult {
  /** Repulsion offset X as a spring motion value */
  offsetX: MotionValue<number>;
  /** Repulsion offset Y as a spring motion value */
  offsetY: MotionValue<number>;
  /** Ref to attach to the tag element for position measurement */
  ref: React.RefObject<HTMLDivElement | null>;
}

/**
 * useProximityRepulsion — Physics-based cursor repulsion for a single element.
 *
 * Measures the element's center position and, when the cursor is within
 * REPEL_RADIUS, applies a spring-dampened offset that pushes the element
 * away from the cursor. Returns smoothly to origin when cursor exits.
 */
export function useProximityRepulsion(): RepulsionResult {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const offsetX = useSpring(rawX, { stiffness: 200, damping: 30 });
  const offsetY = useSpring(rawY, { stiffness: 200, damping: 30 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = centerX - e.clientX;
      const dy = centerY - e.clientY;
      const dist = Math.hypot(dx, dy);

      if (dist < REPEL_RADIUS && dist > 0) {
        const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
        // Push AWAY from cursor: tag center minus cursor = direction from cursor to tag
        // We want the tag to move in that direction
        rawX.set((dx / dist) * force * REPEL_STRENGTH);
        rawY.set((dy / dist) * force * REPEL_STRENGTH);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    },
    [rawX, rawY]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return { offsetX, offsetY, ref };
}
