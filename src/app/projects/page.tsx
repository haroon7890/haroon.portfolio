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
    images: ["/projects/supply-chain-management-system/opengraph-image"],
  },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  const getThumbnailProps = (slug: string, title: string, category: string) => {
    if (slug === "ride-sharing-dispatch-system") {
      return {
        title: "Ride Sharing",
        gradient: "from-[#0f3958] via-[#147ea1] to-[#23b5d3]",
        pattern: "circuit" as const,
        category: "Mobility",
      };
    }

    if (slug === "supply-chain-management-system") {
      return {
        title: "Supply Chain",
        gradient: "from-[#182b4d] via-[#23617d] to-[#2ea8a1]",
        pattern: "grid" as const,
        category: "Enterprise",
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
        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-soft)] px-4 py-2 font-mono text-sm mb-6 text-[color:var(--accent)] transition hover:-translate-y-0.5 hover:bg-[#ff8a5b22]"
      >
        <span aria-hidden="true">←</span>
        <span>Back to Home</span>
      </Link>
      <div className="glass card-3d mb-12 rounded-[28px] p-9 md:p-12">
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent)] font-mono mb-2">Case Studies</p>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-[-1.2px] text-[color:var(--text-light)] mb-4">Proof, not promises</h1>
        <p className="max-w-3xl text-[color:var(--text-mid)]">
          Each project below breaks down the business problem, technical approach, and delivery impact. These are structured for
          stakeholders who care about outcomes and engineering decisions.
        </p>
      </div>

      <div className="grid gap-7 md:grid-cols-2">
        {projects.map((project) => {
          const thumbnail = getThumbnailProps(project.slug, project.title, project.category);

          return (
          <article key={project.slug} className="glass card-3d overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--card-bg)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-[color:var(--accent-soft)]">
            <ProjectThumbnail
              title={thumbnail.title}
              gradient={thumbnail.gradient}
              pattern={thumbnail.pattern}
              category={thumbnail.category}
              imageSrc={project.coverImage}
            />
            <div className="p-6 flex flex-col gap-4 flex-1">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs px-3 py-1 rounded-full border border-[color:var(--accent-soft)] bg-[#ff8a5b24] text-[color:var(--accent)]">
                  {project.category}
                </span>
                <span className="text-xs font-mono text-[color:var(--text-dim)]">{project.timeline}</span>
              </div>
              <h2 className="text-2xl font-semibold text-[color:var(--text-light)]">{project.title}</h2>
              <p className="text-[color:var(--text-mid)]">{project.summary}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {project.stack.map((tech) => (
                  <span key={`${project.slug}-${tech}`} className="px-2 py-1 rounded border border-[color:var(--border)] bg-[#fff8ef] text-[color:var(--text-mid)]">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-auto pt-2 flex items-center gap-4">
                <Link
                  href={`/projects/${project.slug}`}
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--accent)] transition-all duration-200 hover:text-[#ffd09b] hover:gap-[8px]"
                >
                  Read Case Study
                  <ArrowRight size={14} />
                </Link>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm font-semibold text-[color:var(--text-mid)] transition-colors duration-200 hover:text-[color:var(--accent)]"
                >
                  GitHub
                </a>
              </div>
            </div>
          </article>
          );
        })}
      </div>
    </main>
  );
}
