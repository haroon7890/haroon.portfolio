"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");

    const syncEnabled = () => {
      setEnabled(media.matches && window.innerWidth >= 1024);
    };

    syncEnabled();
    media.addEventListener("change", syncEnabled);
    window.addEventListener("resize", syncEnabled);

    return () => {
      media.removeEventListener("change", syncEnabled);
      window.removeEventListener("resize", syncEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest("a, button, [role='button'], input, textarea, select, label");
      setHovering(Boolean(interactive));
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  const size = hovering ? 24 : 8;

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none fixed left-0 top-0 z-[120] rounded-full transition-[width,height,transform,background-color,border-color] duration-150",
        hovering ? "bg-transparent border border-[color:var(--accent)]/80" : "bg-[color:var(--accent)]",
      ].join(" ")}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(${position.x - size / 2}px, ${position.y - size / 2}px)`,
      }}
    />
  );
}
