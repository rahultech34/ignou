"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Building,
  UploadCloud,
  CheckSquare,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { HomeGuideData } from "@/lib/types";
import { openEnquiryModal } from "./EnquiryModal";

interface HomeGuideSectionProps {
  guide?: HomeGuideData;
}

export default function HomeGuideSection({ guide }: HomeGuideSectionProps) {
  // Default fallback data matching the exact content if guide not populated yet
  const data: HomeGuideData = guide || {
    metaTitle: "IGNOU: Courses, Admission, Eligibility and Study Guide",
    metaDescription:
      "Learn about IGNOU, its courses, admission, eligibility, study material and exams. A simple guide to Indira Gandhi National Open University for new students.",
    guideTitle:
      "IGNOU: Courses, Admission, Eligibility and Study Guide for New Students",
    guideIntro:
      "Want a degree but can't attend a regular college? That's the situation millions of learners find themselves in, and it's exactly why IGNOU exists. Indira Gandhi National Open University is India's largest open university, and it offers programmes you can study from home, at your own pace. This guide explains what IGNOU is, which courses it offers, who can apply, how the process works and how to get the best from your studies.",
    whatIsIgnou:
      "IGNOU was established in 1985 by an Act of Parliament, with the aim of making higher education reachable for everyone. Indira Gandhi National Open University serves lakhs of learners across India and abroad through regional centres, study centres and online support. Its degrees are recognised by the UGC-DEB, so they're valid for jobs, promotions and further studies. Add low fees and flexible schedules, and it's easy to see why IGNOU is the first choice for working professionals, homemakers and defence personnel.",
    coursesOffered: {
      intro: "The university offers programmes at nearly every level. Popular options include:",
      items: [
        "Certificate and diploma courses in education, computing, health and more",
        "Undergraduate degrees such as BA, BCom, BSc and BCA",
        "Postgraduate degrees such as MA, MCom, MSc and MCA",
        "Management programmes including MBA and PG diplomas",
        "Doctoral and research programmes in selected subjects",
      ],
      note: "The list changes from session to session, so check the official prospectus before you pick a course.",
    },
    whyChoose: {
      intro:
        "Open and Distance Learning removes the barriers of time, age and location. With IGNOU, you study at your own pace, attend optional counselling sessions at a nearby centre and appear for exams at designated centres. A few of the biggest advantages:",
      items: [
        "Affordable fees compared to regular universities",
        "Flexible duration, with extra time to finish your programme",
        "Study material, e-content and video lectures through digital platforms",
        "Recognised degrees accepted for jobs and higher studies",
        "Admissions twice a year, usually in the January and July sessions",
      ],
    },
    eligibility: {
      intro: "Eligibility differs by programme, so always read the official details. In general:",
      items: [
        "Certificate and diploma: 10th or 12th pass, as specified",
        "Bachelor's degree: 10+2 or equivalent from a recognised board",
        "Master's degree: a bachelor's degree from a recognised university",
        "Some programmes, like MBA or MCA, may have extra requirements",
      ],
      note: "Most programmes have no upper age limit, which makes IGNOU open to lifelong learners.",
    },
    howToApply: {
      steps: [
        "Visit the official admission portal and register with your email and mobile number.",
        "Select your programme and preferred regional centre.",
        "Fill in your personal and academic details carefully.",
        "Upload your photograph, signature and documents in the prescribed size.",
        "Pay the fee online through debit card, credit card or net banking.",
        "Submit the form and save the confirmation.",
      ],
      linkText: "IGNOU",
      linkUrl: "https://ignou.distanceeducationschool.com/",
    },
    documentsRequired: [
      "Class 10 and 12 marksheets",
      "Graduation marksheet, for postgraduate programmes",
      "Recent passport-size photograph and scanned signature",
      "ID proof such as Aadhaar",
      "Category certificate, if required",
    ],
    studyMaterial:
      "Upon entering into the course, you will start to receive the study materials for the courses, generally via computer, but in some courses in paper format. All courses contain assignments, and you will be required to submit the assignments to the centre, and they are marked. At the end of the term, the term-end examination is written. The university will announce the dates of the assignments and the exams, so be sure to check the notices regularly. Most students find that early completion of the assignments greatly reduces the stress of exam time.",
    results:
      "They also publish the results of the term-end exams on the official website of IGNOU after a few weeks of the exams. The result will appear paper-wise, showing the marks of each paper. The grade card is a gift for every student as you need it while applying for a job or further studies. If you find a mistake, report it immediately to your regional centre.",
    regionalCentres:
      "The university has a series of regional and study centres nationwide where you can obtain help, attend counselling and hand in assignments. Other forms of learner support include helplines, email support and a dedicated website for standard questions. Select a centre that is convenient – you'll actually visit it more than you anticipate, particularly during assignment and exam time – and develop a good relationship with your co-ordinator.",
    commonMistakes:
      "Small mistakes lead to big delays. Wrong marks, uploading 2MB of blurry documents or missing a deadline - these are common. Check the programme guide as it will tell you the precise rules regarding eligibility and fees. Never go by unofficial sites for dates, and don't ever pay someone who says he has a shortcut to admission or results.",
    tips: [
      "Apply well before the last date",
      "Prepare electronically scanned documents for the right format",
      "Select a regional centre near to you",
      "Turn in homework on schedule",
      "Check your email and the official website for updates",
    ],
    faqs: [
      {
        question: "Is IGNOU degree valid?",
        answer: "Yes, it's recognised by the UGC-DEB and accepted for jobs and higher studies.",
      },
      {
        question: "Does Indira Gandhi National Open University admit students twice a year?",
        answer: "Yes, admissions are usually held in the January and July sessions. Dates vary, so keep an eye on the official notice.",
      },
      {
        question: "Can I study at IGNOU while working?",
        answer: "Absolutely. The flexible schedule lets you study after work hours and prepare at your own pace.",
      },
    ],
    conclusion:
      "IGNOU is a practical route to a recognised qualification without disturbing your career or family life. Check eligibility, keep your documents ready and apply on time. Start your journey with Indira Gandhi National Open University today.",
  };

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <section id="ignou-student-guide" className="py-16 sm:py-20 bg-slate-50/80 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 text-[#009FE3] border border-sky-200/80 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            Complete Student Guide 2026-27
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {data.guideTitle}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {data.guideIntro}
          </p>
        </div>

        {/* 1. What Is IGNOU & Why Choose IGNOU Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* What is IGNOU Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#009FE3] flex items-center justify-center mb-5 border border-sky-100">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-3">
              What Is IGNOU?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal mb-5">
              {data.whatIsIgnou}
            </p>
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-700 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Established in 1985</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>UGC-DEB Recognised</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Govt Job Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Lakhs of Learners</span>
              </div>
            </div>
          </div>

          {/* Why Choose IGNOU Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 border border-amber-100">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-3">
              Why Choose IGNOU for Distance Learning?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal mb-4">
              {data.whyChoose.intro}
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              {data.whyChoose.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 2. Courses Offered & Eligibility Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Courses Offered */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 border border-indigo-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
              Courses Offered by IGNOU
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              {data.coursesOffered.intro}
            </p>
            <div className="space-y-2.5 mb-5">
              {data.coursesOffered.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-800 font-medium flex items-center gap-2.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 italic bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-amber-900">
              ℹ️ {data.coursesOffered.note}
            </p>
          </div>

          {/* Eligibility for IGNOU Programmes */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
              Eligibility for IGNOU Programmes
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              {data.eligibility.intro}
            </p>
            <div className="space-y-3 mb-5">
              {data.eligibility.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs sm:text-sm text-slate-800 font-medium flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-900 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#009FE3] shrink-0" />
              <span>{data.eligibility.note}</span>
            </div>
          </div>
        </div>

        {/* 3. How to Apply & Documents Required */}
        <div className="bg-gradient-to-br from-[#0b2545] to-[#022859] rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                Admission Portal Process
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                How to Apply for IGNOU Admission
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2">
                Follow these 6 simple steps on the official online portal to secure your seat.
              </p>
            </div>

            {/* Step-by-Step Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {data.howToApply.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-sky-400/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-7 h-7 rounded-xl bg-[#009FE3] text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
                      Step {idx + 1}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Official Link Banner */}
            <div className="p-4 rounded-2xl bg-white/15 border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="text-xs sm:text-sm text-slate-200 text-center sm:text-left">
                For admission help, official registration &amp; latest updates, visit the{" "}
                <Link
                  href={data.howToApply.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#ffcc00] underline hover:text-amber-300 inline-flex items-center gap-1"
                >
                  <span>IGNOU Admission Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>{" "}
                page.
              </div>
              <button
                type="button"
                onClick={() => openEnquiryModal({ source: "Guide - Apply Now" })}
                className="px-5 py-2.5 rounded-xl bg-[#ffcc00] hover:bg-[#e6b800] text-slate-950 font-extrabold text-xs shadow-md transition-all shrink-0 cursor-pointer"
              >
                Get Free Admission Help
              </button>
            </div>

            {/* Documents Required Checklist */}
            <div className="pt-6 border-t border-white/15">
              <h4 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-300" />
                Documents Required for Online Application:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {data.documentsRequired.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 flex items-center gap-2"
                  >
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 4. Academic Lifecycle: Study Material, Results & Regional Centres */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Study Material, Assignments and Exams */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#009FE3] flex items-center justify-center mb-4 border border-sky-100">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Study Material, Assignments &amp; Exams
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {data.studyMaterial}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#009FE3]">
              eGyanKosh digital access + offline evaluation
            </div>
          </div>

          {/* Results and Grade Cards */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Results and Grade Cards
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {data.results}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-amber-700">
              Paper-wise marksheet valid for employment &amp; PG
            </div>
          </div>

          {/* Regional Centres and Learner Support */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Regional Centres &amp; Learner Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {data.regionalCentres}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-indigo-700">
              67+ Regional Centres across all Indian states
            </div>
          </div>

        </div>

        {/* 5. Common Mistakes to Avoid & Tips for Students */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14">
          
          {/* Common Mistakes */}
          <div className="lg:col-span-6 bg-rose-50/60 rounded-3xl p-6 sm:p-8 border border-rose-200/70">
            <div className="flex items-center gap-3 mb-3 text-rose-700">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Common Mistakes to Avoid
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {data.commonMistakes}
            </p>
          </div>

          {/* Tips for Students */}
          <div className="lg:col-span-6 bg-emerald-50/60 rounded-3xl p-6 sm:p-8 border border-emerald-200/70">
            <div className="flex items-center gap-3 mb-3 text-emerald-700">
              <Lightbulb className="w-6 h-6 shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Tips for IGNOU Students
              </h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {data.tips.map((tip, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* 6. Frequently Asked Questions (Interactive Accordion) */}
        <div className="max-w-4xl mx-auto mb-14">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Got Questions?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {data.faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-[#009FE3] text-sm sm:text-base transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. Conclusion CTA Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md text-center max-w-4xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
            Ready to Begin Your Academic Journey?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6">
            {data.conclusion}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => openEnquiryModal({ source: "Guide - Conclusion CTA" })}
              className="px-6 py-3 rounded-xl bg-[#009FE3] hover:bg-[#008ec9] text-white font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Apply for IGNOU Admission 2026-27</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => openEnquiryModal({ course: "Free Career Counseling", source: "Guide - Callback CTA" })}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Request Free Counselor Call
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

