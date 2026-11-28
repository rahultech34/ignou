"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Award,
  CheckCircle,
  ArrowRight,
  BookOpen,
  FileText,
  Clock,
  Phone
} from "lucide-react";
import { HomePageData, Program, SiteSettings } from "@/lib/types";
import AboutSection from "./AboutSection";
import CertificateSection from "./CertificateSection";
import ApplicationProcessSection from "./ApplicationProcessSection";
import { openEnquiryModal } from "./EnquiryModal";
import { AdmissionForm } from "@/components/public/AdmissionForm";

interface HeroSectionProps {
  onOpenSearch?: () => void;
  homePageData?: HomePageData;
  programsList?: Program[];
  settings?: SiteSettings;
}

export default function HeroSection({
  homePageData,
  programsList,
}: HeroSectionProps) {
  const [selectedStream, setSelectedStream] = useState("all");
  const [courseSearch] = useState("");

  // Priority 1: Data from Cloud Firestore (DB) with reliable defaults
  const heroHeadline =
    homePageData?.heroHeadline ||
    "Empower Your Career with IGNOU Distance & Online Degrees";
  const heroSubtitle =
    homePageData?.heroSubtitle ||
    "Admissions open for July 2026-27 academic session. Choose from 150+ UGC-DEB recognized degree programs with flexible self-paced learning and pan-India exam centers.";
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
      {/* 1. HERO BANNER WITH ADMISSION FORM */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-10 sm:pt-14 pb-16">
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

        <div className="site-container relative z-10">
          <div className="site-grid items-center">
            
            {/* Left Column: Heading, Value Props & Stats */}
            <div className="col-span-4 md:col-span-8 lg:col-span-7 flex flex-col items-start text-left">
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
              </div>
            </div>

            {/* Right Column: Unified AdmissionForm Card */}
            <div id="admission-form" className="col-span-4 md:col-span-8 lg:col-span-5 w-full flex justify-center lg:justify-end pt-2 sm:pt-3 lg:pt-0 scroll-mt-28">
              <AdmissionForm
                formTitle="Book 100% Free Counseling"
                formSubtitle={formSubheading}
                source="Home Hero Form"
                defaultCourse="MBA"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. STUDENT UTILITIES QUICK STRIP */}
      <div className="site-container -mt-4 relative z-20">
        <section className="bg-white border border-slate-200/80 py-5 sm:py-6 rounded-2xl shadow-lg shadow-slate-900/5 px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6 text-center md:divide-x divide-slate-100">
            <a href="#hall-ticket" className="p-2 group flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 mt-2 group-hover:text-sky-600">
                Hall Ticket TEE
              </span>
              <span className="text-[10px] text-slate-400">Download Admit Card</span>
            </a>

            <a href="#assignments" className="p-2 group flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 mt-2 group-hover:text-emerald-600">
                Assignment Status
              </span>
              <span className="text-[10px] text-slate-400">Question Paper & Marks</span>
            </a>

            <a href="#grade-card" className="p-2 group flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 mt-2 group-hover:text-amber-600">
                Grade Card & Result
              </span>
              <span className="text-[10px] text-slate-400">Check Marks & Status</span>
            </a>

            <a href="#re-registration" className="p-2 group flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#009FE3] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#009FE3] group-hover:text-white transition-all">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 mt-2 group-hover:text-[#009FE3]">
                Re-Registration
              </span>
              <span className="text-[10px] text-slate-400">Samarth Portal</span>
            </a>

            <a href="#egyankosh" className="col-span-2 md:col-span-1 p-2 group flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 mt-2 group-hover:text-blue-600">
                eGyanKosh Books
              </span>
              <span className="text-[10px] text-slate-400">Free PDF Downloads</span>
            </a>
          </div>
        </section>
      </div>

      {/* 2.5 ABOUT IGNOU & LATEST NEWS TICKER SECTION */}
      <AboutSection homePageData={homePageData} />

      {/* 2.6 ELIGIBILITY CRITERIA & DEGREE CERTIFICATE SECTION */}
      <CertificateSection admissionYear="2026" />

      {/* 3. POPULAR COURSES EXPLORER */}
      <section className="site-container py-14 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Explore Popular IGNOU Degree Programs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              All courses are recognized by UGC-DEB for government jobs, exams & higher education.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex sm:flex-wrap gap-1.5 bg-slate-200/70 p-1.5 rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar max-w-full">
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
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-[1920px]:grid-cols-4 site-gutter">
          {filteredCourses.map((c) => (
            <div
              key={c.code}
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{c.code} • {c.level} • {c.mode}</p>

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
          ))}
        </div>
      </section>

      {/* 3.5 IGNOU APPLICATION PROCESS FLOW */}
      <ApplicationProcessSection />
    </div>
  );
}
