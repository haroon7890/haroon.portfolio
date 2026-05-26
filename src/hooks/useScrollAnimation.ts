"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollAnimation(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);

  // Default to visible so content is never blank if JS hydration/observer fails.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {

      return;
    }



    const element = ref.current;
    if (!element) {
      return;
    }


    // Initial value comes from useState(true) to avoid cascading state-set lint errors.
    // IntersectionObserver will update it after mount.



    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update visible state only when we intersect; avoids eager setState.

        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -10% 0px",
      }


    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };

}
