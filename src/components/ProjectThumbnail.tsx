import { useId } from "react";

export type ProjectPattern = "grid" | "circuit" | "dots";

type ProjectThumbnailProps = {
  title: string;
  gradient: string;
  pattern: ProjectPattern;
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
    pattern: "dots",
  },
  {
    match: (title) => title.toLowerCase().includes("apms"),
    gradient: "from-[#0a1628] via-[#1a2f5e] to-[#2d4a8a]",
    pattern: "circuit",
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
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id={`${id}-grid`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#${id}-grid)`} />
      </svg>
    );
  }

  if (pattern === "circuit") {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1="20" x2="100" y2="80" stroke="white" strokeWidth="0.8" />
        <line x1="0" y1="80" x2="100" y2="20" stroke="white" strokeWidth="0.8" />
        <line x1="20" y1="0" x2="20" y2="100" stroke="white" strokeWidth="0.8" />
        <line x1="80" y1="0" x2="80" y2="100" stroke="white" strokeWidth="0.8" />
      </svg>
    );
  }

  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.05]" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id={`${id}-dots`} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1.8" cy="1.8" r="0.8" fill="white" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill={`url(#${id}-dots)`} />
    </svg>
  );
}

export default function ProjectThumbnail({
  title,
  gradient,
  pattern,
  className = "",
}: ProjectThumbnailProps) {
  const id = useId();

  return (
    <div
      role="img"
      aria-label={`${title} — Case Study`}
      className={`relative aspect-[16/9] w-full overflow-hidden border-t-2 border-teal-400/30 ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <PatternLayer pattern={pattern} id={id} />
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-5">
        <span className="pointer-events-none select-none whitespace-nowrap text-[64px] font-black tracking-[-2px] text-white/[0.12]">
          {title}
        </span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#080d14]/30 via-transparent to-transparent" />
    </div>
  );
}
