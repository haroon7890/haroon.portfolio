import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import { ArrowRight } from "lucide-react";
import ProjectThumbnail from "@/components/ProjectThumbnail";

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
    images: ["/projects/supply-chain-optimization-platform/opengraph-image"],
  },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  const getThumbnailProps = (slug: string, title: string, category: string) => {
    if (slug === "supply-chain-optimization-platform") {
      return {
        title: "Supply Chain",
        gradient: "from-[#1a1a4e] via-[#0f3460] to-[#533483]",
        pattern: "grid" as const,
        category: "Enterprise",
      };
    }

    if (slug === "ai-powered-portfolio") {
      return {
        title: "AI Portfolio",
        gradient: "from-[#0f4c4c] via-[#0d7377] to-[#14a085]",
        pattern: "circuit" as const,
        category: "Personal Brand",
      };
    }

    if (slug === "academic-planning-mentorship-system") {
      return {
        title: "APMS Platform",
        gradient: "from-[#0a1628] via-[#1a2f5e] to-[#2d4a8a]",
        pattern: "dots" as const,
        category: "EdTech",
      };
    }

    return {
      title,
      gradient: "from-[#0a1628] via-[#1a2f5e] to-[#2d4a8a]",
      pattern: "grid" as const,
      category,
    };
  };

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
        {projects.map((project) => {
          const thumbnail = getThumbnailProps(project.slug, project.title, project.category);

          return (
          <article key={project.slug} className="glass tilt-3d tilt-soft card-3d overflow-hidden flex flex-col border border-white/[0.06] bg-[#0d1626] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:border-teal-500/30">
            <ProjectThumbnail
              title={thumbnail.title}
              gradient={thumbnail.gradient}
              pattern={thumbnail.pattern}
              category={thumbnail.category}
            />
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
                <Link
                  href={`/projects/${project.slug}`}
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-teal-400 transition-all duration-200 hover:text-teal-300 hover:gap-[8px]"
                >
                  Read Case Study
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </article>
          );
        })}
      </div>
    </main>
  );
}
