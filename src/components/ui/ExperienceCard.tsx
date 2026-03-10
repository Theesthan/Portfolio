"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePortfolioStore } from "@/store/portfolioStore";

/** Stack tags for Dataflo.ai role */
const STACK_TAGS = [
  "Python",
  "FastAPI",
  "PostgreSQL",
  "Redis",
  "Docker",
  "AWS",
  "React",
  "TypeScript",
];

/**
 * ExperienceCard — DOM overlay for Work Experience section.
 *
 * Appears only when activeSection === 'experience'.
 * Features:
 * - Glassmorphism card with animated conic-gradient border
 * - Company name, role, date with blinking cursor
 * - Stack technology pills
 * - Timeline line (right side)
 */
export function ExperienceCard() {
  const activeSection = usePortfolioStore((s) => s.activeSection);
  const isVisible = activeSection === "experience";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="experience-card"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.97 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto fixed inset-0 z-20 flex items-center justify-center"
        >
          <div className="relative flex max-w-xl items-stretch gap-6">
            {/* ── Main Card ── */}
            <div className="experience-card relative overflow-hidden rounded-2xl px-8 py-7">
              {/* Animated conic-gradient border */}
              <div className="experience-border-glow" />

              {/* Content */}
              <div className="relative z-10">
                {/* Company */}
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-1 text-3xl font-bold tracking-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--color-accent)",
                  }}
                >
                  Dataflo.ai
                </motion.h2>

                {/* Role */}
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="mb-1 text-lg font-medium"
                  style={{ color: "var(--color-lavender)" }}
                >
                  Data & AI Engineering Intern
                </motion.p>

                {/* Date with blinking cursor */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  className="mb-5 text-sm tracking-wide"
                  style={{ color: "rgba(220, 198, 255, 0.6)" }}
                >
                  Jan 2024 — Present
                  <span className="blink-cursor ml-0.5">_</span>
                </motion.p>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.5 }}
                  className="mb-5 text-sm leading-relaxed"
                  style={{ color: "rgba(220, 198, 255, 0.8)" }}
                >
                  Building scalable data pipelines, ML model deployment
                  infrastructure, and real-time analytics dashboards. Working
                  with cross-functional teams to deliver AI-powered SaaS
                  products.
                </motion.p>

                {/* Stack Tags */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.5 }}
                  className="flex flex-wrap gap-2"
                >
                  {STACK_TAGS.map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.05, duration: 0.3 }}
                      className="stack-tag"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* ── Timeline Line ── */}
            <div className="relative flex flex-col items-center py-4">
              {/* Timeline dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                className="experience-timeline-dot"
              />
              {/* Vertical line */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="experience-timeline-line"
                style={{ transformOrigin: "top" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
