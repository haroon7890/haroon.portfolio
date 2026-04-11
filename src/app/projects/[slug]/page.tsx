import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects";
import ProjectThumbnail from "@/components/ProjectThumbnail";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Case Study Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      type: "article",
      title: `${project.title} | Case Study`,
      description: project.summary,
      url: `/projects/${project.slug}`,
      images: [`/projects/${project.slug}/opengraph-image`],
    },
  };
}

export default async function ProjectCaseStudyPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${siteUrl}/projects/${project.slug}`,
    image: `${siteUrl}${project.coverImage}`,
    creator: {
      "@type": "Person",
      name: "Haroon Imran",
    },
    keywords: project.stack.join(", "),
  };

  const thumbnail = (() => {
    if (project.slug === "ride-sharing-dispatch-system") {
      return {
        title: "Ride Sharing",
        gradient: "from-[#0f3958] via-[#147ea1] to-[#23b5d3]",
        pattern: "circuit" as const,
        category: "Mobility",
      };
    }

    if (project.slug === "supply-chain-management-system") {
      return {
        title: "Supply Chain",
        gradient: "from-[#182b4d] via-[#23617d] to-[#2ea8a1]",
        pattern: "grid" as const,
        category: "Enterprise",
      };
    }

    return {
      title: project.title,
      gradient: "from-[#0a1628] via-[#1a2f5e] to-[#2d4a8a]",
      pattern: "grid" as const,
      category: project.category,
    };
  })();

  return (
    <main className="section max-w-5xl py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Link
        href="/projects"
        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-soft)] px-4 py-2 font-mono text-sm mb-8 text-[color:var(--accent)] transition hover:-translate-y-0.5 hover:bg-[#ff8a5b22]"
      >
        <span aria-hidden="true">←</span>
        <span>Back to Case Studies</span>
      </Link>

      <article className="glass card-3d overflow-hidden rounded-[28px] border border-[color:var(--border)]">
        <div className="w-full" role="img" aria-label={`${project.title} - Case Study by Haroon Imran`}>
          <ProjectThumbnail
            title={thumbnail.title}
            gradient={thumbnail.gradient}
            pattern={thumbnail.pattern}
            category={thumbnail.category}
            imageSrc={project.coverImage}
          />
        </div>

        <div className="p-9 md:p-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-[#ff8a5b24] text-[color:var(--accent)] border border-[color:var(--accent-soft)] text-xs">
              {project.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#ffbf6d22] text-[#ffd8aa] border border-[#ffbf6d55] text-xs">
              {project.timeline}
            </span>
          </div>

          <h1 className="mb-4 text-5xl font-extrabold tracking-[-1px] text-[color:var(--text-light)]">{project.title}</h1>
          <p className="mb-8 text-lg text-[color:var(--text-mid)]">{project.summary}</p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="glass card-3d rounded-2xl border border-[color:var(--border)] bg-[#fffaf4] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--text-dim)] mb-1">Role</p>
              <p className="text-[color:var(--text-light)] font-medium">{project.role}</p>
            </div>
            <div className="glass card-3d rounded-2xl border border-[color:var(--border)] bg-[#fffaf4] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--text-dim)] mb-1">Stack</p>
              <p className="text-[color:var(--text-light)] font-medium">{project.stack.join(" • ")}</p>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-3 text-[color:var(--text-light)]">Problem</h2>
            <p className="text-[color:var(--text-mid)]">{project.problem}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-3 text-[color:var(--text-light)]">Approach</h2>
            <ul className="space-y-2 text-[color:var(--text-mid)] list-disc ml-5">
              {project.approach.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-3 text-[color:var(--text-light)]">Impact</h2>
            <ul className="space-y-2 text-[color:var(--text-mid)] list-disc ml-5">
              {project.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-3 text-[color:var(--text-light)]">Core Features</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {project.features.map((feature) => (
                <div key={feature} className="glass card-3d border border-[color:var(--border)] bg-[#fff8ef] p-3 text-[color:var(--text-mid)]">
                  {feature}
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <a href={project.liveUrl} target="_blank" rel="noreferrer noopener" className="featured-btn">
              Live Demo
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="px-6 py-2 rounded-full border border-[color:var(--accent)] text-[color:var(--accent)] font-semibold hover:bg-[#ff8a5b22]"
            >
              GitHub
            </a>
          </div>
        </div>
      </article>
    </main>
  );
}
