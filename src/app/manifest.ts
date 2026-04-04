import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Haroon Imran Portfolio",
    short_name: "Haroon Portfolio",
    description:
      "Portfolio of Haroon Imran, a Full-Stack Engineer and AI Integrator.",
    start_url: "/",
    display: "standalone",
    background_color: "#101624",
    theme_color: "#101624",
    categories: ["portfolio", "technology", "developer"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
