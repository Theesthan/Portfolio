"use client";

import dynamic from "next/dynamic";
import { NavDots } from "@/components/ui/NavDots";
import { useSectionScroll } from "@/hooks/useSectionScroll";

/**
 * Dynamic import of Scene to prevent SSR of Three.js/Canvas.
 * R3F requires browser APIs (WebGL context) — must be client-only.
 */
const Scene = dynamic(
  () =>
    import("@/components/canvas/Scene").then((mod) => ({
      default: mod.Scene,
    })),
  { ssr: false }
);

/* Phase 2: 3D Environment components */
const Terrain = dynamic(
  () =>
    import("@/components/canvas/Terrain").then((mod) => ({
      default: mod.Terrain,
    })),
  { ssr: false }
);

const Mountains = dynamic(
  () =>
    import("@/components/canvas/Mountains").then((mod) => ({
      default: mod.Mountains,
    })),
  { ssr: false }
);

const CatModel = dynamic(
  () =>
    import("@/components/canvas/CatModel").then((mod) => ({
      default: mod.CatModel,
    })),
  { ssr: false }
);

const VolumetricClouds = dynamic(
  () =>
    import("@/components/canvas/VolumetricClouds").then((mod) => ({
      default: mod.VolumetricClouds,
    })),
  { ssr: false }
);

const ParticleField = dynamic(
  () =>
    import("@/components/canvas/ParticleField").then((mod) => ({
      default: mod.ParticleField,
    })),
  { ssr: false }
);

/* Phase 3: Camera system */
const CameraRig = dynamic(
  () =>
    import("@/components/canvas/CameraRig").then((mod) => ({
      default: mod.CameraRig,
    })),
  { ssr: false }
);

export default function Home() {
  // Phase 3: Wheel scroll section navigation
  useSectionScroll();

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-portfolio-bg">
      {/* WebGL Canvas — full-screen, fixed behind DOM overlays */}
      <Scene>
        {/* Phase 2: 3D Environment */}
        <Terrain />
        <Mountains />
        <CatModel />
        <VolumetricClouds />
        <ParticleField />
        {/* Phase 3: Camera navigation */}
        <CameraRig />
      </Scene>

      {/* DOM overlays — layered above the canvas */}
      <div className="pointer-events-none fixed inset-0 z-10">
        {/* Phase 4+: HeroText, Cursor, etc. */}
        <div className="flex h-full w-full items-center justify-center">
          <h1 className="pointer-events-auto font-coolvetica text-6xl tracking-widest text-portfolio-accent drop-shadow-[0_0_30px_rgba(176,109,255,0.5)]">
            S THEESTHAN
          </h1>
        </div>
      </div>

      {/* Phase 3: Navigation dots */}
      <NavDots />
    </main>
  );
}
