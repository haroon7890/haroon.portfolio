"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const positionRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);

  const applyPosition = (size: number) => {
    const node = cursorRef.current;
    if (!node) {
      return;
    }

    const { x, y } = positionRef.current;
    node.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
  };

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

    const size = hovering ? 24 : 8;

    const schedule = () => {
      if (rafRef.current != null) {
        return;
      }

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        applyPosition(size);
      });
    };

    const onMove = (event: MouseEvent) => {
      positionRef.current = { x: event.clientX, y: event.clientY };
      schedule();
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest("a, button, [role='button'], input, textarea, select, label");
      setHovering(Boolean(interactive));
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    applyPosition(size);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [enabled, hovering]);

  if (!enabled) {
    return null;
  }

  const size = hovering ? 24 : 8;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={[
        "pointer-events-none fixed left-0 top-0 z-[120] rounded-full transition-[width,height,transform,background-color,border-color] duration-150",
        hovering ? "bg-transparent border border-[color:var(--accent)]/80" : "bg-[color:var(--accent)]",
      ].join(" ")}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(-100px, -100px)`,
      }}
    />
  );
}
