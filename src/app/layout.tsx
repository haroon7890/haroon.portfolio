import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TiltEffects from "./TiltEffects";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Haroon Imran — Full-Stack Developer & AI Integrator",
  description:
    "MERN Stack developer and AI integrator based in Lahore, Pakistan. Building production-ready web apps and AI-powered tools. Available for freelance on Upwork and Fiverr.",
  applicationName: "Haroon Imran Portfolio",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Full-Stack Developer",
    "MERN Stack Developer",
    "AI Integration",
    "Freelance Developer Pakistan",
    "React Developer Lahore",
    "Node.js Developer",
    "Next.js Developer",
    "Upwork Developer",
    "Fiverr Developer",
    "Haroon Imran",
  ],
  authors: [{ name: "Haroon Imran" }],
  creator: "Haroon Imran",
  publisher: "Haroon Imran",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Haroon Imran — Full-Stack Developer & AI Integrator",
    description: "Building MERN stack web apps and AI-powered tools. Available for freelance.",
    url: "https://haroon.dev",
    siteName: "Haroon Imran Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Haroon Imran — Full-Stack Developer",
    description: "MERN Stack + AI Integration. Available for freelance.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  other: {
    "format-detection": "telephone=no, date=no, email=no, address=no",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#101624",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CustomCursor />
        <TiltEffects />
        <div className="page-load-bar" aria-hidden="true" />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
