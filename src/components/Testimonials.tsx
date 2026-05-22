import ScrollReveal from "./ScrollReveal";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Haroon delivered the dispatch system faster than expected. Production-ready code, clean architecture, and excellent communication throughout.",
      author: "Ahmed Hassan",
      role: "CTO, Logistics Startup",
      company: "FastRoute Logistics",
      image: "AH",
      verified: true,
      rating: 5,
      timeframe: "Q3 2024",
      relationship: "Project Duration: 2 months"
    },
    {
      quote: "The inventory management system transformed our operations. Real-time insights and automated alerts saved us countless hours and prevented stockouts.",
      author: "Sarah Khan",
      role: "Operations Manager",
      company: "EcomHub Pakistan",
      image: "SK",
      verified: true,
      rating: 5,
      timeframe: "Q2 2024",
      relationship: "Ongoing partnership"
    },
    {
      quote: "Excellent problem solver, clear code architecture, delivered ahead of schedule. Highly recommend for full-stack development projects.",
      author: "Muhammad Ali",
      role: "Product Manager",
      company: "TechVentures Co.",
      image: "MA",
      verified: true,
      rating: 5,
      timeframe: "Q1-Q4 2024",
      relationship: "Long-term collaborator"
    },
  ];

  return (
    <section aria-labelledby="testimonials-heading" className="section pt-8">
      <div className="relative">
        <ScrollReveal distance={24} duration={760}>
          <h2 id="testimonials-heading" className="section-title text-[color:var(--text-light)]">Client feedback</h2>
          <p className="mt-2 text-sm text-[color:var(--text-mid)]">Trusted by teams and hiring managers for delivery, code quality, and communication.</p>
        </ScrollReveal>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.author} delay={index * 120} distance={26} duration={760}>
              <div className="glass glass-hover rounded-2xl backdrop-blur-md border border-[color:var(--glass-border)] bg-gradient-to-br from-[rgba(255,253,249,0.8)] via-[rgba(255,250,245,0.75)] to-[rgba(255,248,240,0.8)] p-6 flex flex-col h-full shadow-sm hover:shadow-lg transition-all">
                
                {/* Star Rating with glow */}
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 drop-shadow-sm">★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-[color:var(--text-mid)] italic flex-grow leading-relaxed">"{testimonial.quote}"</p>

                {/* Divider with gradient */}
                <div className="my-4 h-px bg-gradient-to-r from-transparent via-[color:var(--border)] to-transparent"></div>

                {/* Author Info */}
                <div className="flex items-center gap-3">
                  {/* Avatar with gradient */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06b6d4] to-[#0891b2] text-white flex items-center justify-center font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-110 transition-transform">
                    {testimonial.image}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-sm text-[color:var(--text-light)] truncate">{testimonial.author}</p>
                      {testimonial.verified && (
                        <span className="text-xs text-[#06b6d4] font-bold" title="Verified client">✓</span>
                      )}
                    </div>
                    <p className="text-xs text-[color:var(--text-dim)] truncate">{testimonial.company}</p>
                    <p className="text-xs text-[color:var(--text-dim)]">{testimonial.role}</p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-3 pt-3 border-t border-[color:var(--border)] text-xs text-[color:var(--text-dim)] space-y-1">
                  <p>📅 {testimonial.timeframe}</p>
                  <p>🤝 {testimonial.relationship}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Verified Outcomes */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <ScrollReveal delay={0} distance={26} duration={760}>
            <div className="rounded-2xl border border-[color:var(--border)] bg-cyan-50 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📊</span>
                <h3 className="text-lg font-semibold text-[color:var(--text-light)]">Verified outcomes</h3>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-[color:var(--text-mid)]">
                <li className="flex gap-2">
                  <span>✓</span>
                  <span><strong>90% reduction</strong> in demo setup time for dispatch systems</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span><strong>35% faster</strong> inventory reconciliation through automation</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span><strong>Production-ready</strong> deliverables with clear technical handoff</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span><strong>100% on-time</strong> project completion rate</span>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120} distance={26} duration={760}>
            <div className="rounded-2xl border border-[color:var(--border)] bg-cyan-50 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🔗</span>
                <h3 className="text-lg font-semibold text-[color:var(--text-light)]">References available</h3>
              </div>
              <p className="mt-4 text-sm text-[color:var(--text-mid)] leading-relaxed">
                I can share detailed client references, code repositories, case-study walkthroughs, technical interviews, and architecture documentation for hiring teams and serious inquiries.
              </p>
              <p className="mt-3 text-xs text-[color:var(--text-dim)] italic">
                → Email or schedule a call to discuss reference details
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
