"use client";

import Link from "next/link";
import { Mail, Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SITE_CONFIG } from "@/lib/config";

type NavItem = {
  id: "about" | "case-studies" | "contact";
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "about", label: "About", href: "#about" },
  { id: "case-studies", label: "Case Studies", href: "#case-studies" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<NavItem["id"]>("about");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = NAV_ITEMS
      .map((item) => document.getElementById(item.id))
      .filter((item): item is HTMLElement => Boolean(item));

    if (targets.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const next = activeEntries[0]?.target?.id as NavItem["id"] | undefined;
        if (next) {
          setActiveSection(next);
        }
      },
      {
        threshold: [0.2, 0.35, 0.5, 0.7],
        rootMargin: "-28% 0px -52% 0px",
      }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const navLinkClass = useMemo(
    () =>
      (id: NavItem["id"]) =>
        [
          "inline-flex items-center border-b-2 pb-1 text-sm font-medium transition-all duration-300",
          activeSection === id
            ? "border-teal-400 text-white"
            : "border-transparent text-[#94a3b8] hover:text-white",
        ].join(" "),
    [activeSection]
  );

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "backdrop-blur-md bg-[#080d14]/80 border-b border-white/[0.06] shadow-lg shadow-black/20"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav className="mx-auto w-[92vw] max-w-6xl">
        <div className="flex h-16 items-center justify-between gap-3">
          <a
            href="#hero"
            className="group inline-flex items-center gap-2 font-mono text-[15px] font-semibold text-[#00C9A7] transition-colors duration-300 hover:text-white"
            data-analytics="nav_logo_click"
          >
            <span className="logo-slashes">//</span>
            <span>haroon.dev</span>
          </a>

          <div className="hidden md:flex items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={navLinkClass(item.id)}
                data-analytics={`nav_${item.id.replace("-", "_")}_click`}
              >
                {item.label}
              </a>
            ))}

            <Link
              href="/projects"
              className="inline-flex items-center border-b-2 border-transparent pb-1 text-sm font-medium text-[#94a3b8] transition-all duration-300 hover:text-white"
              data-analytics="nav_projects_click"
            >
              Projects
            </Link>

            <a
              href="#contact"
              className="inline-flex items-center rounded-full bg-teal-500 px-4 py-1.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-teal-400 hover:scale-[1.03]"
              data-analytics="nav_hire_me_click"
            >
              Hire Me
            </a>

            <div className="flex items-center gap-1">
              <a
                href={SITE_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-[#94a3b8] transition-colors duration-200 hover:text-[#00C9A7]"
                data-analytics="nav_github_click"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.37-1.342-3.37-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.089 2.91.833.091-.647.35-1.089.636-1.34-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.254-.447-1.274.098-2.656 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.025 2.747-1.025.547 1.382.203 2.402.1 2.656.64.7 1.028 1.594 1.028 2.687 0 3.847-2.339 4.695-4.566 4.944.359.31.678.921.678 1.857 0 1.34-.012 2.422-.012 2.752 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                </svg>
              </a>
              <a
                href={SITE_CONFIG.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-[#94a3b8] transition-colors duration-200 hover:text-[#00C9A7]"
                data-analytics="nav_linkedin_click"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                aria-label="Email"
                title="Email"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-[#94a3b8] transition-colors duration-200 hover:text-[#00C9A7]"
                data-analytics="nav_email_click"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.1] text-[#94a3b8]"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div
          className={[
            "md:hidden overflow-hidden transition-all duration-300",
            mobileOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0",
          ].join(" ")}
        >
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d1626] p-4 space-y-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={[
                  "block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                  activeSection === item.id ? "text-white bg-white/[0.06]" : "text-[#94a3b8] hover:text-white",
                ].join(" ")}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}

            <Link
              href="/projects"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-[#94a3b8] transition-colors duration-200 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              Projects
            </Link>

            <div className="flex items-center justify-center gap-3 pt-1">
              <a
                href={SITE_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-[#94a3b8]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
                  <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.37-1.342-3.37-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.089 2.91.833.091-.647.35-1.089.636-1.34-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.254-.447-1.274.098-2.656 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.025 2.747-1.025.547 1.382.203 2.402.1 2.656.64.7 1.028 1.594 1.028 2.687 0 3.847-2.339 4.695-4.566 4.944.359.31.678.921.678 1.857 0 1.34-.012 2.422-.012 2.752 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                </svg>
              </a>
              <a
                href={SITE_CONFIG.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-[#94a3b8]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                aria-label="Email"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-[#94a3b8]"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
