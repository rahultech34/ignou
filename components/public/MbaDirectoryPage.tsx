"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  Award,
  CheckCircle2,
  Briefcase,
  Layers,
  ChevronRight,
  TrendingUp,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { MbaSpecialization } from "@/lib/types";
import { openEnquiryModal } from "@/app/components/EnquiryModal";

interface MbaDirectoryPageProps {
  specializations: MbaSpecialization[];
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

const CATEGORY_TABS = [
  { id: "all", label: "All Specializations (7)", icon: Sparkles },
  { id: "finance", label: "Finance & Banking", icon: DollarSign },
  { id: "hr-ops", label: "HR & Operations", icon: Briefcase },
  { id: "tech-analytics", label: "IT & Analytics", icon: BarChart3 },
  { id: "marketing-business", label: "Marketing & Strategy", icon: TrendingUp },
];

export function MbaDirectoryPage({ specializations }: MbaDirectoryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = specializations.filter((item) => {
    // Category match
    const slug = item.slug.toLowerCase();
    let matchesCategory = true;
    if (selectedCategory === "finance") {
      matchesCategory = slug.includes("finance");
    } else if (selectedCategory === "hr-ops") {
      matchesCategory = slug.includes("hr") || slug.includes("operations");
    } else if (selectedCategory === "tech-analytics") {
      matchesCategory = slug.includes("it") || slug.includes("analytics");
    } else if (selectedCategory === "marketing-business") {
      matchesCategory = slug.includes("marketing") || slug.includes("business-management");
    }

    // Search query match
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === "" ||
      item.title.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-[#0b2545] via-[#0d2d54] to-[#133b6b] text-white py-14 sm:py-20 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-sky-300 border border-white/20 mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>SOMS IGNOU • Admissions 2027 Session</span>
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            IGNOU MBA Specializations 2027
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Choose from 7 specialized management streams approved by AICTE &amp; UGC-DEB.
            Learn at your own pace with affordable semester fees (₹15,500/sem) and direct online admission.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search specialization (e.g. Finance, HR, IT, Analytics)..."
              className="w-full pl-12 pr-4 py-3 text-sm sm:text-base bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white/20 transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter Tabs Navigation */}
      <section className="bg-white border-b border-slate-200/80 sticky top-[65px] z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-3 no-scrollbar">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#009FE3] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Program Cards Grid */}
      <section className="py-12 sm:py-16 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
              <GraduationCap className="w-12 h-12 text-[#009FE3] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900">No Specializations Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                We couldn&apos;t find any specialization matching your search query. Try another keyword.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#009FE3] text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredItems.map((item) => {
                const code = MBA_CODES[item.slug] || "MBA";

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Accent Strip */}
                      <div className="h-1.5 w-full bg-gradient-to-r from-[#009FE3] via-sky-500 to-[#0b2545]" />

                      <div className="p-6">
                        {/* Header Badges */}
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                          <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 font-extrabold text-xs border border-sky-100">
                            {code}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[11px] border border-amber-200">
                            AICTE Approved
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#009FE3] transition-colors leading-snug">
                          <Link href={`/mba-specializations/${item.slug}`}>
                            {item.title}
                          </Link>
                        </h2>

                        {/* Description */}
                        <p className="mt-2 text-xs sm:text-[13px] text-slate-600 line-clamp-3 leading-relaxed">
                          {item.excerpt ||
                            item.metaDescription ||
                            "Complete guide to eligibility, fees, semester curriculum, admission process and corporate career opportunities."}
                        </p>

                        {/* Info List */}
                        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-slate-500">
                              <Clock className="w-3.5 h-3.5 text-slate-400" /> Duration:
                            </span>
                            <span className="font-bold text-slate-800">2 Years (4 Semesters)</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Total Course Fee:</span>
                            <span className="font-extrabold text-[#009FE3] text-sm">
                              ₹66,000 Total
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Mode:</span>
                            <span className="font-medium text-slate-700">Distance &amp; Online (ODL)</span>
                          </div>

                          <div className="pt-1">
                            <div className="text-[11px] text-slate-400">Eligibility:</div>
                            <div className="font-medium text-slate-800 truncate text-[12px]">
                              Graduation with 50% Marks (45% for Reserved)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => openEnquiryModal(item.title)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors cursor-pointer"
                      >
                        Quick Enquiry
                      </button>

                      <Link
                        href={`/mba-specializations/${item.slug}`}
                        className="inline-flex items-center gap-1.5 font-bold text-[#009FE3] hover:text-[#008ec9] group-hover:translate-x-1 transition-all"
                      >
                        <span>View Syllabus</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Program Structure Banner at Bottom */}
      <section className="bg-white border-y border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-sky-50 border border-sky-200 rounded-3xl p-6 sm:p-10">
            <div className="max-w-3xl">
              <span className="text-xs font-bold text-[#009FE3] uppercase tracking-wider">
                SOMS Overview
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Why Pursue an MBA from IGNOU SOMS?
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Indira Gandhi National Open University&apos;s School of Management Studies (SOMS) is one of India&apos;s largest and most reputable business schools. It offers curriculum parity with top Indian institutions while accommodating work schedules with direct admission.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xs font-bold text-slate-400 uppercase">Total Credits</div>
                <div className="text-xl font-black text-slate-900 mt-1">116 Credits</div>
                <div className="text-xs text-slate-500 mt-0.5">28 Courses across 4 Sems</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xs font-bold text-slate-400 uppercase">Economical Fee</div>
                <div className="text-xl font-black text-[#009FE3] mt-1">₹66,000 Total</div>
                <div className="text-xs text-slate-500 mt-0.5">₹15,500/semester installment</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xs font-bold text-slate-400 uppercase">Recognition</div>
                <div className="text-xl font-black text-indigo-700 mt-1">AICTE &amp; UGC-DEB</div>
                <div className="text-xs text-slate-500 mt-0.5">Valid for Govt &amp; MNC jobs</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-xs font-bold text-slate-400 uppercase">Direct Entry</div>
                <div className="text-xl font-black text-emerald-700 mt-1">No Entrance Exam</div>
                <div className="text-xs text-slate-500 mt-0.5">50% in Graduation (45% Reserved)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Need Help Counseling Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-black text-slate-900">
            Confused Between MBA Disciplines?
          </h3>
          <p className="text-sm text-slate-600 mt-2">
            Speak with certified counselors to match your career background with the right IGNOU MBA specialization.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openEnquiryModal("IGNOU MBA Specializations Guidance")}
              className="px-6 py-3 rounded-xl bg-[#009FE3] hover:bg-[#008ec9] text-white text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              Get Free Career Guidance
            </button>
            <a
              href="https://edukyu.com/compare-colleges"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-sm font-bold shadow-2xs transition-all"
            >
              Compare Online MBA Degrees
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

