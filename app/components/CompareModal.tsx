"use client";

import React, { useState } from "react";
import { X, Check, ArrowRight, Award, ShieldCheck, DollarSign, BookOpen, Laptop, Scale, Sparkles } from "lucide-react";
import { openEnquiryModal } from "./EnquiryModal";

interface University {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  badge?: string;
  naac: string;
  approvals: string[];
  mbaFee: string;
  bcaFee: string;
  examMode: string;
  studyFormat: string;
  placementSupport: string;
  highlight: string;
  isPopular?: boolean;
}

const UNIVERSITIES: University[] = [
  {
    id: "ignou",
    name: "Indira Gandhi National Open University (IGNOU)",
    shortName: "IGNOU",
    tagline: "World's Largest Open University • Central Govt University",
    badge: "Government Central University",
    naac: "NAAC A++ (Highest Grade)",
    approvals: ["UGC-DEB", "AICTE", "AIU", "COL"],
    mbaFee: "₹62,000 (Total 2 Yrs)",
    bcaFee: "₹46,200 (Total 3 Yrs)",
    examMode: "Offline Pen-Paper (800+ Centers Pan-India) & Online",
    studyFormat: "Printed Books by Post + eGyanKosh Digital LMS",
    placementSupport: "Campus Placement Cell (CPC)",
    highlight: "Most affordable central university degree recognized globally across UPSC, Gov exams & multinational corporations.",
    isPopular: true,
  },
  {
    id: "amity",
    name: "Amity University Online",
    shortName: "Amity Online",
    tagline: "Top Private Online University",
    badge: "Private Recognized",
    naac: "NAAC A+",
    approvals: ["UGC-DEB", "AICTE", "WES"],
    mbaFee: "₹1,99,000 (Total)",
    bcaFee: "₹1,65,000 (Total)",
    examMode: "100% Proctored Online Exams",
    studyFormat: "Interactive LMS & Live Masterclasses",
    placementSupport: "Dedicated Virtual Placement Drives",
    highlight: "Comprehensive corporate placement tie-ups and global live webinars.",
  },
  {
    id: "nmims",
    name: "NMIMS Centre for Distance & Online Education",
    shortName: "NMIMS CDOE",
    tagline: "Premier Brand for Management Programs",
    badge: "Top Business School Brand",
    naac: "NAAC A+",
    approvals: ["UGC-DEB", "AICTE"],
    mbaFee: "₹1,80,000 (Total)",
    bcaFee: "Not Offered (B.Com/BBA ₹1.5L)",
    examMode: "Online Proctored / Designated Exam Centers",
    studyFormat: "Student Portal & Recorded Video Lectures",
    placementSupport: "Job Board & Career Advisory",
    highlight: "High industry reputation for corporate management & executive roles.",
  },
  {
    id: "manipal",
    name: "Manipal University Online (MUJ)",
    shortName: "Manipal Online",
    tagline: "Renowned Higher Education Heritage",
    badge: "UGC Entitled",
    naac: "NAAC A+",
    approvals: ["UGC-DEB", "AICTE"],
    mbaFee: "₹1,75,000 (Total)",
    bcaFee: "₹1,35,000 (Total)",
    examMode: "Web-Proctored Online",
    studyFormat: "Modern LMS with Coursera Certifications",
    placementSupport: "Career Guidance & 500+ Hiring Partners",
    highlight: "Integrated certifications with Coursera and industry project work.",
  },
  {
    id: "dusol",
    name: "School of Open Learning, Delhi University",
    shortName: "DU SOL",
    tagline: "University of Delhi Distance Education",
    badge: "Delhi Univ Constituent",
    naac: "NAAC A++ (DU)",
    approvals: ["UGC-DEB"],
    mbaFee: "₹1,00,000 (Approx)",
    bcaFee: "Not Offered (B.Com ₹25k)",
    examMode: "Physical Exam Centers in Delhi NCR",
    studyFormat: "Study Material from DU SOL Centers & PDF",
    placementSupport: "Limited DU Placement Cells",
    highlight: "Direct University of Delhi stamp on distance degree at economical fees.",
  },
];

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompareModal({ isOpen, onClose }: CompareModalProps) {
  const [selectedU1, setSelectedU1] = useState<string>("ignou");
  const [selectedU2, setSelectedU2] = useState<string>("amity");

  if (!isOpen) return null;

  const u1 = UNIVERSITIES.find((u) => u.id === selectedU1) || UNIVERSITIES[0];
  const u2 = UNIVERSITIES.find((u) => u.id === selectedU2) || UNIVERSITIES[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Content */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10">
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight">Compare Universities Side-by-Side</h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Sparkles className="w-3 h-3" /> 2026-27 Updated
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Analyze Fees, Approvals, NAAC Accreditation, Exam Mode & Value Before Applying
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* University Selector Controls */}
        <div className="grid grid-cols-2 divide-x divide-slate-200 bg-slate-50 border-b border-slate-200 p-3 sm:p-4">
          <div className="pr-2 sm:pr-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Select University 1
            </label>
            <select
              value={selectedU1}
              onChange={(e) => setSelectedU1(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-xs"
            >
              {UNIVERSITIES.map((u) => (
                <option key={u.id} value={u.id} disabled={u.id === selectedU2}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pl-2 sm:pl-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Select University 2 (To Compare)
            </label>
            <select
              value={selectedU2}
              onChange={(e) => setSelectedU2(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-xs"
            >
              {UNIVERSITIES.map((u) => (
                <option key={u.id} value={u.id} disabled={u.id === selectedU1}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Body Table */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Institution Header Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            <div className={`p-4 rounded-xl border ${u1.id === 'ignou' ? 'bg-sky-50/60 border-sky-300 ring-1 ring-sky-200' : 'bg-slate-50 border-slate-200'}`}>
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-600 text-white mb-2">
                {u1.badge}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{u1.shortName}</h4>
              <p className="text-xs text-slate-600 mt-1">{u1.tagline}</p>
            </div>

            <div className={`p-4 rounded-xl border ${u2.id === 'ignou' ? 'bg-sky-50/60 border-sky-300 ring-1 ring-sky-200' : 'bg-slate-50 border-slate-200'}`}>
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-600 text-white mb-2">
                {u2.badge}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{u2.shortName}</h4>
              <p className="text-xs text-slate-600 mt-1">{u2.tagline}</p>
            </div>
          </div>

          {/* Metric Comparison Rows */}
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-sm">
            {/* NAAC Accreditation */}
            <div className="bg-slate-100/70 px-4 py-2 text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-sky-600" /> NAAC Accreditation
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-200 p-3 sm:p-4 bg-white">
              <div className="font-semibold text-slate-800 pr-3">{u1.naac}</div>
              <div className="font-semibold text-slate-800 pl-3">{u2.naac}</div>
            </div>

            {/* Approvals & Recognition */}
            <div className="bg-slate-100/70 px-4 py-2 text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Regulatory Recognitions
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-200 p-3 sm:p-4 bg-white">
              <div className="flex flex-wrap gap-1.5 pr-3">
                {u1.approvals.map((app) => (
                  <span key={app} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-medium">
                    <Check className="w-3 h-3" /> {app}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 pl-3">
                {u2.approvals.map((app) => (
                  <span key={app} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-medium">
                    <Check className="w-3 h-3" /> {app}
                  </span>
                ))}
              </div>
            </div>

            {/* Total MBA Program Fee */}
            <div className="bg-slate-100/70 px-4 py-2 text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-600" /> Total MBA Program Fee
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-200 p-3 sm:p-4 bg-white">
              <div className="font-bold text-sky-700 text-base pr-3">{u1.mbaFee}</div>
              <div className="font-bold text-indigo-700 text-base pl-3">{u2.mbaFee}</div>
            </div>

            {/* Total BCA Program Fee */}
            <div className="bg-slate-100/70 px-4 py-2 text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-600" /> Total BCA / UG Fee
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-200 p-3 sm:p-4 bg-white">
              <div className="font-medium text-slate-800 pr-3">{u1.bcaFee}</div>
              <div className="font-medium text-slate-800 pl-3">{u2.bcaFee}</div>
            </div>

            {/* Examination Mode */}
            <div className="bg-slate-100/70 px-4 py-2 text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-600" /> Examination Mode & Centers
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-200 p-3 sm:p-4 bg-white">
              <div className="text-slate-700 text-xs sm:text-sm pr-3">{u1.examMode}</div>
              <div className="text-slate-700 text-xs sm:text-sm pl-3">{u2.examMode}</div>
            </div>

            {/* Learning Format */}
            <div className="bg-slate-100/70 px-4 py-2 text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-blue-600" /> Learning Material & LMS
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-200 p-3 sm:p-4 bg-white">
              <div className="text-slate-700 text-xs sm:text-sm pr-3">{u1.studyFormat}</div>
              <div className="text-slate-700 text-xs sm:text-sm pl-3">{u2.studyFormat}</div>
            </div>

            {/* Key Highlight */}
            <div className="bg-slate-100/70 px-4 py-2 text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Student Verdict & Best For
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-200 p-3 sm:p-4 bg-white">
              <div className="text-xs text-slate-600 leading-relaxed pr-3">{u1.highlight}</div>
              <div className="text-xs text-slate-600 leading-relaxed pl-3">{u2.highlight}</div>
            </div>
          </div>
        </div>

        {/* Footer Guidance CTA */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 text-center sm:text-left">
            Need personalized admission guidance for July 2026-27 session?
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                openEnquiryModal({ source: "Compare Modal Counseling" });
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Free Career Counseling <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
