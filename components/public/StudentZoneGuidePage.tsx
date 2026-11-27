"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdmissionForm } from "@/components/public/AdmissionForm";
import type { ContentBlock, StudentZonePageData } from "@/lib/student-zone-pages";

interface StudentZoneGuidePageProps {
  page: StudentZonePageData;
}

function renderBold(text: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const boldRegex = /<b>([\s\S]*?)<\/b>/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    parts.push(
      <strong key={`${keyPrefix}-b-${i++}`} className="font-bold text-slate-900">
        {match[1]}
      </strong>
    );
    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }
  return parts;
}

function renderRichText(rich: string, keyPrefix = "rt"): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const linkRegex = /<LINK:([^>]+)>([\s\S]*?)<\/LINK>/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = linkRegex.exec(rich)) !== null) {
    if (match.index > lastIdx) {
      parts.push(...renderBold(rich.slice(lastIdx, match.index), `${keyPrefix}-t-${i}`));
    }
    const href = match[1];
    const label = match[2].replace(/<\/?b>/g, "");
    parts.push(
      <Link
        key={`${keyPrefix}-l-${i++}`}
        href={href}
        className="font-bold text-[#009FE3] hover:underline"
      >
        {label}
      </Link>
    );
    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < rich.length) {
    parts.push(...renderBold(rich.slice(lastIdx), `${keyPrefix}-end`));
  }
  return parts;
}

function renderBlock(block: ContentBlock, idx: number) {
  if (block.type === "subheading") {
    return (
      <h3
        key={idx}
        className="text-base sm:text-lg font-bold pt-2 text-slate-900"
      >
        {block.text}
      </h3>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p
        key={idx}
        className="text-sm sm:text-base leading-relaxed text-slate-700"
      >
        {renderRichText(block.rich, `p-${idx}`)}
      </p>
    );
  }

  if (block.type === "ul") {
    return (
      <ul key={idx} className="space-y-2.5">
        {block.items.map((item, itemIdx) => (
          <li
            key={itemIdx}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm sm:text-base text-slate-700"
          >
            <span className="w-2 h-2 rounded-full bg-[#009FE3] shrink-0 mt-2" />
            <span>{renderRichText(item, `ul-${idx}-${itemIdx}`)}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "ol") {
    return (
      <ol key={idx} className="space-y-3">
        {block.items.map((item, itemIdx) => (
          <li
            key={itemIdx}
            className="flex items-start gap-3.5 p-3.5 rounded-xl bg-sky-50/50 border border-sky-100"
          >
            <span className="w-7 h-7 rounded-full bg-[#009FE3] text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
              {itemIdx + 1}
            </span>
            <span className="text-sm sm:text-base text-slate-800 leading-relaxed">
              {renderRichText(item, `ol-${idx}-${itemIdx}`)}
            </span>
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === "table") {
    const headerRow = block.hasHeader ? block.rows[0] : null;
    const bodyRows = block.hasHeader ? block.rows.slice(1) : block.rows;
    return (
      <div key={idx} className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          {headerRow && (
            <thead className="bg-slate-100 text-slate-900">
              <tr>
                {headerRow.map((cell, cIdx) => (
                  <th
                    key={cIdx}
                    className="px-4 py-3 font-extrabold border-b border-slate-200"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-slate-100">
            {bodyRows.map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={`px-4 py-2.5 text-slate-700 ${
                      cIdx === 0 && block.hasHeader ? "font-bold text-slate-900" : "font-medium"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

export function StudentZoneGuidePage({ page }: StudentZoneGuidePageProps) {
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
            {page.title}
          </h1>

          {page.heroIntro.map((para, idx) => (
            <p
              key={idx}
              className="text-sm sm:text-base text-slate-200 max-w-3xl mx-auto leading-relaxed"
            >
              {para}
            </p>
          ))}

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
              {page.sections.map((section, sIdx) => (
                <div
                  key={`${section.heading}-${sIdx}`}
                  className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4"
                >
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {section.heading}
                  </h2>
                  {section.blocks.map((block, bIdx) => renderBlock(block, bIdx))}
                </div>
              ))}

              {/* Frequently Asked Questions (FAQs) */}
              {page.faqs.length > 0 && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Frequently Asked Questions (FAQs)
                  </h2>

                  <div className="space-y-3">
                    {page.faqs.map((faq, idx) => {
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
              )}
            </article>

            {/* RIGHT COLUMN: Sticky Counseling Form Sidebar */}
            <aside
              id="admission-form"
              className="lg:col-span-4 lg:sticky lg:top-[96px] self-start z-20 w-full max-w-[380px] mx-auto lg:ml-auto scroll-mt-28"
            >
              <AdmissionForm
                formTitle="Book 100% Free Counseling"
                formSubtitle={`Get 1 to 1 Expert Guidance for ${page.navLabel}`}
                source={`${page.navLabel} Page Sidebar`}
                defaultCourse={page.defaultCourse}
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
          aria-label={`${page.navLabel} Counseling Form`}
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
              formSubtitle={`Get 1 to 1 Expert Guidance for ${page.navLabel}`}
              source={`${page.navLabel} Hero Popup`}
              defaultCourse={page.defaultCourse}
            />
          </div>
        </div>
      )}
    </div>
  );
}
