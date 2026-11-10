import React from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { getPrograms, getSiteSettings } from "@/lib/admin-data";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ProgramDirectoryPage } from "@/components/public/ProgramDirectoryPage";

export const metadata: Metadata = {
  title: "IGNOU PG & Master Programs 2026-27 | MBA, MCA, M.Com, MA & M.Sc",
  description:
    "Advance your career with UGC-DEB and AICTE approved IGNOU Master degrees for working professionals. Check fee structures, syllabus, and admission eligibility.",
};

export default async function PgProgramsPage() {
  await connection();
  const [programs, siteSettings] = await Promise.all([
    getPrograms(),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar settings={siteSettings} />
      <main className="flex-1 flex flex-col">
        <ProgramDirectoryPage type="pg" programs={programs} />
      </main>
      <Footer settings={siteSettings} />
    </div>
  );
}
