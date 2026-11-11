import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { connection } from "next/server";
import { getBlogBySlug, getBlogs, getSiteSettings, getMbaSpecializationBySlug } from "@/lib/admin-data";
import {
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  Sparkles,
  ChevronRight,
  BookOpen,
  Tag,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { AdmissionForm } from "@/components/public/AdmissionForm";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    const mba = await getMbaSpecializationBySlug(slug);
    if (mba) {
      return {
        title: mba.metaTitle || `${mba.title} | IGNOU Admission & Exam Guides 2026`,
        description: mba.metaDescription || mba.excerpt,
      };
    }
    return {
      title: "Article Not Found | IGNOU Portal",
    };
  }

  return {
    title:
      blog.metaTitle ||
      `${blog.title} | IGNOU Admission & Exam Guides 2026`,
    description:
      blog.metaDescription ||
      blog.excerpt ||
      "Read verified IGNOU admission guides, assignment submission steps, and syllabus updates.",
    keywords:
      blog.tags && blog.tags.length > 0
        ? blog.tags
        : ["IGNOU Admission", "IGNOU Assignment", "IGNOU TEE Exam", "IGNOU Guide"],
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      images: blog.coverImage ? [{ url: blog.coverImage }] : undefined,
      type: "article",
      publishedTime: blog.createdAt,
      authors: [blog.author || "IGNOU Advisory Team"],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : undefined,
    },
  };
}

function calculateReadingTime(content: string, fallback?: string): string {
  if (fallback) return fallback;
  if (!content) return "4 min read";
  const clean = content.replace(/<[^>]*>/g, " ").trim();
  const words = clean.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(2, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export default async function BlogPostPage({ params }: Props) {
  await connection();
  const { slug } = await params;
  const [blog, allBlogs, siteSettings] = await Promise.all([
    getBlogBySlug(slug),
    getBlogs(),
    getSiteSettings(),
  ]);

  if (!blog) {
    const mba = await getMbaSpecializationBySlug(slug);
    if (mba) {
      redirect(`/mba-specializations/${mba.slug}`);
    }
    notFound();
  }

  // Related guides excluding current article
  const relatedBlogs = allBlogs
    .filter((b) => b.id !== blog.id && b.status !== "draft")
    .slice(0, 3);
  const readingTime = calculateReadingTime(blog.content, blog.readTime);

  // Phone and email from settings
  const phone =
    siteSettings?.supportPhone && siteSettings.supportPhone !== "1800-11-2345"
      ? siteSettings.supportPhone
      : "+91 83368 89553";
  const email =
    siteSettings?.supportEmail &&
    !siteSettings.supportEmail.includes("distanceeducationschool.com")
      ? siteSettings.supportEmail
      : "hi@edukyu.com";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar settings={siteSettings} />

      <main className="flex-1 flex flex-col">
        {/* Draft Banner if applicable */}
        {blog.status === "draft" && (
          <div className="bg-amber-400 text-slate-950 px-4 py-2 text-center text-xs font-bold tracking-wide">
            ⚠️ Admin Preview Mode — This article is currently a Draft and hidden from the public.
          </div>
        )}

        {/* Breadcrumb Header Bar */}
        <section className="bg-white border-b border-slate-200/80 py-3.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
              <Link href="/" className="hover:text-[#009FE3] transition-colors shrink-0">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <Link href="/blogs" className="hover:text-[#009FE3] transition-colors shrink-0">
                Blogs
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span className="text-slate-800 truncate max-w-[220px] sm:max-w-md font-semibold">
                {blog.title}
              </span>
            </nav>
          </div>
        </section>

        {/* 2-Column Main Section: Content on Left (8 cols), Sticky Form on Right (4 cols) */}
        <section className="py-8 sm:py-12 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              
              {/* LEFT COLUMN: Main Blog Content (8 cols) */}
              <article className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-xs space-y-7">
                {/* Category & Read Time */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 text-[#009FE3] border border-sky-200/80">
                    <Sparkles className="w-3 h-3 text-[#009FE3]" />
                    <span>{blog.category || "Admission Guide"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{readingTime}</span>
                  </span>
                </div>

                {/* Article Main Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                  {blog.title}
                </h1>

                {/* Author & Published Date Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-[#0b2545] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {(blog.author || "A")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        {blog.author || "Academic Advisory Team"}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        IGNOU Guidance Division • EduKyu
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Updated {new Date(blog.updatedAt || blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                </div>

                {/* Featured / Cover Image */}
                {blog.coverImage && (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-xs">
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Excerpt Callout */}
                {blog.excerpt && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 border-l-4 border-[#009FE3] text-slate-700 text-sm sm:text-base leading-relaxed italic">
                    {blog.excerpt}
                  </div>
                )}

                {/* Rich Article Body Content */}
                <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base prose-li:text-slate-700 prose-a:text-[#009FE3] prose-a:font-semibold hover:prose-a:underline">
                  {blog.content.includes("<") && blog.content.includes(">") ? (
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                  ) : (
                    <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                      {blog.content}
                    </div>
                  )}
                </div>

                {/* Article Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
                        <Tag className="w-3.5 h-3.5" /> Tags:
                      </span>
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Need Admission Help Bottom Callout */}
                <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0b2545] to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Free Counseling &amp; Admission Desk
                    </span>
                    <h3 className="text-lg sm:text-xl font-black">
                      Need Direct Assistance with IGNOU Admissions?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                      Get instant assistance with course eligibility, syllabus books, assignment submissions, and exam hall tickets.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                    <a
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-colors"
                    >
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>{phone}</span>
                    </a>
                    <a
                      href="#counseling-form"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#ffcc00] hover:bg-[#e6b800] text-[#0b2545] text-xs font-extrabold shadow-md transition-all active:scale-95"
                    >
                      <span>Get Free Guidance</span>
                      <ArrowRight className="w-4 h-4 text-[#0b2545]" />
                    </a>
                  </div>
                </div>
              </article>

              {/* RIGHT COLUMN: Sticky Sidebar with Form */}
              <aside
                id="counseling-form"
                className="lg:col-span-4 lg:sticky lg:top-[76px] self-start z-20 w-full max-w-[370px] mx-auto lg:ml-auto"
              >
                {/* Quick Admission Counseling Form (Sticks below navbar) */}
                <AdmissionForm
                  formTitle="Get Free IGNOU Counseling"
                  formSubtitle="Direct Admission Assistance · 100% Free Service"
                  source={`Blog Sidebar - ${blog.slug}`}
                />
              </aside>

            </div>
          </div>
        </section>

        {/* RELATED ADMISSIONS GUIDES SECTION AT BOTTOM */}
        {relatedBlogs.length > 0 && (
          <section className="py-12 bg-white border-t border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold text-[#009FE3] uppercase tracking-wider">Keep Reading</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                    Related Admissions Guides
                  </h3>
                </div>
                <Link
                  href="/blogs"
                  className="text-xs font-bold text-[#009FE3] hover:text-sky-700 inline-flex items-center gap-1 transition-colors"
                >
                  <span>View All Articles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((item) => (
                  <Link
                    key={item.id}
                    href={`/blogs/${item.slug}`}
                    className="bg-slate-50 hover:bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-sky-300 hover:shadow-lg transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#009FE3] mb-2 block">
                        {item.category || "Guide"}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-[#009FE3] transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      {item.excerpt && (
                        <p className="mt-2 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="mt-5 pt-3.5 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-[#009FE3]">
                      <span>Read Full Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer settings={siteSettings} />
    </div>
  );
}
