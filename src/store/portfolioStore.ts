import { create } from "zustand";

/** All navigable sections in the portfolio */
export type Section = "hero" | "about" | "experience" | "projects";

/** Normalized 2D cursor position in NDC space (-1 to 1) */
interface CursorPosition {
  x: number;
  y: number;
}

/** Global portfolio application state  */
interface PortfolioState {
  /* ── Navigation ── */
  activeSection: Section;
  setActiveSection: (section: Section) => void;

  /* ── Loading ── */
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadProgress: number;
  setLoadProgress: (progress: number) => void;

  /* ── Audio ── */
  isMuted: boolean;
  toggleMute: () => void;

  /* ── Cursor ── */
  cursorPosition: CursorPosition;
  setCursorPosition: (pos: CursorPosition) => void;

  /* ── Projects ── */
  hoveredProject: number | null;
  setHoveredProject: (id: number | null) => void;
  selectedProject: number | null;
  setSelectedProject: (id: number | null) => void;

  /* ── UI Flags ── */
  heroTextVisible: boolean;
  setHeroTextVisible: (visible: boolean) => void;
  loadingScreenVisible: boolean;
  setLoadingScreenVisible: (visible: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;

  /* ── Post-Processing ── */
  cameraTransitioning: boolean;
  setCameraTransitioning: (transitioning: boolean) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  /* ── Navigation ── */
  activeSection: "hero",
  setActiveSection: (section) => set({ activeSection: section }),

  /* ── Loading ── */
  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),
  loadProgress: 0,
  setLoadProgress: (progress) => set({ loadProgress: progress }),

  /* ── Audio ── */
  isMuted: true,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  /* ── Cursor ── */
  cursorPosition: { x: 0, y: 0 },
  setCursorPosition: (pos) => set({ cursorPosition: pos }),

  /* ── Projects ── */
  hoveredProject: null,
  setHoveredProject: (id) => set({ hoveredProject: id }),
  selectedProject: null,
  setSelectedProject: (id) => set({ selectedProject: id }),

  /* ── UI Flags ── */
  heroTextVisible: false,
  setHeroTextVisible: (visible) => set({ heroTextVisible: visible }),
  loadingScreenVisible: true,
  setLoadingScreenVisible: (visible) =>
    set({ loadingScreenVisible: visible }),
  reducedMotion: false,
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),

  /* ── Post-Processing ── */
  cameraTransitioning: false,
  setCameraTransitioning: (transitioning) =>
    set({ cameraTransitioning: transitioning }),
}));
