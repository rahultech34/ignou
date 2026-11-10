"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, ZoomIn, X, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import { openEnquiryModal } from "./EnquiryModal";

interface CertificateSectionProps {
  admissionYear?: string;
  onOpenConsultation?: () => void;
}

interface EligibilityRow {
  course: string;
  eligibility: string;
}

const ELIGIBILITY_DATA: EligibilityRow[] = [
  {
    course: "BA, BCom, BSc, BCA, BSW, BAVTM",
    eligibility: "Merit based or 10+2 from a recognized board.",
  },
  {
    course: "BLIS",
    eligibility: "Bachelor's Degree or 1-Year Diploma in Library Science.",
  },
  {
    course: "MBA",
    eligibility: "Bachelor's Degree with at least 50% marks .",
  },
  {
    course: "Mcom, MA, MSc",
    eligibility: "Bachelor's Degree with 50% marks.",
  },
  {
    course: "PG Diploma",
    eligibility: "Any bachelor's degree from a recognised university",
  },
  {
    course: "Diploma",
    eligibility: "10+2 from a recognized board with a minimum of 50% score.",
  },
];

export default function CertificateSection({
  admissionYear = "2026",
  onOpenConsultation,
}: CertificateSectionProps) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const handleConsultationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenConsultation) {
      onOpenConsultation();
      return;
    }
    openEnquiryModal({
      course: "General Admission",
      source: "Certificate Eligibility Section",
    });
  };

  return (
    <section
      id="eligibility-certificate"
      className="bg-[#003057] text-white py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-y border-sky-900/50 relative overflow-hidden"
    >
      {/* Background Glow Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#009FE3]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug">
            Eligibility Criteria for IGNOU Distance Education
            <span className="block mt-1 sm:mt-1.5 text-white">
              Admission in {admissionYear}
            </span>
          </h2>
        </div>

        {/* Two-Column Grid: Left (Table + Button) & Right (Certificate Showcase) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Eligibility Table (7 cols on lg) */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center">
            
            {/* Table Container */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#e2f2ff] border-b border-slate-200">
                    <th
                      scope="col"
                      className="py-3 px-3 sm:px-5 text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider w-[38%] sm:w-[35%] border-r border-slate-200"
                    >
                      COURSE
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-3 sm:px-5 text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider"
                    >
                      ELIGIBILITY CRITERIA
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-800">
                  {ELIGIBILITY_DATA.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-2.5 sm:py-3 px-3 sm:px-5 font-bold text-slate-900 border-r border-slate-200 leading-snug align-middle">
                        {row.course}
                      </td>
                      <td className="py-2.5 sm:py-3 px-3 sm:px-5 font-medium text-slate-700 leading-relaxed align-middle">
                        {row.eligibility}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CTA Button below Table */}
            <div className="mt-6 sm:mt-8 flex justify-center">
              <a
                href="#admission-form"
                onClick={handleConsultationClick}
                className="group inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-md bg-[#ffcc00] hover:bg-[#ffb700] text-slate-950 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Get FREE Consultation</span>
                <span className="w-5 h-5 rounded-full border border-slate-950 inline-flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-3 h-3 text-slate-950" />
                </span>
              </a>
            </div>

          </div>

          {/* Right Column: Degree Certificate Showcase (5 cols on lg) */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center justify-center">
            
            <div className="relative group max-w-[320px] sm:max-w-[360px] w-full">
              
              {/* Outer Blue Frame with subtle glow */}
              <div
                onClick={() => setIsZoomOpen(true)}
                className="relative rounded-lg p-1.5 bg-[#009FE3] shadow-2xl cursor-pointer hover:shadow-sky-400/30 transition-all duration-300 hover:scale-[1.02]"
                title="Click to view full certificate sample"
              >
                <div className="relative overflow-hidden rounded bg-white">
                  <Image
                    src="/ignou-degree-certificate-sample.png"
                    alt="IGNOU UGC-DEB Recognized Sample Degree Certificate"
                    width={247}
                    height={360}
                    className="w-full h-auto block object-contain"
                    priority
                  />
                  
                  {/* Subtle Hover Overlay with Zoom Icon */}
                  <div className="absolute inset-0 bg-[#003057]/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1.5 backdrop-blur-[1px]">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold tracking-wide">View Full Sample</span>
                  </div>
                </div>
              </div>

              {/* Verified Certificate Badges */}
              <div className="mt-3.5 flex items-center justify-center gap-2 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-200 border border-white/15 text-xs font-semibold backdrop-blur-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  UGC-DEB & AICTE Approved Degree
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Lightbox / Zoom Modal for Certificate */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative bg-[#003057] p-2 sm:p-3 rounded-2xl max-w-lg w-full shadow-2xl border border-sky-600/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-sky-800/80 mb-3 text-white">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-sky-400" />
                <span className="text-xs sm:text-sm font-bold">
                  Official IGNOU Degree Certificate Sample
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Close Preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Certificate Image */}
            <div className="p-1.5 bg-[#009FE3] rounded-lg overflow-hidden">
              <Image
                src="/ignou-degree-certificate-sample.png"
                alt="Full IGNOU Degree Certificate Sample"
                width={494}
                height={720}
                className="w-full h-auto rounded block bg-white"
              />
            </div>

            {/* Modal Footer Note */}
            <div className="mt-3 px-2 py-1 text-center">
              <p className="text-[11.5px] text-sky-200">
                Degrees awarded by IGNOU are valid worldwide for Govt Jobs, UPSC exams, and Higher Education.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

