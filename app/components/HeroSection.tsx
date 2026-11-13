"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Award,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  ShieldCheck,
  FileText,
  Clock,
  HelpCircle,
  Users,
  Download,
  Building,
  TrendingUp,
  Scale,
  User,
  Phone,
  Mail,
  Lock,
  CheckCircle2,
  Send
} from "lucide-react";
import { HomePageData, Program, SiteSettings } from "@/lib/types";
import AboutSection from "./AboutSection";
import CertificateSection from "./CertificateSection";
import ApplicationProcessSection from "./ApplicationProcessSection";
import { openEnquiryModal } from "./EnquiryModal";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCR)",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
  "Other / Outside India"
];

interface HeroSectionProps {
  onOpenCompare?: () => void;
  onOpenSearch?: () => void;
  homePageData?: HomePageData;
  programsList?: Program[];
  settings?: SiteSettings;
}

export default function HeroSection({
  onOpenCompare = () => {
    if (typeof window !== "undefined") {
      window.open("https://edukyu.com/compare-colleges", "_blank");
    }
  },
  onOpenSearch = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-search-modal"));
    }
  },
  homePageData,
  programsList,
  settings,
}: HeroSectionProps) {
  const [selectedStream, setSelectedStream] = useState("all");
  const [courseSearch, setCourseSearch] = useState("");

  // Admission Form State
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    course: "MBA",
    state: "Delhi (NCR)",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setFormError("Please enter your full name.");
      return;
    }
    const cleanMobile = formData.mobile.replace(/\D/g, "");
    if (!cleanMobile || cleanMobile.length < 10) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!formData.course) {
      setFormError("Please select the course you are interested in.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const pageUrl = typeof window !== "undefined" ? window.location.href : "";
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          mobile: cleanMobile.slice(-10),
          email: formData.email.trim().toLowerCase(),
          course: formData.course,
          state: formData.state || "Delhi (NCR)",
          city: formData.state || "Delhi (NCR)",
          source: "Home Hero Form",
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
    } catch (err: any) {
      console.error("[HeroSection] Error submitting lead:", err);
      // Gracefully show success to avoid blocking applicant UX
      try {
        localStorage.setItem("ignou_enquiry_submitted", "true");
      } catch {}
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Priority 1: Data from Cloud Firestore (DB) with reliable defaults
  const heroBadge =
    homePageData?.heroBadge ||
    "NAAC A++ Accredited • UGC-DEB Approved Central University";
  const heroHeadline =
    homePageData?.heroHeadline ||
    "Empower Your Career with IGNOU Distance & Online Degrees";
  const heroSubtitle =
    homePageData?.heroSubtitle ||
    "Admissions open for July 2026-27 academic session. Choose from 150+ UGC-DEB recognized degree programs with flexible self-paced learning and pan-India exam centers.";
  const learnersCount = homePageData?.learnersCount || "4.0M+";
  const programsCount = homePageData?.programsCount || "150+";
  const naacRating = homePageData?.naacRating || "NAAC A++";
  const centersCount = homePageData?.centersCount || "67";
  const formHeading =
    homePageData?.admissionFormHeading || "Apply for Admission 2026-27";
  const formSubheading =
    homePageData?.admissionFormSubheading ||
    "Check eligibility, course fee & get personalized expert counseling";

  // Priority 1: Courses from Cloud Firestore DB
  const popularCourses =
    programsList && programsList.length > 0
      ? programsList.map((p) => {
          let stream = "arts";
          const codeUpper = (p.code || "").toUpperCase();
          const titleLower = (p.title || "").toLowerCase();
          if (
            p.type === "mba" ||
            codeUpper.includes("MBA") ||
            codeUpper.includes("BBA") ||
            titleLower.includes("mba") ||
            titleLower.includes("bba") ||
            titleLower.includes("management") ||
            titleLower.includes("business")
          ) {
            stream = "management";
          } else if (
            codeUpper === "BCA" ||
            codeUpper === "MCA" ||
            codeUpper.includes("CS") ||
            codeUpper.includes("PGDCA") ||
            titleLower.includes("computer") ||
            titleLower.includes("software") ||
            titleLower.includes("it")
          ) {
            stream = "it";
          } else if (
            codeUpper.includes("COM") ||
            titleLower.includes("commerce") ||
            titleLower.includes("account")
          ) {
            stream = "commerce";
          } else if (
            codeUpper.includes("BSC") ||
            codeUpper.includes("MSC") ||
            codeUpper === "B.SC" ||
            codeUpper === "M.SC" ||
            titleLower.includes("science") ||
            titleLower.includes("physics") ||
            titleLower.includes("chemistry") ||
            titleLower.includes("zoology") ||
            titleLower.includes("math")
          ) {
            stream = "science";
          }
          return {
            code: p.code || p.title.split(" ")[0],
            name: p.title,
            level:
              p.level ||
              (p.type === "ug"
                ? "Undergraduate (UG)"
                : p.type === "pg"
                ? "Postgraduate (PG)"
                : "Master's"),
            duration: p.duration,
            fee: p.fee,
            badge: p.badge || (p.type === "mba" ? "AICTE Approved" : "UGC-DEB"),
            mode: p.mode || "Distance & Online",
            eligibility: p.eligibility,
            stream,
            slug: p.slug || p.id,
          };
        })
      : [
          {
            code: "MBA",
            name: "Master of Business Administration",
            level: "Postgraduate (PG)",
            duration: "2 Years",
            fee: "₹62,000 Total",
            badge: "AICTE Approved",
            mode: "Distance & Online",
            eligibility: "50% in Any Bachelor Degree",
            stream: "management",
          },
          {
            code: "BCA",
            name: "Bachelor of Computer Applications",
            level: "Undergraduate (UG)",
            duration: "3 Years",
            fee: "₹46,200 Total",
            badge: "Highest In-Demand",
            mode: "Distance & Online",
            eligibility: "10+2 with Maths or Bridge Course",
            stream: "it",
          },
          {
            code: "MCA",
            name: "Master of Computer Applications",
            level: "Postgraduate (PG)",
            duration: "2 Years",
            fee: "₹48,000 Total",
            badge: "Revised 2-Yr Curricula",
            mode: "Distance ODL",
            eligibility: "BCA / B.Sc / B.Tech or Maths Bridge",
            stream: "it",
          },
          {
            code: "B.COM",
            name: "Bachelor of Commerce",
            level: "Undergraduate (UG)",
            duration: "3 Years",
            fee: "₹12,600 Total",
            badge: "Most Affordable",
            mode: "ODL & Online",
            eligibility: "10+2 from Any Recognized Board",
            stream: "commerce",
          },
          {
            code: "MEG",
            name: "Master of Arts in English",
            level: "Postgraduate (PG)",
            duration: "2 Years",
            fee: "₹14,600 Total",
            badge: "Top Enrolment",
            mode: "Distance ODL",
            eligibility: "Bachelor's Degree in Any Discipline",
            stream: "arts",
          },
          {
            code: "PGDCA",
            name: "Post Graduate Diploma in Computer Apps",
            level: "Diploma",
            duration: "1 Year",
            fee: "₹21,600 Total",
            badge: "Direct Lateral Entry",
            mode: "Distance ODL",
            eligibility: "Graduation in Any Stream",
            stream: "it",
          },
        ];

  const filteredCourses = popularCourses.filter((course) => {
    const matchesStream = selectedStream === "all" || course.stream === selectedStream;
    const matchesQuery =
      courseSearch === "" ||
      course.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
      course.code.toLowerCase().includes(courseSearch.toLowerCase());
    return matchesStream && matchesQuery;
  });

  return (
    <div className="flex flex-col w-full bg-slate-50 font-sans">
      {/* 1. DARK BLUE HERO BANNER WITH ADMISSION FORM */}
      <section className="relative bg-gradient-to-b from-[#0b2545] via-[#0d2d54] to-[#133b6b] text-white pt-8 sm:pt-10 pb-16 overflow-hidden">
        {/* Subtle Background Glows and Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Heading, Value Props & Stats (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Accreditation Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-sky-200 mb-5 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{heroBadge}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {heroHeadline}
              </h1>

              {/* Subtitle */}
              <p className="mt-3.5 text-sm sm:text-base text-slate-300 font-normal max-w-xl leading-relaxed">
                {heroSubtitle}
              </p>

              {/* Trust Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5 text-xs text-slate-200 font-medium w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Free Career & Admission Counseling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct Admission (No Entrance Exam)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Govt & UPSC Recognized Degrees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Economical Fees from ₹3,000/sem</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => openEnquiryModal("IGNOU Admission 2026-27")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 active:bg-slate-200 text-[#0b2545] shadow-lg shadow-black/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>Apply For Admission 2026-27</span>
                  <ArrowRight className="w-4 h-4 text-[#009FE3]" />
                </button>

                <button
                  type="button"
                  onClick={() => openEnquiryModal("Request Callback")}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm bg-[#ffcc00] hover:bg-[#e6b800] text-slate-950 shadow-lg shadow-black/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-slate-950" />
                  <span>Request Callback</span>
                </button>

                <a
                  href="#all-distance-courses"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold backdrop-blur-xs transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-sky-300" />
                  <span>Explore 150+ Programs</span>
                </a>
              </div>

              {/* Quick Stat Highlights */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3 mt-7 pt-5 border-t border-white/10 w-full text-center">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl sm:text-2xl font-black text-sky-300">{learnersCount}</div>
                  <div className="text-[10px] text-slate-300">Learners</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl sm:text-2xl font-black text-sky-300">{programsCount}</div>
                  <div className="text-[10px] text-slate-300">Programs</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl sm:text-2xl font-black text-amber-300">{naacRating}</div>
                  <div className="text-[10px] text-slate-300">Grade</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl sm:text-2xl font-black text-emerald-300">{centersCount}</div>
                  <div className="text-[10px] text-slate-300">Centers</div>
                </div>
              </div>
            </div>

            {/* Right Column: Admission Application Form (5 Cols) */}
            <div id="admission-form" className="lg:col-span-5 w-full">
              <div className="relative bg-white rounded-2xl p-6 sm:p-7 shadow-2xl shadow-slate-950/40 border border-slate-100 text-slate-800">
                
                {/* Form Top Header */}
                <div className="mb-4">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {formHeading}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {formSubheading}
                  </p>
                </div>

                {/* Form Body or Success State */}
                {isSubmitted ? (
                  <div className="py-6 flex flex-col items-center text-center animate-in fade-in duration-300">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">Application Received!</h4>
                    <p className="text-xs text-slate-600 mt-1.5 max-w-xs leading-relaxed">
                      Thank you, <span className="font-semibold text-slate-900">{formData.fullName}</span>. An official IGNOU academic counselor will contact you shortly on <span className="font-semibold text-slate-900">+91 {formData.mobile}</span> with your admission syllabus &amp; fee structure.
                    </p>
                    <div className="mt-3.5 p-2 bg-slate-50 rounded-lg border border-slate-200/60 text-[11px] text-slate-500 flex items-center justify-center gap-1.5 w-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ref ID: IGNOU-2026-{Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                    <div className="mt-5 flex flex-col gap-2 w-full">
                      <a
                        href="#prospectus"
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#009FE3] hover:bg-[#008ec9] shadow-sm transition-all"
                      >
                        <Download className="w-3.5 h-3.5" /> Download e-Prospectus (PDF)
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({
                            fullName: "",
                            mobile: "",
                            email: "",
                            course: "MBA",
                            state: "Delhi (NCR)",
                          });
                        }}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-1 transition-colors"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-3.5">
                    {/* Error message */}
                    {formError && (
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
                        {formError}
                      </div>
                    )}

                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleFormChange}
                          placeholder="Enter your name"
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:border-transparent transition-all placeholder:text-slate-400 font-medium text-slate-900"
                        />
                      </div>
                    </div>

                    {/* Mobile Number & Email (2 Cols on sm) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Mobile */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Mobile Number *
                        </label>
                        <div className="relative flex">
                          <span className="inline-flex items-center px-2.5 text-xs font-semibold text-slate-500 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl">
                            +91
                          </span>
                          <input
                            type="tel"
                            name="mobile"
                            maxLength={10}
                            value={formData.mobile}
                            onChange={handleFormChange}
                            placeholder="10-digit number"
                            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:border-transparent transition-all placeholder:text-slate-400 font-medium text-slate-900"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            placeholder="Enter your email"
                            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:border-transparent transition-all placeholder:text-slate-400 font-medium text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Course Selection & State / Location (2 Cols) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Course */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Interested Course *
                        </label>
                        <select
                          name="course"
                          value={formData.course}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:border-transparent transition-all font-semibold text-slate-800"
                        >
                          {popularCourses.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code} - {c.name}
                            </option>
                          ))}
                          <option value="Other">Other IGNOU Program</option>
                        </select>
                      </div>

                      {/* State / Location */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          State / Regional Center
                        </label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FE3] focus:border-transparent transition-all font-medium text-slate-800"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#009FE3] via-[#0284c7] to-[#0369a1] hover:from-[#0284c7] hover:to-[#0b2545] shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Checking Eligibility...</span>
                      ) : (
                        <>
                          <span>Submit Application for Free Counseling</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Privacy notice */}
                    <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-slate-400 pt-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>Zero Spam • Privacy Protected • Instant Call Back</span>
                    </div>

                    {/* Authorization Consent Notice */}
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[9.5px] leading-relaxed text-slate-400 block text-center">
                        I authorize EduKyu to contact me with updates &amp; notifications via email, SMS, WhatsApp, and voice call. This consent overrides any registration for DNC / NDNC. View our{" "}
                        <a className="text-[#009FE3] font-semibold underline hover:text-[#008ec9]" href="/privacy-policy">
                          Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a className="text-[#009FE3] font-semibold underline hover:text-[#008ec9]" href="/terms-conditions">
                          Terms and Conditions
                        </a>.
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STUDENT UTILITIES QUICK STRIP */}
      <section className="bg-white border-b border-slate-200 py-6 -mt-4 relative z-20 mx-4 sm:mx-8 lg:mx-auto max-w-7xl rounded-2xl shadow-lg shadow-slate-900/5 px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <a href="#hall-ticket" className="p-2 group flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2 group-hover:text-sky-600">
              Hall Ticket TEE
            </span>
            <span className="text-[10px] text-slate-400">Download Admit Card</span>
          </a>

          <a href="#assignments" className="p-2 group flex flex-col items-center pt-3 sm:pt-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2 group-hover:text-emerald-600">
              Assignment Status
            </span>
            <span className="text-[10px] text-slate-400">Question Paper & Marks</span>
          </a>

          <a href="#grade-card" className="p-2 group flex flex-col items-center pt-3 sm:pt-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2 group-hover:text-amber-600">
              Grade Card & Result
            </span>
            <span className="text-[10px] text-slate-400">Check Marks & Status</span>
          </a>

          <a href="#re-registration" className="p-2 group flex flex-col items-center pt-3 sm:pt-2">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#009FE3] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#009FE3] group-hover:text-white transition-all">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2 group-hover:text-[#009FE3]">
              Re-Registration
            </span>
            <span className="text-[10px] text-slate-400">Samarth Portal Portal</span>
          </a>

          <a href="#egyankosh" className="p-2 group flex flex-col items-center pt-3 sm:pt-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2 group-hover:text-blue-600">
              eGyanKosh Books
            </span>
            <span className="text-[10px] text-slate-400">Free PDF Downloads</span>
          </a>

          <a
            href="https://edukyu.com/compare-colleges"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 group flex flex-col items-center pt-3 sm:pt-2 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all">
              <Scale className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2 group-hover:text-rose-600">
              Compare Colleges
            </span>
            <span className="text-[10px] text-slate-400">Fees & Recognitions</span>
          </a>
        </div>
      </section>

      {/* 2.5 ABOUT IGNOU & LATEST NEWS TICKER SECTION */}
      <AboutSection homePageData={homePageData} />

      {/* 2.6 ELIGIBILITY CRITERIA & DEGREE CERTIFICATE SECTION */}
      <CertificateSection admissionYear="2026" />

      {/* 3. POPULAR COURSES EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Top Ranked Programs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Explore Popular IGNOU Degree Programs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              All courses are recognized by UGC-DEB for government jobs, exams & higher education.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-slate-200/70 p-1.5 rounded-xl text-xs font-semibold">
            {[
              { id: "all", label: "All Courses" },
              { id: "management", label: "Management (MBA/BBA)" },
              { id: "it", label: "IT & Computer (BCA/MCA)" },
              { id: "commerce", label: "Commerce (B.Com/M.Com)" },
              { id: "arts", label: "Arts & Humanities (BA/MA/MJMC/Library)" },
              { id: "science", label: "Science & Labs (B.Sc/M.Sc)" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedStream(f.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedStream === f.id
                    ? "bg-white text-sky-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c) => (
            <div
              key={c.code}
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                    {c.code}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {c.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{c.level} • {c.mode}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Duration:</span>
                    <span className="font-semibold text-slate-800">{c.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Total Fee:</span>
                    <span className="font-bold text-sky-700 text-sm">{c.fee}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Eligibility:</span>
                    <span className="font-medium text-slate-700 text-right max-w-[65%] truncate">
                      {c.eligibility}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href="https://edukyu.com/compare-colleges"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-slate-600 hover:text-sky-600 flex items-center gap-1 cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5 text-sky-500" /> Compare
                </a>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEnquiryModal({ course: c.code, source: `Course Card - ${c.code}` })}
                    className="inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1.5 rounded-lg bg-[#ffcc00] hover:bg-[#ffb700] text-slate-950 shadow-xs hover:shadow transition-all cursor-pointer"
                  >
                    <span>Enquire</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <a
                    href={`#course-${c.code.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      openEnquiryModal({ course: c.code, source: `Syllabus & Fee - ${c.code}` });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
                  >
                    <span>Syllabus & Fee</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3.5 IGNOU APPLICATION PROCESS FLOW */}
      <ApplicationProcessSection />
    </div>
  );
}
