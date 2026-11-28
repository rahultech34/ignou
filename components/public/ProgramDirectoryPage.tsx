"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
} from "lucide-react";
import { Program } from "@/lib/types";
import { openEnquiryModal } from "@/app/components/EnquiryModal";

interface ProgramDirectoryPageProps {
  type?: "all" | "ug" | "pg" | "mba";
  programs: Program[];
}

export function ProgramDirectoryPage({
  type = "all",
  programs,
}: ProgramDirectoryPageProps) {
  const [selectedType, setSelectedType] = useState<string>(type);
  const [searchQuery, setSearchQuery] = useState("");

  const pageTitle =
    selectedType === "ug"
      ? "Undergraduate (UG) Programs"
      : selectedType === "pg"
        ? "Postgraduate (PG) Programs"
        : selectedType === "mba"
          ? "Management & MBA Programs"
          : "Explore All IGNOU Degree Programs";

  const pageSubtitle =
    selectedType === "ug"
      ? "Explore UGC-DEB recognized Bachelor degrees (BCA, B.Com, BA, B.Sc, BLIS) with self-paced learning and pan-India study centers."
      : selectedType === "pg"
        ? "Advance your career with UGC-DEB & AICTE approved Master degrees (MBA, MCA, M.Com, MA, M.Sc) for working professionals."
        : selectedType === "mba"
          ? "AICTE-approved Distance & Online MBA programs with cutting-edge curriculum and affordable installment plans."
          : "Choose from over 150+ UGC-DEB and AICTE recognized distance & online programs for January and July 2026-27 admission sessions.";

  const filteredPrograms = programs.filter((prog) => {
    const matchesType =
      selectedType === "all" ||
      prog.type === selectedType ||
      (selectedType === "mba" &&
        (prog.type === "mba" || prog.code.toUpperCase().includes("MBA")));

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      prog.title.toLowerCase().includes(query) ||
      prog.code.toLowerCase().includes(query) ||
      (prog.overview && prog.overview.toLowerCase().includes(query));

    return matchesType && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-14 sm:py-20">
        <Image
          src="/IGNOU-img.webp"
          alt="Indira Gandhi National Open University (IGNOU)"
          fill
          sizes="100vw"
          quality={75}
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-950/75" />

        <div className="site-container text-center relative z-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {pageTitle}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {pageSubtitle}
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course name or code (e.g. MBA, BCA, B.Com)..."
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
      <section className="bg-white border-b border-slate-200/80 sticky top-[60px] sm:top-[65px] z-30 shadow-xs">
        <div className="site-container">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-3 no-scrollbar">
            {[
              { id: "all", label: "All Programs", icon: GraduationCap },
              { id: "ug", label: "Undergraduate (UG)", icon: GraduationCap },
              { id: "pg", label: "Postgraduate (PG)", icon: BookOpen },
              { id: "mba", label: "Management (MBA)", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedType(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${isActive
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
        <div className="site-container">
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
              <GraduationCap className="w-12 h-12 text-[#009FE3] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900">No Programs Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                We couldn&apos;t find any programs matching your search query. Try searching for a different keyword.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                }}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#009FE3] text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-[1920px]:grid-cols-4 site-gutter">
            {filteredPrograms.map((prog) => {
                return (
                  <div
                    key={prog.id}
                    className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Accent Strip */}
                      <div className="h-1.5 w-full bg-gradient-to-r from-[#009FE3] via-sky-500 to-[#0b2545]" />

                      <div className="p-6">
                        {/* Title */}
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#009FE3] transition-colors leading-snug">
                          <Link href={`/programs/${prog.slug}`}>{prog.title}</Link>
                        </h2>

                        {/* Description */}
                        <p className="mt-2 text-xs sm:text-[13px] text-slate-600 line-clamp-3 leading-relaxed">
                          {prog.shortDescription || prog.overview}
                        </p>

                        {/* Info List */}
                        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Program Code:</span>
                            <span className="font-bold text-slate-800">{prog.code}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-slate-500">
                              <Clock className="w-3.5 h-3.5 text-slate-400" /> Duration:
                            </span>
                            <span className="font-bold text-slate-800">{prog.duration}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Total Course Fee:</span>
                            <span className="font-extrabold text-[#009FE3] text-sm">
                              {prog.fee}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Mode:</span>
                            <span className="font-medium text-slate-700">{prog.mode}</span>
                          </div>

                          <div className="pt-1">
                            <div className="text-[11px] text-slate-400">Eligibility:</div>
                            <div className="font-medium text-slate-800 truncate text-[12px]">
                              {prog.eligibility}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          openEnquiryModal({
                            course: prog.code,
                            source: `Program Directory - ${prog.code}`,
                          })
                        }
                        className="px-3 py-1.5 rounded-lg bg-[#ffcc00] hover:bg-[#ffb700] text-slate-950 font-bold shadow-xs hover:shadow transition-all cursor-pointer"
                      >
                        Enquire
                      </button>

                      <Link
                        href={`/programs/${prog.slug}`}
                        className="font-bold text-[#009FE3] hover:text-[#008ec9] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        <span>Course Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

