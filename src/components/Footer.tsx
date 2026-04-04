import { ExternalLink, Mail } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import type { ReactNode } from "react";

type SocialLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
};

function SocialLink({ href, label, icon }: SocialLinkProps) {
  if (!href) {
    return (
      <span
        aria-label={`${label} (add link in config)`}
        className="inline-flex h-9 w-9 items-center justify-center text-gray-500/60"
      >
        {icon}
      </span>
    );
  }

  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center text-gray-400 transition-colors duration-200 hover:text-teal-400"
    >
      {icon}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#080f1a] border-t border-white/[0.06] py-8 px-6 mt-0">
      <div className="mx-auto w-full max-w-6xl grid gap-6 md:grid-cols-3 items-center text-center md:text-left">
        <div>
          <div className="font-mono font-semibold text-sm text-teal-400">// haroon.dev</div>
          <div className="mt-1 text-xs text-gray-400">Full-Stack Developer &amp; AI Integrator</div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <SocialLink
            href={SITE_CONFIG.github}
            label="GitHub"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.37-1.342-3.37-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.089 2.91.833.091-.647.35-1.089.636-1.34-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.254-.447-1.274.098-2.656 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.025 2.747-1.025.547 1.382.203 2.402.1 2.656.64.7 1.028 1.594 1.028 2.687 0 3.847-2.339 4.695-4.566 4.944.359.31.678.921.678 1.857 0 1.34-.012 2.422-.012 2.752 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
              </svg>
            }
          />
          <SocialLink
            href={SITE_CONFIG.linkedin}
            label="LinkedIn"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            }
          />
          <SocialLink href={SITE_CONFIG.upwork} label="Upwork" icon={<ExternalLink size={18} />} />
          <SocialLink href={SITE_CONFIG.fiverr} label="Fiverr" icon={<ExternalLink size={18} />} />
          <SocialLink href={`mailto:${SITE_CONFIG.email}`} label="Email" icon={<Mail size={18} />} />
        </div>

        <div className="md:text-right">
          <div className="text-xs text-gray-500">Built with Next.js &amp; Tailwind</div>
          <div className="mt-1 text-xs text-gray-400">© 2025 Haroon Imran</div>
        </div>
      </div>
    </footer>
  );
}
