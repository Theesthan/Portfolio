import { useEffect, useRef, useCallback } from "react";
import { useCameraTransition } from "@/hooks/useCameraTransition";
import { usePortfolioStore } from "@/store/portfolioStore";

/** Wheel scroll cooldown in milliseconds */
const SCROLL_COOLDOWN = 2500;

/** Minimum delta threshold to trigger a scroll event */
const DELTA_THRESHOLD = 30;

/**
 * useSectionScroll — Wheel event listener that navigates sections sequentially.
 *
 * - deltaY > 0 → next section
 * - deltaY < 0 → previous section
 * - Throttled with SCROLL_COOLDOWN to prevent over-scrolling during transitions
 * - Respects reducedMotion (uses shorter cooldown)
 */
export function useSectionScroll() {
  const { next, prev } = useCameraTransition();
  const lastScrollRef = useRef(0);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);
  const isLoading = usePortfolioStore((s) => s.isLoading);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      // Don't navigate during loading
      if (isLoading) return;

      const now = Date.now();
      const cooldown = reducedMotion ? 500 : SCROLL_COOLDOWN;

      if (now - lastScrollRef.current < cooldown) return;
      if (Math.abs(e.deltaY) < DELTA_THRESHOLD) return;

      lastScrollRef.current = now;

      if (e.deltaY > 0) {
        next();
      } else {
        prev();
      }
    },
    [next, prev, reducedMotion, isLoading]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);
}
