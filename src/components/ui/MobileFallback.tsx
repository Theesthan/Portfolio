"use client";

import { motion } from "framer-motion";
import { usePortfolioStore } from "@/store/portfolioStore";
import { PROJECTS } from "@/lib/projectData";
import { SECTION_ORDER } from "@/types";

/**
 * MobileFallback — Simplified portfolio layout for mobile devices.
 *
 * Replaces the WebGL canvas with a static gradient background
 * and pure Framer Motion animations. Sections scroll vertically.
 */
export function MobileFallback() {
  const setActiveSection = usePortfolioStore((s) => s.setActiveSection);

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-portfolio-bg">
      {/* Hero Section */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Gradient backdrop */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(176, 109, 255, 0.3) 0%, transparent 60%)",
          }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 mb-4 text-5xl font-bold tracking-tight sm:text-6xl"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-lavender)",
          }}
        >
          S THEESTHAN
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="subtitle-text relative z-10 mb-8 text-lg tracking-wide"
          style={{ color: "var(--color-accent)" }}
        >
          Data & AI Engineer
        </motion.p>

        {/* Section nav pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 flex flex-wrap justify-center gap-3"
        >
          {SECTION_ORDER.map((section) => (
            <button
              key={section}
              onClick={() => {
                setActiveSection(section);
                document
                  .getElementById(`section-${section}`)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
              style={{
                background: "rgba(176, 109, 255, 0.12)",
                border: "1px solid rgba(176, 109, 255, 0.25)",
                color: "var(--color-lavender)",
              }}
            >
              {section}
            </button>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 text-xs tracking-widest"
          style={{ color: "var(--color-lavender)" }}
        >
          SCROLL ↓
        </motion.div>
      </section>

      {/* Experience Section */}
      <section
        id="section-experience"
        className="flex min-h-screen flex-col items-center justify-center px-6 py-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md rounded-2xl p-6"
          style={{
            background: "rgba(10, 0, 18, 0.8)",
            border: "1px solid rgba(176, 109, 255, 0.15)",
          }}
        >
          <h2
            className="mb-2 text-2xl font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-accent)",
            }}
          >
            Dataflo.ai
          </h2>
          <p className="mb-1 text-base" style={{ color: "var(--color-lavender)" }}>
            Data & AI Engineering Intern
          </p>
          <p
            className="mb-4 text-sm"
            style={{ color: "rgba(220, 198, 255, 0.6)" }}
          >
            Jan 2024 — Present
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(220, 198, 255, 0.8)" }}
          >
            Building scalable data pipelines, ML model deployment infrastructure,
            and real-time analytics dashboards.
          </p>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section
        id="section-projects"
        className="flex min-h-screen flex-col items-center px-6 py-16"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 text-3xl font-bold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-lavender)",
          }}
        >
          Projects
        </motion.h2>

        <div className="flex w-full max-w-md flex-col gap-4">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-xl p-5"
              style={{
                background: "rgba(10, 0, 18, 0.8)",
                border: `1px solid ${project.color}30`,
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3
                  className="text-lg font-bold"
                  style={{ color: "var(--color-lavender)" }}
                >
                  {project.name}
                </h3>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                  style={{
                    background: project.color + "20",
                    color: project.color,
                  }}
                >
                  {project.type}
                </span>
              </div>
              <p
                className="mb-3 text-sm leading-relaxed"
                style={{ color: "rgba(220, 198, 255, 0.7)" }}
              >
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tag) => (
                  <span key={tag} className="stack-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p
          className="text-xs tracking-widest"
          style={{ color: "rgba(220, 198, 255, 0.3)" }}
        >
          © 2026 S THEESTHAN
        </p>
      </footer>
    </div>
  );
}
