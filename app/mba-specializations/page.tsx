import React from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { getMbaSpecializations, getSiteSettings } from "@/lib/admin-data";
import { MBA_SPECIALIZATION_STATIC_PAGES } from "@/lib/mba-specializations-static";
import type { MbaSpecialization } from "@/lib/types";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { MbaDirectoryPage } from "@/components/public/MbaDirectoryPage";

export const metadata: Metadata = {
  title: "IGNOU MBA Specializations 2027: Fees, Eligibility, Admission & Syllabus",
  description:
    "Explore all 14 IGNOU MBA Specializations: Finance, HR, Operations, IT, Business Analytics, Business Management, Marketing, Retail, Project, Rural, Supply Chain, International Trade, Hospital Administration & Construction Management.",
  keywords: [
    "IGNOU MBA Specializations",
    "IGNOU MBA in Finance",
    "IGNOU MBA in HR",
    "IGNOU MBA in Operations",
    "IGNOU MBA in IT",
    "IGNOU MBA in Business Analytics",
    "IGNOU MBA in Marketing",
    "IGNOU MBA in Retail Management",
    "IGNOU MBA in Project Management",
    "IGNOU MBA in Rural Management",
    "IGNOU MBA in Supply Chain Management",
    "IGNOU MBA in International Trade Management",
    "IGNOU MBA in Hospital Administration Management",
    "IGNOU MBA in Construction Management",
    "IGNOU MBA Fees 2027",
    "IGNOU MBA Admission 2027",
  ],
};

export default async function PublicMbaSpecializationsPage() {
  await connection();
  const [specializations, siteSettings] = await Promise.all([
    getMbaSpecializations(),
    getSiteSettings(),
  ]);

  const publishedItems = specializations
    .filter((s) => s.status !== "draft")
    .map((s) => {
      const staticMatch =
        MBA_SPECIALIZATION_STATIC_PAGES[`/mba-specializations/${s.slug.toLowerCase()}`];
      if (!staticMatch) return s;
      return {
        ...s,
        title: staticMatch.title || s.title,
        metaTitle: staticMatch.metaTitle || s.metaTitle,
        metaDescription: staticMatch.metaDescription || s.metaDescription,
        excerpt: staticMatch.metaDescription || s.excerpt,
      };
    });
  const existingSlugs = new Set(publishedItems.map((s) => s.slug.toLowerCase()));

  const staticItems: MbaSpecialization[] = Object.entries(
    MBA_SPECIALIZATION_STATIC_PAGES
  )
    .map(([route, page]): MbaSpecialization | null => {
      const slug = route.replace("/mba-specializations/", "").toLowerCase();
      if (existingSlugs.has(slug)) return null;
      return {
        id: `static-${page.key}`,
        title: page.navLabel,
        slug,
        excerpt: page.metaDescription || page.heroIntro[0] || "",
        content: "",
        category: "MBA Specialization",
        author: "IGNOU SOMS Faculty",
        readTime: "6 min read",
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        status: "published",
        createdAt: "2026-11-24T00:00:00.000Z",
        updatedAt: "2026-11-24T00:00:00.000Z",
      };
    })
    .filter((item): item is MbaSpecialization => item !== null);

  const allPublished = [...publishedItems, ...staticItems];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar settings={siteSettings} />
      <main className="flex-1 flex flex-col">
        <MbaDirectoryPage specializations={allPublished} />
      </main>
      <Footer settings={siteSettings} />
    </div>
  );
}
