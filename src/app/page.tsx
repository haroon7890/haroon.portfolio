import Link from "next/link";
import Image from "next/image";
import { getAllProjects } from "@/lib/projects";
import FadeInOnScroll from "./FadeInOnScroll";
import { AssistantWidget, HomeBehaviorTracker } from "./home-client";
import ContactSection from "./ContactSection";
import { Icon } from "@iconify/react";
import typescriptIcon from "@iconify-icons/devicon/typescript";
import javascriptIcon from "@iconify-icons/devicon/javascript";
import reactIcon from "@iconify-icons/devicon/react";
import nextjsIcon from "@iconify-icons/devicon/nextjs";
import nodejsIcon from "@iconify-icons/devicon/nodejs";
import expressIcon from "@iconify-icons/devicon/express";
import tailwindcssIcon from "@iconify-icons/devicon/tailwindcss";
import cplusplusIcon from "@iconify-icons/devicon/cplusplus";
import pythonIcon from "@iconify-icons/devicon/python";
import mongodbIcon from "@iconify-icons/devicon/mongodb";
import postgresqlIcon from "@iconify-icons/devicon/postgresql";
import swaggerIcon from "@iconify-icons/devicon/swagger";
import githubIcon from "@iconify-icons/devicon/github";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://calendly.com/";

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

  // Deterministic fallback that stays within the teal/blue family.
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const base = 165 + (hash % 55); // 165..219
  return { h1: base, h2: (base + 28) % 360 };
}

function ProjectThumbnail({ title, stack, slug, image }: { title: string; stack: string[]; slug: string; image?: string }) {
  const { h1, h2 } = getProjectThumbHues(stack, slug);

  return (
    <div className="project-thumb-base relative h-44 w-full" aria-hidden="true">
      {image && (
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      )}
      <div 
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: `radial-gradient(900px circle at 15% 20%, hsla(${h1}, 80%, 55%, 0.4), transparent 55%), radial-gradient(800px circle at 85% 75%, hsla(${h2}, 80%, 55%, 0.25), transparent 60%)`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#101624] via-[#101624]/40 to-[#101624]/10" />
      <div className="absolute inset-x-5 bottom-5">
        <div className="text-white font-extrabold text-2xl leading-tight drop-shadow">{title}</div>
      </div>
    </div>
  );
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Haroon Imran",
      jobTitle: "Full-Stack Developer & AI Integrator",
      url: siteUrl,
      image: `${siteUrl}/image/haroon.jpg`,
      email: "mailto:haroon86865@gmail.com",
      telephone: "+923364450294",
      sameAs: [
        "https://github.com/haroon7890",
        "https://www.linkedin.com/in/haroon-imran-80b515352/",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#service`,
      name: "Haroon Imran Engineering Services",
      areaServed: "Worldwide",
      provider: { "@id": `${siteUrl}/#person` },
      serviceType: [
        "Full-stack web development",
        "AI integration",
        "Backend architecture",
        "Technical consulting",
      ],
      url: siteUrl,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Haroon Imran Portfolio",
      publisher: { "@id": `${siteUrl}/#person` },
    },
  ],
};

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 md:px-10 py-3">
      <div className="glass max-w-6xl mx-auto rounded-full border border-[#63d2b420] shadow-lg shadow-black/25">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5">
          <div className="font-mono text-[#63d2b4] text-sm md:text-base font-bold tracking-wide select-none">
            {"// haroon.dev"}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm font-mono text-zinc-200">
            <a
              href="#about"
              className="btn-anim rounded-full px-3 py-2 hover:bg-[#63d2b420] hover:text-white"
              data-analytics="nav_about_click"
            >
              About
            </a>
            <a
              href="#case-studies"
              className="btn-anim rounded-full px-3 py-2 hover:bg-[#63d2b420] hover:text-white"
              data-analytics="nav_case_studies_click"
            >
              Case Studies
            </a>
            <a
              href="#contact"
              className="btn-anim rounded-full px-3 py-2 hover:bg-[#63d2b420] hover:text-white"
              data-analytics="nav_contact_click"
            >
              Contact
            </a>
            <Link
              href="/projects"
              className="btn-anim rounded-full px-3 py-2 border border-[#63d2b440] bg-[#63d2b420] text-[#63d2b4] hover:bg-[#63d2b430]"
              data-analytics="nav_projects_click"
            >
              Projects
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  const projects = getAllProjects().slice(0, 3);

  // NOTE: In this Next.js version, `searchParams` can be a Promise.
  // Unwrap it before accessing properties to avoid sync dynamic API warnings.
  const resolvedSearchParams = !searchParams
    ? undefined
    : typeof (searchParams as Promise<unknown>).then === "function"
      ? await (searchParams as Promise<Record<string, string | string[] | undefined>>)
      : (searchParams as Record<string, string | string[] | undefined>);

  const rawContact = resolvedSearchParams?.contact;
  const contact = Array.isArray(rawContact) ? rawContact[0] : rawContact;
  const initialContactStatus = contact === "success" || contact === "error" ? contact : undefined;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <HomeBehaviorTracker />
      <Navbar />

      <FadeInOnScroll>
        <section id="hero" className="fade-in" style={{ paddingTop: "6.25rem", paddingBottom: "2.5rem" }}>
          <div className="mx-auto w-[85vw] max-w-6xl">
            <div className="tilt-3d tilt-soft">
              <div className="glass hero-card p-7 md:p-10 grid lg:grid-cols-[320px_1fr] gap-8 items-center">
              <div className="relative h-[360px] w-full overflow-hidden rounded-xl border border-[#63d2b440] bg-[#0f1627]">
                <Image
                  src="/image/haroon.jpg"
                  alt="Haroon Imran"
                  fill
                  priority
                  sizes="(min-width: 1024px) 320px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/35" />
                <div className="absolute bottom-3 right-3 text-[11px] font-mono text-[#63d2b4] bg-[#101624d8] px-2 py-1 rounded inline-flex items-center gap-2">
                  <span className="relative inline-flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Available for freelance
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#63d2b4] mb-3 font-mono">Full-stack + AI delivery</p>
                <h1 className="text-5xl md:text-7xl font-extrabold gradient-text drop-shadow mb-4">Haroon Imran</h1>
                <p className="text-zinc-200 text-lg md:text-xl mb-4 leading-relaxed">I build production-ready products with modern web architecture and practical AI integrations.</p>
                <p className="text-zinc-300 mb-6 max-w-2xl leading-relaxed">
                From product strategy to backend systems and polished frontends, I focus on outcomes that matter: faster delivery,
                clearer architecture, and better conversion performance.
                </p>

                <div className="flex flex-wrap gap-3 mb-5">
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="featured-btn"
                    data-analytics="booking_primary_click"
                    data-analytics-label="hero"
                  >
                    Let&apos;s Work Together
                  </a>
                <a
                  href="#contact"
                  className="px-6 py-2 rounded-full border border-[#63d2b4] text-[#63d2b4] font-semibold hover:bg-[#63d2b420] transition hover:-translate-y-0.5"
                  data-analytics="hero_contact_click"
                >
                  Start a Project
                </a>
                <a
                  href="/cv/Haroon_Imran_CV.docx"
                  download
                  className="px-6 py-2 rounded-full border border-[#4fa8e8] text-[#4fa8e8] font-semibold hover:bg-[#4fa8e820] transition hover:-translate-y-0.5 inline-flex items-center gap-2"
                  data-analytics="hero_download_cv_click"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" /></svg>
                  Download CV
                </a>
                </div>

                <div className="flex flex-wrap gap-3 text-xs font-mono text-zinc-300">
                  <span className="px-3 py-1 rounded-full bg-[#63d2b420] border border-[#63d2b440]">Next.js</span>
                  <span className="px-3 py-1 rounded-full bg-[#4fa8e820] border border-[#4fa8e840]">TypeScript</span>
                  <span className="px-3 py-1 rounded-full bg-[#63d2b420] border border-[#63d2b440]">AI Workflows</span>
                  <span className="px-3 py-1 rounded-full bg-[#4fa8e820] border border-[#4fa8e840]">C++ Systems</span>
                </div>

                <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-zinc-200 px-3 py-2 rounded-full bg-[#232946] border border-[#ffffff18]">
                  <span aria-hidden="true">🔨</span>
                  <span className="text-zinc-300">Currently building:</span>
                  <span className="text-[#63d2b4]">Multi-Agent AI Dev Workflow</span>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        <div className="section-divider" aria-hidden="true" />

        <section id="about" className="section fade-in">
          <div className="glass tilt-3d tilt-soft p-8 mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-4">Engineering with business context</h2>
            <p className="text-zinc-200 leading-7 mb-4 text-lg">
              I am a BSCS student at UMT Lahore and a hands-on full-stack engineer focused on building useful digital products.
              My approach combines structured architecture, clear communication, and iterative delivery.
            </p>
            <p className="text-zinc-300 leading-7">
              If you need someone who can reason through product tradeoffs, implement robust APIs, and craft high-quality
              user-facing experiences, we should talk.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass tilt-3d tilt-soft p-8">
              <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-[#63d2b4]"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                Core Technologies
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "TypeScript", icon: typescriptIcon },
                  { label: "JavaScript", icon: javascriptIcon },
                  { label: "React", icon: reactIcon },
                  { label: "Next.js", icon: nextjsIcon },
                  { label: "Node.js", icon: nodejsIcon },
                  { label: "Express", icon: expressIcon },
                  { label: "Tailwind CSS", icon: tailwindcssIcon },
                  { label: "C++", icon: cplusplusIcon },
                  { label: "Python", icon: pythonIcon },
                  { label: "MongoDB", icon: mongodbIcon },
                  { label: "PostgreSQL", icon: postgresqlIcon },
                  { label: "REST APIs", icon: swaggerIcon },
                  { label: "Git/GitHub", icon: githubIcon },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="tilt-3d tilt-strong card-3d flex items-center gap-3 px-3 py-3 rounded-xl bg-[#232946] border border-[#ffffff18] text-zinc-200 shadow-sm transition hover:border-[#63d2b440]"
                  >
                    <Icon icon={item.icon} className="h-6 w-6" aria-hidden="true" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass tilt-3d tilt-soft p-8">
              <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-[#4fa8e8]"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" /></svg>
                What I Deliver
              </h3>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#4fa8e8] mt-1">✓</span>
                  Full-stack web applications from zero to deployment.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4fa8e8] mt-1">✓</span>
                  Integration of AI workflows and LLMs into existing tools.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4fa8e8] mt-1">✓</span>
                  Performant REST APIs and database schema design.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4fa8e8] mt-1">✓</span>
                  Data structures and C++ system modeling.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="section-divider" aria-hidden="true" />

        <section id="case-studies" className="section fade-in">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div>
              <h2 className="text-3xl font-bold gradient-text">Featured Case Studies</h2>
              <p className="text-zinc-400 mt-2">Problem, approach, and impact for recent work.</p>
            </div>
            <Link href="/projects" className="featured-btn" data-analytics="projects_view_all_click">
              View All Case Studies
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {projects.map((project) => (
              <article key={project.slug} className="glass tilt-3d tilt-soft overflow-hidden flex flex-col">
                <ProjectThumbnail title={project.title} stack={project.stack} slug={project.slug} image={project.coverImage} />
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="text-xs text-[#63d2b4] font-mono">{project.category}</div>
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  <p className="text-zinc-400 text-sm">{project.summary}</p>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {project.stack.slice(0, 4).map((item) => (
                      <span key={`${project.slug}-${item}`} className="px-2 py-1 rounded bg-[#232946] text-zinc-200">
                        {item}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="btn-anim mt-auto inline-flex w-fit items-center justify-center rounded-full border border-[#63d2b440] bg-[#10162466] px-4 py-2 text-sm font-semibold text-[#63d2b4] hover:bg-[#63d2b420]"
                    data-analytics="project_case_study_open"
                    data-analytics-label={project.slug}
                  >
                    Open Case Study
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="section-divider" aria-hidden="true" />

        <ContactSection bookingUrl={bookingUrl} initialStatus={initialContactStatus} />
      </FadeInOnScroll>

      <AssistantWidget />
    </>
  );
}
