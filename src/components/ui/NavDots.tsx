"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SECTION_ORDER } from "@/types";
import type { Section } from "@/types";
import { useCameraTransition } from "@/hooks/useCameraTransition";

const SECTION_LABELS: Record<Section, string> = {
  hero: "Home",
  about: "About",
  experience: "Work",
  projects: "Projects",
};

/**
 * NavDots — Vertical navigation dots on the right edge of the viewport.
 *
 * - Active dot: filled #b06dff, scale 1.5
 * - Inactive: ring outline #6a3fa0
 * - Click navigates to section
 * - Keyboard: Tab through, Enter activates
 * - Tooltip label on hover
 */
export function NavDots() {
  const { activeSection, navigate } = useCameraTransition();

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-5"
    >
      {SECTION_ORDER.map((section) => {
        const isActive = section === activeSection;

        return (
          <button
            key={section}
            onClick={() => navigate(section)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(section);
              }
            }}
            aria-label={`Navigate to ${SECTION_LABELS[section]}`}
            aria-current={isActive ? "true" : undefined}
            className="group relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-portfolio-accent focus-visible:ring-offset-2 focus-visible:ring-offset-portfolio-bg"
          >
            {/* Dot */}
            <motion.div
              className="rounded-full"
              animate={{
                width: isActive ? 14 : 10,
                height: isActive ? 14 : 10,
                backgroundColor: isActive ? "#b06dff" : "transparent",
                borderColor: isActive ? "#b06dff" : "#6a3fa0",
                borderWidth: isActive ? 0 : 2,
                scale: isActive ? 1.3 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              style={{ borderStyle: "solid" }}
            />

            {/* Tooltip label — appears on hover */}
            <span className="pointer-events-none absolute right-8 whitespace-nowrap rounded-md bg-portfolio-purple/90 px-2 py-1 font-coolvetica text-xs tracking-wider text-portfolio-lavender opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
              {SECTION_LABELS[section]}
            </span>

            {/* Active glow ring */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  className="absolute rounded-full border border-portfolio-accent/30"
                  initial={{ width: 14, height: 14, opacity: 0.8 }}
                  animate={{ width: 28, height: 28, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </nav>
  );
}
