"use client";

import dynamic from "next/dynamic";
import { NavDots } from "@/components/ui/NavDots";
import { Cursor } from "@/components/ui/Cursor";
import { HeroText } from "@/components/ui/HeroText";
import { InterestTags } from "@/components/ui/InterestTags";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { useCursorPosition } from "@/hooks/useCursorPosition";
import { ExperienceCard } from "@/components/ui/ExperienceCard";

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

/* Phase 6: Experience 3D orb */
const ExperienceNode = dynamic(
  () =>
    import("@/components/canvas/ExperienceNode").then((mod) => ({
      default: mod.ExperienceNode,
    })),
  { ssr: false }
);

export default function Home() {
  // Phase 3: Wheel scroll section navigation
  useSectionScroll();
  // Phase 4: Track cursor position in NDC for 3D/UI effects
  useCursorPosition();

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
        {/* Phase 6: Experience 3D orb */}
        <ExperienceNode />
      </Scene>

      {/* DOM overlays — layered above the canvas */}
      <div className="pointer-events-none fixed inset-0 z-10">
        {/* Phase 4: Hero section UI */}
        <div className="flex h-full w-full items-center justify-center">
          <HeroText />
        </div>
        {/* Phase 5: Interest tags with proximity repulsion */}
        <InterestTags />
        {/* Phase 6: Experience card overlay */}
        <ExperienceCard />
      </div>

      {/* Phase 4: Custom cursor */}
      <Cursor />

      {/* Phase 3: Navigation dots */}
      <NavDots />
    </main>
  );
}
