"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  Bell,
  Sparkles,
  BarChart3,
  Layers,
  GraduationCap,
  Users,
  Award,
  MapPin,
  ExternalLink,
  Newspaper,
  Plus,
  Trash2,
  BookOpen,
  ArrowRight,
  Pause,
  Play,
  Calendar,
} from "lucide-react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { HomePageData, NewsItem } from "@/lib/types";

const DEFAULT_PARAGRAPHS = [
  "Established in 1985, IGNOU, or Indira Gandhi National Open University, is India's sole national and the world's largest open university. Renowned for its comprehensive range of undergraduate and postgraduate courses. IGNOU is a popular choice for distance and online education.",
  "The university is recognized for offering flexible learning opportunities to students, working professionals, homemakers, and aspirants preparing for competitive examinations. IGNOU regularly updates its curriculum to meet current industry and academic requirements while maintaining affordable and accessible education.",
  "They admit students in January and July sessions and offer over 333 courses in various subjects including Online MBA. It has study centers all over India. They cover subjects like Arts, Commerce, Management, and research programs, providing different interests. Known for its strong educational foundation and supportive faculty, This is a top institution in the field of Online and Distance Education.",
];

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "IGNOU Online Admission Portal for July 2026-27",
    link: "#admission-form",
    isNew: true,
    date: "July 2026-27",
  },
  {
    id: "news-2",
    title: "IGNOU 2026-27 Assignment – Find Course Code, Download & Verify Validity",
    link: "#assignment-status",
    isNew: true,
    date: "Latest",
  },
  {
    id: "news-3",
    title: "IGNOU New Registration for July 2026-27",
    link: "#admission-form",
    isNew: true,
    date: "July 2026-27",
  },
  {
    id: "news-4",
    title: "DEB ID is mandatory for learners enrolling in ODL/Online programmes",
    link: "#deb-guidelines",
    isNew: true,
    date: "Notice",
  },
  {
    id: "news-5",
    title: "Guidelines and Instructions for Submission of On-Line Examination form Only for ODL & Online Programmes",
    link: "#exam-form",
    isNew: true,
    date: "TEE Exam",
  },
  {
    id: "news-6",
    title: "Date Sheet for Term End Examination (TEE) Released",
    link: "#datesheet",
    isNew: true,
    date: "TEE",
  },
  {
    id: "news-7",
    title: "Re-Registration Open for Next Semester / Year Students",
    link: "#re-registration",
    isNew: false,
    date: "Registration",
  },
];

export function HomePageEditor() {
  const [data, setData] = useState<HomePageData>({
    announcementTicker: "",
    heroBadge: "NAAC A++ Accredited • UGC-DEB Approved Central University",
    heroHeadline:
      "Empower Your Career with IGNOU Distance & Online Degrees 2026-27",
    heroSubtitle:
      "Admissions open for July 2026-27 academic session. Choose from 150+ UGC-DEB recognized degree programs with flexible self-paced learning and pan-India exam centers.",
    learnersCount: "4.0M+",
    programsCount: "150+",
    naacRating: "NAAC A++",
    centersCount: "67",
    admissionFormHeading: "Apply for Admission 2026-27",
    admissionFormSubheading:
      "Check eligibility, course fee & get personalized expert counseling",
    aboutTitle:
      "About IGNOU Distance Education – Indira Gandhi National Open University",
    aboutParagraphs: DEFAULT_PARAGRAPHS,
    latestNews: DEFAULT_NEWS,
    updatedAt: "2026-10-27T00:00:00.000Z",
  });

  const [newNewsTitle, setNewNewsTitle] = useState("");
  const [newNewsLink, setNewNewsLink] = useState("#admission-form");
  const [newNewsDate, setNewNewsDate] = useState("July 2026-27");
  const [newNewsIsNew, setNewNewsIsNew] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/home-page");
        if (res.ok) {
          const text = await res.text();
          const json = text ? JSON.parse(text) : {};
          const hp = json.data || json.homePage;
          if (hp) {
            setData({
              ...hp,
              aboutTitle:
                hp.aboutTitle ||
                "About IGNOU Distance Education – Indira Gandhi National Open University",
              aboutParagraphs:
                hp.aboutParagraphs && hp.aboutParagraphs.length > 0
                  ? hp.aboutParagraphs
                  : DEFAULT_PARAGRAPHS,
              latestNews:
                hp.latestNews && hp.latestNews.length > 0
                  ? hp.latestNews
                  : DEFAULT_NEWS,
            });
          }
        }
      } catch (e) {
        console.error("Failed to load home page content:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSaving(true);

    try {
      const res = await fetch("/api/admin/home-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let resJson: any = null;
      try {
        const text = await res.text();
        resJson = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        console.warn("Response parse warning:", parseErr);
      }

      if (!res.ok) {
        setFeedback({
          type: "error",
          text: resJson?.error || "Failed to update home page configuration.",
        });
        setSaving(false);
        return;
      }

      setFeedback({
        type: "success",
        text: "Home page configuration, About section & Latest News saved directly to Cloud Firestore & local store!",
      });
      setTimeout(() => setFeedback(null), 5000);
    } catch (e: any) {
      setFeedback({
        type: "error",
        text: e.message || "An unexpected error occurred while saving.",
      });
    } finally {
      setSaving(false);
    }
  };

  // About Section Paragraph Handlers
  const handleParagraphChange = (index: number, val: string) => {
    const list = [...(data.aboutParagraphs || DEFAULT_PARAGRAPHS)];
    list[index] = val;
    setData({ ...data, aboutParagraphs: list });
  };

  const handleAddParagraph = () => {
    const list = [...(data.aboutParagraphs || DEFAULT_PARAGRAPHS), ""];
    setData({ ...data, aboutParagraphs: list });
  };

  const handleRemoveParagraph = (index: number) => {
    const list = (data.aboutParagraphs || DEFAULT_PARAGRAPHS).filter(
      (_, i) => i !== index
    );
    setData({ ...data, aboutParagraphs: list });
  };

  // Latest News Item Handlers
  const handleAddNewsItem = () => {
    if (!newNewsTitle.trim()) return;
    const item: NewsItem = {
      id: `news-${Date.now()}`,
      title: newNewsTitle.trim(),
      link: newNewsLink.trim() || "#admission-form",
      date: newNewsDate.trim() || "July 2026-27",
      isNew: newNewsIsNew,
    };
    const updated = [item, ...(data.latestNews || DEFAULT_NEWS)];
    setData({ ...data, latestNews: updated });
    setNewNewsTitle("");
    setNewNewsLink("#admission-form");
  };

  const handleRemoveNewsItem = (id: string) => {
    const updated = (data.latestNews || DEFAULT_NEWS).filter(
      (n) => n.id !== id
    );
    setData({ ...data, latestNews: updated });
  };

  const handleToggleNewsIsNew = (id: string) => {
    const updated = (data.latestNews || DEFAULT_NEWS).map((n) =>
      n.id === id ? { ...n, isNew: !n.isNew } : n
    );
    setData({ ...data, latestNews: updated });
  };

  const handleUpdateNewsTitle = (id: string, title: string) => {
    const updated = (data.latestNews || DEFAULT_NEWS).map((n) =>
      n.id === id ? { ...n, title } : n
    );
    setData({ ...data, latestNews: updated });
  };

  const handleUpdateNewsLink = (id: string, link: string) => {
    const updated = (data.latestNews || DEFAULT_NEWS).map((n) =>
      n.id === id ? { ...n, link } : n
    );
    setData({ ...data, latestNews: updated });
  };

  if (loading) {
    return (
      <AdminLayoutWrapper title="Edit Home Page">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-3 border-[#009FE3] border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayoutWrapper>
    );
  }

  return (
    <AdminLayoutWrapper title="Edit Home Page">
      <form onSubmit={handleSave} className="space-y-8 max-w-5xl pb-16">
        {/* Top Header & Save Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Globe className="w-6 h-6 text-[#009FE3]" />
              <span>Home Page Content & Sections</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live database editor for Hero banner, About section & Upward Scrolling Latest News.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>View Live Home</span>
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009FE3] text-white text-xs sm:text-sm font-bold hover:bg-[#008ac7] transition-all shadow-md shadow-sky-500/20 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving to DB...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl flex items-start gap-3 border ${
              feedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span className="text-xs sm:text-sm font-semibold">{feedback.text}</span>
          </div>
        )}

        {/* SECTION 1: ABOUT IGNOU SECTION (Requested by User) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#009FE3]" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  About IGNOU Distance Education Section
                </h3>
                <p className="text-xs text-slate-500">
                  Left-side content displayed on the home page below the hero recognition strip.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddParagraph}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-[#009FE3] text-xs font-bold hover:bg-sky-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Paragraph</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              About Section Heading
            </label>
            <input
              type="text"
              value={data.aboutTitle || ""}
              onChange={(e) => setData({ ...data, aboutTitle: e.target.value })}
              placeholder="About IGNOU Distance Education – Indira Gandhi National Open University"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900 font-semibold"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              About Paragraphs (Multi-Paragraph Content)
            </label>
            {(data.aboutParagraphs || DEFAULT_PARAGRAPHS).map((paragraph, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Paragraph {idx + 1}</span>
                  {(data.aboutParagraphs || DEFAULT_PARAGRAPHS).length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveParagraph(idx)}
                      className="text-rose-600 hover:text-rose-700 p-1 flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={paragraph}
                  onChange={(e) => handleParagraphChange(idx, e.target.value)}
                  placeholder="Enter paragraph text..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-800"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: LATEST NEWS UPWARD SCROLLING TICKER (Requested by User) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Latest News & Circulars (Upward Scrolling Ticker)
                </h3>
                <p className="text-xs text-slate-500">
                  Right-side live ticker scrolling upwards with yellow &quot;New&quot; badges and links.
                </p>
              </div>
            </div>
          </div>

          {/* Add New News Item Form */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50/70 to-blue-50/40 border border-sky-100 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-[#009FE3]" />
              <span>Add New Circular / Notice</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <input
                  type="text"
                  value={newNewsTitle}
                  onChange={(e) => setNewNewsTitle(e.target.value)}
                  placeholder="e.g. IGNOU July 2026-27 Hall Ticket Download Link..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 font-medium outline-none focus:border-[#009FE3]"
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={newNewsLink}
                  onChange={(e) => setNewNewsLink(e.target.value)}
                  placeholder="Link URL (#admission-form)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 outline-none focus:border-[#009FE3]"
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={newNewsDate}
                  onChange={(e) => setNewNewsDate(e.target.value)}
                  placeholder="Tag / Date (July 2026-27)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 outline-none focus:border-[#009FE3]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={newNewsIsNew}
                  onChange={(e) => setNewNewsIsNew(e.target.checked)}
                  className="rounded border-slate-300 text-[#009FE3] focus:ring-[#009FE3] w-4 h-4"
                />
                <span>Highlight with Yellow &quot;New&quot; Badge</span>
              </label>

              <button
                type="button"
                onClick={handleAddNewsItem}
                disabled={!newNewsTitle.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#009FE3] text-white text-xs font-bold hover:bg-[#008ac7] transition-all shadow-xs disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Live Ticker</span>
              </button>
            </div>
          </div>

          {/* List of Existing News Items */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Current Live News Items ({ (data.latestNews || DEFAULT_NEWS).length })
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {(data.latestNews || DEFAULT_NEWS).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-sky-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateNewsTitle(item.id, e.target.value)}
                        className="font-bold text-xs sm:text-sm text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#009FE3] outline-none flex-1 min-w-[200px]"
                      />
                      {item.isNew && (
                        <span className="px-1.5 py-0.5 text-[10px] font-black rounded bg-amber-400 text-slate-950 uppercase tracking-wide shrink-0">
                          New
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">Link:</span>
                        <input
                          type="text"
                          value={item.link || ""}
                          onChange={(e) => handleUpdateNewsLink(item.id, e.target.value)}
                          placeholder="#admission-form"
                          className="text-xs font-mono text-sky-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#009FE3] outline-none w-36"
                        />
                      </div>
                      {item.date && (
                        <span className="text-[11px] font-medium text-slate-400">
                          Tag: {item.date}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleToggleNewsIsNew(item.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        item.isNew
                          ? "bg-amber-100 text-amber-900 border border-amber-200"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {item.isNew ? "★ New Badge On" : "Add New Badge"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveNewsItem(item.id)}
                      title="Delete notice"
                      className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: HERO BANNER & HEADLINE */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-[#009FE3]" />
            <h3 className="text-base font-bold text-slate-900">
              Hero Banner & Headline Copy
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Top Trust Badge
              </label>
              <input
                type="text"
                value={data.heroBadge}
                onChange={(e) => setData({ ...data, heroBadge: e.target.value })}
                placeholder="NAAC A++ Accredited • UGC-DEB Approved Central University"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Main H1 Headline
              </label>
              <input
                type="text"
                value={data.heroHeadline}
                onChange={(e) =>
                  setData({ ...data, heroHeadline: e.target.value })
                }
                placeholder="Empower Your Career with IGNOU Distance & Online Degrees 2026-27"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900 font-extrabold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Sub-headline Description
              </label>
              <textarea
                rows={3}
                value={data.heroSubtitle}
                onChange={(e) =>
                  setData({ ...data, heroSubtitle: e.target.value })
                }
                placeholder="Detailed description below the headline..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: KEY STATS */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <BarChart3 className="w-5 h-5 text-[#009FE3]" />
            <h3 className="text-base font-bold text-slate-900">
              Institutional Statistics & Trust Badges
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#009FE3]" />
                <span>Active Learners</span>
              </label>
              <input
                type="text"
                value={data.learnersCount}
                onChange={(e) =>
                  setData({ ...data, learnersCount: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-extrabold text-slate-900 text-sm outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#009FE3]" />
                <span>Courses Offered</span>
              </label>
              <input
                type="text"
                value={data.programsCount}
                onChange={(e) =>
                  setData({ ...data, programsCount: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-extrabold text-slate-900 text-sm outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>NAAC Accreditation</span>
              </label>
              <input
                type="text"
                value={data.naacRating}
                onChange={(e) => setData({ ...data, naacRating: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-extrabold text-slate-900 text-sm outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Regional Centers</span>
              </label>
              <input
                type="text"
                value={data.centersCount}
                onChange={(e) =>
                  setData({ ...data, centersCount: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-extrabold text-slate-900 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: ADMISSION FORM COPY */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Layers className="w-5 h-5 text-[#009FE3]" />
            <h3 className="text-base font-bold text-slate-900">
              Admission Lead Form Copy
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Form Heading
              </label>
              <input
                type="text"
                value={data.admissionFormHeading}
                onChange={(e) =>
                  setData({ ...data, admissionFormHeading: e.target.value })
                }
                placeholder="Apply for Admission 2026-27"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Form Subtitle
              </label>
              <input
                type="text"
                value={data.admissionFormSubheading}
                onChange={(e) =>
                  setData({ ...data, admissionFormSubheading: e.target.value })
                }
                placeholder="Check eligibility, course fee & get personalized expert counseling"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>
          </div>
        </div>

      </form>
    </AdminLayoutWrapper>
  );
}
