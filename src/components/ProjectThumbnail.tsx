import { useId } from "react";

export type ProjectPattern = "grid" | "circuit" | "dots";

type ProjectThumbnailProps = {
  title: string;
  gradient: string;
  pattern: ProjectPattern;
  category: string;
  className?: string;
};

const PROJECT_THUMBNAIL_PRESETS: Array<{
  match: (title: string) => boolean;
  gradient: string;
  pattern: ProjectPattern;
}> = [
  {
    match: (title) => title.toLowerCase().includes("supply chain optimization"),
    gradient: "from-[#1a1a4e] via-[#0f3460] to-[#533483]",
    pattern: "grid",
  },
  {
    match: (title) => title.toLowerCase().includes("ai-powered portfolio"),
    gradient: "from-[#0f4c4c] via-[#0d7377] to-[#14a085]",
    pattern: "circuit",
  },
  {
    match: (title) => title.toLowerCase().includes("apms"),
    gradient: "from-[#0a1628] via-[#1a2f5e] to-[#2d4a8a]",
    pattern: "dots",
  },
];

export function getProjectThumbnailPreset(title: string): {
  gradient: string;
  pattern: ProjectPattern;
} {
  const preset = PROJECT_THUMBNAIL_PRESETS.find((item) => item.match(title));
  if (preset) {
    return {
      gradient: preset.gradient,
      pattern: preset.pattern,
    };
  }

  return {
    gradient: "from-[#0a1628] via-[#1a2f5e] to-[#2d4a8a]",
    pattern: "grid",
  };
}

function PatternLayer({ pattern, id }: { pattern: ProjectPattern; id: string }) {
  if (pattern === "grid") {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <pattern id={`${id}-grid`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id}-grid)`} />
      </svg>
    );
  }

  if (pattern === "circuit") {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <pattern id={`${id}-circuit`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 0 20 L 40 20 M 20 0 L 20 40" fill="none" stroke="white" strokeWidth="1" />
            <circle cx="20" cy="20" r="3" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id}-circuit)`} />
      </svg>
    );
  }

  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <pattern id={`${id}-dots`} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-dots)`} />
    </svg>
  );
}

export default function ProjectThumbnail({
  title,
  gradient,
  pattern,
  category,
  className = "",
}: ProjectThumbnailProps) {
  const id = useId();

  return (
    <div
      role="img"
      aria-label={`${title} - Case Study by Haroon Imran`}
      className={`relative aspect-video w-full overflow-hidden bg-gradient-to-br ${gradient} flex items-center justify-center ${className}`}
    >
      <PatternLayer pattern={pattern} id={id} />
      <span className="pointer-events-none select-none text-center px-4 leading-none text-5xl font-black tracking-tight text-white/[0.07] sm:text-6xl">
        {title}
      </span>
      <span className="absolute top-3 left-3 rounded-md border border-teal-500/20 bg-black/30 px-2 py-1 text-xs font-mono tracking-widest text-teal-400 uppercase backdrop-blur-sm">
        {category}
      </span>
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500/0 via-teal-400/60 to-teal-500/0" />
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-5">
        <span className="pointer-events-none select-none whitespace-nowrap text-[58px] font-black tracking-[-2px] text-white/[0.08] sm:text-[64px]">
          {title}
        </span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#080d14]/35 via-transparent to-transparent" />
    </div>
  );
}
