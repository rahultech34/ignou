"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Clock,
  BookOpen,
  DollarSign,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  Phone,
  Mail,
  Scale,
  Sparkles,
  ChevronRight,
  Send,
  Lock,
} from "lucide-react";
import { Program } from "@/lib/types";
import { openEnquiryModal } from "@/app/components/EnquiryModal";
import { AdmissionForm } from "./AdmissionForm";

interface ProgramDetailPageProps {
  program: Program;
}

export function ProgramDetailPage({ program }: ProgramDetailPageProps) {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const isMBA =
    program.type === "mba" || program.code.toUpperCase().includes("MBA");

  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "eligibility", label: "Eligibility & Admission" },
    ...(program.curriculum && program.curriculum.length > 0
      ? [{ id: "curriculum", label: "Curriculum Syllabus" }]
      : []),
    { id: "fees", label: "Fee Structure" },
    ...(program.highlights && program.highlights.length > 0
      ? [{ id: "highlights", label: "Key Highlights" }]
      : []),
    ...(program.faqs && program.faqs.length > 0
      ? [{ id: "faqs", label: "FAQs" }]
      : []),
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(item.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -135; // Navbar (~65px) + Subnav (~52px) + breathing buffer (~18px)
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const directoryUrl =
    program.type === "ug"
      ? "/ug-programs"
      : program.type === "pg"
      ? "/pg-programs"
      : "/programs";
  const directoryLabel =
    program.type === "ug"
      ? "UG Programs"
      : program.type === "pg"
      ? "PG Programs"
      : "All Programs";

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Draft banner */}
      {program.status === "draft" && (
        <div className="bg-amber-400 text-slate-950 px-4 py-2 text-center text-xs font-bold tracking-wide">
          ⚠️ Admin Preview Mode — This course is in Draft status and hidden from public visitors.
        </div>
      )}

      {/* Breadcrumbs Header */}
      <section className="bg-white border-b border-slate-200/80 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-[#009FE3] transition-colors shrink-0">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <Link href={directoryUrl} className="hover:text-[#009FE3] transition-colors shrink-0">
              {directoryLabel}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-slate-800 truncate max-w-xs font-semibold">
              {program.title}
            </span>
          </nav>
        </div>
      </section>

      {/* Hero Showcase */}
      <section className="relative bg-gradient-to-b from-[#0b2545] via-[#0d2d54] to-[#133b6b] text-white py-12 lg:py-16 overflow-hidden">
        {/* Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Course Highlights (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-sky-400/20 text-sky-300 text-xs font-bold border border-sky-400/30">
                  {program.code}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  {program.badge || (isMBA ? "AICTE Approved" : "UGC-DEB Recognized")}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-medium border border-white/15">
                  {program.mode}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {program.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {program.overview || program.shortDescription}
              </p>

              {/* Quick Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-sky-300 text-xs font-semibold mb-1">
                    <Clock className="w-3.5 h-3.5" /> Duration
                  </div>
                  <div className="text-sm font-bold text-white">
                    {program.duration}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-sky-300 text-xs font-semibold mb-1">
                    <DollarSign className="w-3.5 h-3.5" /> Total Fee
                  </div>
                  <div className="text-sm font-bold text-white">{program.fee}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-2 text-sky-300 text-xs font-semibold mb-1">
                    <GraduationCap className="w-3.5 h-3.5" /> Degree Level
                  </div>
                  <div className="text-sm font-bold text-white">{program.level}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection("admission-form")}
                  className="px-6 py-3 rounded-xl bg-[#ffcc00] hover:bg-[#ffb700] text-slate-950 font-extrabold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  Apply for Admission 2026-27
                </button>

                <a
                  href="https://edukyu.com/compare-colleges"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Scale className="w-4 h-4 text-sky-300" />
                  Compare Universities
                </a>
              </div>
            </div>

            {/* Right Column: Key Admissions Checklist Card (5 cols) */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/15 text-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                    Admission Highlights
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    2026-27 Open
                  </span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span><strong>Direct Online Admission:</strong> Merit-based admission without CUET examination requirement.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span><strong>Flexible Installments:</strong> Pay semester-wise fee starting from low economical rates.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span><strong>Self-Paced Learning:</strong> Printed books delivered home plus 24x7 eGyanKosh digital access.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span><strong>Government Degree:</strong> UGC-DEB entitled degree accepted for UPSC &amp; Govt Jobs.</span>
                  </li>
                </ul>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span>Helpline: +91 83368 89553</span>
                  <span className="font-bold text-amber-300">100% Free Guidance</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Sticky Tab Navigation Bar — CENTERED */}
      <section className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-[64px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2.5 overflow-x-auto py-2.5 sm:py-3 no-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeSection === item.id
                    ? "bg-sky-50 text-[#009FE3] ring-1 ring-sky-200/70 shadow-2xs"
                    : "text-slate-700 hover:text-slate-950 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Body: 8 cols Content on Left, 4 cols Sticky Form on Right */}
      <section className="py-10 sm:py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column Content (8 cols) */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* 1. Overview */}
              <div
                id="overview"
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 scroll-mt-36"
              >
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-bold text-[#009FE3] uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                    Course Summary
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    About {program.title}
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {program.overview || program.shortDescription}
                </p>

                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-medium">
                    🏛️ Central University Degree
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-medium">
                    📜 UGC-DEB Valid Worldwide
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-medium">
                    💼 Campus Placement Cell Support
                  </span>
                </div>
              </div>

              {/* 2. Eligibility & Admission */}
              <div
                id="eligibility"
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 scroll-mt-36"
              >
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-bold text-[#009FE3] uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                    Admission Criteria
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    Eligibility &amp; Requirements
                  </h2>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
                  <div className="text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
                    Minimum Academic Requirement
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {program.eligibility}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Direct Admission: No entrance examination required for most distance programs.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Age Criteria: No upper age limit for enrolling in IGNOU degree programs.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Mode: Open &amp; Distance Learning (ODL) with printed books or eGyanKosh digital LMS.</span>
                  </div>
                </div>
              </div>

              {/* 3. Curriculum Syllabus */}
              {program.curriculum && program.curriculum.length > 0 && (
                <div
                  id="curriculum"
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-36"
                >
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold text-[#009FE3] uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                      Academic Syllabus
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                      Semester-Wise Curriculum Breakdown
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Structured semester modules approved by the university academic council.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {program.curriculum.map((sem, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-200 transition-colors"
                      >
                        <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center justify-between">
                          <span>{sem.semester}</span>
                          <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                            {sem.subjects.length} Subjects
                          </span>
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-600">
                          {sem.subjects.map((sub, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#009FE3] shrink-0 mt-1.5" />
                              <span className="font-medium text-slate-700">{sub}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Fee Structure */}
              <div
                id="fees"
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 scroll-mt-36"
              >
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-bold text-[#009FE3] uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                    Tuition &amp; Charges
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    Fee Structure &amp; Installments
                  </h2>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50/30 border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Total Course Fee
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-[#009FE3] mt-0.5">
                      {program.fee}
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 sm:text-right max-w-xs leading-relaxed">
                    Installment payment options available semester-wise or year-wise during re-registration cycles.
                  </div>
                </div>
              </div>

              {/* 5. Key Highlights */}
              {program.highlights && program.highlights.length > 0 && (
                <div
                  id="highlights"
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 scroll-mt-36"
                >
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold text-[#009FE3] uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                      Benefits
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                      Why Choose IGNOU for {program.code}?
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {program.highlights.map((h, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. FAQs */}
              {program.faqs && program.faqs.length > 0 && (
                <div
                  id="faqs"
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 scroll-mt-36"
                >
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold text-[#009FE3] uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                      Help &amp; Answers
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                      Frequently Asked Questions
                    </h2>
                  </div>

                  <div className="space-y-3 pt-1">
                    {program.faqs.map((faq, idx) => {
                      const isOpen = openFaqIdx === idx;
                      return (
                        <div
                          key={idx}
                          className="rounded-2xl border border-slate-200 overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenFaqIdx(isOpen ? null : idx)
                            }
                            className="w-full p-4 text-left font-bold text-sm text-slate-800 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                          >
                            <span>{faq.question}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column Sticky Form (4 cols) — Fixed after touching the header */}
            <aside
              id="admission-form"
              className="lg:col-span-4 lg:sticky lg:top-[128px] self-start space-y-4 w-full max-w-[370px] mx-auto lg:ml-auto"
            >
              {/* 1. Dedicated Admission & Counseling Form */}
              <AdmissionForm
                formTitle={`Apply for ${program.code} 2026-27`}
                formSubtitle="Direct Admission · No CUET · Free Counseling"
                source={`Course Sticky Sidebar - ${program.code}`}
                defaultCourse={program.title}
              />

              {/* 2. Accreditations & Key Trust Badges */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#009FE3]" />
                  <span>Recognition &amp; Approvals</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>UGC-DEB &amp; AICTE Approved:</strong> Central University degree valid worldwide.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>NAAC A++ Grade:</strong> Highest grade accreditation in India.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>No CUET Required:</strong> Direct admission into Bachelor &amp; Master programs.</span>
                  </li>
                </ul>
              </div>

            </aside>

          </div>
        </div>
      </section>
    </main>
  );
}
