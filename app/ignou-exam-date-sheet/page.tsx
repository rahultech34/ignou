import React from "react";
import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { StudentZoneGuidePage } from "@/components/public/StudentZoneGuidePage";
import { STUDENT_ZONE_PAGES } from "@/lib/student-zone-pages";

const pageData = STUDENT_ZONE_PAGES["/ignou-exam-date-sheet"];

export const metadata: Metadata = {
  title: pageData.metaTitle,
  description: pageData.metaDescription,
  openGraph: {
    title: pageData.metaTitle,
    description: pageData.metaDescription,
    images: [{ url: "/IGNOU-img.webp" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: pageData.metaTitle,
    description: pageData.metaDescription,
    images: ["/IGNOU-img.webp"],
  },
};

export default function IgnouExamDateSheetPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <StudentZoneGuidePage page={pageData} />
      </main>
      <Footer />
    </div>
  );
}
