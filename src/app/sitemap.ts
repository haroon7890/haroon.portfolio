import type { MetadataRoute } from "next";
import { getProjectSlugs } from "@/lib/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const projectSlugs = getProjectSlugs();

  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [`${siteUrl}/image/haroon.jpg.JPG`],
    },
  ];

  if (projectSlugs.length > 0) {
    routes.push({
      url: `${siteUrl}/projects`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    });

    routes.push(
      ...projectSlugs.map((slug) => ({
        url: `${siteUrl}/projects/${slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }))
    );
  }

  // No /blog or /blog/* routes included
  return routes;
}
