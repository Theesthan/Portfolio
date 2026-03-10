import { usePortfolioStore } from "@/store/portfolioStore";
import type { Section } from "@/types";
import { SECTION_ORDER } from "@/types";

/**
 * Hook for programmatic camera navigation between sections.
 *
 * Provides:
 * - navigate(section) — jump to a specific section
 * - next() / prev() — sequential navigation
 * - activeSection — current section
 */
export function useCameraTransition() {
  const activeSection = usePortfolioStore((s) => s.activeSection);
  const setActiveSection = usePortfolioStore((s) => s.setActiveSection);

  const navigate = (section: Section) => {
    if (section === activeSection) return;
    setActiveSection(section);
  };

  const next = () => {
    const currentIndex = SECTION_ORDER.indexOf(activeSection);
    if (currentIndex < SECTION_ORDER.length - 1) {
      setActiveSection(SECTION_ORDER[currentIndex + 1]);
    }
  };

  const prev = () => {
    const currentIndex = SECTION_ORDER.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(SECTION_ORDER[currentIndex - 1]);
    }
  };

  return { activeSection, navigate, next, prev };
}
