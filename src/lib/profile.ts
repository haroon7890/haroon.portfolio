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
    name: "Haroon Imran",
    headline: "Full-Stack Developer & AI Integrator",
    shortIntro:
      "Haroon Imran is a full-stack developer focused on production-ready web apps, backend APIs, and practical AI integrations.",
    about: [
      "Builds modern Next.js/React apps with strong UX and technical SEO.",
      "Designs and implements backend APIs, databases, and integrations.",
      "Works with automation/AI workflows when they add real product value.",
    ],
    education: "BSCS student at UMT Lahore.",
    location: "Worldwide (remote)",
    availability: "Available for freelance projects.",
    specialties: [
      "Full-stack web applications",
      "Backend/API systems",
      "AI workflow integration",
      "Technical consulting",
    ],
    contact: {
      email: "haroon86865@gmail.com",
      phone: "+923364450294",
      github: "https://github.com/haroon7890",
      linkedin: "https://www.linkedin.com/in/haroon-imran-80b515352/",
      bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://calendly.com/",
    },
  };
}
