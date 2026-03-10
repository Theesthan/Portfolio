"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useProximityRepulsion } from "@/hooks/useProximityRepulsion";
import { INTEREST_TAGS } from "@/lib/projectData";

/**
 * Tag positions distributed around the hero section.
 * Values are CSS percentages for absolute positioning.
 */
const TAG_POSITIONS: Array<{ top: string; left: string; phase: number }> = [
  { top: "22%", left: "12%", phase: 0 },
  { top: "18%", left: "72%", phase: 1.2 },
  { top: "68%", left: "8%", phase: 2.4 },
  { top: "72%", left: "76%", phase: 3.6 },
];

/**
 * Single floating interest tag with glassmorphism styling,
 * sinusoidal float animation, and cursor proximity repulsion.
 */
function FloatingTag({
  label,
  description,
  position,
  phase,
  isExpanded,
  onToggle,
}: {
  label: string;
  description: string;
  position: { top: string; left: string };
  phase: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { offsetX, offsetY, ref } = useProximityRepulsion();

  return (
    <motion.div
      ref={ref}
      className="absolute"
      style={{
        top: position.top,
        left: position.left,
        x: offsetX,
        y: offsetY,
      }}
    >
      <motion.button
        data-cursor="hover"
        onClick={onToggle}
        className="relative rounded-full border border-portfolio-accent/30 bg-white/5 px-5 py-2.5 font-coolvetica text-sm tracking-wider text-portfolio-lavender backdrop-blur-md transition-colors hover:border-portfolio-accent/60 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-portfolio-accent sm:text-base"
        animate={{
          y: [
            Math.sin(phase) * 8,
            Math.sin(phase + Math.PI) * 8,
            Math.sin(phase) * 8,
          ],
        }}
        transition={{
          y: {
            duration: 3 + phase * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        layout
        layoutId={`tag-${label}`}
      >
        {label}
      </motion.button>

      {/* Expanded tooltip card */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute left-1/2 top-full z-20 mt-3 w-64 -translate-x-1/2 rounded-xl border border-portfolio-accent/20 bg-portfolio-purple/90 p-4 backdrop-blur-lg"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            layoutId={`tag-tooltip-${label}`}
          >
            <p className="font-coolvetica text-sm font-medium tracking-wider text-portfolio-accent">
              {label}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-portfolio-lavender/70">
              {description}
            </p>
            {/* Caret arrow */}
            <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-portfolio-accent/20 bg-portfolio-purple/90" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * InterestTags — 4 floating glassmorphism pills on the hero section
 * with sinusoidal float animation, cursor proximity repulsion,
 * and click-to-expand tooltip cards.
 *
 * Only visible when activeSection === "hero".
 */
export function InterestTags() {
  const activeSection = usePortfolioStore((s) => s.activeSection);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const isHeroActive = activeSection === "hero";

  const handleToggle = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <AnimatePresence>
      {isHeroActive && (
        <motion.div
          key="interest-tags"
          className="pointer-events-auto absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {INTEREST_TAGS.map((tag, i) => (
            <FloatingTag
              key={tag.label}
              label={tag.label}
              description={tag.description}
              position={TAG_POSITIONS[i]}
              phase={TAG_POSITIONS[i].phase}
              isExpanded={expandedIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
