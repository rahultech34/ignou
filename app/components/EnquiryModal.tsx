"use client";

import React, { useEffect } from "react";
import { HOME_PAGE_COURSES } from "@/lib/form-constants";
import { AdmissionForm } from "@/components/public/AdmissionForm";

export interface EnquiryOptions {
  course?: string;
  source?: string;
}

export function openEnquiryModal(options?: EnquiryOptions | string) {
  if (typeof window !== "undefined") {
    const detail =
      typeof options === "string"
        ? { course: options, source: options }
        : options;
    window.dispatchEvent(
      new CustomEvent("open-enquiry-modal", { detail })
    );
  }
}

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourse?: string;
  source?: string;
}

function resolveModalCourse(rawCourse?: string): string {
  const val = (rawCourse || "").trim();
  if (!val) return "";
  if (HOME_PAGE_COURSES.some((c) => c.code.toLowerCase() === val.toLowerCase())) {
    const matched = HOME_PAGE_COURSES.find(
      (c) => c.code.toLowerCase() === val.toLowerCase()
    );
    return matched ? matched.code : val;
  }
  const lower = val.toLowerCase();
  if (
    lower.includes("request callback") ||
    lower.includes("free career counseling") ||
    lower.includes("general admission") ||
    lower.includes("ignou admission")
  ) {
    return "";
  }
  if (lower.includes("mba") && lower.includes("guidance")) {
    return "MBA";
  }
  return val;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  defaultCourse = "MBA",
  source = "General Enquiry",
}: EnquiryModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resolvedCourse = resolveModalCourse(defaultCourse);
  const subtitleTarget =
    resolvedCourse && resolvedCourse !== "General Admission"
      ? `Get 1 to 1 Expert Guidance for ${resolvedCourse}`
      : "Get 1 to 1 Expert Guidance for IGNOU Admissions";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book 100% Free Counseling"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[390px] max-h-[92dvh] overflow-y-auto overscroll-contain"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Enquiry Modal"
          className="absolute right-3 top-3 z-10 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base leading-none flex items-center justify-center cursor-pointer"
        >
          ×
        </button>

        <AdmissionForm
          formTitle="Book 100% Free Counseling"
          formSubtitle={subtitleTarget}
          source={source || "Enquiry Popup"}
          defaultCourse={resolvedCourse}
          onSuccess={onClose}
        />
      </div>
    </div>
  );
}
