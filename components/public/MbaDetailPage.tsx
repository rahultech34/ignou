"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { MbaSpecialization } from "@/lib/types";
import { sanitizePublicHtml } from "@/lib/sanitize";
import { AdmissionForm } from "./AdmissionForm";

interface MbaDetailPageProps {
  item: MbaSpecialization;
  otherSpecializations?: MbaSpecialization[];
}

interface ParsedFaq {
  question: string;
  answerHtml: string;
}

interface ParsedSection {
  heading: string;
  bodyHtml: string;
  faqs: ParsedFaq[];
}

interface ParsedMbaContent {
  heroIntroHtmls: string[];
  introExtraHtml: string;
  sections: ParsedSection[];
}

function decodeBasicEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&rsquo;|&#39;|&apos;/g, "'")
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(html: string): string {
  return decodeBasicEntities(html.replace(/<[^>]+>/g, " "));
}

function parseFaqItems(faqBodyHtml: string): ParsedFaq[] {
  const items: ParsedFaq[] = [];
  const faqRegex = /<h3[^>]*>([\s\S]*?)<\/h3>\s*([\s\S]*?)(?=<\/div>|<h3[^>]*>|$)/gi;
  let match: RegExpExecArray | null;

  while ((match = faqRegex.exec(faqBodyHtml)) !== null) {
    const question = stripTags(match[1]);
    const answerRaw = match[2].trim();
    if (question && answerRaw) {
      items.push({
        question,
        answerHtml: sanitizePublicHtml(answerRaw),
      });
    }
  }

  return items;
}

function parseMbaHtmlContent(rawHtml: string, fallbackExcerpt?: string): ParsedMbaContent {
  const cleaned = sanitizePublicHtml(rawHtml || "").replace(
    /href="\/admission"/g,
    'href="/ignou-admission"'
  );

  const chunks = cleaned.split(/(?=<h2[^>]*>)/i);
  const introChunk = (chunks[0] || "").trim();

  const heroIntroHtmls: string[] = [];
  let introExtraHtml = introChunk;

  if (introChunk && !/^<h2[\s>]/i.test(introChunk)) {
    const pMatches = [...introChunk.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    for (const m of pMatches) {
      const inner = m[1].trim();
      if (inner) {
        heroIntroHtmls.push(inner);
      }
    }
    introExtraHtml = introChunk.replace(/<p[^>]*>[\s\S]*?<\/p>/gi, "").trim();
  }

  if (heroIntroHtmls.length === 0 && fallbackExcerpt) {
    heroIntroHtmls.push(fallbackExcerpt);
  }

  const h2Parts = /^<h2[\s>]/i.test(introChunk) ? chunks : chunks.slice(1);
  const sections: ParsedSection[] = [];

  for (const part of h2Parts) {
    const h2Match = part.match(/^<h2[^>]*>([\s\S]*?)<\/h2>([\s\S]*)$/i);
    if (!h2Match) continue;

    const heading = stripTags(h2Match[1]);
    const bodyHtml = h2Match[2].trim();
    const headingLower = heading.toLowerCase();

    const isFaqHeading =
      headingLower.includes("frequently asked") || headingLower === "faqs";
    const faqs = isFaqHeading ? parseFaqItems(bodyHtml) : [];

    sections.push({
      heading,
      bodyHtml,
      faqs,
    });
  }

  return {
    heroIntroHtmls,
    introExtraHtml,
    sections,
  };
}

export function MbaDetailPage({ item }: MbaDetailPageProps) {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const shortTitle = useMemo(() => {
    const base = item.title.split(":")[0] || item.title;
    return base.replace(/\s+20\d{2}\s*$/i, "").trim();
  }, [item.title]);

  const parsed = useMemo(
    () => parseMbaHtmlContent(item.content, item.excerpt || item.metaDescription),
    [item.content, item.excerpt, item.metaDescription]
  );

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
      {/* 1. FULL-WIDTH HERO BANNER (Matches Construction Management Guide Design) */}
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

        <div className="relative z-10 site-container text-center space-y-5">
          <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white leading-tight">
            {item.title}
          </h1>

          {parsed.heroIntroHtmls.map((html, idx) => (
            <p
              key={idx}
              className="text-sm sm:text-base text-slate-200 max-w-3xl mx-auto leading-relaxed [&_strong]:text-white [&_strong]:font-bold [&_a]:text-sky-300 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: html }}
            />
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
        <div className="site-container">
          <div className="site-grid items-start">
            {/* LEFT COLUMN: Structured Guide Cards */}
            <article className="col-span-4 md:col-span-8 lg:col-span-8 space-y-6 min-w-0">
              {parsed.introExtraHtml && (
                <div
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs overflow-x-hidden
                    [&_img]:max-w-full [&_img]:h-auto [&_table]:block [&_table]:overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: parsed.introExtraHtml }}
                />
              )}

              {parsed.sections.map((section, sIdx) => {
                if (section.faqs.length > 0) {
                  return (
                    <div
                      key={`${section.heading}-${sIdx}`}
                      className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5"
                    >
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        {section.heading}
                      </h2>

                      <div className="space-y-3">
                        {section.faqs.map((faq, idx) => {
                          const isOpen = openFaqIdx === idx;
                          return (
                            <div
                              key={`${faq.question}-${idx}`}
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
                                <div
                                  className="p-4 bg-white border-t border-slate-100 text-sm text-slate-700 leading-relaxed [&_p]:m-0 [&_a]:font-bold [&_a]:text-[#009FE3] [&_a]:hover:underline"
                                  dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`${section.heading}-${sIdx}`}
                    className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4"
                  >
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {section.heading}
                    </h2>

                    <div
                      className={`space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed overflow-x-hidden
                        [&_h3]:text-base sm:[&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:pt-2
                        [&_p]:text-sm sm:[&_p]:text-base [&_p]:leading-relaxed [&_p]:text-slate-700
                        [&_strong]:font-bold [&_strong]:text-slate-900
                        [&_a:not([class*='bg-'])]:font-bold [&_a:not([class*='bg-'])]:text-[#009FE3] [&_a:not([class*='bg-'])]:hover:underline
                        [&_ul]:space-y-2.5 [&_ul]:list-none [&_ul]:pl-0
                        [&_ul>li]:p-3 [&_ul>li]:rounded-xl [&_ul>li]:bg-slate-50 [&_ul>li]:border [&_ul>li]:border-slate-100 [&_ul>li]:text-sm sm:[&_ul>li]:text-base [&_ul>li]:text-slate-700
                        [&_ol]:space-y-2.5 [&_ol]:pl-5
                        [&_ol>li]:p-3.5 [&_ol>li]:rounded-xl [&_ol>li]:bg-sky-50/50 [&_ol>li]:border [&_ol>li]:border-sky-100 [&_ol>li]:text-sm sm:[&_ol>li]:text-base [&_ol>li]:text-slate-800
                        [&_table]:block [&_table]:overflow-x-auto [&_table]:w-full [&_table]:text-left [&_table]:border-collapse [&_table]:text-xs sm:[&_table]:text-sm
                        [&_th]:px-4 [&_th]:py-3 [&_th]:font-extrabold [&_th]:bg-slate-100 [&_th]:text-slate-900 [&_th]:border-b [&_th]:border-slate-200
                        [&_td]:px-4 [&_td]:py-2.5 [&_td]:text-slate-700 [&_td]:border-b [&_td]:border-slate-100
                        [&_span:empty]:hidden [&_.w-8:empty]:hidden
                        [&_img]:max-w-full [&_img]:h-auto`}
                      dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
                    />
                  </div>
                );
              })}
            </article>

            {/* RIGHT COLUMN: Sticky Counseling Form Sidebar */}
            <aside
              id="admission-form"
              className="col-span-4 md:col-span-8 lg:col-span-4 lg:sticky lg:top-[96px] self-start z-20 w-full max-w-[420px] lg:max-w-[440px] mx-auto lg:ml-auto scroll-mt-28"
            >
              <AdmissionForm
                formTitle="Book 100% Free Counseling"
                formSubtitle={`Get 1 to 1 Expert Guidance for ${shortTitle}`}
                source={`${shortTitle} Page Sidebar`}
                defaultCourse="MBA"
              />
            </aside>
          </div>
        </div>
      </section>

      {/* POPUP MODAL FOR HERO ADMISSION BUTTON */}
      {isPopupOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${shortTitle} Counseling Form`}
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
              formSubtitle={`Get 1 to 1 Expert Guidance for ${shortTitle}`}
              source={`${shortTitle} Hero Popup`}
              defaultCourse="MBA"
            />
          </div>
        </div>
      )}
    </div>
  );
}
