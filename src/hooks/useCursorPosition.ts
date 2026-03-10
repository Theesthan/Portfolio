import { useEffect } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";

/**
 * useCursorPosition — Tracks mouse position in NDC space (-1 to 1)
 * and updates the global store for use by 3D components and UI effects.
 */
export function useCursorPosition() {
  const setCursorPosition = usePortfolioStore((s) => s.setCursorPosition);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setCursorPosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [setCursorPosition]);
}
