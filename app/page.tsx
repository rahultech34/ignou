import type { Metadata } from "next";
import { connection } from "next/server";
import { getHomePageData, getPrograms, getSiteSettings } from "@/lib/admin-data";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HomeGuideSection from "./components/HomeGuideSection";
import Footer from "./components/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const homePageData = await getHomePageData();
  const metaTitle =
    homePageData.metaTitle ||
    homePageData.guide?.metaTitle ||
    "IGNOU: Courses, Admission, Eligibility and Study Guide";
  const metaDescription =
    homePageData.metaDescription ||
    homePageData.guide?.metaDescription ||
    "Learn about IGNOU, its courses, admission, eligibility, study material and exams. A simple guide to Indira Gandhi National Open University for new students.";

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "website",
    },
  };
}

export default async function Home() {
  await connection();
  // First priority: Fetch live data directly from Google Cloud Firestore
  const [homePageData, programsList, siteSettings] = await Promise.all([
    getHomePageData(),
    getPrograms(),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* Responsive & Beautiful Navigation Bar with live DB announcement and helpline */}
      <Navbar settings={siteSettings} homePageData={homePageData} />

      {/* Main Page Showcase with live DB hero content, stats, and courses */}
      <main className="flex-1 flex flex-col">
        <HeroSection
          homePageData={homePageData}
          programsList={programsList}
          settings={siteSettings}
        />
        {/* Complete Courses, Admission, Eligibility and Study Guide for New Students */}
        <HomeGuideSection guide={homePageData?.guide} />
      </main>

      {/* Comprehensive Academic Footer with live DB contact details */}
      <Footer settings={siteSettings} />
    </div>
  );
}
