import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TiltEffects from "./TiltEffects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const seoDescription =
  "Portfolio of Haroon Imran, a Full-Stack Developer and AI Integrator from Lahore. Explore projects, skills, and contact details.";

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
  title: {
    default: "Haroon Imran | Full-Stack Developer & AI Integrator",
    template: "%s | Haroon Imran",
  },
  description: seoDescription,
  applicationName: "Haroon Imran Portfolio",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Haroon Imran",
    "Full-Stack Developer",
    "AI Integrator",
    "Portfolio",
    "UMT Lahore",
    "React",
    "Node.js",
    "C++",
    "Web Developer",
    "Pakistan"
  ],
  authors: [{ name: "Haroon Imran", url: siteUrl }],
  creator: "Haroon Imran",
  publisher: "Haroon Imran",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Haroon Imran | Full-Stack Developer & AI Integrator",
    description: seoDescription,
    url: siteUrl,
    siteName: "Haroon Imran Portfolio",
    images: [
      {
        url: "/image/haroon.jpg.JPG",
        width: 1200,
        height: 630,
        alt: "Haroon Imran professional photo"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Haroon Imran | Full-Stack Developer & AI Integrator",
    description: seoDescription,
    images: ["/image/haroon.jpg.JPG"]
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
      <body className="min-h-full flex flex-col">
        <TiltEffects />
        {children}
      </body>
    </html>
  );
}
