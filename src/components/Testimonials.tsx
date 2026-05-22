import ScrollReveal from "./ScrollReveal";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Haroon delivered the dispatch system faster than expected. The demo was immediately production-ready.",
      author: "CTO, Logistics Startup",
      role: "Client",
    },
    {
      quote: "The inventory sync system saved us hours every week. Best implementation we've had.",
      author: "Operations Manager, E-commerce",
      role: "Client",
    },
    {
      quote: "Great communication, clean code, and delivered on time. Exactly what we needed.",
      author: "Product Manager, SaaS Company",
      role: "Client",
    },
  ];

  return (
    <section aria-labelledby="testimonials-heading" className="section pt-8">
      <div className="relative">
        <ScrollReveal distance={24} duration={760}>
          <h2 id="testimonials-heading" className="section-title text-[color:var(--text-light)]">Client feedback</h2>
          <p className="mt-2 text-sm text-[color:var(--text-mid)]">Trusted by teams and hiring managers for delivery and communication.</p>
        </ScrollReveal>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.author} delay={index * 120} distance={26} duration={760}>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[#fffdf9] p-6 flex flex-col">
                <p className="text-sm text-[color:var(--text-mid)] italic">"{testimonial.quote}"</p>
                <div className="mt-4 pt-4 border-t border-[color:var(--border)]">
                  <p className="font-semibold text-sm text-[color:var(--text-light)]">{testimonial.author}</p>
                  <p className="text-xs text-[color:var(--text-dim)]">{testimonial.role}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <ScrollReveal delay={0} distance={26} duration={760}>
            <div className="rounded-2xl border border-[color:var(--border)] bg-blue-50 p-6">
              <h3 className="text-lg font-semibold text-[color:var(--text-light)]">Verified outcomes</h3>
              <ul className="mt-3 space-y-2 text-sm text-[color:var(--text-mid)]">
                <li>✦ Demo setup time reduced by ~90% for a dispatch system.</li>
                <li>✦ Manual inventory reconciliation reduced by ~35%.</li>
                <li>✦ Production-ready Next.js + API delivery with clear handoff.</li>
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120} distance={26} duration={760}>
            <div className="rounded-2xl border border-[color:var(--border)] bg-blue-50 p-6">
              <h3 className="text-lg font-semibold text-[color:var(--text-light)]">References on request</h3>
              <p className="mt-3 text-sm text-[color:var(--text-mid)]">
                I can share detailed client references, code samples, case-study walkthroughs, and technical interviews for hiring teams.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
