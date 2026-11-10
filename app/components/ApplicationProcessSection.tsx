"use client";

import React from "react";
import { Globe, ArrowRight, HelpCircle } from "lucide-react";
import { openEnquiryModal } from "./EnquiryModal";

interface StepItem {
  number: number;
  title: string;
  desc: string;
  color: string;
  badgeBg: string;
}

const STEPS: StepItem[] = [
  {
    number: 1,
    title: "Official Website",
    desc: 'Visit the IGNOU official website and navigate to the "Admission" section.',
    color: "#e91e63", // Pink / Rose
    badgeBg: "bg-[#e91e63]",
  },
  {
    number: 2,
    title: "Register",
    desc: "Register as a new user and you will receive login credentials",
    color: "#2563eb", // Blue
    badgeBg: "bg-[#2563eb]",
  },
  {
    number: 3,
    title: "Form Fill up",
    desc: "Fill out the online application form with accurate personal and academic information.",
    color: "#eab308", // Yellow / Gold
    badgeBg: "bg-[#eab308]",
  },
  {
    number: 4,
    title: "Document Upload",
    desc: "Upload required documents, such as scanned copies of certificates and photographs,",
    color: "#9333ea", // Purple
    badgeBg: "bg-[#9333ea]",
  },
  {
    number: 5,
    title: "Application Fee",
    desc: "Pay the application fee through the provided payment options.",
    color: "#16a34a", // Green
    badgeBg: "bg-[#16a34a]",
  },
  {
    number: 6,
    title: "Submit Form",
    desc: "Submit your application then you will receive a confirmation email",
    color: "#ea580c", // Orange
    badgeBg: "bg-[#ea580c]",
  },
  {
    number: 7,
    title: "Save & Print",
    desc: "For Your Future reference Save and Print the Application Form",
    color: "#1e3a8a", // Dark Blue / Navy
    badgeBg: "bg-[#1e3a8a]",
  },
];

export default function ApplicationProcessSection() {
  return (
    <section
      id="application-process"
      className="py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50/60 to-white border-b border-slate-200/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-snug">
            <span className="text-slate-900">IGNOU </span>
            <span className="text-[#003b71]">Application Process</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
            Easy 7-step guide to complete your online application form on the official IGNOU Samarth admission portal.
          </p>
        </div>

        {/* DESKTOP VIEW: Zigzag Staggered Flow (Hidden on mobile/tablet, visible on lg+) */}
        <div className="hidden lg:block relative pb-10">
          
          {/* 7-Column Grid */}
          <div className="grid grid-cols-7 gap-3 xl:gap-4 relative z-10 items-start">
            {STEPS.map((step, idx) => {
              const isEven = step.number % 2 === 0;
              return (
                <div
                  key={step.number}
                  className={`relative flex flex-col items-center transition-transform duration-300 hover:-translate-y-1 ${
                    isEven ? "mt-16 xl:mt-20" : "mt-0"
                  }`}
                >
                  {/* Step Card */}
                  <div className="w-full bg-white rounded-2xl p-4 xl:p-5 shadow-lg shadow-slate-200/60 border border-slate-100 flex flex-col items-center text-center relative group min-h-[220px]">
                    
                    {/* Outline Step Number on Top-Left */}
                    <div className="absolute -top-3 left-2 xl:left-3">
                      <span
                        className="text-4xl xl:text-5xl font-black select-none tracking-tighter"
                        style={{
                          WebkitTextStroke: `2px ${step.color}`,
                          color: "transparent",
                        }}
                      >
                        {step.number}
                      </span>
                    </div>

                    {/* Top Globe Badge */}
                    <div
                      className={`w-11 h-11 rounded-2xl ${step.badgeBg} text-white flex items-center justify-center shadow-md mb-3 -mt-2 group-hover:scale-110 transition-transform`}
                    >
                      <Globe className="w-6 h-6 stroke-[2.2]" />
                    </div>

                    {/* Step Title */}
                    <h3 className="text-sm xl:text-[15px] font-bold text-slate-900 leading-tight mb-2">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-[11px] xl:text-xs text-slate-500 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Dotted connecting line to next step */}
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`absolute pointer-events-none z-0 hidden xl:block ${
                        isEven
                          ? "-right-6 top-8 w-12 h-14 border-t-2 border-r-2"
                          : "-right-6 bottom-8 w-12 h-14 border-b-2 border-r-2"
                      }`}
                      style={{
                        borderColor: step.color,
                        borderStyle: "dotted",
                        borderWidth: "2px",
                        opacity: 0.7,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE & TABLET VIEW: Responsive Vertical Stepper (Visible below lg) */}
        <div className="lg:hidden space-y-4 max-w-xl mx-auto">
          {STEPS.map((step, idx) => (
            <div
              key={step.number}
              className="relative bg-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-100 flex items-start gap-4 transition-all hover:shadow-lg"
            >
              {/* Left Column: Number + Badge */}
              <div className="flex flex-col items-center shrink-0">
                <span
                  className="text-3xl font-black select-none leading-none mb-2"
                  style={{
                    WebkitTextStroke: `2px ${step.color}`,
                    color: "transparent",
                  }}
                >
                  {step.number}
                </span>

                <div
                  className={`w-10 h-10 rounded-xl ${step.badgeBg} text-white flex items-center justify-center shadow-xs`}
                >
                  <Globe className="w-5 h-5 stroke-[2.2]" />
                </div>

                {/* Connecting dashed line to next item */}
                {idx < STEPS.length - 1 && (
                  <div
                    className="w-0.5 h-6 mt-3 border-l-2"
                    style={{
                      borderColor: step.color,
                      borderStyle: "dashed",
                    }}
                  />
                )}
              </div>

              {/* Right Column: Title & Description */}
              <div className="flex-1 pt-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight mb-1">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Assistance Banner */}
        <div className="mt-12 sm:mt-14 max-w-4xl mx-auto bg-sky-50/80 border border-sky-100 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#009FE3]/10 text-[#009FE3] flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Need Help with the IGNOU Admission Process?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Our counselors help you check eligibility, upload documents, and choose the right study center.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              openEnquiryModal({
                source: "Application Process Section - Need Help",
              })
            }
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-[#ffcc00] hover:bg-[#ffb700] shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <span>Get Free Application Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}

