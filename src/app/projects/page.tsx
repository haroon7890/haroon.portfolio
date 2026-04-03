import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Detailed case studies covering product challenges, architecture, implementation strategy, and measurable outcomes.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Case Studies | Haroon Imran",
    description:
      "Detailed case studies covering product challenges, architecture, implementation strategy, and measurable outcomes.",
    url: "/projects",
    type: "website",
    images: ["/image/supplychain.jpg"],
  },
};

function getHueForTech(tech: string): number | null {
  const key = tech.toLowerCase();
  if (key.includes("typescript")) return 210;
  if (key.includes("javascript")) return 48;
  if (key.includes("react")) return 195;
  if (key.includes("next")) return 220;
  if (key.includes("node")) return 135;
  if (key.includes("express")) return 16;
  if (key.includes("tailwind")) return 189;
  if (key.includes("postgres")) return 210;
  if (key.includes("mongo")) return 135;
  if (key.includes("python")) return 42;
  if (key.includes("tensorflow")) return 28;
  if (key.includes("c++") || key.includes("cplusplus")) return 260;
  if (key.includes("ai")) return 280;
  if (key.includes("mail")) return 340;
  return null;
}

function getProjectThumbHues(stack: string[], seed: string): { h1: number; h2: number } {
  const hues = stack
    .map(getHueForTech)
    .filter((hue): hue is number => typeof hue === "number");

  if (hues.length >= 2) {
    return { h1: hues[0], h2: hues[1] };
  }

  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const base = 165 + (hash % 55);
  return { h1: base, h2: (base + 28) % 360 };
}

function ProjectThumbnail({ title, stack, slug }: { title: string; stack: string[]; slug: string }) {
  const { h1, h2 } = getProjectThumbHues(stack, slug);

  return (
    <div
      className="project-thumb relative h-52 w-full"
      style={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ["--h1" as any]: h1,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ["--h2" as any]: h2,
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-x-6 bottom-6">
        <div className="text-white font-extrabold text-3xl leading-tight drop-shadow">{title}</div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="section max-w-6xl py-20">
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#63d2b440] text-[#63d2b4] font-mono text-sm mb-6 hover:bg-[#63d2b420] transition hover:-translate-y-0.5"
      >
        <span aria-hidden="true">←</span>
        <span>Back to Home</span>
      </Link>
      <div className="glass tilt-3d tilt-soft card-3d p-8 md:p-10 mb-10">
        <p className="text-xs uppercase tracking-[0.18em] text-[#63d2b4] font-mono mb-2">Case Studies</p>
        <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-4">Proof, not promises</h1>
        <p className="text-zinc-300 max-w-3xl">
          Each project below breaks down the business problem, technical approach, and delivery impact. These are structured for
          stakeholders who care about outcomes and engineering decisions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <article key={project.slug} className="glass tilt-3d tilt-soft card-3d overflow-hidden flex flex-col">
            <ProjectThumbnail title={project.title} stack={project.stack} slug={project.slug} />
            <div className="p-6 flex flex-col gap-4 flex-1">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs px-3 py-1 rounded-full bg-[#63d2b430] text-[#63d2b4] border border-[#63d2b450]">
                  {project.category}
                </span>
                <span className="text-xs text-zinc-400 font-mono">{project.timeline}</span>
              </div>
              <h2 className="text-2xl font-semibold text-white">{project.title}</h2>
              <p className="text-zinc-400">{project.summary}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {project.stack.map((tech) => (
                  <span key={`${project.slug}-${tech}`} className="px-2 py-1 rounded bg-[#232946] text-zinc-200 border border-[#ffffff18]">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-auto pt-2">
                <Link href={`/projects/${project.slug}`} className="featured-btn inline-flex">
                  Read Case Study
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
