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
  ArrowRight,
  TrendingUp,
  Award,
} from "lucide-react";
import { MbaSpecialization } from "@/lib/types";
import { AdmissionForm } from "./AdmissionForm";

interface MbaDetailPageProps {
  item: MbaSpecialization;
  otherSpecializations: MbaSpecialization[];
}

const MBA_CODES: Record<string, string> = {
  "ignou-mba-in-finance-management": "MBA-FM",
  "ignou-mba-in-hr-management": "MBA-HRM",
  "ignou-mba-in-operations-management": "MBA-OM",
  "ignou-mba-in-it": "MBA-IT",
  "ignou-mba-in-business-analytics": "MBA-BA",
  "ignou-mba-in-business-management": "MBA-BM",
  "ignou-mba-in-marketing-management": "MBA-MM",
};

export function MbaDetailPage({
  item,
  otherSpecializations,
}: MbaDetailPageProps) {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const code = MBA_CODES[item.slug] || "MBA";

  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "eligibility", label: "Eligibility & Admission" },
    { id: "curriculum", label: "Curriculum Syllabus" },
    { id: "fees", label: "Fee Structure" },
    { id: "careers", label: "Career Scope" },
    { id: "all-specializations", label: "Other Specializations" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const nav = navItems[i];
        const el = document.getElementById(nav.id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(nav.id);
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
      const yOffset = -135;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Breadcrumbs Header */}
      <section className="bg-white border-b border-slate-200/80 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap"
          >
            <Link href="/" className="hover:text-[#009FE3] transition-colors shrink-0">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <Link
              href="/mba-specializations"
              className="hover:text-[#009FE3] transition-colors shrink-0 font-medium"
            >
              MBA Specializations
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-slate-800 truncate max-w-xs sm:max-w-md font-semibold">
              {item.title}
            </span>
          </nav>
        </div>
      </section>

      {/* Hero Showcase — Exact Same Gradient & Layout as ProgramDetailPage */}
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
                  {code}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  AICTE &amp; UGC-DEB Approved
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-medium border border-white/15">
                  Distance &amp; Online (ODL)
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {item.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {item.excerpt ||
                  "A premier postgraduate management programme offered by Indira Gandhi National Open University (SOMS) designed to accelerate your corporate leadership career without pausing your employment."}
              </p>

              {/* Quick Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-sky-300 text-xs font-semibold mb-1">
                    <Clock className="w-3.5 h-3.5" /> Duration
                  </div>
                  <div className="text-sm font-bold text-white">2 Years (4 Semesters)</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-sky-300 text-xs font-semibold mb-1">
                    <DollarSign className="w-3.5 h-3.5" /> Total Fee
                  </div>
                  <div className="text-sm font-bold text-white">₹66,000 Total</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-2 text-sky-300 text-xs font-semibold mb-1">
                    <GraduationCap className="w-3.5 h-3.5" /> Degree Level
                  </div>
                  <div className="text-sm font-bold text-white">Postgraduate (PG)</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection("admission-form")}
                  className="px-6 py-3 rounded-xl bg-[#ffcc00] hover:bg-[#ffb700] text-slate-950 font-extrabold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  Apply for Admission 2027
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
                    Admission Highlights 2027
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    Admission Open
                  </span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      <strong>Direct Online Admission:</strong> Merit-based admission without OPENMAT or entrance exam requirement.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      <strong>Flexible Installments:</strong> Economical semester fee of ₹15,500 payable during each registration cycle.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      <strong>Self-Paced Learning:</strong> Printed books delivered home plus 24x7 eGyanKosh digital LMS access.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>
                      <strong>UGC-DEB &amp; AICTE Approved:</strong> Central University degree valid for MNC leadership, Govt jobs, and PhD.
                    </span>
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
            {navItems.map((nav) => (
              <button
                key={nav.id}
                type="button"
                onClick={() => scrollToSection(nav.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeSection === nav.id
                    ? "bg-sky-50 text-[#009FE3] ring-1 ring-sky-200/70 shadow-2xs"
                    : "text-slate-700 hover:text-slate-950 hover:bg-slate-50"
                }`}
              >
                {nav.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Body: 8 cols Left, 4 cols Sticky Form on Right */}
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
                    About {item.title}
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {item.excerpt ||
                    "Indira Gandhi National Open University (IGNOU) offers this specialized MBA through the School of Management Studies (SOMS) for working professionals seeking domain expertise in corporate leadership."}
                </p>

                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-medium">
                    🏛️ Central University Degree
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-medium">
                    📜 AICTE &amp; UGC-DEB Valid Worldwide
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-medium">
                    💼 Campus Placement Cell Support
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-medium">
                    ⏱️ Self-Paced Flexible Schedule
                  </span>
                </div>
              </div>

              {/* 2. Eligibility & Requirements */}
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
                    Bachelor&apos;s degree of minimum 3 years from a recognized university with at least 50% marks (45% for reserved-category candidates).
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>No Entrance Exam:</strong> Direct merit-based admission without OPENMAT or CUET requirement.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>No Age Bar:</strong> Working professionals of any age can apply for the degree.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Study Mode:</strong> Open and Distance Learning (ODL) with printed textbooks and online lectures.</span>
                  </div>
                </div>
              </div>

              {/* 3. Detailed Curriculum & Syllabus */}
              <div
                id="curriculum"
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-36"
              >
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-bold text-[#009FE3] uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                    Academic Syllabus
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    Curriculum &amp; Program Details
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Full academic guide, semester syllabus, and evaluation pattern for this specialization.
                  </p>
                </div>

                {/* Render the full comprehensive guide content in styled prose */}
                <div
                  className="prose prose-slate max-w-none text-slate-700 leading-relaxed
                    prose-headings:text-slate-950 prose-headings:font-black prose-headings:tracking-tight
                    prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2
                    prose-h3:text-lg prose-h3:font-bold prose-h3:text-slate-900 prose-h3:mt-6 prose-h3:mb-2
                    prose-p:text-sm sm:prose-p:text-[15px] prose-p:leading-relaxed prose-p:my-3
                    prose-ul:my-3 prose-ul:space-y-1.5 prose-li:text-sm prose-li:text-slate-600
                    prose-strong:text-slate-900 prose-strong:font-bold
                    prose-table:my-4 prose-table:w-full prose-table:text-xs prose-th:bg-slate-100 prose-th:p-2.5 prose-td:p-2.5 prose-td:border prose-td:border-slate-200"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </div>

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
                      ₹66,000 Total
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 sm:text-right max-w-xs leading-relaxed">
                    Payable in economical semester installments of <strong>₹15,500 per semester</strong> during re-registration cycles (+ registration fee in sem 1).
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Semester 1</div>
                    <div className="font-extrabold text-slate-900 mt-0.5">₹15,500 + reg</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Semester 2</div>
                    <div className="font-extrabold text-slate-900 mt-0.5">₹15,500</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Semester 3</div>
                    <div className="font-extrabold text-slate-900 mt-0.5">₹15,500</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Semester 4</div>
                    <div className="font-extrabold text-slate-900 mt-0.5">₹15,500</div>
                  </div>
                </div>
              </div>

              {/* 5. Career Scope */}
              <div
                id="careers"
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 scroll-mt-36"
              >
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-bold text-[#009FE3] uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                    Career Opportunities
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                    Career Scope &amp; Placements
                  </h2>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Graduates of this MBA specialization qualify for middle-to-senior corporate management roles, consultancy positions, and entrepreneurial ventures. IGNOU degrees are accepted by top Indian IT/BPO giants, banks, financial institutions, and multinational corporations.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-[#009FE3] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">Corporate Leadership</div>
                      <div className="text-xs text-slate-500 mt-0.5">Manager, Lead, Strategy Consultant, Vice President</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">Salary Growth</div>
                      <div className="text-xs text-slate-500 mt-0.5">Average starting package ₹6 LPA - ₹14 LPA for experienced professionals</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Other Specializations */}
              <div
                id="all-specializations"
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-36"
              >
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#009FE3] uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                      Explore Alternatives
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                      Other MBA Specializations
                    </h2>
                  </div>
                  <Link
                    href="/mba-specializations"
                    className="text-xs font-bold text-[#009FE3] hover:underline hidden sm:inline-flex items-center gap-1"
                  >
                    <span>View All 7</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {otherSpecializations.map((other) => (
                    <Link
                      key={other.id}
                      href={`/mba-specializations/${other.slug}`}
                      className="group p-4 rounded-2xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                            {MBA_CODES[other.slug] || "MBA"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">2 Years</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#009FE3] transition-colors">
                          {other.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {other.excerpt || other.metaDescription}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#009FE3]">
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column Sticky Form (4 cols) — Fixed after touching the header */}
            <aside
              id="admission-form"
              className="lg:col-span-4 lg:sticky lg:top-[128px] self-start space-y-4 w-full max-w-[370px] mx-auto lg:ml-auto"
            >
              {/* 1. Dedicated Admission & Counseling Form */}
              <AdmissionForm
                formTitle={`Apply for ${code} 2027`}
                formSubtitle="Direct Admission · No Entrance · Free Counseling"
                source={`MBA Sticky Sidebar - ${code}`}
                defaultCourse={item.title}
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
                    <span><strong>UGC-DEB &amp; AICTE Approved:</strong> Degree valid worldwide for MNCs &amp; Govt jobs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>NAAC A++ Central University:</strong> Highest quality education standard in India.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Direct Admission:</strong> No OPENMAT or entrance exam required.</span>
                  </li>
                </ul>
              </div>

              {/* 3. Counselor Helpline */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0b2545] text-white space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Phone className="w-3.5 h-3.5" /> Dedicated Admissions Helpline
                </div>
                <div className="text-sm font-extrabold text-white">
                  +91 83368 89553
                </div>
                <div className="text-xs text-slate-300">
                  Call or WhatsApp our certified academic advisors for free admission guidance and syllabus PDF.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

