import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { getAllProjects } from "@/lib/projects";
import { SITE_CONFIG } from "@/lib/config";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import ProjectThumbnail, { getProjectThumbnailPreset } from "@/components/ProjectThumbnail";
import { AssistantWidget, HomeBehaviorTracker } from "./home-client";
import ContactSection from "@/app/contact-section";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
      email: `mailto:${SITE_CONFIG.email}`,
      sameAs: [SITE_CONFIG.github, SITE_CONFIG.linkedin].filter(Boolean),
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

function hasCvFile() {
  const cvPath = path.join(process.cwd(), "public", "cv", "Haroon_Imran_CV.docx");
  return fs.existsSync(cvPath);
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  const projects = getAllProjects().slice(0, 3);
  const cvExists = hasCvFile();

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

      <main className="relative z-10 pt-24 md:pt-28">
        <section id="hero" className="section scroll-mt-24 pb-6 md:pb-8">
          <div className="relative mx-auto w-full max-w-6xl">
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(ellipse 600px 400px at 60% 50%, rgba(0,201,167,0.05) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />
            <div className="hero-shell relative overflow-hidden rounded-[20px] border border-white/[0.07] bg-gradient-to-br from-[#0d1626] to-[#0a1020] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" aria-hidden="true" />
              <div className="grid items-center gap-6 md:gap-8 lg:grid-cols-[320px_1fr]">
                <div className="photo-frame mx-auto w-full max-w-[200px] rounded-[12px] bg-gradient-to-br from-[#00C9A7] to-[#0066ff] p-[2px] sm:max-w-[280px] md:max-w-[320px] lg:mx-0">
                  <div className="relative h-[250px] sm:h-[320px] md:h-[360px] w-full overflow-hidden rounded-[10px] bg-[#0b1323]">
                    <Image
                      src="/image/haroon.jpg"
                      alt="Haroon Imran - Full-Stack Developer based in Lahore, Pakistan"
                      fill
                      priority
                      sizes="(max-width: 639px) 200px, (max-width: 767px) 280px, 320px"
                      className="object-cover object-[center_18%] md:object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-transparent to-black/35" />
                    <div className="absolute bottom-3 right-3 inline-flex rounded-full border border-white/10 bg-[#0a1020d8] px-3 py-1.5">
                      <span className="flex items-center gap-1.5 text-xs text-white/80">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                        </span>
                        Available for freelance
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center lg:text-left">
                  <div className="mb-3 inline-flex items-center justify-center gap-2 lg:justify-start">
                    <span className="h-px w-5 bg-[#00C9A7]" aria-hidden="true" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#00C9A7]">MERN STACK + AI INTEGRATION</span>
                  </div>

                  <h1 className="hero-name mb-4 text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">Haroon Imran</h1>

                  <p className="mb-3 text-base text-[#d8e3f2] md:text-lg">
                    I build MERN stack web apps and AI-powered tools that ship fast and work reliably.
                  </p>

                  <p className="body-copy max-w-2xl">
                    From backend APIs to polished React frontends - I am a BSCS student at UMT Lahore building real products with
                    the MERN stack and AI integrations. Currently available for freelance projects.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <a
                      href="#contact"
                      className="cta-primary inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-[#00C9A7] px-6 py-3 text-sm font-semibold text-black transition-all duration-200 ease-out hover:brightness-110 hover:scale-[1.03] hover:shadow-lg hover:shadow-teal-500/25"
                      data-analytics="booking_primary_click"
                      data-analytics-label="hero"
                    >
                      Let&apos;s Work Together
                    </a>

                    <a
                      href="#contact"
                      className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-[#63d2b440] px-6 py-3 text-sm font-semibold text-[#94a3b8] transition-all duration-200 ease-out hover:bg-teal-500/10 hover:border-teal-400 hover:text-teal-300"
                      data-analytics="hero_contact_click"
                    >
                      Start a Project
                    </a>

                    {cvExists ? (
                      <a
                        href="/cv/Haroon_Imran_CV.docx"
                        download
                        className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-white/[0.12] px-6 py-3 text-sm font-semibold text-[#e2e8f0] transition-all duration-200 ease-out hover:bg-white/5 hover:scale-[1.02]"
                        data-analytics="hero_download_cv_click"
                      >
                        Download CV
                      </a>
                    ) : (
                      <a
                        href={`mailto:${SITE_CONFIG.email}?subject=CV Request - Haroon Imran`}
                        className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-white/[0.12] px-6 py-3 text-sm font-semibold text-[#e2e8f0] transition-all duration-200 ease-out hover:bg-white/5 hover:scale-[1.02]"
                        data-analytics="hero_cv_request_click"
                      >
                        Request CV by Email
                      </a>
                    )}
                  </div>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#080d14] px-3 py-2 text-xs font-mono text-[#94a3b8]">
                    <span aria-hidden="true">🔨</span>
                    <span>Currently building: Multi-Agent AI Dev Workflow - n8n + LLMs + REST APIs</span>
                  </div>
                  {/* TODO: Add your CV to /public/cv/Haroon_Imran_CV.docx */}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section scroll-mt-24 pt-6 md:pt-8">
          <div className="relative">
            <span className="section-number" aria-hidden="true">01</span>
            <ScrollReveal distance={24} duration={600} className="relative z-[1]">
              <h2 className="section-title mb-4 text-[#e2e8f0]">
                Engineering with <span className="text-teal-400">business context</span>
              </h2>
              <p className="body-copy border-l-2 border-teal-500/40 pl-4 text-[#94a3b8]">
                I am a BSCS student at UMT Lahore and a hands-on full-stack engineer building useful digital products with the MERN
                stack. My work sits at the intersection of clean architecture, practical AI integration, and real-world delivery -
                not just academic exercises.
              </p>
              <p className="body-copy mt-4 border-l-2 border-teal-500/25 pl-4 text-[#94a3b8]">
                If you need someone who understands product tradeoffs, builds robust REST APIs, and ships polished frontends
                without cutting corners - let us talk. I am currently available for freelance projects on Upwork and Fiverr.
              </p>
            </ScrollReveal>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <ScrollReveal distance={24} duration={600}>
              <div className="rounded-2xl border border-white/[0.06] bg-[#0d1626] p-6 transition-colors duration-300 hover:border-white/[0.12]">
                <span className="text-xs font-mono tracking-widest text-teal-400">// STACK</span>
                <h3 className="mt-3 text-2xl font-bold text-white">Core Technologies</h3>
                <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                  {[
                    { label: "TypeScript", icon: "devicon-typescript-plain colored" },
                    { label: "JavaScript", icon: "devicon-javascript-plain colored" },
                    { label: "React", icon: "devicon-react-original colored" },
                    { label: "Next.js", icon: "devicon-nextjs-plain" },
                    { label: "Node.js", icon: "devicon-nodejs-plain colored" },
                    { label: "Express", icon: "devicon-express-original" },
                    { label: "Tailwind CSS", icon: "devicon-tailwindcss-plain colored" },
                    { label: "C++", icon: "devicon-cplusplus-plain colored" },
                    { label: "Python", icon: "devicon-python-plain colored" },
                    { label: "MongoDB", icon: "devicon-mongodb-plain colored" },
                    { label: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
                    { label: "Git/GitHub", icon: "devicon-github-original" },
                  ].map((item, index) => (
                    <ScrollReveal key={item.label} delay={index * 30} distance={20} duration={500}>
                      <div className="tech-badge group inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#080d14] px-3 py-2 text-xs font-medium text-[#e2e8f0] hover:border-teal-400/50 hover:-translate-y-1 transition-all duration-200">
                        <i className={`${item.icon} text-base`} aria-hidden="true" />
                        <span>{item.label}</span>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal distance={24} duration={600}>
              <div className="rounded-2xl border border-white/[0.06] bg-[#0d1626] p-6 transition-colors duration-300 hover:border-white/[0.12]">
                <span className="text-xs font-mono tracking-widest text-teal-400">// SERVICES</span>
                <h3 className="mt-3 text-2xl font-bold text-white">What I Deliver</h3>
                <ul className="mt-5 space-y-3 text-[#94a3b8]">
                  {[
                    "Full-stack web applications from zero to deployment.",
                    "Integration of AI workflows and LLMs into existing tools.",
                    "Performant REST APIs and database schema design.",
                    "Data structures and C++ system modeling.",
                    "Social media and marketing automation for crypto and Web3 brands.",
                  ].map((item, index) => (
                    <ScrollReveal key={item} delay={index * 60} distance={20} duration={500}>
                      <li className="group flex items-start gap-2 transition-colors duration-150 hover:text-white">
                        <Check size={14} className="mt-1 shrink-0 text-teal-400" />
                        <span>{item}</span>
                      </li>
                    </ScrollReveal>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="case-studies" className="section scroll-mt-24 pt-10">
          <div className="relative">
            <span className="section-number" aria-hidden="true">02</span>
            <ScrollReveal distance={24} duration={600} className="relative z-[1] mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="section-title text-[#e2e8f0]">Featured Case Studies</h2>
                <p className="mt-2 text-sm text-[#64748b]">Problem, approach, and measurable outcomes.</p>
              </div>
              <Link href="/projects" className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] px-4 py-2 text-sm font-semibold text-[#e2e8f0] transition-colors duration-200 hover:border-teal-500/30 hover:text-teal-300">
                View All Case Studies
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {projects.map((project, index) => {
              const preset = getProjectThumbnailPreset(project.title);

              return (
                <ScrollReveal key={project.slug} delay={index * 120} distance={32} duration={600}>
                  <article className="case-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d1626] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:border-teal-500/30">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-b from-teal-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="pointer-events-none absolute right-4 top-4 text-5xl font-bold font-mono text-white/[0.04]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <ProjectThumbnail
                      title={project.title}
                      gradient={preset.gradient}
                      pattern={preset.pattern}
                      category={project.category}
                    />

                    <div className="flex flex-1 flex-col gap-4 p-5">
                      <span className="w-fit rounded-full border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[1px] text-teal-400">
                        {project.category}
                      </span>
                      <h3 className="text-[20px] font-bold tracking-[-0.5px] text-white">{project.title}</h3>
                      <p className="text-sm leading-6 text-[#71839b]">{project.summary}</p>

                      <div className="mt-auto flex flex-wrap gap-2">
                        {project.stack.slice(0, 4).map((item) => (
                          <span key={`${project.slug}-${item}`} className="rounded-lg border border-white/[0.06] bg-[#080d14] px-2 py-1 text-[11px] font-mono text-[#94a3b8]">
                            {item}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-400 transition-all duration-200 group-hover:gap-3"
                        data-analytics="project_case_study_open"
                        data-analytics-label={project.slug}
                      >
                        Open Case Study
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        <ContactSection
          calendlyUrl={SITE_CONFIG.calendlyUrl}
          initialStatus={initialContactStatus}
        />
      </main>

      <AssistantWidget />
    </>
  );
}
