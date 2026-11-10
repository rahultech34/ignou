"use client";

import React, { useState } from "react";
import {
  Bell,
  ArrowRight,
  ExternalLink,
  Pause,
  Play,
  CheckCircle2,
  Calendar,
  Award,
  BookOpen,
} from "lucide-react";
import { HomePageData, NewsItem } from "@/lib/types";
import { openEnquiryModal } from "./EnquiryModal";

interface AboutSectionProps {
  homePageData?: HomePageData;
}

const DEFAULT_PARAGRAPHS = [
  "Established in 1985, IGNOU, or Indira Gandhi National Open University, is India's sole national and the world's largest open university. Renowned for its comprehensive range of undergraduate and postgraduate courses. IGNOU is a popular choice for distance and online education.",
  "The university is recognized for offering flexible learning opportunities to students, working professionals, homemakers, and aspirants preparing for competitive examinations. IGNOU regularly updates its curriculum to meet current industry and academic requirements while maintaining affordable and accessible education.",
  "They admit students in January and July sessions and offer over 333 courses in various subjects including Online MBA. It has study centers all over India. They cover subjects like Arts, Commerce, Management, and research programs, providing different interests. Known for its strong educational foundation and supportive faculty, This is a top institution in the field of Online and Distance Education.",
];

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "IGNOU Online Admission Portal for July 2026-27",
    link: "#admission-form",
    isNew: true,
    date: "July 2026-27",
  },
  {
    id: "news-2",
    title: "IGNOU 2026-27 Assignment – Find Course Code, Download & Verify Validity",
    link: "#assignment-status",
    isNew: true,
    date: "Latest",
  },
  {
    id: "news-3",
    title: "IGNOU New Registration for July 2026-27",
    link: "#admission-form",
    isNew: true,
    date: "July 2026-27",
  },
  {
    id: "news-4",
    title: "DEB ID is mandatory for learners enrolling in ODL/Online programmes",
    link: "#deb-guidelines",
    isNew: true,
    date: "UGC-DEB",
  },
  {
    id: "news-5",
    title: "Guidelines and Instructions for Submission of On-Line Examination form Only for ODL & Online Programmes",
    link: "#exam-form",
    isNew: true,
    date: "TEE Exam",
  },
  {
    id: "news-6",
    title: "Date Sheet for Term End Examination (TEE) Released",
    link: "#datesheet",
    isNew: true,
    date: "Important",
  },
  {
    id: "news-7",
    title: "Re-Registration Open for Next Semester / Year Students",
    link: "#re-registration",
    isNew: false,
    date: "Notice",
  },
];

export default function AboutSection({ homePageData }: AboutSectionProps) {
  const [isPaused, setIsPaused] = useState(false);

  const title =
    homePageData?.aboutTitle ||
    "About IGNOU Distance Education – Indira Gandhi National Open University";

  const paragraphs =
    homePageData?.aboutParagraphs && homePageData.aboutParagraphs.length > 0
      ? homePageData.aboutParagraphs
      : DEFAULT_PARAGRAPHS;

  const rawNews =
    homePageData?.latestNews && homePageData.latestNews.length > 0
      ? homePageData.latestNews
      : DEFAULT_NEWS;

  // Duplicate items for continuous seamless vertical marquee
  const tickerItems = [...rawNews, ...rawNews];

  return (
    <section id="about-ignou" className="py-14 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: About IGNOU Text Content */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-4 sm:space-y-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b2545] tracking-tight leading-snug">
                {title}
              </h2>
            </div>

            <div className="space-y-3.5 text-slate-600 text-[14.5px] sm:text-[15px] leading-relaxed">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="font-normal text-justify sm:text-left">
                  {p}
                </p>
              ))}
            </div>

            {/* Trust Highlights Badges */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Est. 1985</div>
                  <div className="text-[10.5px] text-slate-500">40+ Yrs Legacy</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-extrabold text-slate-900">UGC-DEB & AICTE</div>
                  <div className="text-[10.5px] text-slate-500">Govt Recognized</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <div className="text-xs font-extrabold text-slate-900">333+ Programs</div>
                  <div className="text-[10.5px] text-slate-500">Degree & Diplomas</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Latest News Upward Scrolling Box */}
          <div className="lg:col-span-5 xl:col-span-5 w-full">
            <div className="rounded-2xl border border-sky-100 bg-white shadow-xl shadow-slate-900/5 overflow-hidden flex flex-col">
              
              {/* Box Header */}
              <div className="bg-gradient-to-r from-sky-50 via-white to-sky-50/60 px-5 py-4 border-b border-sky-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <h3 className="text-lg font-black text-[#0b2545] tracking-tight">
                    Latest News
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400">
                    Hover to pause
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPaused(!isPaused)}
                    title={isPaused ? "Resume auto scroll" : "Pause auto scroll"}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Ticker Viewport with Top & Bottom Gradients */}
              <div className="relative h-[340px] sm:h-[355px] overflow-hidden bg-slate-50/30 group">
                {/* Top Subtle Fade */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white via-white/80 to-transparent z-10" />

                {/* Vertical Upward Scrolling Track */}
                <div
                  className={`animate-marquee-up flex flex-col ${
                    isPaused ? "[animation-play-state:paused]" : ""
                  }`}
                  style={{ willChange: "transform" }}
                >
                  {tickerItems.map((item, index) => (
                    <a
                      key={`${item.id}-${index}`}
                      href={item.link || "#admission-form"}
                      className="p-3.5 sm:p-4 border-b border-slate-100 hover:bg-sky-50/70 transition-colors flex items-start gap-2.5 group/news block"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] sm:text-[13.5px] font-medium text-slate-800 group-hover/news:text-[#009FE3] leading-snug transition-colors">
                          <span>{item.title}</span>
                          {item.isNew && (
                            <span className="inline-block ml-2 px-1.5 py-0.5 text-[10px] font-black rounded bg-amber-400 text-slate-950 uppercase tracking-wide shrink-0 shadow-2xs">
                              New
                            </span>
                          )}
                        </div>
                        {item.date && (
                          <div className="mt-1 text-[11px] font-semibold text-slate-400">
                            {item.date}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 -translate-x-1 group-hover/news:opacity-100 group-hover/news:translate-x-0 group-hover/news:text-[#009FE3] transition-all shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>

                {/* Bottom Subtle Fade */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
              </div>

              {/* Box Footer Action */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium text-[11.5px]">
                  Updated live from IGNOU official circulars
                </span>
                <button
                  type="button"
                  onClick={() => openEnquiryModal({ course: "General Admission", source: "About IGNOU Live Circulars" })}
                  className="font-bold text-[#009FE3] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
