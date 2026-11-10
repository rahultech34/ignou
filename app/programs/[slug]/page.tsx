import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getProgramBySlug, getSiteSettings } from "@/lib/admin-data";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ProgramDetailPage } from "@/components/public/ProgramDetailPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return {
      title: "Program Not Found | IGNOU Admission Portal",
    };
  }

  return {
    title:
      program.metaTitle ||
      `IGNOU ${program.title} Admission 2026-27 | Fees, Eligibility, Syllabus`,
    description:
      program.metaDescription ||
      program.shortDescription ||
      `Detailed syllabus, semester fees, eligibility, and admission criteria for IGNOU ${program.title}. UGC-DEB recognized degree.`,
    keywords: [
      `IGNOU ${program.code}`,
      `IGNOU ${program.title}`,
      "IGNOU Admission 2026-27",
      "IGNOU Distance Learning",
      "IGNOU Syllabus",
      "IGNOU Fee Structure",
    ],
    openGraph: {
      title: program.metaTitle || `IGNOU ${program.title}`,
      description:
        program.metaDescription ||
        program.shortDescription ||
        `Study ${program.title} from IGNOU with UGC-DEB recognition.`,
      type: "website",
    },
  };
}

export default async function ProgramDetailRoute({ params }: Props) {
  await connection();
  const { slug } = await params;
  const [program, siteSettings] = await Promise.all([
    getProgramBySlug(slug),
    getSiteSettings(),
  ]);

  if (!program) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar settings={siteSettings} />
      <main className="flex-1 flex flex-col">
        <ProgramDetailPage program={program} />
      </main>
      <Footer settings={siteSettings} />
    </div>
  );
}
