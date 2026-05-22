import { SITE_CONFIG } from "@/lib/config";

export default function OnePager() {
  return (
    <main className="section" id="onepager">
      <div className="max-w-3xl mx-auto bg-[#fffdf9] rounded-2xl p-8 shadow-lg">
        <h1 className="section-title">One-Page Summary — {SITE_CONFIG.name}</h1>
        <p className="body-copy mt-4">{SITE_CONFIG.title} — {SITE_CONFIG.location} — Open to freelance & full-time.</p>

        <div className="mt-6">
          <h2 className="text-base font-semibold">Top Deliverables</h2>
          <ul className="mt-3 list-disc list-inside">
            <li>Production Next.js frontends with CI/CD and deployment.</li>
            <li>Robust REST APIs and backend automation pipelines.</li>
            <li>Measurable outcomes: demo-setup time −90%, inventory reconciliation −35%.</li>
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="text-base font-semibold">Contact</h2>
          <p className="mt-2 body-copy">Email: <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a></p>
        </div>

      </div>
    </main>
  );
}
