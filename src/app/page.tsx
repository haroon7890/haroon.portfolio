import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getAllProjects } from "@/lib/projects";
import { SITE_CONFIG } from "@/lib/config";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import ProjectThumbnail from "@/components/ProjectThumbnail";
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
      jobTitle: "Full-Stack Engineer & AI Integrator",
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
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const projects = getAllProjects().slice(0, 3);
  const cvExists = hasCvFile();

  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const rawContact = resolvedSearchParams?.contact;
  const contact = Array.isArray(rawContact) ? rawContact[0] : rawContact;
  const initialContactStatus = contact === "success" || contact === "error" ? contact : undefined;

  const thumbnailPropsBySlug: Record<
    string,
    { title: string; gradient: string; pattern: "grid" | "dots" | "circuit"; category: string }
  > = {
    "ride-sharing-dispatch-system": {
      title: "Ride Sharing",
      gradient: "from-[#0f3958] via-[#147ea1] to-[#23b5d3]",
      pattern: "circuit",
      category: "Mobility",
    },
    "supply-chain-management-system": {
      title: "Supply Chain",
      gradient: "from-[#182b4d] via-[#23617d] to-[#2ea8a1]",
      pattern: "grid",
      category: "Enterprise",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <HomeBehaviorTracker />
      <Navbar />

      <main className="relative z-10 pt-24 md:pt-28">
        <section id="hero" className="section scroll-mt-24 pb-10 md:pb-14">
          <div className="relative mx-auto w-full max-w-6xl">
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(ellipse 640px 420px at 58% 46%, rgba(231,119,70,0.14) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />
            <div className="hero-shell hero-shell-enter relative overflow-hidden rounded-[28px] border border-[color:var(--border)] p-7 md:p-10 shadow-[0_22px_56px_rgba(66,43,18,0.16)]">
              <div className="hero-orb orb-a" aria-hidden="true" />
              <div className="hero-orb orb-b" aria-hidden="true" />
              <div className="hero-orb orb-c" aria-hidden="true" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffb26b66] to-transparent" aria-hidden="true" />
              <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-[1fr_320px]">
                <div className="photo-frame hero-media order-2 mx-auto w-full max-w-[200px] rounded-[12px] bg-gradient-to-br from-[color:var(--accent)] via-[color:var(--accent-2)] to-[color:var(--accent-3)] p-[2px] sm:max-w-[280px] md:max-w-[320px] lg:mx-0">
                  <div className="relative h-[250px] sm:h-[320px] md:h-[360px] w-full overflow-hidden rounded-[10px] bg-[#eadfce]">
                    <Image
                      src="/image/haroon.jpg"
                      alt="Haroon Imran - Full-Stack Engineer based in Lahore, Pakistan"
                      fill
                      priority
                      sizes="(max-width: 639px) 200px, (max-width: 767px) 280px, 320px"
                      className="object-cover object-[center_18%] md:object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20" />
                    <div className="absolute bottom-3 right-3 inline-flex rounded-full border border-black/10 bg-[#fff7ebee] px-3 py-1.5">
                      <span className="flex items-center gap-1.5 text-xs text-[color:var(--text-mid)]">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                        </span>
                        Available for freelance
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-1 text-center lg:text-left">
                  <div className="hero-reveal hero-delay-1 mb-3 inline-flex items-center justify-center gap-2 lg:justify-start">
                    <span className="h-px w-5 bg-[color:var(--accent)]" aria-hidden="true" />
                    <span className="font-mono text-[11px] tracking-[0.28em] text-[color:var(--accent)]">INDEPENDENT PRODUCT ENGINEER</span>
                  </div>

                  <h1 className="hero-name hero-reveal hero-delay-2 mb-4 text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[color:var(--text-light)] leading-[1.05]">Haroon Imran</h1>
                  <p className="hero-lead hero-reveal hero-delay-3 mb-4 max-w-2xl">Design-forward websites and robust web apps with practical AI workflows.</p>

                  <p className="body-copy hero-reveal hero-delay-4 max-w-2xl">From backend APIs to polished React frontends — I am a BSCS student at UMT Lahore building real products using the MERN stack and AI integrations. Currently available for freelance projects.</p>

                  <div className="hero-reveal hero-delay-5 metric-grid mt-5 grid gap-2 sm:grid-cols-3 sm:gap-3 max-w-3xl">
                    <div className="hero-metric">
                      <p className="font-display text-xl font-bold text-[color:var(--text-light)]">2</p>
                      <p className="mt-0.5 text-[11px] font-mono tracking-[0.12em] text-[color:var(--text-dim)]">LIVE CASE STUDIES</p>
                    </div>
                    <div className="hero-metric">
                      <p className="font-display text-xl font-bold text-[color:var(--text-light)]">24h</p>
                      <p className="mt-0.5 text-[11px] font-mono tracking-[0.12em] text-[color:var(--text-dim)]">RESPONSE TIME</p>
                    </div>
                    <div className="hero-metric">
                      <p className="font-display text-xl font-bold text-[color:var(--text-light)]">MERN + AI</p>
                      <p className="mt-0.5 text-[11px] font-mono tracking-[0.12em] text-[color:var(--text-dim)]">DELIVERY FOCUS</p>
                    </div>
                  </div>

                  <div className="hero-reveal hero-delay-6 mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <a
                      href="#contact"
                      className="cta-primary inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-[#2d1308] transition-all duration-200 ease-out hover:brightness-110 hover:scale-[1.03] hover:shadow-lg hover:shadow-[#ff8a5b55]"
                      data-analytics="booking_primary_click"
                      data-analytics-label="hero"
                    >
                      Let&apos;s Work Together
                    </a>

                    <a
                      href="#contact"
                      className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-[color:var(--accent-soft)] px-6 py-3 text-sm font-semibold text-[color:var(--text-mid)] transition-all duration-200 ease-out hover:bg-[#ff8a5b1f] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                      data-analytics="hero_contact_click"
                    >
                      Start a Project
                    </a>

                    {cvExists ? (
                      <a
                        href="/cv/Haroon_Imran_CV.docx"
                        download
                        className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-[color:var(--border)] px-6 py-3 text-sm font-semibold text-[color:var(--text-light)] transition-all duration-200 ease-out hover:bg-[#fff2e6] hover:scale-[1.02]"
                        data-analytics="hero_download_cv_click"
                      >
                        Download CV
                      </a>
                    ) : (
                      <a
                        href={`mailto:${SITE_CONFIG.email}?subject=CV Request - Haroon Imran`}
                        className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-[color:var(--border)] px-6 py-3 text-sm font-semibold text-[color:var(--text-light)] transition-all duration-200 ease-out hover:bg-[#fff2e6] hover:scale-[1.02]"
                        data-analytics="hero_cv_request_click"
                      >
                        Request CV by Email
                      </a>
                    )}
                  </div>

                  <div className="hero-reveal hero-delay-7 mt-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[#fff8ef] px-3 py-2 text-xs font-mono text-[color:var(--text-mid)]">
                    <span aria-hidden="true">🔨</span>
                    <span>Currently building: Multi-Agent AI Dev Workflow — n8n + LLMs + REST APIs</span>
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
            <ScrollReveal distance={26} duration={760} className="relative z-[1]">
              <h2 className="section-title mb-4 text-[color:var(--text-light)]">
                Engineering with <span className="text-[color:var(--accent)]">business context</span>
              </h2>
              <p className="body-copy border-l-2 border-[color:var(--accent-soft)] pl-4 text-[color:var(--text-mid)]">I am a BSCS student at UMT Lahore and a hands-on full-stack engineer building useful digital products with the MERN stack. My work sits at the intersection of clean architecture, practical AI integration, and real-world delivery — not just academic exercises.</p>
              <p className="body-copy mt-4 border-l-2 border-[color:var(--accent-soft)] pl-4 text-[color:var(--text-mid)]">If you need someone who understands product tradeoffs, builds robust REST APIs, and ships polished frontends without cutting corners — let us talk. I am currently available for freelance projects on Upwork and Fiverr.</p>
            </ScrollReveal>
          </div>
        </section>

        <section id="services" className="section scroll-mt-24 pt-8">
          <div className="relative">
            <span className="section-number" aria-hidden="true">02</span>
            <ScrollReveal distance={26} duration={760} className="relative z-[1]">
              <h2 className="section-title text-[color:var(--text-light)]">Services built for outcomes</h2>
              <p className="mt-3 max-w-3xl text-[color:var(--text-mid)]">From product sites to backend systems and AI workflows, each engagement is scoped around measurable business goals and reliable delivery.</p>
            </ScrollReveal>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Product Websites",
                detail: "Narrative-driven marketing and portfolio sites with clean typography, premium motion, and conversion-focused structure.",
              },
              {
                title: "Web App Engineering",
                detail: "Full-stack app delivery with Next.js, Node.js, API design, auth, and production-grade deployment workflows.",
              },
              {
                title: "AI Integrations",
                detail: "Practical AI assistants and automation layers integrated into existing systems without sacrificing maintainability.",
              },
            ].map((service, index) => (
              <ScrollReveal key={service.title} delay={index * 120} distance={30} duration={780}>
                <article className="case-card rounded-2xl border border-[color:var(--border)] bg-[#fffaf4] p-6">
                  <p className="text-xs font-mono tracking-[0.16em] text-[color:var(--accent)]">0{index + 1}</p>
                  <h3 className="mt-3 text-2xl font-bold tracking-[-0.6px] text-[color:var(--text-light)]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--text-mid)]">{service.detail}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section id="case-studies" className="section scroll-mt-24 pt-10">
          <div className="relative">
            <span className="section-number" aria-hidden="true">03</span>
            <ScrollReveal distance={26} duration={760} className="relative z-[1] mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="section-title text-[color:var(--text-light)]">Featured Case Studies</h2>
                <p className="mt-2 text-sm text-[color:var(--text-dim)]">Problem, approach, and measurable outcomes.</p>
              </div>
              <Link href="/projects" className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-semibold text-[color:var(--text-light)] transition-colors duration-200 hover:border-[color:var(--accent-soft)] hover:text-[color:var(--accent)]">
                View All Case Studies
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {projects.map((project, index) => {
              const thumbnailProps =
                thumbnailPropsBySlug[project.slug] ?? {
                  title: project.title,
                  gradient: "from-[#0a1628] via-[#1a2f5e] to-[#2d4a8a]",
                  pattern: "grid" as const,
                  category: project.category,
                };

              return (
                <ScrollReveal key={project.slug} delay={index * 130} distance={34} duration={780}>
                  <article className="case-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--card-bg)] transition-all duration-300 ease-out hover:border-[color:var(--accent-soft)]">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-b from-[#ff8a5b33] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="pointer-events-none absolute right-4 top-4 text-5xl font-bold font-mono text-black/[0.08]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <ProjectThumbnail
                      title={thumbnailProps.title}
                      gradient={thumbnailProps.gradient}
                      pattern={thumbnailProps.pattern}
                      category={thumbnailProps.category}
                      imageSrc={project.coverImage}
                    />

                    <div className="flex flex-1 flex-col gap-4 p-5">
                      <span className="w-fit rounded-full border border-[color:var(--accent-soft)] bg-[#ff8a5b1f] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[1px] text-[color:var(--accent)]">
                        {project.category}
                      </span>
                      <h3 className="text-[20px] font-bold tracking-[-0.5px] text-[color:var(--text-light)]">{project.title}</h3>
                      <p className="text-sm leading-6 text-[color:var(--text-mid)]">{project.summary}</p>

                      <div className="mt-auto flex flex-wrap gap-2">
                        {project.stack.slice(0, 4).map((item) => (
                          <span key={`${project.slug}-${item}`} className="rounded-lg border border-[color:var(--border)] bg-[#fff8ef] px-2 py-1 text-[11px] font-mono text-[color:var(--text-mid)]">
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="mt-2 flex items-center gap-4">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--accent)] transition-all duration-200 group-hover:gap-3"
                          data-analytics="project_case_study_open"
                          data-analytics-label={project.slug}
                        >
                          Open Case Study
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
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        <section id="experience" className="section scroll-mt-24 pt-10">
          <div className="relative">
            <span className="section-number" aria-hidden="true">04</span>
            <ScrollReveal distance={26} duration={760} className="relative z-[1]">
              <h2 className="section-title text-[color:var(--text-light)]">Experience and delivery</h2>
              <p className="mt-3 max-w-3xl text-[color:var(--text-mid)]">A focused progression from systems fundamentals to full product execution with real clients and practical AI workflows.</p>
            </ScrollReveal>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              {
                period: "2024 - Present",
                title: "Freelance Full-Stack Developer",
                detail: "Shipping client-facing Next.js and Node.js products with measurable outcomes and rapid iteration cycles.",
              },
              {
                period: "2023 - 2024",
                title: "Automation + AI Workflow Builder",
                detail: "Built production flows that combine LLM prompting, API orchestration, validation, and human review loops.",
              },
              {
                period: "2022 - 2023",
                title: "Systems and DSA Foundation",
                detail: "Focused on C++, data structures, and performance-first engineering fundamentals applied to real use cases.",
              },
              {
                period: "Current Focus",
                title: "Productized Engineering",
                detail: "Merging design direction, frontend polish, and backend reliability into complete end-to-end digital products.",
              },
            ].map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 110} distance={28} duration={760}>
                <article className="case-card rounded-2xl border border-[color:var(--border)] bg-[#fffdf9] p-6">
                  <p className="text-xs font-mono tracking-[0.16em] text-[color:var(--accent)]">{item.period}</p>
                  <h3 className="mt-2 text-xl font-bold tracking-[-0.4px] text-[color:var(--text-light)]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--text-mid)]">{item.detail}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <ContactSection initialStatus={initialContactStatus} />
      </main>

      <AssistantWidget />
    </>
  );
}
