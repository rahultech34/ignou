import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import {
  getMbaSpecializationBySlug,
  getMbaSpecializations,
  getSiteSettings,
} from "@/lib/admin-data";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { MbaDetailPage } from "@/components/public/MbaDetailPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const item = await getMbaSpecializationBySlug(slug);

  if (!item) {
    return {
      title: "MBA Specialization Not Found | IGNOU Portal",
    };
  }

  return {
    title: item.metaTitle || `${item.title} | IGNOU MBA 2027 Admission`,
    description:
      item.metaDescription ||
      item.excerpt ||
      "Explore IGNOU MBA specializations: fees, eligibility, admission process, curriculum and career scope.",
    keywords:
      item.tags && item.tags.length > 0
        ? item.tags
        : ["IGNOU MBA Specialization", "IGNOU MBA Admission 2027", "IGNOU MBA Fees"],
    openGraph: {
      title: item.metaTitle || item.title,
      description: item.metaDescription || item.excerpt,
      type: "article",
      publishedTime: item.createdAt,
      authors: [item.author || "IGNOU SOMS Faculty"],
    },
    twitter: {
      card: "summary_large_image",
      title: item.metaTitle || item.title,
      description: item.metaDescription || item.excerpt,
    },
  };
}

export default async function MbaSpecializationDetailPage({ params }: Props) {
  await connection();
  const { slug } = await params;
  const [mbaItem, allMba, siteSettings] = await Promise.all([
    getMbaSpecializationBySlug(slug),
    getMbaSpecializations(),
    getSiteSettings(),
  ]);

  if (!mbaItem) {
    notFound();
  }

  // Other specializations (up to 6)
  const otherSpecializations = allMba
    .filter((m) => m.id !== mbaItem.id && m.status !== "draft")
    .slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar settings={siteSettings} />
      <main className="flex-1 flex flex-col">
        <MbaDetailPage
          item={mbaItem}
          otherSpecializations={otherSpecializations}
        />
      </main>
      <Footer settings={siteSettings} />
    </div>
  );
}
