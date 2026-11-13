"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  GraduationCap,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Lock,
} from "lucide-react";

interface AdmissionFormProps {
  formTitle?: string;
  formSubtitle?: string;
  source?: string;
  onSuccess?: () => void;
  isCompact?: boolean;
  defaultCourse?: string;
}

const INDIAN_STATES = [
  "Delhi (NCR)",
  "Uttar Pradesh",
  "Haryana",
  "Bihar",
  "Rajasthan",
  "Punjab",
  "Madhya Pradesh",
  "Maharashtra",
  "West Bengal",
  "Uttarakhand",
  "Jharkhand",
  "Karnataka",
  "Tamil Nadu",
  "Other State",
];

const IGNOU_COURSES = [
  { group: "Undergraduate (UG)", courses: ["Online BLIS (100% Digital Mode)", "Online B.Sc (100% Digital Mode)", "Online B.Com (100% Digital Mode)", "Online BCA (100% Digital Mode)", "Online BA (100% Digital Mode)", "Online BBA (100% Digital Mode)", "Distance BA (Arts & Humanities)", "Distance BBA (Business Admin)", "Distance BCA (Computer Applications)", "Distance B.Com (Commerce & Accounts)", "Distance B.Sc (Bachelor of Science)", "Distance B.Ed (Bachelor of Education)", "Distance BLIS (Library Science)", "BSW (Social Work)"] },
  { group: "Postgraduate (PG)", courses: ["Online MLIS (100% Digital Mode)", "Online M.Sc (100% Digital Mode)", "Online MJMC (100% Digital Mode)", "Online M.Com (100% Digital Mode)", "Online MCA (100% Digital Mode)", "Online MA (100% Digital Mode)", "Distance MLIS (Library Science)", "Distance M.Sc (Master of Science)", "Distance MJMC (Journalism & Mass Comm)", "Distance M.Com (Master of Commerce)", "Distance MCA (Master of Computer Applications)", "Distance MA (Master of Arts)", "M.Com (Master of Commerce)", "MCA (Master of Computer Applications)", "M.A. English (MEG)", "M.A. Hindi (MHD)", "M.A. Political Science (MPS)", "M.A. History (MAH)"] },
  { group: "Management & MBA", courses: ["Online MBA (100% Digital Mode)", "MBA in Marketing Management (Online/Distance)", "MBA in Business Management (Online/Distance)", "MBA in Business Analytics (Online/Distance)", "MBA in Information Technology (IT)", "MBA in Operations Management (Online/Distance)", "MBA in HR Management (Online/Distance)", "MBA in Finance Management (Online/Distance)", "Distance MBA (General Management)", "MBA (General Management)", "MBA in Banking & Finance (MPB)", "MBA in Human Resource (HRM)", "100% Online MBA"] },
];

export function AdmissionForm({
  formTitle = "Apply for IGNOU Admission 2026-27",
  formSubtitle = "UGC-DEB Recognized · No CUET Required · Free Counseling",
  source = "Blog Sidebar",
  onSuccess,
  isCompact = false,
  defaultCourse = "",
}: AdmissionFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    course: defaultCourse || "",
    state: "Delhi (NCR)",
  });

  React.useEffect(() => {
    if (defaultCourse) {
      setFormData((prev) => ({ ...prev, course: defaultCourse }));
    }
  }, [defaultCourse]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
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
      } catch {}

      setIsSubmitted(true);
      if (onSuccess) {
        setTimeout(onSuccess, 2200);
      }
    } catch (err: any) {
      console.error("[AdmissionForm] Error submitting lead:", err);
      // Fallback UX so student isn't blocked
      try {
        localStorage.setItem("ignou_enquiry_submitted", "true");
      } catch {}
      setIsSubmitted(true);
      if (onSuccess) {
        setTimeout(onSuccess, 2200);
      }
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
          <span>Ref ID: IGNOU-2026-{Math.floor(100000 + Math.random() * 900000)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[370px] mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-lg ring-1 ring-slate-900/5 border border-slate-200/80">
      {/* Header Badge & Title */}
      <div className="mb-3 text-center">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-[#009FE3] text-[10px] font-bold tracking-wide uppercase mb-1 border border-sky-100">
          <span className="w-1.5 h-1.5 rounded-full bg-[#009FE3] animate-pulse" />
          Admissions 2026-27 Open
        </div>
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
          {formTitle}
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{formSubtitle}</p>
      </div>

      {error && (
        <div className="mb-3 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5 animate-in fade-in">
          <span>⚠️ {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Row 1: Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Student Full Name <span className="text-rose-500">*</span>
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
            Mobile Number (10 Digits) <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex">
            <span className="inline-flex items-center px-2.5 rounded-l-lg border border-r-0 border-slate-200 bg-slate-100 text-slate-600 text-xs font-bold shrink-0">
              🇮🇳 +91
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "") })
              }
              placeholder="Enter 10-digit mobile number"
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

        {/* Row 4: Select Course */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Course Interested In <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              required
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full pl-9 pr-7 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-100 transition-all bg-slate-50/50 appearance-none font-medium truncate"
            >
              <option value="">Select Course</option>
              {defaultCourse && (
                <option value={defaultCourse}>{defaultCourse}</option>
              )}
              {IGNOU_COURSES.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Row 5: Select State / Region */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Current State / Region
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full pl-9 pr-7 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-100 transition-all bg-slate-50/50 appearance-none font-medium truncate"
            >
              <option value="">Select your state</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
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

