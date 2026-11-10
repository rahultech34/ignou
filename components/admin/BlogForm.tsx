"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  Globe,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Tag,
  User,
  Folder,
} from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUploader } from "./ImageUploader";
import { Blog } from "@/lib/types";

interface BlogFormProps {
  initialData?: Blog | null;
  isEdit?: boolean;
}

const CATEGORIES = [
  "Admissions",
  "Exam & Datesheet",
  "Assignments",
  "Results & Grade Card",
  "Career & Placement",
  "Student Guides",
];

export function BlogForm({ initialData, isEdit = false }: BlogFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(
    initialData?.content ||
      "<h2>Introduction</h2><p>Provide comprehensive insights and information about IGNOU distance education...</p>"
  );
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [author, setAuthor] = useState(
    initialData?.author || "IGNOU EduKyu Editorial Team"
  );
  const [category, setCategory] = useState(initialData?.category || "Admissions");
  const [readTime, setReadTime] = useState(initialData?.readTime || "5 min read");
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(", ") || "IGNOU, Admissions 2026-27, Distance Learning"
  );
  const [status, setStatus] = useState<"draft" | "published">(
    initialData?.status || "published"
  );

  // SEO fields
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription || ""
  );

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    if (!title.trim()) {
      setError("Article title is required.");
      setSaving(false);
      return;
    }

    const payload: Partial<Blog> = {
      title: title.trim(),
      slug: slug || slugifyHelper(title),
      excerpt: excerpt.trim(),
      content,
      coverImage,
      author: author.trim(),
      category,
      readTime,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      status,
    };

    try {
      const url =
        isEdit && initialData
          ? `/api/admin/blogs/${initialData.id}`
          : "/api/admin/blogs";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save blog post.");
        setSaving(false);
        return;
      }

      setSuccess("Article saved successfully!");
      setSaving(false);

      setTimeout(() => {
        router.push("/admin/blogs");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to connect to admin server.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {isEdit ? `Edit: ${initialData?.title}` : "Compose New Article"}
            </h2>
            <p className="text-xs text-slate-500">
              Write rich guides, admissions notices, exam alerts, and student announcements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
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
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? "Update Article" : "Publish Article"}</span>
              </>
            )}
          </button>
        </div>
      </div>

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

      {/* Main Form 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Title, Excerpt, Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Article Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. IGNOU Admission July 2026-27: Registration Link & Documents"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-sm sm:text-base font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                URL Slug <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugifyHelper(e.target.value))}
                placeholder="ignou-admission-july-2026-27"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Short Excerpt
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Summary snippet displayed on article cards..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Article Body Content
              </label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>

          {/* SEO Box */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#009FE3]" />
              <span>Search Engine Optimization (SEO)</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Custom browser tab and search title..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Meta Description
              </label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Google search results snippet..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Metadata, Featured Image, Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Publishing Settings
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm outline-none focus:border-[#009FE3]"
              >
                <option value="published">Published Live</option>
                <option value="draft">Save as Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm outline-none focus:border-[#009FE3]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. IGNOU EduKyu Editorial Team"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Read Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 5 min read"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="IGNOU, Admissions, Distance MBA"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <ImageUploader
              value={coverImage}
              onChange={setCoverImage}
              label="Article Cover Image"
              helper="Recommended size: 1200x630 (WebP/PNG/JPG)"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
