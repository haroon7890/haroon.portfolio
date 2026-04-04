import { SITE_CONFIG } from "@/lib/config";

export type ProfileKnowledge = {
  name: string;
  headline: string;
  shortIntro: string;
  about: string[];
  education: string;
  location: string;
  availability: string;
  specialties: string[];
  contact: {
    email: string;
    phone?: string;
    github?: string;
    linkedin?: string;
    bookingUrl?: string;
  };
};

export function getProfileKnowledge(): ProfileKnowledge {
  return {
    name: SITE_CONFIG.name,
    headline: SITE_CONFIG.title,
    shortIntro:
      "Haroon Imran is a full-stack engineer focused on production-ready web apps, backend APIs, and practical AI integrations.",
    about: [
      "Builds modern Next.js/React apps with strong UX and technical SEO.",
      "Designs and implements backend APIs, databases, and integrations.",
      "Works with automation/AI workflows when they add real product value.",
    ],
    education: "BSCS student at UMT Lahore.",
    location: SITE_CONFIG.location,
    availability: SITE_CONFIG.available ? "Available for freelance projects." : "Currently unavailable for freelance projects.",
    specialties: [
      "Full-stack web applications",
      "Backend/API systems",
      "AI workflow integration",
      "Technical consulting",
    ],
    contact: {
      email: SITE_CONFIG.email,
      phone: "+923364450294",
      github: SITE_CONFIG.github,
      linkedin: SITE_CONFIG.linkedin,
      bookingUrl: SITE_CONFIG.calendlyUrl || undefined,
    },
  };
}
