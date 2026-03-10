"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

/**
 * Custom Cursor — dual-element cursor (dot + ring) with spring lag
 * and hover state expansion for interactive elements.
 *
 * - Dot: 8px filled circle, tracks 1:1 with mouse
 * - Ring: 40px outline circle, follows with spring lag
 * - Hover: ring scales 2.5x, turns accent color, dot fades
 * - Hidden on touch devices
 */
export function Cursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Raw mouse position (dot follows instantly)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springy ring position (lags behind)
  const ringX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const ringY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    },
    [mouseX, mouseY, isVisible]
  );

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Track hover state on elements with data-cursor="hover"
  useEffect(() => {
    const onEnter = () => setIsHovering(true);
    const onLeave = () => setIsHovering(false);

    const observeTargets = () => {
      const targets = document.querySelectorAll('[data-cursor="hover"]');
      targets.forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
      return targets;
    };

    // Initial observation + MutationObserver for dynamically added elements
    let targets = observeTargets();

    const observer = new MutationObserver(() => {
      // Cleanup old listeners
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      targets = observeTargets();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  // Global mouse listeners
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Hide on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  return (
    <>
      {/* Cursor Dot — tracks mouse 1:1 */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-portfolio-accent"
        style={{
          x: mouseX,
          y: mouseY,
          width: 8,
          height: 8,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? (isHovering ? 0 : 1) : 0,
          scale: isHovering ? 0.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Cursor Ring — follows with spring lag */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border-2"
        style={{
          x: ringX,
          y: ringY,
          width: 40,
          height: 40,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 2.5 : 1,
          borderColor: isHovering ? "#b06dff" : "#6a3fa0",
          backgroundColor: isHovering
            ? "rgba(176, 109, 255, 0.08)"
            : "transparent",
        }}
        transition={{
          scale: { type: "spring", stiffness: 200, damping: 20 },
          opacity: { duration: 0.2 },
          borderColor: { duration: 0.2 },
          backgroundColor: { duration: 0.2 },
        }}
      />
    </>
  );
}
