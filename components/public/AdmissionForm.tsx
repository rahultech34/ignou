"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  GraduationCap,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Check,
} from "lucide-react";
import { INDIAN_STATES, HOME_PAGE_COURSES } from "@/lib/form-constants";

interface DropdownOption {
  value: string;
  label: string;
}

interface DownwardSelectProps {
  value: string;
  placeholder: string;
  options: DropdownOption[];
  icon: React.ReactNode;
  onChange: (value: string) => void;
  ariaLabel: string;
}

function DownwardSelect({
  value,
  placeholder,
  options,
  icon,
  onChange,
  ariaLabel,
}: DownwardSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        e.stopPropagation();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        {icon}
      </div>

      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full pl-9 pr-8 py-2 rounded-lg border text-left text-xs sm:text-sm transition-all bg-slate-50/50 font-medium flex items-center justify-between cursor-pointer ${
          isOpen
            ? "border-sky-500 ring-1 ring-sky-100 bg-white text-slate-900"
            : "border-slate-200 hover:border-slate-300 text-slate-900"
        }`}
      >
        <span className={`truncate block ${selectedOption ? "text-slate-900" : "text-slate-400"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </button>

      <ChevronDown
        className={`w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-150 ${
          isOpen ? "rotate-180 text-[#009FE3]" : ""
        }`}
      />

      {isOpen && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-900/15 max-h-52 overflow-y-auto overscroll-contain py-1"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs sm:text-[13px] leading-snug flex items-center justify-between gap-2 transition-colors whitespace-normal cursor-pointer ${
                  isSelected
                    ? "bg-sky-50 text-[#009FE3] font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-medium"
                }`}
              >
                <span className="break-words">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#009FE3] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface AdmissionFormProps {
  formTitle?: string;
  formSubtitle?: string;
  source?: string;
  onSuccess?: () => void;
  isCompact?: boolean;
  defaultCourse?: string;
}

export function AdmissionForm({
  formTitle = "Apply for IGNOU Admission 2026-27",
  formSubtitle = "UGC-DEB Recognized · No CUET Required · Free Counseling",
  source = "Blog Sidebar",
  onSuccess,
  defaultCourse = "",
}: AdmissionFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    course: defaultCourse || "",
    state: "Delhi (NCR)",
  });

  const [prevDefaultCourse, setPrevDefaultCourse] = useState(defaultCourse);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [refId, setRefId] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (defaultCourse !== prevDefaultCourse) {
    setPrevDefaultCourse(defaultCourse);
    if (defaultCourse) {
      setFormData((prev) => ({ ...prev, course: defaultCourse }));
    }
  }

  const courseOptions: DropdownOption[] = React.useMemo(() => {
    const base = HOME_PAGE_COURSES.map((c) => ({
      value: c.code,
      label: c.label,
    }));
    if (defaultCourse && !base.some((c) => c.value === defaultCourse)) {
      return [{ value: defaultCourse, label: defaultCourse }, ...base];
    }
    return base;
  }, [defaultCourse]);

  const stateOptions: DropdownOption[] = React.useMemo(
    () => INDIAN_STATES.map((st) => ({ value: st, label: st })),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    const cleanMobile = formData.mobile.replace(/\D/g, "");
    if (!cleanMobile || cleanMobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!formData.course) {
      setError("Please select the program you are interested in.");
      return;
    }

    setIsSubmitting(true);

    try {
      const pageUrl = typeof window !== "undefined" ? window.location.href : "";
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          mobile: cleanMobile.slice(-10),
          course: formData.course,
          city: formData.state || "Delhi (NCR)",
          state: formData.state || "Delhi (NCR)",
          source: source || "Program Sidebar",
          source_name: "WS",
          source_id: "49",
          page_url: pageUrl,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit enquiry. Please try again.");
      }

      try {
        localStorage.setItem("ignou_enquiry_submitted", "true");
      } catch {
        // Storage unavailable
      }

      setRefId(`IGNOU-2026-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsSubmitted(true);
      if (onSuccess) {
        setTimeout(onSuccess, 2200);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit enquiry. Please try again.";
      console.error("[AdmissionForm] Error submitting lead:", msg);
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-100 text-center animate-in fade-in duration-300">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-2.5">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Application Received!</h3>
        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
          Thank you, <strong className="text-slate-800">{formData.fullName}</strong>. An official academic counselor will call you on{" "}
          <strong className="text-slate-800">+91 {formData.mobile}</strong> shortly with your syllabus and fee details.
        </p>
        <div className="mt-3.5 p-2 bg-slate-50 rounded-lg border border-slate-200/60 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ref ID: {refId}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[370px] mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-lg ring-1 ring-slate-900/5 border border-slate-200/80">
      {/* Title */}
      <div className="mb-3 text-center">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
          {formTitle}
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{formSubtitle}</p>
      </div>

      {error && (
        <div className="mb-3 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5 animate-in fade-in">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Row 1: Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter your name"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-100 transition-all bg-slate-50/50 font-medium"
            />
          </div>
        </div>

        {/* Row 2: Mobile Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Mobile Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex">
            <span className="inline-flex items-center px-2.5 rounded-l-lg border border-r-0 border-slate-200 bg-slate-100 text-slate-600 text-xs font-bold shrink-0">
              +91
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "") })
              }
              placeholder="10-digit number"
              className="w-full px-3 py-2 rounded-r-lg border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-100 transition-all bg-slate-50/50 font-medium"
            />
          </div>
        </div>

        {/* Row 3: Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-100 transition-all bg-slate-50/50 font-medium"
            />
          </div>
        </div>

        {/* Row 4: Select Course (Downward Controlled Dropdown) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Interested Course <span className="text-rose-500">*</span>
          </label>
          <DownwardSelect
            ariaLabel="Interested Course"
            value={formData.course}
            placeholder="Select Course"
            options={courseOptions}
            icon={<GraduationCap className="w-4 h-4" />}
            onChange={(course) => {
              setFormData((prev) => ({ ...prev, course }));
              if (error) setError(null);
            }}
          />
        </div>

        {/* Row 5: Select State / Region (Downward Controlled Dropdown) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            State / Regional Center
          </label>
          <DownwardSelect
            ariaLabel="State / Regional Center"
            value={formData.state}
            placeholder="Select your state"
            options={stateOptions}
            icon={<MapPin className="w-4 h-4" />}
            onChange={(state) => setFormData((prev) => ({ ...prev, state }))}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#ffcc00] hover:bg-[#e6b800] active:bg-[#cca300] text-[#0b2545] font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 cursor-pointer active:scale-98 mt-1"
        >
          {isSubmitting ? (
            <span>Submitting details...</span>
          ) : (
            <>
              <span>Apply &amp; Get Free Counseling</span>
              <ArrowRight className="w-4 h-4 text-[#0b2545]" />
            </>
          )}
        </button>

        {/* Authorization Consent Notice */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[9.5px] leading-relaxed text-slate-500 block text-center">
            I authorize EduKyu to contact me with updates &amp; notifications via email, SMS, WhatsApp, and voice call. This consent overrides any registration for DNC / NDNC. View our{" "}
            <Link className="text-[#009FE3] font-semibold underline hover:text-[#008ec9]" href="/privacy-policy">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link className="text-[#009FE3] font-semibold underline hover:text-[#008ec9]" href="/terms-conditions">
              Terms &amp; Conditions
            </Link>.
          </span>
        </div>
      </form>
    </div>
  );
}
