"use client";
import { useEffect } from "react";

export default function FadeInOnScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return <>{children}</>;
}
