import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects";

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
      images: [project.coverImage],
    },
  };
}

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

  const thumbHues = getProjectThumbHues(project.stack, project.slug);

  return (
    <main className="section max-w-5xl py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Link
        href="/projects"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#63d2b440] text-[#63d2b4] font-mono text-sm mb-8 hover:bg-[#63d2b420] transition hover:-translate-y-0.5"
      >
        <span aria-hidden="true">←</span>
        <span>Back to Case Studies</span>
      </Link>

      <article className="glass tilt-3d tilt-soft card-3d overflow-hidden">
        <div className="project-thumb-base relative w-full h-64 md:h-96" aria-hidden="true">
          {project.coverImage && (
            <img
              src={project.coverImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div 
            className="absolute inset-0 mix-blend-screen"
            style={{
              background: `radial-gradient(900px circle at 15% 20%, hsla(${thumbHues.h1}, 80%, 55%, 0.4), transparent 55%), radial-gradient(800px circle at 85% 75%, hsla(${thumbHues.h2}, 80%, 55%, 0.25), transparent 60%)`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101624] via-[#101624]/50 to-[#101624]/10" />
          <div className="absolute inset-x-8 bottom-8">
            <div className="text-white font-extrabold text-3xl md:text-4xl leading-tight drop-shadow">
              {project.title}
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-[#63d2b430] text-[#63d2b4] border border-[#63d2b450] text-xs">
              {project.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#4fa8e830] text-[#4fa8e8] border border-[#4fa8e850] text-xs">
              {project.timeline}
            </span>
          </div>

          <h1 className="text-4xl font-extrabold gradient-text mb-4">{project.title}</h1>
          <p className="text-zinc-300 mb-8 text-lg">{project.summary}</p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="glass tilt-3d tilt-soft card-3d p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-400 mb-1">Role</p>
              <p className="text-white font-medium">{project.role}</p>
            </div>
            <div className="glass tilt-3d tilt-soft card-3d p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-400 mb-1">Stack</p>
              <p className="text-white font-medium">{project.stack.join(" • ")}</p>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-3 text-white">Problem</h2>
            <p className="text-zinc-300">{project.problem}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-3 text-white">Approach</h2>
            <ul className="space-y-2 text-zinc-300 list-disc ml-5">
              {project.approach.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-3 text-white">Impact</h2>
            <ul className="space-y-2 text-zinc-300 list-disc ml-5">
              {project.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-3 text-white">Core Features</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {project.features.map((feature) => (
                <div key={feature} className="glass card-3d p-3 text-zinc-200">
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
              className="px-6 py-2 rounded-full border border-[#63d2b4] text-[#63d2b4] font-semibold hover:bg-[#63d2b418]"
            >
              GitHub
            </a>
          </div>
        </div>
      </article>
    </main>
  );
}
