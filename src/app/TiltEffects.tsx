"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function TiltEffects() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    if (reduceMotion) return;

    const unbindByElement = new Map<HTMLElement, () => void>();

    const resetElement = (element: HTMLElement) => {
      element.classList.remove("is-tilting");
      element.style.setProperty("--tilt-rx", "0deg");
      element.style.setProperty("--tilt-ry", "0deg");
      element.style.setProperty("--tilt-mx", "50%");
      element.style.setProperty("--tilt-my", "50%");
    };

    const bindElement = (element: HTMLElement) => {
      if (unbindByElement.has(element)) return;

      let rafId: number | null = null;
      let lastClientX = 0;
      let lastClientY = 0;
      let active = false;

      const setTilt = () => {
        rafId = null;
        if (!active) return;

        const rect = element.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;

        const x = (lastClientX - rect.left) / rect.width;
        const y = (lastClientY - rect.top) / rect.height;

        const normX = clamp(x * 2 - 1, -1, 1);
        const normY = clamp(y * 2 - 1, -1, 1);

        const computed = window.getComputedStyle(element);
        const maxRaw = computed.getPropertyValue("--tilt-max").trim();
        const max = Number.parseFloat(maxRaw || "10");

        const rotateY = normX * max;
        const rotateX = -normY * max;

        element.style.setProperty("--tilt-rx", `${rotateX.toFixed(2)}deg`);
        element.style.setProperty("--tilt-ry", `${rotateY.toFixed(2)}deg`);
        element.style.setProperty("--tilt-mx", `${(clamp(x, 0, 1) * 100).toFixed(2)}%`);
        element.style.setProperty("--tilt-my", `${(clamp(y, 0, 1) * 100).toFixed(2)}%`);
      };

      const schedule = () => {
        if (rafId == null) {
          rafId = window.requestAnimationFrame(setTilt);
        }
      };

      const enter = (clientX: number, clientY: number) => {
        active = true;
        element.classList.add("is-tilting");
        lastClientX = clientX;
        lastClientY = clientY;
        schedule();
      };

      const move = (clientX: number, clientY: number) => {
        if (!active) return;
        lastClientX = clientX;
        lastClientY = clientY;
        schedule();
      };

      const leave = () => {
        active = false;
        resetElement(element);
        if (rafId != null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
      };

      if (window.PointerEvent) {
        const onPointerEnter = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          enter(event.clientX, event.clientY);
        };

        const onPointerMove = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          move(event.clientX, event.clientY);
        };

        element.addEventListener("pointerenter", onPointerEnter);
        element.addEventListener("pointermove", onPointerMove);
        element.addEventListener("pointerleave", leave);
        element.addEventListener("pointercancel", leave);

        unbindByElement.set(element, () => {
          leave();
          element.removeEventListener("pointerenter", onPointerEnter);
          element.removeEventListener("pointermove", onPointerMove);
          element.removeEventListener("pointerleave", leave);
          element.removeEventListener("pointercancel", leave);
        });
        return;
      }

      const onMouseEnter = (event: MouseEvent) => {
        enter(event.clientX, event.clientY);
      };

      const onMouseMove = (event: MouseEvent) => {
        move(event.clientX, event.clientY);
      };

      element.addEventListener("mouseenter", onMouseEnter);
      element.addEventListener("mousemove", onMouseMove);
      element.addEventListener("mouseleave", leave);

      unbindByElement.set(element, () => {
        leave();
        element.removeEventListener("mouseenter", onMouseEnter);
        element.removeEventListener("mousemove", onMouseMove);
        element.removeEventListener("mouseleave", leave);
      });
    };

    const bindAll = () => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(".tilt-3d"));
      for (const el of elements) {
        bindElement(el);
      }
      return elements.length;
    };

    // Initial bind (and a second pass right after paint for streamed content).
    bindAll();
    const postPaintId = window.requestAnimationFrame(() => void bindAll());

    const observer = new MutationObserver(() => {
      bindAll();
    });
    observer.observe(document.body, { subtree: true, childList: true });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(postPaintId);
      for (const unbind of unbindByElement.values()) {
        unbind();
      }
      unbindByElement.clear();
    };
  }, [pathname]);

  return null;
}
