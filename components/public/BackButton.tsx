"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  fallbackHref?: string;
  label?: string;
}

/**
 * Navigates back to the previous page in browser history, falling back to a safe route
 * when opened directly in a fresh tab.
 */
export function BackButton({
  fallbackHref = "/",
  label = "Back",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-xs text-xs sm:text-sm font-bold transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-[#009FE3]" />
        <span>{label}</span>
      </button>
    </div>
  );
}
