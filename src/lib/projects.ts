import projects from "../../content/projects.json";

export type ProjectCaseStudy = {
  slug: string;
  title: string;
  summary: string;
  coverImage: string;
  category: string;
  stack: string[];
  liveUrl: string;
  githubUrl: string;
  role: string;
  timeline: string;
  problem: string;
  approach: string[];
  impact: string[];
  features: string[];
};

export function getAllProjects(): ProjectCaseStudy[] {
  return projects as ProjectCaseStudy[];
}

export function getProjectBySlug(slug: string): ProjectCaseStudy | null {
  return (projects as ProjectCaseStudy[]).find((project) => project.slug === slug) ?? null;
}

export function getProjectSlugs(): string[] {
  return (projects as ProjectCaseStudy[]).map((project) => project.slug);
}
