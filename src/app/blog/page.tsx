"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

const blogPosts = [
  {
    slug: "system-design-dispatch-engines",
    title: "System Design for Dispatch Engines",
    description: "Deep dive into building real-time dispatch systems that handle thousands of concurrent orders, rider-driver matching algorithms, and geographic optimization.",
    date: "Mar 2024",
    readTime: "12 min read",
    category: "System Design",
    featured: true
  },
  {
    slug: "scalable-mern-architecture",
    title: "Building Scalable MERN Applications",
    description: "Production patterns for MERN stack: database optimization, API design, caching strategies, and deployment best practices for scaling to 10k+ users.",
    date: "Feb 2024",
    readTime: "10 min read",
    category: "Architecture",
    featured: true
  },
  {
    slug: "oop-cpp-realworld",
    title: "Real-World OOP in C++: From Theory to Production",
    description: "Practical C++ object-oriented design patterns, memory management, and how to structure backends that serve millions of operations.",
    date: "Jan 2024",
    readTime: "15 min read",
    category: "C++",
    featured: false
  },
  {
    slug: "typescript-type-safety",
    title: "Type Safety in Full-Stack TypeScript",
    description: "End-to-end type checking from database to frontend. Build type-safe APIs that prevent runtime errors before they reach production.",
    date: "Dec 2023",
    readTime: "8 min read",
    category: "TypeScript",
    featured: false
  }
];

export default function BlogPage() {
  return (
    <main className="section pt-12">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal distance={24} duration={760}>
          <h1 className="section-title text-[color:var(--text-light)]">Engineering Blog</h1>
          <p className="mt-3 text-[color:var(--text-mid)] max-w-xl">
            Technical deep-dives on system design, full-stack architecture, and lessons from building production systems at scale.
          </p>
        </ScrollReveal>

        <div className="mt-12 space-y-8">
          {blogPosts.map((post, index) => (
            <ScrollReveal key={post.slug} delay={index * 100} distance={24} duration={760}>
              <article className="group rounded-2xl border border-[color:var(--border)] bg-gradient-to-br from-[#fffdf9] to-white p-6 hover:shadow-md transition-shadow">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-semibold text-[color:var(--accent)] uppercase tracking-wider">
                          {post.category}
                        </span>
                        {post.featured && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">⭐ Featured</span>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-[color:var(--text-light)] group-hover:text-[color:var(--accent)] transition-colors">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-[color:var(--text-mid)]">{post.description}</p>
                      <div className="mt-4 flex items-center gap-4 text-xs text-[color:var(--text-dim)]">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div className="text-[color:var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </div>
                </Link>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-[color:var(--border)] bg-blue-50 p-8">
          <h3 className="text-lg font-semibold text-[color:var(--text-light)]">More resources</h3>
          <p className="mt-2 text-[color:var(--text-mid)]">
            Also publishing on{" "}
            <a href="https://dev.to" target="_blank" rel="noreferrer" className="text-[color:var(--accent)] hover:underline">
              Dev.to
            </a>
            {" "}and{" "}
            <a href="https://github.com/haroon7890" target="_blank" rel="noreferrer" className="text-[color:var(--accent)] hover:underline">
              GitHub
            </a>
            . Follow for latest updates on system design, architecture, and full-stack development.
          </p>
        </div>
      </div>
    </main>
  );
}
