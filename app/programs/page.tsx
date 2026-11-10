import React from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { getPrograms, getSiteSettings } from "@/lib/admin-data";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ProgramDirectoryPage } from "@/components/public/ProgramDirectoryPage";

export const metadata: Metadata = {
  title: "IGNOU Courses & Programs 2026-27 | Admission, Eligibility & Fees",
  description:
    "Explore all UGC-DEB and AICTE approved IGNOU Bachelor degrees, Master degrees, and MBA specializations with semester syllabus, fees, and admission details.",
};

export default async function AllProgramsPage() {
  await connection();
  const [programs, siteSettings] = await Promise.all([
    getPrograms(),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar settings={siteSettings} />
      <main className="flex-1 flex flex-col">
        <ProgramDirectoryPage type="all" programs={programs} />
      </main>
      <Footer settings={siteSettings} />
    </div>
  );
}
