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
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-xl border px-4 py-3 text-white shadow-xl animate-slide-up ${
        type === "error" ? "bg-[#1e293b] border-red-500/30" : "bg-[#1e293b] border-teal-500/30"
      }`}
      role="status"
      aria-live="polite"
    >
      <span className="text-sm">{message}</span>
      <button type="button" onClick={onClose} className="ml-2 text-xs text-gray-400 transition-colors duration-200 hover:text-white">
        X
      </button>
    </div>
  );
}
