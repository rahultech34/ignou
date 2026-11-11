import React from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { getMbaSpecializations, getSiteSettings } from "@/lib/admin-data";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { MbaDirectoryPage } from "@/components/public/MbaDirectoryPage";

export const metadata: Metadata = {
  title: "IGNOU MBA Specializations 2027: Fees, Eligibility, Admission & Syllabus",
  description:
    "Explore all 7 IGNOU MBA Specializations: Finance, HR, Operations, IT, Business Analytics, Business Management & Marketing. Check fees (₹66,000), eligibility, duration, and admission steps.",
  keywords: [
    "IGNOU MBA Specializations",
    "IGNOU MBA in Finance",
    "IGNOU MBA in HR",
    "IGNOU MBA in Operations",
    "IGNOU MBA in IT",
    "IGNOU MBA in Business Analytics",
    "IGNOU MBA in Marketing",
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

  const publishedItems = specializations.filter((s) => s.status !== "draft");

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar settings={siteSettings} />
      <main className="flex-1 flex flex-col">
        <MbaDirectoryPage specializations={publishedItems} />
      </main>
      <Footer settings={siteSettings} />
    </div>
  );
}
