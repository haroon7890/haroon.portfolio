import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";
import GitHubStats from "@/components/GitHubStats";

export default function RecruiterPage() {
  return (
    <main className="section" id="recruiter">
      <div className="glass glass-hover max-w-3xl mx-auto bg-gradient-to-br from-[rgba(18,18,18,0.94)] via-[rgba(20,20,20,0.94)] to-[rgba(26,26,26,0.96)] rounded-3xl p-8 shadow-lg backdrop-blur-md border border-[color:var(--glass-border)] hover:border-[color:var(--accent)]/30">
        <h1 className="section-title">For Recruiters</h1>
        <p className="body-copy mt-4">
          Hi — I&apos;m {SITE_CONFIG.name}. I build production-ready full-stack applications with measurable outcomes. Open to freelance, full-time, and contract roles. Based in {SITE_CONFIG.location}, {SITE_CONFIG.timezone}.
        </p>

        <ul className="mt-6 space-y-3">
          <li className="body-copy">
            <strong>Availability:</strong>{" "}
            {SITE_CONFIG.available ? "Open to freelance & full‑time" : "Not currently available"}.
          </li>
          <li className="body-copy">
            <strong>Response time:</strong> {SITE_CONFIG.responseTime} (same day guaranteed).
          </li>
          <li className="body-copy">
            <strong>Top skills:</strong> Full-stack development, Next.js, Node.js, system design, database optimization, OOP patterns.
          </li>
          <li className="body-copy">
            <strong>Selected outcomes:</strong> 90% reduction in demo setup for dispatch systems; 35% improvement in operational efficiency for enterprise platforms.
          </li>
          <li className="body-copy">
            <strong>Interview-ready:</strong> Can provide code samples, case-study walkthroughs, live demos, and client references.
          </li>
        </ul>

        <div className="mt-8">
          <h3 className="text-lg font-semibold">Core Skills</h3>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {SITE_CONFIG.skills.slice(0, 6).map((skill) => (
              <div
                key={skill.name}
                className="glass glass-hover rounded-lg backdrop-blur-sm border border-[color:var(--glass-border)] bg-[rgba(18,18,18,0.88)] px-3 py-2 transition-all hover:bg-[rgba(255,255,255,0.04)]"
              >
                <span className="text-sm font-medium text-[color:var(--text-light)]">{skill.name}</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-[#241506] font-semibold bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-2)] px-2 py-1 rounded">
                    {skill.level}
                  </span>
                  <span className="text-xs text-[color:var(--text-dim)] font-medium">{skill.yearsExp}y exp</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass glass-hover rounded-lg backdrop-blur-sm border border-[color:var(--glass-border)] bg-gradient-to-br from-[rgba(18,18,18,0.94)] to-[rgba(26,26,26,0.96)] p-4 shadow-sm">
            <h4 className="font-semibold text-[color:var(--accent)]">Quick Actions</h4>
            <div className="mt-3 flex flex-col gap-2">
              <a href="/cv/Haroon_Imran_CV.pdf" download className="featured-btn text-center">
                Download Resume (PDF)
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}?subject=Let%27s%20Talk`}
                className="rounded-md border border-[color:var(--accent)] bg-[rgba(155,184,155,0.1)] px-3 py-2 text-center text-[color:var(--accent)] hover:bg-[rgba(155,184,155,0.14)] transition-colors shadow-sm hover:shadow-md"
              >
                Email Direct
              </a>
            </div>
          </div>

          <div className="glass glass-hover rounded-lg backdrop-blur-sm border border-[color:var(--glass-border)] bg-gradient-to-br from-[rgba(18,18,18,0.94)] to-[rgba(26,26,26,0.96)] p-4 shadow-sm">
            <h4 className="font-semibold text-[color:var(--accent)]">Learn More</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/onepager"
                className="rounded-md border border-[color:var(--border)] bg-[rgba(18,18,18,0.9)] px-3 py-2 text-center hover:bg-[rgba(255,255,255,0.04)] transition-colors shadow-sm hover:shadow-md"
              >
                One-Page Summary
              </Link>
              <a
                href={SITE_CONFIG.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-[color:var(--border)] bg-[rgba(18,18,18,0.9)] px-3 py-2 text-center hover:bg-[rgba(255,255,255,0.04)] transition-colors shadow-sm hover:shadow-md"
              >
                GitHub Profile
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass rounded-lg backdrop-blur-sm border border-[color:var(--glass-border)] bg-[rgba(18,18,18,0.88)] p-4">
            <h3 className="font-semibold text-[color:var(--text-light)]">Work Preferences</h3>
            <ul className="mt-3 space-y-2 text-sm text-[color:var(--text-dim)]">
              <li>• <strong>Full-time:</strong> Remote/Hybrid (Pakistan timezones)</li>
              <li>• <strong>Freelance:</strong> $50-100/hr or project-based</li>
              <li>• <strong>Contract:</strong> 3-6 month engagements</li>
              <li>• <strong>Startups:</strong> Equity + salary arrangements</li>
            </ul>
          </div>
          <GitHubStats />
        </div>

        <div className="mt-8 border-t border-[color:var(--border)] pt-6">
          <h3 className="font-semibold text-[color:var(--text-light)]">Why Choose Me</h3>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--text-dim)]">
            <li>✓ <strong>Fast turnaround:</strong> Delivers features within sprint cycles</li>
            <li>✓ <strong>Production-ready:</strong> Code passes reviews, deploys cleanly</li>
            <li>✓ <strong>Proactive communicator:</strong> Daily updates, transparent timelines</li>
            <li>✓ <strong>End-to-end:</strong> Database design → API → Frontend → Deployment</li>
            <li>✓ <strong>Cost-conscious:</strong> Optimizes for performance & scalability</li>
          </ul>
        </div>

        <div className="mt-8 border-t border-[color:var(--border)] pt-6">
          <h3 className="font-semibold text-[color:var(--text-light)]">Certifications & Learning</h3>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--text-dim)]">
            {SITE_CONFIG.certifications.map((cert) => (
              <li key={cert.name}>
                • <strong>{cert.name}</strong> {cert.badge && <span className="ml-1">{cert.badge}</span>}
                <span className="text-[color:var(--text-dim)]"> — {cert.issuer} ({cert.year})</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-[color:var(--border)] pt-6">
          <h3 className="font-semibold text-[color:var(--text-light)]">Resources & Blog</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {SITE_CONFIG.resources.map((resource) => (
              <li key={resource.title}>
                <a href={resource.url} className="text-[color:var(--accent)] hover:underline">
                  {resource.title}
                </a>
                <span className="ml-2 text-[color:var(--text-dim)]">({resource.category})</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-[color:var(--border)] pt-6">
          <h3 className="font-semibold text-[color:var(--text-light)]">Verified Platforms</h3>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--text-dim)]">
            <li>
              • <strong>GitHub:</strong>{" "}
              <a href={SITE_CONFIG.github} target="_blank" rel="noreferrer" className="text-[color:var(--accent)] hover:underline">
                haroon7890
              </a>{" "}
              — 2 featured projects
            </li>
            <li>
              • <strong>LinkedIn:</strong>{" "}
              <a href={SITE_CONFIG.linkedin} target="_blank" rel="noreferrer" className="text-[color:var(--accent)] hover:underline">
                haroon-imran
              </a>
            </li>
            {SITE_CONFIG.upwork && (
              <li>
                • <strong>Upwork:</strong>{" "}
                <a href={SITE_CONFIG.upwork} target="_blank" rel="noreferrer" className="text-[color:var(--accent)] hover:underline">
                  View Profile
                </a>{" "}
                — 5/5 rated
              </li>
            )}
          </ul>
        </div>

        <div className="mt-8 rounded-lg bg-[color:var(--card-bg)] border border-[color:var(--border)] p-6">
          <h3 className="font-semibold text-[color:var(--text-light)]">Schedule a Call</h3>
          <p className="mt-2 text-sm text-[color:var(--text-mid)]">
            Free 30-minute discovery call to discuss your project, technical requirements, and fit. No obligation.
          </p>
          {SITE_CONFIG.calendlyUrl && (
            <a
              href={SITE_CONFIG.calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block rounded-md bg-[color:var(--accent)] px-4 py-2 text-[#241506] text-sm font-semibold hover:brightness-110 transition-all"
            >
              Schedule Discovery Call →
            </a>
          )}
        </div>
      </div>
    </main>
  );
}

