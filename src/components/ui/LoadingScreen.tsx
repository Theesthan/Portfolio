"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { gsap } from "gsap";
import { usePortfolioStore } from "@/store/portfolioStore";

/**
 * LoadingScreen — Cinematic 5-phase intro sequence.
 *
 * Phase 0: Hold dark screen (0.5s)
 * Phase 1: Purple fog wipe from center (1.0s)
 * Phase 2: Canvas fade in (1.0s, overlaps Phase 1 by 0.3s)
 * Phase 3: Camera pull-back from cat close-up to hero (1.0s)
 * Phase 4: Hero text assembles (1.5s)
 * Phase 5: Loading screen fades out (0.8s)
 *
 * Renders a full-screen overlay with progress bar + percentage.
 */
export function LoadingScreen() {
  const { progress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const loadingScreenVisible = usePortfolioStore(
    (s) => s.loadingScreenVisible
  );
  const setIsLoading = usePortfolioStore((s) => s.setIsLoading);
  const setHeroTextVisible = usePortfolioStore((s) => s.setHeroTextVisible);
  const setLoadingScreenVisible = usePortfolioStore(
    (s) => s.setLoadingScreenVisible
  );
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasStarted = useRef(false);

  // Smoothly animate displayed progress number
  useEffect(() => {
    const proxy = { val: displayProgress };
    gsap.to(proxy, {
      val: progress,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => setDisplayProgress(Math.round(proxy.val)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  // When loading reaches 100%, start cinematic timeline
  useEffect(() => {
    if (progress < 100 || hasStarted.current) return;
    hasStarted.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
        // Enable custom cursor
        document.body.classList.add("custom-cursor-active");
      },
    });
    timelineRef.current = tl;

    // Phase 0: Hold dark (0.5s)
    tl.to({}, { duration: 0.5 });

    // Phase 1: Purple fog wipe — scale up and fade
    tl.to(
      ".fog-overlay",
      { scale: 20, opacity: 0, duration: 1.0, ease: "power2.in" },
      "+=0"
    );

    // Phase 2: Canvas fade in (overlaps fog wipe by 0.3s)
    tl.to(
      ".canvas-wrapper",
      { opacity: 1, duration: 1.0, ease: "power2.inOut" },
      "-=0.3"
    );

    // Phase 3: Camera pull back (CameraRig handles via isLoading → false)
    tl.to({}, { duration: 1.0 });

    // Phase 4: Hero text assembles
    tl.call(() => setHeroTextVisible(true));
    tl.to({}, { duration: 1.5 });

    // Phase 5: Loading screen fades out
    tl.to(".loading-screen", {
      opacity: 0,
      duration: 0.8,
      onComplete: () => setLoadingScreenVisible(false),
    });

    return () => {
      tl.kill();
    };
  }, [progress, setIsLoading, setHeroTextVisible, setLoadingScreenVisible]);

  if (!loadingScreenVisible) return null;

  return (
    <div
      className="loading-screen fixed inset-0 z-[1000] flex flex-col items-center justify-center"
      style={{ background: "#0a0012" }}
    >
      {/* Purple fog overlay — scales out during Phase 1 */}
      <div
        className="fog-overlay absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(45, 0, 95, 0.6) 0%, rgba(10, 0, 18, 0) 70%)",
        }}
      />

      {/* Progress bar */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Percentage counter */}
        <p
          className="text-5xl font-bold tabular-nums tracking-tight"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-accent)",
          }}
        >
          {displayProgress}%
        </p>

        {/* Thin progress line */}
        <div
          className="h-[2px] w-48 overflow-hidden rounded-full"
          style={{ background: "rgba(176, 109, 255, 0.15)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${displayProgress}%`,
              background:
                "linear-gradient(90deg, var(--color-accent), var(--color-lavender))",
            }}
          />
        </div>
      </div>

      {/* Bottom name text */}
      <p
        className="absolute bottom-10 text-xs font-bold uppercase tracking-[0.4em]"
        style={{
          fontFamily: "var(--font-display)",
          color: "rgba(220, 198, 255, 0.3)",
        }}
      >
        S THEESTHAN
      </p>
    </div>
  );
}
