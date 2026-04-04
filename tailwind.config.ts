import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontSize: {
        display: "clamp(48px, 6vw, 72px)",
        h1: "clamp(32px, 4vw, 48px)",
        h2: "clamp(24px, 3vw, 32px)",
        h3: "clamp(18px, 2vw, 22px)",
        body: "16px",
        small: "14px",
        mono: "13px",
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#94a3b8",
            "--tw-prose-headings": "#e2e8f0",
            "--tw-prose-bold": "#ffffff",
          },
        },
      },
    },
  },
};

export default config;
