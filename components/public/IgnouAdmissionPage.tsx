"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdmissionForm } from "@/components/public/AdmissionForm";

const WHY_CHOOSE_ITEMS = [
  {
    label: "Flexibility",
    text: "Study at your own pace without leaving your job.",
  },
  {
    label: "Affordability",
    text: "Fees are generally lower than those of many regular colleges.",
  },
  {
    label: "Wide choice",
    text: "Programmes span management, commerce, arts, science, education and more.",
  },
  {
    label: "Recognised institution",
    text: "IGNOU is a central university with decades of experience.",
  },
  {
    label: "Open access",
    text: "Many programmes welcome learners who could not continue earlier.",
  },
];

const REQUIRED_DOCUMENTS = [
  "Recent passport-size photograph",
  "Scanned signature",
  "Photo ID proof",
  "Mark sheets and certificates of qualifying examinations",
  "Category or other certificates, if applicable",
];

const ADMISSION_STEPS = [
  "Visit the official IGNOU admission portal and register with a valid email address and mobile number.",
  "Log in and select the programme you want to join.",
  "Fill in your academic and personal details carefully.",
  "Upload your photograph, signature, ID proof and certificates.",
  "Pay the programme fee online using the payment options available.",
  "Submit the form and download the confirmation for your records.",
];

const COMMON_MISTAKES = [
  "Choosing a programme without reading its eligibility rules",
  "Uploading blurred or wrongly sized documents",
  "Entering an email address or mobile number you rarely check",
  "Missing the last date and waiting for an extension",
  "Forgetting to save the confirmation after payment",
];

const APPLICATION_TIPS = [
  {
    title: "Read the prospectus first.",
    desc: "It lists programmes, rules and dates.",
  },
  {
    title: "Prepare documents early.",
    desc: "Ready scans make IGNOU Online Admission quicker to complete.",
  },
  {
    title: "Double-check details.",
    desc: "Names and dates should match your certificates.",
  },
  {
    title: "Apply before the deadline.",
    desc: "Early applications leave time to fix errors.",
  },
  {
    title: "Track your status.",
    desc: "Log in regularly to see updates and messages.",
  },
];

const FAQS = [
  {
    question: "Q1. Who can apply for IGNOU Admission?",
    answer:
      "Learners who meet the eligibility rules of their chosen programme can apply. Requirements differ for certificate, diploma, undergraduate and postgraduate courses.",
  },
  {
    question: "Q2. How does IGNOU Online Admission work?",
    answer:
      "Register on the official portal, select a programme, fill in details, upload documents, pay the fee and submit the form.",
  },
  {
    question: "Q3. When does admission open?",
    answer:
      "IGNOU has traditionally admitted learners in two cycles, around January and July. Always check official notices for exact dates.",
  },
  {
    question: "Q4. Which documents are needed?",
    answer:
      "You typically need a photograph, signature, ID proof and mark sheets, plus any category certificate if applicable.",
  },
  {
    question: "Q5. Do I need to attend regular classes?",
    answer:
      "Most programmes are distance based, so regular attendance is not required. Counselling sessions are available to support you.",
  },
];

export function IgnouAdmissionPage() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (!isPopupOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsPopupOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPopupOpen]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-900">
      {/* 1. FULL-WIDTH HERO BANNER (Reference Layout + Local Public Image) */}
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

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white leading-tight">
            IGNOU Admission: A Complete Guide for Learners and Working Professionals
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-3xl mx-auto leading-relaxed">
            Not everyone can attend a full-time college. Some learners work, some live far from a campus, and others are returning to study after a long break. For all of them, Indira Gandhi National Open University (IGNOU) offers a flexible route to a recognised degree. This guide explains how IGNOU Admission works, who can apply, which documents you need and how to complete the process online without confusion.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsPopupOpen(true)}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#ffcc00] hover:bg-[#eab308] text-[#0b2545] text-xs sm:text-sm font-extrabold shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Apply for IGNOU Admission
            </button>
          </div>
        </div>
      </section>

      {/* 2. TWO-COLUMN BODY SECTION (8 Cols Content + 4 Cols Sticky Form) */}
      <section className="py-10 sm:py-14 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT COLUMN: Structured Guide Content */}
            <article className="lg:col-span-8 space-y-6">
              {/* What Is IGNOU Admission? */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  What Is IGNOU Admission?
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  IGNOU is a central university known for open and distance learning. IGNOU Admission is the process through which learners enrol in its certificate, diploma, undergraduate and postgraduate programmes. Most programmes do not require you to attend regular classes. Instead, you study from provided material, submit assignments, attend optional counselling sessions and appear for term-end examinations.
                </p>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  This format makes the university popular with working professionals, homemakers, government employees and learners from small towns.
                </p>
              </div>

              {/* Why Choose IGNOU for Higher Education? */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Why Choose IGNOU for Higher Education?
                </h2>
                <ul className="space-y-3">
                  {WHY_CHOOSE_ITEMS.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm sm:text-base text-slate-700"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
                      <span>
                        <strong className="text-slate-900">{item.label}:</strong> {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Programmes You Can Apply For & Eligibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Programmes You Can Apply For
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    The university typically offers programmes at several levels, including certificates, diplomas, bachelor’s degrees and master’s degrees. Popular choices include BA, BCom, MA, MCom and MBA. The list of programmes and the mode of study can change each session, so check the official prospectus for the current options.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Eligibility for IGNOU Admission
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Eligibility depends on the programme. In general, undergraduate programmes ask for completion of senior secondary education, while postgraduate programmes ask for a bachelor’s degree from a recognised university. Some programmes may have minimum-mark rules or extra requirements. Always read the eligibility section for your chosen course before you pay any fee.
                  </p>
                </div>
              </div>

              {/* Documents Required */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Documents Required
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Keep clear scanned copies of the following ready before you start:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {REQUIRED_DOCUMENTS.map((doc) => (
                    <li
                      key={doc}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-sm font-medium text-slate-800"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                  Check the size and format limits mentioned on the portal, because uploads that do not match can be rejected.
                </p>
              </div>

              {/* How IGNOU Online Admission Works */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    How IGNOU Online Admission Works
                  </h2>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    IGNOU Online Admission is done through the official admission portal, so you can apply from home. The steps usually look like this:
                  </p>
                </div>

                <ol className="space-y-3">
                  {ADMISSION_STEPS.map((step, index) => (
                    <li
                      key={step}
                      className="flex items-start gap-3.5 p-3.5 rounded-xl bg-sky-50/50 border border-sky-100"
                    >
                      <span className="w-7 h-7 rounded-full bg-[#009FE3] text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm sm:text-base text-slate-800 leading-relaxed">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="space-y-2 pt-1 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <p>
                    IGNOU has traditionally opened admissions in two cycles, usually around January and July, with exact dates announced each session. Check official notifications regularly so you do not miss the window.
                  </p>
                  <p>
                    For more details on courses and the application process, you can also visit this guide to{" "}
                    <Link
                      href="/programs"
                      className="font-bold text-[#009FE3] hover:underline"
                    >
                      IGNOU Admission
                    </Link>
                    .
                  </p>
                </div>
              </div>

              {/* Study Material & Examinations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Study Material and Learner Support
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    After you enrol, you receive access to study material prepared for each course. Many learners find printed or digital units easy to follow because they are written for self-study. Assignments help you practise what you learn, and counselling sessions at study centres give you a chance to ask questions and meet other learners. A learner portal and helpline channels also help with queries about registration, results and re-registration.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Examinations and Evaluation
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Evaluation usually combines assignments with term-end examinations. Assignments are submitted by a set date, and examination schedules are published by the university. Plan your revision around these dates, and keep your enrolment number handy, since you will need it for forms, hall tickets and results.
                  </p>
                </div>
              </div>

              {/* Who Should Consider & Fees */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Who Should Consider This Route?
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Distance learning suits people who value independence and can manage time well. It works especially well for professionals who want a promotion-linked degree, homemakers returning to study, and learners from regions with few colleges. If you prefer daily classroom interaction, plan extra time for self-study and use the counselling sessions.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Fees and Payment
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Fees vary by programme and session, and they may be payable in one instalment or in parts. During IGNOU Online Admission, pay only through the official portal and keep the payment receipt safe. Confirm the latest fee structure in the prospectus, since amounts and payment rules are updated from time to time.
                  </p>
                </div>
              </div>

              {/* Common Mistakes & Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-rose-200/80 shadow-xs space-y-4">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Common Mistakes to Avoid
                  </h2>
                  <ul className="space-y-2.5 text-sm text-slate-700">
                    {COMMON_MISTAKES.map((mistake) => (
                      <li key={mistake} className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-2" />
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-sky-200/80 shadow-xs space-y-4">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Tips for a Smooth Application
                  </h2>
                  <ol className="space-y-2.5 text-sm text-slate-700">
                    {APPLICATION_TIPS.map((tip, idx) => (
                      <li key={tip.title} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>
                          <strong className="text-slate-900">{tip.title}</strong> {tip.desc}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Final Thoughts */}
              <div className="bg-gradient-to-br from-[#0b2545] to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Final Thoughts on IGNOU Admission
                </h2>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  If you want a recognised qualification without giving up your job or relocating, IGNOU Admission is a practical option. The process is simple when you plan ahead, understand the eligibility rules and keep your documents ready.
                </p>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  Before you begin IGNOU Online Admission, check the current programme list, fees and last dates on the official IGNOU website. With careful preparation, you can complete the application in one sitting and focus on your studies.
                </p>
                <p className="text-sm sm:text-base text-sky-200 font-semibold leading-relaxed">
                  If you are ready, choose your programme, gather your documents and apply before the deadline. Starting early makes IGNOU Admission stress-free and gives you more time to settle into your course.
                </p>
              </div>

              {/* Frequently Asked Questions (FAQs) */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Frequently Asked Questions (FAQs)
                </h2>

                <div className="space-y-3">
                  {FAQS.map((faq, idx) => {
                    const isOpen = openFaqIdx === idx;
                    return (
                      <div
                        key={faq.question}
                        className="rounded-xl border border-slate-200 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between gap-3 p-4 text-left bg-slate-50/70 hover:bg-sky-50/50 transition-colors cursor-pointer"
                        >
                          <span className="font-bold text-sm sm:text-base text-slate-900">
                            {faq.question}
                          </span>
                          <span className="text-lg font-bold text-[#009FE3] shrink-0 leading-none">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="p-4 bg-white border-t border-slate-100 text-sm text-slate-700 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>

            {/* RIGHT COLUMN: Sticky Counseling Form Sidebar */}
            <aside
              id="admission-form"
              className="lg:col-span-4 lg:sticky lg:top-[96px] self-start z-20 w-full max-w-[380px] mx-auto lg:ml-auto scroll-mt-28"
            >
              <AdmissionForm
                formTitle="Book 100% Free Counseling"
                formSubtitle="Get 1 to 1 Expert Guidance for IGNOU Admission"
                source="IGNOU Admission Page Sidebar"
                defaultCourse="MBA"
              />
            </aside>
          </div>
        </div>
      </section>

      {/* POPUP MODAL FOR THIS PAGE'S FORM */}
      {isPopupOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="IGNOU Admission Counseling Form"
          onClick={() => setIsPopupOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[390px] max-h-[92dvh] overflow-y-auto overscroll-contain"
          >
            <button
              type="button"
              onClick={() => setIsPopupOpen(false)}
              aria-label="Close form popup"
              className="absolute right-3 top-3 z-10 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base leading-none flex items-center justify-center cursor-pointer"
            >
              ×
            </button>
            <AdmissionForm
              formTitle="Book 100% Free Counseling"
              formSubtitle="Get 1 to 1 Expert Guidance for IGNOU Admission"
              source="IGNOU Admission Hero Popup"
              defaultCourse="MBA"
            />
          </div>
        </div>
      )}
    </div>
  );
}
