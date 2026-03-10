"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { usePortfolioStore } from "@/store/portfolioStore";

const NAME = "S THEESTHAN";
const SUBTITLE = "Data & AI Engineer";

/**
 * Animated letter span for the name reveal.
 */
function AnimatedLetter({
  letter,
  index,
  isVisible,
}: {
  letter: string;
  index: number;
  isVisible: boolean;
}) {
  if (letter === " ") {
    return <span className="inline-block w-[0.3em]" />;
  }

  return (
    <motion.span
      className="inline-block"
      initial={{ y: 60, opacity: 0, clipPath: "inset(100% 0 0 0)" }}
      animate={
        isVisible
          ? { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)" }
          : { y: 60, opacity: 0, clipPath: "inset(100% 0 0 0)" }
      }
      exit={{
        y: -100,
        opacity: 0,
        scale: 0.5,
        transition: { delay: index * 0.02, duration: 0.4 },
      }}
      transition={{
        delay: 0.8 + index * 0.05,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {letter}
    </motion.span>
  );
}

/**
 * Cursor-warping subtitle word.
 * Each word tracks cursor proximity and warps away.
 */
function WarpWord({
  word,
  index,
  isVisible,
}: {
  word: string;
  index: number;
  isVisible: boolean;
}) {
  const wordRef = useRef<HTMLSpanElement>(null);
  const warpX = useMotionValue(0);
  const warpY = useMotionValue(0);
  const springX = useSpring(warpX, { stiffness: 150, damping: 25 });
  const springY = useSpring(warpY, { stiffness: 150, damping: 25 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!wordRef.current) return;
      const rect = wordRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = centerX - e.clientX;
      const dy = centerY - e.clientY;
      const dist = Math.hypot(dx, dy);

      if (dist < 200 && dist > 0) {
        const force = Math.min(20, 200 / dist);
        warpX.set((dx / dist) * force);
        warpY.set((dy / dist) * force);
      } else {
        warpX.set(0);
        warpY.set(0);
      }
    },
    [warpX, warpY]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <motion.span
      ref={wordRef}
      className="subtitle-text inline-block"
      style={{ x: springX, y: springY }}
      initial={{ opacity: 0, y: 20 }}
      animate={
        isVisible
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 20 }
      }
      exit={{ opacity: 0, y: -40, transition: { delay: index * 0.05 } }}
      transition={{
        delay: 1.4 + index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      {word}
    </motion.span>
  );
}

/**
 * HeroText — Kinetic name reveal + cursor-warping subtitle.
 *
 * - Name: staggered letter-by-letter clip reveal
 * - Subtitle: words warp away from cursor with spring physics
 * - Chromatic aberration shimmer on subtitle
 * - AnimatePresence for clean exit on section change
 */
export function HeroText() {
  const activeSection = usePortfolioStore((s) => s.activeSection);
  const isLoading = usePortfolioStore((s) => s.isLoading);
  const setHeroTextVisible = usePortfolioStore((s) => s.setHeroTextVisible);

  const isHeroActive = activeSection === "hero";
  const isVisible = isHeroActive && !isLoading;

  const letters = useMemo(() => NAME.split(""), []);
  const subtitleWords = useMemo(() => SUBTITLE.split(" "), []);

  useEffect(() => {
    setHeroTextVisible(isVisible);
  }, [isVisible, setHeroTextVisible]);

  return (
    <AnimatePresence mode="wait">
      {isHeroActive && (
        <motion.div
          key="hero-text"
          className="flex flex-col items-center gap-4"
          exit={{ transition: { staggerChildren: 0.02 } }}
        >
          {/* Name */}
          <h1 className="font-coolvetica text-5xl tracking-[0.25em] text-portfolio-accent drop-shadow-[0_0_30px_rgba(176,109,255,0.5)] sm:text-6xl md:text-7xl lg:text-8xl">
            {letters.map((letter, i) => (
              <AnimatedLetter
                key={`${letter}-${i}`}
                letter={letter}
                index={i}
                isVisible={isVisible}
              />
            ))}
          </h1>

          {/* Subtitle — cursor-warping words */}
          <div className="flex flex-wrap justify-center gap-x-3 font-coolvetica text-lg tracking-wider text-portfolio-lavender/80 sm:text-xl md:text-2xl">
            {subtitleWords.map((word, i) => (
              <WarpWord
                key={word}
                word={word}
                index={i}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-12 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 0.5 : 0 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            <span className="font-coolvetica text-xs tracking-[0.3em] text-portfolio-lavender/40">
              SCROLL
            </span>
            <motion.div
              className="h-8 w-px bg-gradient-to-b from-portfolio-accent/50 to-transparent"
              animate={{ scaleY: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
