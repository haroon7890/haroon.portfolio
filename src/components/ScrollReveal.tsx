"use client";

import type { CSSProperties, ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
  distance?: number;
  duration?: number;
};

export default function ScrollReveal({
  children,
  className = "",
  threshold = 0.15,
  delay = 0,
  distance = 20,
  duration = 500,
}: ScrollRevealProps) {
  const { ref, visible } = useScrollAnimation(threshold);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${visible ? "animate-in" : "animate-ready"} ${className}`.trim()}
      style={
        {
          transitionDelay: `${delay}ms`,
          transitionDuration: `${duration}ms`,
          ["--reveal-y" as string]: `${distance}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
