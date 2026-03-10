"use client";

import { useRef, useMemo, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { PROJECTS } from "@/lib/projectData";
import { usePortfolioStore } from "@/store/portfolioStore";

import vertexShader from "@/shaders/distortion/vertex.glsl";
import fragmentShader from "@/shaders/distortion/fragment.glsl";

/* ─── Constants ─── */
const CARD_COUNT = PROJECTS.length; // 5
const RADIUS = 4;
const CARD_WIDTH = 2.8;
const CARD_HEIGHT = 1.8;

/**
 * Generate a programmatic CanvasTexture placeholder for a project card.
 * Dark card with project name, stack badges, accent color strip, and type badge.
 */
function generateCardTexture(project: (typeof PROJECTS)[number]): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;

  // Background: dark gradient
  const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bg.addColorStop(0, "#0f0020");
  bg.addColorStop(1, "#0a0012");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Accent color strip (top)
  ctx.fillStyle = project.color;
  ctx.fillRect(0, 0, canvas.width, 6);

  // Subtle grid pattern
  ctx.strokeStyle = "rgba(176, 109, 255, 0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Type badge (top-right)
  ctx.font = "bold 22px sans-serif";
  const badgeText = project.type;
  const badgeMetrics = ctx.measureText(badgeText);
  const badgeW = badgeMetrics.width + 24;
  const badgeX = canvas.width - badgeW - 30;
  const badgeY = 40;
  ctx.fillStyle = project.color + "30";
  ctx.strokeStyle = project.color + "80";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, 36, 18);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = project.color;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(badgeText, badgeX + 12, badgeY + 18);

  // Project name — large
  ctx.font = "bold 56px sans-serif";
  ctx.fillStyle = "#dcc6ff";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(project.name, 50, 120);

  // Description — smaller, wrapping
  ctx.font = "24px sans-serif";
  ctx.fillStyle = "rgba(220, 198, 255, 0.65)";
  const words = project.description.split(" ");
  let line = "";
  let lineY = 200;
  const maxWidth = canvas.width - 100;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), 50, lineY);
      line = word + " ";
      lineY += 32;
      if (lineY > 300) break;
    } else {
      line = test;
    }
  }
  if (line && lineY <= 300) ctx.fillText(line.trim(), 50, lineY);

  // Stack tags — bottom area
  let tagX = 50;
  const tagY = canvas.height - 90;
  ctx.font = "bold 20px sans-serif";
  for (const tag of project.stack) {
    const tw = ctx.measureText(tag).width + 20;
    // Pill background
    ctx.fillStyle = "rgba(176, 109, 255, 0.12)";
    ctx.strokeStyle = "rgba(176, 109, 255, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tagX, tagY, tw, 32, 16);
    ctx.fill();
    ctx.stroke();
    // Pill text
    ctx.fillStyle = "#dcc6ff";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(tag, tagX + 10, tagY + 16);
    tagX += tw + 10;
  }

  // Bottom accent line
  ctx.fillStyle = project.color + "40";
  ctx.fillRect(50, canvas.height - 30, canvas.width - 100, 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/* ─── Single Project Card Mesh ─── */

interface CardProps {
  project: (typeof PROJECTS)[number];
  index: number;
  totalCards: number;
}

function ProjectCard({ project, index, totalCards }: CardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();
  const setSelectedProject = usePortfolioStore((s) => s.setSelectedProject);

  // Calculate carousel position
  const angle = (index / totalCards) * Math.PI * 2;
  const posX = Math.sin(angle) * RADIUS;
  const posZ = Math.cos(angle) * RADIUS - 2;
  const rotY = -angle;

  // Generate texture once
  const texture = useMemo(() => generateCardTexture(project), [project]);

  // Shader uniforms
  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
    }),
    [texture]
  );

  // Advance time
  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
  });

  const handlePointerEnter = useCallback(() => {
    if (!meshRef.current) return;
    gl.domElement.style.cursor = "pointer";
    gsap.to(uniforms.uHover, { value: 1, duration: 0.5, ease: "power2.out" });
    // Subtle scale-up
    gsap.to(meshRef.current.scale, {
      x: 1.05,
      y: 1.05,
      z: 1.05,
      duration: 0.4,
      ease: "power2.out",
    });
  }, [uniforms, gl]);

  const handlePointerLeave = useCallback(() => {
    if (!meshRef.current) return;
    gl.domElement.style.cursor = "auto";
    gsap.to(uniforms.uHover, { value: 0, duration: 0.6, ease: "power2.inOut" });
    // Reset scale
    gsap.to(meshRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.5,
      ease: "power2.inOut",
    });
    // Reset tilt
    gsap.to(meshRef.current.rotation, {
      x: 0,
      z: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  }, [uniforms, gl]);

  const handlePointerMove = useCallback(
    (e: THREE.Event) => {
      if (!meshRef.current) return;
      const intersection = e as unknown as THREE.Intersection;
      if (intersection.uv) {
        uniforms.uMouse.value.copy(intersection.uv);
      }

      // 3D tilt toward mouse position within card
      if (intersection.uv) {
        const tiltX = (intersection.uv.y - 0.5) * 0.2;
        const tiltZ = (intersection.uv.x - 0.5) * -0.15;
        gsap.to(meshRef.current.rotation, {
          x: tiltX,
          z: tiltZ,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    },
    [uniforms]
  );

  const handleClick = useCallback(() => {
    setSelectedProject(project.id);
  }, [setSelectedProject, project.id]);

  return (
    <mesh
      ref={meshRef}
      position={[posX, 3.5, posZ]}
      rotation={[0, rotY, 0]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ─── Carousel Group ─── */

/**
 * ProjectCards — Cylindrical 3D carousel of project cards.
 *
 * Features:
 * - 5 cards arranged in a circle (radius 4)
 * - Custom GLSL distortion shader with hover-based liquid warp
 * - Fresnel rim glow on hover
 * - Programmatic CanvasTexture placeholders
 * - 3D tilt on pointer move
 * - Click opens detail modal
 */
export function ProjectCards() {
  const groupRef = useRef<THREE.Group>(null);

  // Slow auto-rotation for ambient motion
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {PROJECTS.map((project, i) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={i}
          totalCards={CARD_COUNT}
        />
      ))}
    </group>
  );
}
