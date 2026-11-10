import React from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { getPrograms, getSiteSettings } from "@/lib/admin-data";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ProgramDirectoryPage } from "@/components/public/ProgramDirectoryPage";

export const metadata: Metadata = {
  title: "IGNOU UG Programs 2026-27 | BCA, B.Com, BA, B.Sc & BLIS Admissions",
  description:
    "Explore UGC-DEB recognized IGNOU Bachelor degrees (BCA, B.Com, BA, B.Sc, BLIS) with self-paced learning, low fees, and direct admission without CUET.",
};

export default async function UgProgramsPage() {
  await connection();
  const [programs, siteSettings] = await Promise.all([
    getPrograms(),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar settings={siteSettings} />
      <main className="flex-1 flex flex-col">
        <ProgramDirectoryPage type="ug" programs={programs} />
      </main>
      <Footer settings={siteSettings} />
    </div>
  );
}
