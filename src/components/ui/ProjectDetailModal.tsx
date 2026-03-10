"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePortfolioStore } from "@/store/portfolioStore";
import { PROJECTS } from "@/lib/projectData";

/**
 * ProjectDetailModal — Full-screen overlay for a selected project.
 *
 * Features:
 * - AnimatePresence enter/exit animations
 * - Framer Motion layoutId for expansion effect
 * - Project details: name, description, stack, type badge
 * - Blurred backdrop overlay
 * - Close: ESC key or backdrop click
 */
export function ProjectDetailModal() {
  const selectedProject = usePortfolioStore((s) => s.selectedProject);
  const setSelectedProject = usePortfolioStore((s) => s.setSelectedProject);

  const project = selectedProject
    ? PROJECTS.find((p) => p.id === selectedProject) ?? null
    : null;

  const close = useCallback(() => {
    setSelectedProject(null);
  }, [setSelectedProject]);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (selectedProject !== null) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, close]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={close}
          />

          {/* Modal Card */}
          <motion.div
            key="modal-card"
            layoutId={`project-card-${project.id}`}
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="pointer-events-auto fixed inset-0 z-50 m-auto flex h-fit max-h-[80vh] w-full max-w-lg flex-col overflow-y-auto rounded-2xl border border-white/10 p-8"
            style={{
              background: "rgba(10, 0, 18, 0.92)",
              backdropFilter: "blur(24px)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close project detail"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4L12 12M12 4L4 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Type badge */}
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-3 w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
              style={{
                background: project.color + "20",
                border: `1px solid ${project.color}50`,
                color: project.color,
              }}
            >
              {project.type}
            </motion.span>

            {/* Project name */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-2 text-3xl font-bold tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-lavender)",
              }}
            >
              {project.name}
            </motion.h2>

            {/* Accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-4 h-0.5 w-16 origin-left rounded-full"
              style={{ background: project.color }}
            />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="mb-6 text-sm leading-relaxed"
              style={{ color: "rgba(220, 198, 255, 0.8)" }}
            >
              {project.description}
            </motion.p>

            {/* Stack tags */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-6 flex flex-wrap gap-2"
            >
              {project.stack.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.05, duration: 0.3 }}
                  className="stack-tag"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            {/* View Project button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="group relative w-fit overflow-hidden rounded-lg px-6 py-2.5 text-sm font-bold uppercase tracking-widest transition-all"
              style={{
                background: `linear-gradient(135deg, ${project.color}30, ${project.color}10)`,
                border: `1px solid ${project.color}50`,
                color: project.color,
              }}
              data-cursor="hover"
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = `linear-gradient(135deg, ${project.color}50, ${project.color}20)`;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = `linear-gradient(135deg, ${project.color}30, ${project.color}10)`;
              }}
            >
              View Project
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
