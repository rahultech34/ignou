"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, BookOpen, GraduationCap, FileText, ArrowRight, Sparkles, ExternalLink } from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  category: "Distance Program" | "Online Program" | "Student Portal" | "Guide / Blog";
  badge?: string;
  description: string;
  url: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  {
    id: "ignou-mba",
    title: "Master of Business Administration (MBA)",
    category: "Distance Program",
    badge: "AICTE Approved",
    description: "2-year program, AICTE approved, specializations in Finance, Marketing, HR, Operations.",
    url: "#course-mba",
  },
  {
    id: "ignou-online-mba",
    title: "IGNOU Online MBA (100% Digital LMS)",
    category: "Online Program",
    badge: "UGC Entitled",
    description: "Complete MBA fully online with e-tutorials, live discussion forums, and continuous e-assessment.",
    url: "#online-mba",
  },
  {
    id: "ignou-bca",
    title: "Bachelor of Computer Applications (BCA)",
    category: "Distance Program",
    badge: "3-Year UG",
    description: "Comprehensive software engineering, web tech, C, Java, Python, and system design.",
    url: "#course-bca",
  },
  {
    id: "ignou-mca",
    title: "Master of Computer Applications (MCA)",
    category: "Distance Program",
    badge: "2-Year PG",
    description: "Advanced computing, AI, Cloud, algorithms, and capstone software project.",
    url: "#course-mca",
  },
  {
    id: "ignou-online-bca",
    title: "Online BCA (Digital Learning Mode)",
    category: "Online Program",
    badge: "Online Mode",
    description: "Modern computer curriculum designed for remote working professionals and school leavers.",
    url: "#online-bca",
  },
  {
    id: "ignou-bcom",
    title: "Bachelor of Commerce (B.Com - General & Online)",
    category: "Distance Program",
    badge: "Popular UG",
    description: "Accounting, corporate law, taxation, business economics, and financial audits.",
    url: "#course-bcom",
  },
  {
    id: "ignou-ma-english",
    title: "Master of Arts in English (MEG)",
    category: "Distance Program",
    badge: "High Enrolment",
    description: "British literature, American poetry, linguistics, Indian English writing, literary criticism.",
    url: "#course-meg",
  },
  {
    id: "service-hall-ticket",
    title: "Download Hall Ticket / Admit Card (TEE)",
    category: "Student Portal",
    badge: "Direct Link",
    description: "Instant download for upcoming Term-End Examination admit cards with 9-digit enrollment number.",
    url: "#hall-ticket",
  },
  {
    id: "service-assignments",
    title: "Assignment Question Papers & Submission Status",
    category: "Student Portal",
    badge: "Essential",
    description: "Check 30% weightage assignment submission status, regional center submission instructions & marks.",
    url: "#assignments",
  },
  {
    id: "service-grade-card",
    title: "Check Grade Card & TEE Examination Result",
    category: "Student Portal",
    badge: "Result Portal",
    description: "Updated grade card status for theory, practical, project work and assignments pan-India.",
    url: "#grade-card",
  },
  {
    id: "service-reregistration",
    title: "Re-Registration for Next Semester / Year",
    category: "Student Portal",
    badge: "Samarth Portal",
    description: "Direct portal to register for next year/semester course modules before deadline.",
    url: "#re-registration",
  },
  {
    id: "service-egyankosh",
    title: "eGyanKosh Free Study Material & Books (PDF)",
    category: "Student Portal",
    badge: "Free Resources",
    description: "Official National Digital Repository for IGNOU self-learning course materials.",
    url: "#egyankosh",
  },
  {
    id: "guide-passing-marks",
    title: "IGNOU Passing Marks & 10-Point Grading System Explained",
    category: "Guide / Blog",
    badge: "Student Guide",
    description: "Detailed breakdown of 35% vs 40% rule in assignments and term-end examinations.",
    url: "#passing-marks",
  },
  {
    id: "guide-admission-2026",
    title: "Step-by-Step IGNOU Fresh Admission Process 2026-27",
    category: "Guide / Blog",
    badge: "Updated",
    description: "Eligibility criteria, document upload specifications, admission fees, and regional center selection.",
    url: "#admission-guide",
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = query.trim() === ""
    ? SEARCH_ITEMS.slice(0, 8)
    : SEARCH_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200">
          <Search className="w-5 h-5 text-sky-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search distance courses, online programs, hall tickets, assignments..."
            className="w-full text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-300 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Quick Suggestion Categories */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto text-xs font-medium text-slate-600">
          <span className="text-slate-400 font-semibold shrink-0">Popular:</span>
          {["MBA", "BCA", "Hall Ticket", "Assignments", "Grade Card", "Re-Registration"].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-sky-500 hover:text-sky-600 transition-colors shrink-0"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 p-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={onClose}
                className="group flex items-start justify-between gap-3 p-3 rounded-xl hover:bg-sky-50/70 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-sky-100 text-sky-700 group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
                    {item.category.includes("Program") ? (
                      <GraduationCap className="w-4 h-4" />
                    ) : item.category.includes("Portal") ? (
                      <BookOpen className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 group-hover:text-sky-700 transition-colors">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-800">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.description}</p>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1 inline-block">
                      {item.category}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
              </a>
            ))
          ) : (
            <div className="text-center py-10 px-4 text-slate-500">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-medium text-sm">No exact matches found for &quot;{query}&quot;</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for MBA, MCA, BCA, assignment, or syllabus
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Click any item or press Enter to navigate</span>
          <span className="hidden sm:inline font-mono">Press Esc to close</span>
        </div>
      </div>
    </div>
  );
}
