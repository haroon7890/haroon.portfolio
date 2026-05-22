import type { Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { SITE_CONFIG } from "@/lib/config";
import ClientEffects from "@/components/ClientEffects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Haroon Imran — Full-Stack Engineer & AI Integrator",
  description: "Full-Stack MERN and Next.js engineer integrating practical AI workflows into production-ready web applications. Open to freelance projects.",
  keywords: ["MERN developer", "Next.js freelancer", "AI engineer", "Haroon Imran portfolio"],
  openGraph: {
    title: "Haroon Imran — Full-Stack Engineer & AI Integrator",
    description: "Product-focused Full-Stack engineer (MERN) building production apps and practical AI workflows.",
    url: siteUrl,
    images: [{ url: `${siteUrl}/image/haroon.jpg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Haroon Imran — Full-Stack Engineer",
    images: [`${siteUrl}/image/haroon.jpg`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f1ea",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.name,
    url: siteUrl,
    jobTitle: SITE_CONFIG.title,
    email: `mailto:${SITE_CONFIG.email}`,
    sameAs: [SITE_CONFIG.github, SITE_CONFIG.linkedin, SITE_CONFIG.upwork].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.location,
    },
  };
  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} ${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head />
      <body className="min-h-full flex flex-col">
        <a href="#hero" className="skip-link" tabIndex={0}>Skip to content</a>
        <ClientEffects />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
        <div className="page-load-bar" aria-hidden="true" />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
