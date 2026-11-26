import React from "react";
import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { IgnouAdmissionPage } from "@/components/public/IgnouAdmissionPage";

const META_TITLE = "IGNOU Admission: Eligibility, Process & Programmes";
const META_DESCRIPTION =
  "Explore IGNOU Admission: eligibility, programmes, documents and how IGNOU Online Admission works. A simple step-by-step guide before you apply.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [{ url: "/IGNOU-img.webp" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: ["/IGNOU-img.webp"],
  },
};

export default function IgnouAdmissionStaticPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <IgnouAdmissionPage />
      </main>
      <Footer />
    </div>
  );
}
