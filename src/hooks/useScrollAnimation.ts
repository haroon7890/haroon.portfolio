"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollAnimation(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  // Default to visible so content is never blank if JS hydration/observer fails.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) {
      setVisible(true);
      return;
    }

    const rect = element.getBoundingClientRect();
    const startsInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (startsInView) {
      setVisible(true);
      return;
    }

    setVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
