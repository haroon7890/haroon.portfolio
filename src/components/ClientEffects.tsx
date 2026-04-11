"use client";

import { useEffect, useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import TiltEffects from "@/app/TiltEffects";

export default function ClientEffects() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      setReady(true);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <>
      <CustomCursor />
      <TiltEffects />
    </>
  );
}
