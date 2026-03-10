import type { Project, InterestTag } from "@/types";

/**
 * All portfolio projects — sourced exclusively from PRD.md Section 5.5.
 * No invented content.
 */
export const PROJECTS: readonly Project[] = [
  {
    id: 1,
    name: "VouchX",
    description:
      "AI-assisted B2B SaaS platform for receipt processing with intelligent OCR extraction and validation pipelines.",
    stack: ["React", "Node.js", "Python", "OCR"],
    type: "AI SaaS",
    color: "#b06dff",
  },
  {
    id: 2,
    name: "IndigoGlass Nexus",
    description:
      "Modular Data & AI platform for supply chain analytics and sustainability tracking with graph-based knowledge modeling.",
    stack: ["FastAPI", "MySQL", "Neo4j", "Next.js", "XGBoost"],
    type: "Data Platform",
    color: "#7c3aed",
  },
  {
    id: 3,
    name: "PitchPulse",
    description:
      "Financial analytics platform for pitchbook automation with real-time data visualization and collaborative workflows.",
    stack: ["React", "TypeScript", "Supabase"],
    type: "Financial Analytics",
    color: "#8b5cf6",
  },
  {
    id: 4,
    name: "QuantFlux",
    description:
      "Crypto trading and analytics system leveraging machine learning models for market prediction and automated strategy execution.",
    stack: ["Python", "SQL", "XGBoost", "Docker"],
    type: "Crypto Trading System",
    color: "#a78bfa",
  },
  {
    id: 5,
    name: "TSP-D",
    description:
      "Drone-assisted Traveling Salesman Problem optimization algorithm for efficient multi-stop route planning.",
    stack: ["Python", "Algorithms", "Drone Routing"],
    type: "Research / Algorithm",
    color: "#c4b5fd",
  },
] as const;

/**
 * Interest / skill tags — from PRD.md Section 5.3.
 */
export const INTEREST_TAGS: readonly InterestTag[] = [
  {
    label: "Data Engineering",
    description: "ETL pipelines, Airflow, dbt, streaming architectures",
  },
  {
    label: "Cloud Computing",
    description: "AWS, GCP, serverless functions, distributed systems",
  },
  {
    label: "Machine Learning",
    description: "XGBoost, neural networks, time-series forecasting",
  },
  {
    label: "Database Management",
    description: "SQL, Neo4j graph DB, Redis caching, query optimization",
  },
] as const;
