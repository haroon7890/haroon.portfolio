import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";

export default function RecruiterPage() {
  return (
    <main className="section" id="recruiter">
      <div className="max-w-3xl mx-auto bg-[#fffdf9] rounded-2xl p-8 shadow-lg">
        <h1 className="section-title">For Recruiters</h1>
        <p className="body-copy mt-4">
          Hi — I'm {SITE_CONFIG.name}. I build production-ready MERN apps and Next.js frontends with measurable outcomes. Open to freelance, full-time, and contract roles (3-6 months). Based in {SITE_CONFIG.location}.
        </p>

        <ul className="mt-6 space-y-3">
          <li className="body-copy"><strong>Availability:</strong> {SITE_CONFIG.available ? "Open to freelance & full‑time" : "Not currently available"}.</li>
          <li className="body-copy"><strong>Response time:</strong> Typically replies within 2-4 hours (same day guaranteed).</li>
          <li className="body-copy"><strong>Top skills:</strong> MERN stack, Next.js, REST APIs, production deployments, practical AI integrations, database optimization.</li>
          <li className="body-copy"><strong>Selected outcomes:</strong> Reduced demo setup time by ~90% for a dispatch system; cut manual inventory reconciliation time by ~35% for a supply-chain system.</li>
          <li className="body-copy"><strong>Interview-ready:</strong> Can provide code samples, case-study walkthroughs, and references on request.</li>
          <li className="body-copy"><strong>Team experience:</strong> Collaborated on cross-functional teams; led technical implementations; mentored junior developers on best practices.</li>
        </ul>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Skills</h3>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ["Next.js", "Expert"],
              ["Node.js", "Advanced"],
              ["React", "Expert"],
              ["REST APIs", "Advanced"],
              ["C++", "Intermediate"],
              ["AI Integrations", "Intermediate"],
            ].map(([skill, level]) => (
              <div key={skill as string} className="flex items-center justify-between gap-2 rounded-lg border border-[color:var(--border)] bg-[#fff] px-3 py-2">
                <span className="text-sm font-medium">{skill}</span>
                <span className="text-xs text-[color:var(--text-dim)]">{level}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-[color:var(--border)] bg-blue-50 p-4">
            <h4 className="font-semibold text-[color:var(--accent)]">Quick Actions</h4>
            <div className="mt-3 flex flex-col gap-2">
              <a href="/cv/Haroon_Imran_CV.pdf" download className="featured-btn text-center">Download Resume (PDF)</a>
              <a href={`mailto:${SITE_CONFIG.email}?subject=Let's%20Talk`} className="rounded-md border border-[color:var(--accent)] bg-white px-3 py-2 text-center text-[color:var(--accent)]">Email Direct</a>
            </div>
          </div>
          <div className="rounded-lg border border-[color:var(--border)] bg-blue-50 p-4">
            <h4 className="font-semibold text-[color:var(--accent)]">Learn More</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/onepager" className="rounded-md border border-[color:var(--border)] bg-white px-3 py-2 text-center">One-Page Summary</Link>
              <a href={SITE_CONFIG.github} target="_blank" rel="noreferrer" className="rounded-md border border-[color:var(--border)] bg-white px-3 py-2 text-center">GitHub Profile</a>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[color:var(--text-light)]">Work Preferences</h3>
            <ul className="mt-3 space-y-2 text-sm text-[color:var(--text-dim)]">
              <li>• <strong>Full-time:</strong> Remote / Hybrid (Pakistan-friendly timezones)</li>
              <li>• <strong>Freelance:</strong> $50-100/hr or project-based</li>
              <li>• <strong>Contract:</strong> 3-6 month engagements welcome</li>
              <li>• <strong>Startups:</strong> Early-stage equity + salary arrangements</li>

        <div className="mt-8 border-t border-[color:var(--border)] pt-6">
          <h3 className="font-semibold text-[color:var(--text-light)]">Why Choose Me</h3>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--text-dim)]">
            <li>✓ <strong>Fast turnaround:</strong> Delivers features & fixes within sprint (not weeks)</li>
            <li>✓ <strong>Production-ready:</strong> Code passes reviews, deploys without issues</li>
            <li>✓ <strong>Proactive communicator:</strong> Daily updates, no radio silence</li>
            <li>✓ <strong>End-to-end:</strong> DB design, API, frontend, deployment (not siloed)</li>
            <li>✓ <strong>Cost-conscious:</strong> Optimizes for performance and budget</li>
          </ul>
        </div>

        <div className="mt-8 border-t border-[color:var(--border)] pt-6">
          <h3 className="font-semibold text-[color:var(--text-light)]">Certifications & Learning</h3>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--text-dim)]">
            {SITE_CONFIG.certifications.map((cert) => (
              <li key={cert.name}>• <strong>{cert.name}</strong> — {cert.issuer} ({cert.year})</li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-[color:var(--border)] pt-6">
          <h3 className="font-semibold text-[color:var(--text-light)]">Resources & Guides</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {SITE_CONFIG.resources.map((resource) => (
              <li key={resource.title}>
                <a href={resource.url} className="text-[color:var(--accent)] hover:underline">{resource.title}</a>
                <span className="ml-2 text-[color:var(--text-dim)]">({resource.category})</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 rounded-lg bg-blue-50 border border-blue-200 p-6">
          <h3 className="font-semibold text-[color:var(--text-light)]">Schedule a Call</h3>
          <p className="mt-2 text-sm text-[color:var(--text-mid)]">
            Want to discuss your project or needs? I offer free 30-minute discovery calls to explore fit.
          </p>
          {SITE_CONFIG.calendlyUrl && (
            <a 
              href={SITE_CONFIG.calendlyUrl} 
              target="_blank" 
              rel="noreferrer"
              className="mt-4 inline-block rounded-md bg-[color:var(--accent)] px-4 py-2 text-white text-sm font-semibold hover:brightness-110"
            >
              Schedule Discovery Call →
            </a>
          )}
        </div>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[color:var(--text-light)]">Verified Platforms</h3>
            <ul className="mt-3 space-y-2 text-sm text-[color:var(--text-dim)]">
              <li>• <strong>GitHub:</strong> <a href={SITE_CONFIG.github} target="_blank" rel="noreferrer" className="text-[color:var(--accent)] hover:underline">haroon7890</a></li>
              <li>• <strong>LinkedIn:</strong> <a href={SITE_CONFIG.linkedin} target="_blank" rel="noreferrer" className="text-[color:var(--accent)] hover:underline">haroon-imran</a></li>
              {SITE_CONFIG.upwork && <li>• <strong>Upwork:</strong> <a href={SITE_CONFIG.upwork} target="_blank" rel="noreferrer" className="text-[color:var(--accent)] hover:underline">View Profile</a></li>}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
