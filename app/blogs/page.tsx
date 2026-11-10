import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { connection } from "next/server";
import { getBlogs, getSiteSettings } from "@/lib/admin-data";
import { ArrowRight, BookOpen, Clock, Sparkles } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "IGNOU Blogs & Admission Guides 2026-27 | Student Resources",
  description:
    "Stay updated with the latest IGNOU admission dates, syllabus, assignment submission guidelines, exam datesheets, fee structures, and student career resources.",
};

export default async function PublicBlogsPage() {
  await connection();
  const [blogs, siteSettings] = await Promise.all([
    getBlogs(),
    getSiteSettings(),
  ]);

  const publishedBlogs = blogs.filter((b) => b.status !== "draft");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      <Navbar settings={siteSettings} />

      <main className="flex-1 flex flex-col">
        {/* Hero Header */}
        <section className="bg-gradient-to-b from-[#0b2545] via-slate-900 to-[#030619] text-white py-14 sm:py-20 relative overflow-hidden">
          {/* Subtle Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#009FE3]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-900/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-sky-300 border border-white/20 mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              IGNOU Academic Insights &amp; Guides 2026-27
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              IGNOU Student Blog &amp; News
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Comprehensive updates on Indira Gandhi National Open University admissions, syllabus revisions, assignment submissions, TEE hall tickets, and career roadmaps.
            </p>
          </div>
        </section>

        {/* Blog Cards Grid */}
        <section className="py-12 sm:py-16 flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {publishedBlogs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto shadow-sm">
                <BookOpen className="w-12 h-12 text-[#009FE3] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">Articles Coming Soon</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Our academic counselor team is currently preparing new admissions guides for the 2026-27 session.
                </p>
                <Link
                  href="/"
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#009FE3] text-white text-xs font-bold shadow-md hover:bg-sky-600 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {publishedBlogs.map((blog) => (
                  <article
                    key={blog.id}
                    className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Featured / Cover Image */}
                      {blog.coverImage ? (
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                          <Image
                            src={blog.coverImage}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video w-full bg-gradient-to-tr from-sky-100 via-indigo-50 to-blue-50 flex items-center justify-center text-[#009FE3]">
                          <BookOpen className="w-10 h-10 opacity-50" />
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#009FE3] font-bold text-[11px] border border-sky-100">
                            {blog.category || "Admissions"}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              {blog.readTime ||
                                `${Math.max(2, Math.ceil((blog.content || "").split(/\s+/).length / 200))} min read`}
                            </span>
                          </span>
                        </div>

                        <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#009FE3] transition-colors leading-snug">
                          <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                        </h2>

                        {blog.excerpt && (
                          <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                            {blog.excerpt}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-500 truncate max-w-[150px]">
                        By {blog.author || "Academic Team"}
                      </span>
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="font-bold text-[#009FE3] hover:text-sky-700 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer settings={siteSettings} />
    </div>
  );
}
