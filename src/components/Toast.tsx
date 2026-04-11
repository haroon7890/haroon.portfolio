"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "error" | "success";
  onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-xl border px-4 py-3 text-[color:var(--text-light)] shadow-xl animate-slide-up ${
        type === "error" ? "bg-[#fff1ef] border-red-500/30" : "bg-[#fff8ef] border-[color:var(--accent-soft)]"
      }`}
      role="status"
      aria-live="polite"
    >
      <span className="text-sm">{message}</span>
      <button type="button" onClick={onClose} className="ml-2 text-xs text-[color:var(--text-dim)] transition-colors duration-200 hover:text-[color:var(--text-light)]">
        X
      </button>
    </div>
  );
}
