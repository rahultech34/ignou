"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  DollarSign,
  GraduationCap,
  Briefcase,
  Globe,
  Layers,
  HelpCircle,
} from "lucide-react";
import { Program } from "@/lib/types";

interface ProgramFormProps {
  type: "ug" | "pg" | "mba";
  initialData?: Program | null;
  isEdit?: boolean;
}

export function ProgramForm({ type, initialData, isEdit = false }: ProgramFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [code, setCode] = useState(initialData?.code || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [level, setLevel] = useState(
    initialData?.level ||
      (type === "ug"
        ? "Undergraduate (UG)"
        : type === "pg"
        ? "Postgraduate (PG)"
        : "Postgraduate Diploma / Master Degree")
  );
  const [duration, setDuration] = useState(
    initialData?.duration ||
      (type === "ug" ? "3 Years (Max 6 Years)" : "2 Years (Max 4 Years)")
  );
  const [fee, setFee] = useState(initialData?.fee || "₹18,000 Total (₹6,000/year)");
  const [mode, setMode] = useState<"Distance" | "Online" | "Distance & Online">(
    initialData?.mode || "Distance & Online"
  );
  const [badge, setBadge] = useState(initialData?.badge || "Admissions Open");
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || ""
  );
  const [overview, setOverview] = useState(initialData?.overview || "");
  const [eligibility, setEligibility] = useState(
    initialData?.eligibility ||
      (type === "ug"
        ? "10+2 or its equivalent from a recognized board."
        : "Bachelor's degree with minimum 50% marks from a recognized university.")
  );
  const [status, setStatus] = useState<"draft" | "published">(
    initialData?.status || "published"
  );

  // Highlights
  const [highlights, setHighlights] = useState<string[]>(
    initialData?.highlights && initialData.highlights.length > 0
      ? initialData.highlights
      : [
          "UGC-DEB approved university degree valid pan-India",
          "Comprehensive printed & digital study material via eGyanKosh",
          "Flexible examination cycle held twice a year (June & December)",
        ]
  );

  // Curriculum (list of semesters with subjects)
  const [curriculum, setCurriculum] = useState<
    { semester: string; subjects: string[] }[]
  >(
    initialData?.curriculum && initialData.curriculum.length > 0
      ? initialData.curriculum
      : [
          {
            semester: "Semester 1",
            subjects: ["Foundation Course 1", "Core Subject 1", "Elective Course 1"],
          },
          {
            semester: "Semester 2",
            subjects: ["Foundation Course 2", "Core Subject 2", "Environmental Studies"],
          },
        ]
  );

  // FAQs
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(
    initialData?.faqs && initialData.faqs.length > 0
      ? initialData.faqs
      : [
          {
            question: `Is the IGNOU ${code || title || "degree"} recognized for government jobs?`,
            answer:
              "Yes. IGNOU is a premier Central University established by an Act of Parliament. Its degrees are recognized by UGC, AIU, and all state/central government bodies.",
          },
        ]
  );

  // SEO fields
  const [metaTitle, setMetaTitle] = useState(
    initialData?.metaTitle || `IGNOU ${code} Admission 2026-27 - Eligibility & Fees`
  );
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription ||
      `Check IGNOU ${title} admission 2026-27 details, eligibility criteria, fees, curriculum, and registration link.`
  );

  const [activeTab, setActiveTab] = useState<
    "basic" | "overview" | "curriculum" | "faqs" | "seo"
  >("basic");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const slugifyHelper = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isEdit && (!slug || slug === slugifyHelper(title))) {
      setSlug(slugifyHelper(newTitle));
    }
  };

  // Highlights Handlers
  const addHighlight = () => {
    setHighlights([...highlights, ""]);
  };

  const updateHighlight = (index: number, val: string) => {
    const updated = [...highlights];
    updated[index] = val;
    setHighlights(updated);
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, idx) => idx !== index));
  };

  // Curriculum Handlers
  const addSemester = () => {
    setCurriculum([
      ...curriculum,
      {
        semester: `Semester ${curriculum.length + 1}`,
        subjects: ["Course Subject 1", "Course Subject 2"],
      },
    ]);
  };

  const updateSemesterTitle = (index: number, titleVal: string) => {
    const updated = [...curriculum];
    updated[index].semester = titleVal;
    setCurriculum(updated);
  };

  const updateSubjects = (index: number, text: string) => {
    const updated = [...curriculum];
    updated[index].subjects = text
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setCurriculum(updated);
  };

  const removeSemester = (index: number) => {
    setCurriculum(curriculum.filter((_, idx) => idx !== index));
  };

  // FAQ Handlers
  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const updateFaq = (index: number, field: "question" | "answer", val: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: val };
    setFaqs(updated);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    if (!title.trim()) {
      setError("Program title is required.");
      setSaving(false);
      return;
    }

    if (!code.trim()) {
      setError("Program code is required (e.g. BCA, MBA, BAG).");
      setSaving(false);
      return;
    }

    const payload: Partial<Program> = {
      type,
      title: title.trim(),
      code: code.trim().toUpperCase(),
      slug: slug || slugifyHelper(title),
      level,
      duration,
      fee,
      eligibility,
      mode,
      badge,
      shortDescription,
      overview,
      highlights: highlights.filter((h) => h.trim().length > 0),
      curriculum,
      faqs: faqs.filter((f) => f.question.trim().length > 0),
      metaTitle,
      metaDescription,
      status,
    };

    try {
      const url = isEdit && initialData
        ? `/api/admin/programs/${initialData.id}`
        : "/api/admin/programs";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save program.");
        setSaving(false);
        return;
      }

      setSuccess("Program saved successfully!");
      setSaving(false);

      const targetListUrl =
        type === "ug"
          ? "/admin/ug-programs"
          : type === "pg"
          ? "/admin/pg-programs"
          : "/admin/mba-specializations";

      setTimeout(() => {
        router.push(targetListUrl);
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to connect to admin server.");
      setSaving(false);
    }
  };

  const backUrl =
    type === "ug"
      ? "/admin/ug-programs"
      : type === "pg"
      ? "/admin/pg-programs"
      : "/admin/mba-specializations";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href={backUrl}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Back to List"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {isEdit ? `Edit: ${initialData?.title}` : `New ${type.toUpperCase()} Offering`}
            </h2>
            <p className="text-xs text-slate-500">
              {isEdit
                ? "Update curriculum, fees, admission rules, and metadata."
                : "Add a new accredited IGNOU program to the database."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={backUrl}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009FE3] hover:bg-[#0086bf] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#009FE3]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Program...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? "Update Program" : "Create Program"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: "basic", label: "Basic Details", icon: GraduationCap },
          { id: "overview", label: "Overview & Highlights", icon: BookOpen },
          { id: "curriculum", label: "Curriculum & Semesters", icon: Layers },
          { id: "faqs", label: "FAQs & Questions", icon: HelpCircle },
          { id: "seo", label: "SEO Metadata", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-[#009FE3] text-[#009FE3]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Basic Details */}
      {activeTab === "basic" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Program Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Bachelor of Computer Applications (BCA)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Program Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="BCA, MBA, BAG, BCOMG"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm font-mono text-slate-900 font-bold uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                URL Slug <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugifyHelper(e.target.value))}
                placeholder="bachelor-of-computer-applications-bca"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Study Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm outline-none focus:border-[#009FE3]"
              >
                <option value="Distance & Online">Distance & Online (ODL + OL)</option>
                <option value="Distance">Distance ODL Only</option>
                <option value="Online">Online Mode Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="3 Years (Max 6 Years)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Fee Structure
              </label>
              <input
                type="text"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="₹46,200 Total (₹7,700/sem)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Publish Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm outline-none focus:border-[#009FE3]"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Badge Tag (Optional)
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. Highest In-Demand, NAAC A++, Popular"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Short Summary
            </label>
            <textarea
              rows={3}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief description displayed on cards and catalogs..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Overview & Highlights */}
      {activeTab === "overview" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Program Overview
            </label>
            <textarea
              rows={6}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Comprehensive academic overview of this IGNOU course..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Eligibility Criteria
            </label>
            <textarea
              rows={3}
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              placeholder="Minimum qualifying examinations, subjects, or marks..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
            />
          </div>

          {/* Highlights List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Key Highlights (Bullet Points)
              </label>
              <button
                type="button"
                onClick={addHighlight}
                className="text-xs text-[#009FE3] font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {highlights.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs text-slate-400 font-bold">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => updateHighlight(idx, e.target.value)}
                    placeholder="Enter highlight feature..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => removeHighlight(idx)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Curriculum & Semesters */}
      {activeTab === "curriculum" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Semester-Wise Syllabus</h3>
              <p className="text-xs text-slate-500">
                Organize coursework and subjects for each semester or year.
              </p>
            </div>
            <button
              type="button"
              onClick={addSemester}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 text-[#009FE3] hover:bg-sky-100 font-bold text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Semester</span>
            </button>
          </div>

          <div className="space-y-5">
            {curriculum.map((sem, sIdx) => (
              <div
                key={sIdx}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={sem.semester}
                    onChange={(e) => updateSemesterTitle(sIdx, e.target.value)}
                    placeholder={`Semester ${sIdx + 1}`}
                    className="font-bold text-sm text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 outline-none max-w-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeSemester(sIdx)}
                    className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Subjects (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={sem.subjects.join("\n")}
                    onChange={(e) => updateSubjects(sIdx, e.target.value)}
                    placeholder="Subject 1&#10;Subject 2&#10;Lab Course"
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 outline-none font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: FAQs */}
      {activeTab === "faqs" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Frequently Asked Questions</h3>
              <p className="text-xs text-slate-500">
                Course-specific questions to address student doubts.
              </p>
            </div>
            <button
              type="button"
              onClick={addFaq}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 text-[#009FE3] hover:bg-sky-100 font-bold text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, fIdx) => (
              <div
                key={fIdx}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-400">FAQ #{fIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeFaq(fIdx)}
                    className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFaq(fIdx, "question", e.target.value)}
                  placeholder="Question: e.g. What is the assignment submission deadline?"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-900 outline-none"
                />

                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => updateFaq(fIdx, "answer", e.target.value)}
                  placeholder="Answer explanation..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: SEO Metadata */}
      {activeTab === "seo" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Meta Title Tag
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="IGNOU BCA Admission 2026-27 - Eligibility & Fees"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Meta Description
            </label>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Search engine summary snippet (150-160 characters)..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
            />
          </div>
        </div>
      )}
    </form>
  );
}
