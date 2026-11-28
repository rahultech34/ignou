"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Save,
  ArrowLeft,
  Globe,
  AlertCircle,
  CheckCircle2,
  Eye,
  X,
  Plus,
  Clock,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUploader } from "./ImageUploader";
import { Blog } from "@/lib/types";
import { normalizeSlugInput, slugify } from "@/lib/slug";
import { BLOG_CATEGORIES, estimateReadingTime } from "@/lib/blog-constants";
import { sanitizePublicHtml } from "@/lib/sanitize";

interface BlogFormProps {
  initialData?: Blog | null;
  isEdit?: boolean;
}

interface StoredDraftPayload {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  readTime: string;
  autoReadTime: boolean;
  tags: string[];
  displayOrder: string;
  status: "draft" | "published";
  metaTitle: string;
  metaDescription: string;
  savedAt: string;
}

export function BlogForm({ initialData, isEdit = false }: BlogFormProps) {
  const router = useRouter();
  const draftStorageKey =
    isEdit && initialData ? `blog_draft_${initialData.id}` : "blog_draft_new";

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [author, setAuthor] = useState(
    initialData?.author || "IGNOU EduKyu Editorial Team"
  );
  const [category, setCategory] = useState(
    initialData?.category || BLOG_CATEGORIES[0]
  );
  const [readTime, setReadTime] = useState(initialData?.readTime || "");
  const [autoReadTime, setAutoReadTime] = useState(!initialData?.readTime);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [displayOrder, setDisplayOrder] = useState<string>(
    initialData?.displayOrder !== undefined ? String(initialData.displayOrder) : ""
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
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [restorableDraft, setRestorableDraft] = useState<StoredDraftPayload | null>(null);
  const [autoSaveNote, setAutoSaveNote] = useState<string | null>(null);

  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInteractedRef = useRef(false);

  const computedReadTime = useMemo(() => estimateReadingTime(content), [content]);
  const effectiveReadTime = autoReadTime
    ? computedReadTime
    : readTime.trim() || computedReadTime;

  const categoryOptions = useMemo(() => {
    const list: string[] = [...BLOG_CATEGORIES];
    if (category && !list.includes(category)) {
      list.unshift(category);
    }
    return list;
  }, [category]);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  // Check for saved local draft once on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(draftStorageKey);
        if (!raw) return;
        const parsed = JSON.parse(raw) as StoredDraftPayload;
        const hasUsefulData = Boolean(
          parsed.title?.trim() ||
            parsed.content?.replace(/<[^>]*>/g, "").trim() ||
            parsed.excerpt?.trim()
        );
        if (hasUsefulData) {
          setRestorableDraft(parsed);
        }
      } catch {
        // Ignore corrupted local draft
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [draftStorageKey]);

  // Debounced localStorage auto-save while editing
  useEffect(() => {
    if (!hasInteractedRef.current || redirecting) return;
    const timer = setTimeout(() => {
      try {
        const snapshot: StoredDraftPayload = {
          title,
          slug,
          excerpt,
          content,
          coverImage,
          author,
          category,
          readTime,
          autoReadTime,
          tags,
          displayOrder,
          status,
          metaTitle,
          metaDescription,
          savedAt: new Date().toISOString(),
        };
        window.localStorage.setItem(draftStorageKey, JSON.stringify(snapshot));
        setAutoSaveNote("Draft auto-saved locally");
      } catch {
        // Ignore storage quota errors
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [
    title,
    slug,
    excerpt,
    content,
    coverImage,
    author,
    category,
    readTime,
    autoReadTime,
    tags,
    displayOrder,
    status,
    metaTitle,
    metaDescription,
    draftStorageKey,
    redirecting,
  ]);

  // Warn before closing tab with unsaved changes
  useEffect(() => {
    if (!isDirty || redirecting) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, redirecting]);

  const markDirty = () => {
    hasInteractedRef.current = true;
    if (!isDirty) setIsDirty(true);
  };

  const handleRestoreDraft = () => {
    if (!restorableDraft) return;
    setTitle(restorableDraft.title || "");
    setSlug(restorableDraft.slug || "");
    setExcerpt(restorableDraft.excerpt || "");
    setContent(restorableDraft.content || "");
    setCoverImage(restorableDraft.coverImage || "");
    setAuthor(restorableDraft.author || "IGNOU EduKyu Editorial Team");
    setCategory(restorableDraft.category || BLOG_CATEGORIES[0]);
    setReadTime(restorableDraft.readTime || "");
    setAutoReadTime(restorableDraft.autoReadTime ?? true);
    setTags(Array.isArray(restorableDraft.tags) ? restorableDraft.tags : []);
    setDisplayOrder(restorableDraft.displayOrder || "");
    setStatus(restorableDraft.status || "published");
    setMetaTitle(restorableDraft.metaTitle || "");
    setMetaDescription(restorableDraft.metaDescription || "");
    setRestorableDraft(null);
    markDirty();
  };

  const handleDiscardDraft = () => {
    try {
      window.localStorage.removeItem(draftStorageKey);
    } catch {
      // Ignore storage errors
    }
    setRestorableDraft(null);
  };

  const handleTitleChange = (newTitle: string) => {
    markDirty();
    setTitle(newTitle);
    if (!isEdit && (!slug || slug === slugify(title))) {
      setSlug(slugify(newTitle));
    }
  };

  const addTagsFromInput = (raw: string) => {
    const incoming = raw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    if (incoming.length === 0) return;

    markDirty();
    setTags((prev) => {
      const seen = new Set(prev.map((p) => p.toLowerCase()));
      const next = [...prev];
      for (const item of incoming) {
        if (!seen.has(item.toLowerCase())) {
          seen.add(item.toLowerCase());
          next.push(item);
        }
      }
      return next;
    });
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    markDirty();
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || redirecting) return;

    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("Article title is required.");
      return;
    }

    const finalSlug = slugify(slug || title);
    if (!finalSlug) {
      setError("A valid URL slug (using letters, numbers, or hyphens) is required.");
      return;
    }
    setSlug(finalSlug);

    const plainBodyText = content.replace(/<[^>]*>/g, " ").trim();
    if (!plainBodyText && !content.includes("<img")) {
      setError("Article body content cannot be empty.");
      return;
    }

    const parsedOrder =
      displayOrder.trim() !== "" && Number.isFinite(Number(displayOrder))
        ? Number(displayOrder)
        : undefined;

    setSaving(true);

    const payload: Partial<Blog> = {
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt.trim(),
      content,
      coverImage,
      author: author.trim() || "IGNOU EduKyu Editorial Team",
      category,
      readTime: effectiveReadTime,
      tags,
      displayOrder: parsedOrder,
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim(),
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

      try {
        window.localStorage.removeItem(draftStorageKey);
      } catch {
        // Ignore storage errors
      }

      setIsDirty(false);
      setAutoSaveNote(null);
      setSuccess("Article saved successfully! Redirecting...");
      setSaving(false);
      setRedirecting(true);

      redirectTimerRef.current = setTimeout(() => {
        router.push("/admin/blogs");
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect to admin server.");
      setSaving(false);
    }
  };

  const previewMetaTitle = (metaTitle.trim() || title.trim() || "Article Title | IGNOU Portal").slice(0, 70);
  const previewMetaDesc = (
    metaDescription.trim() ||
    excerpt.trim() ||
    "Add a concise meta description to preview how this article appears in Google Search."
  ).slice(0, 165);
  const metaTitleLen = metaTitle.trim().length;
  const metaDescLen = metaDescription.trim().length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Compact Action Bar (avoids duplicate page heading under AdminHeader) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </Link>
          {autoSaveNote && (
            <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
              {autoSaveNote}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#009FE3]" />
            <span>Preview</span>
          </button>
          <Link
            href="/admin/blogs"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || redirecting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009FE3] hover:bg-[#0086bf] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#009FE3]/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{status === "draft" ? "Saving Draft..." : "Publishing..."}</span>
              </>
            ) : redirecting ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>
                  {isEdit
                    ? "Update Article"
                    : status === "draft"
                    ? "Save Draft"
                    : "Publish Article"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Restore Local Draft Banner */}
      {restorableDraft && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              An unsaved local draft from{" "}
              <strong>{new Date(restorableDraft.savedAt).toLocaleString("en-IN")}</strong> was
              found.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
            >
              Restore Draft
            </button>
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-amber-800 text-xs font-semibold hover:bg-amber-100 cursor-pointer"
            >
              Discard
            </button>
          </div>
        </div>
      )}

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

      {/* Main Form Grid: 4 cols (mobile), 8 cols (tablet), 12 cols (laptop/desktop) */}
      <div className="site-grid items-start">
        {/* Left Column: Title, Excerpt, Content */}
        <div className="col-span-4 md:col-span-8 lg:col-span-8 space-y-6 min-w-0">
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
              <div className="flex items-center rounded-xl border border-slate-200 focus-within:border-[#009FE3] focus-within:ring-2 focus-within:ring-[#009FE3]/10 overflow-hidden">
                <span className="px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-xs font-mono text-slate-400 shrink-0">
                  /blogs/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    markDirty();
                    setSlug(normalizeSlugInput(e.target.value));
                  }}
                  onBlur={() => setSlug((prev) => slugify(prev))}
                  placeholder="ignou-admission-july-2026-27"
                  className="w-full px-3.5 py-2.5 outline-none text-xs sm:text-sm font-mono text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Short Excerpt
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => {
                  markDirty();
                  setExcerpt(e.target.value);
                }}
                placeholder="Summary snippet displayed on article cards..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Article Body Content <span className="text-rose-500">*</span>
              </label>
              <RichTextEditor
                value={content}
                onChange={(nextVal) => {
                  markDirty();
                  setContent(nextVal);
                }}
              />
            </div>
          </div>

          {/* SEO Box with Counters & Google SERP Preview */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#009FE3]" />
              <span>Search Engine Optimization (SEO)</span>
            </h3>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Meta Title
                </label>
                <span
                  className={`text-[11px] font-semibold ${
                    metaTitleLen === 0
                      ? "text-slate-400"
                      : metaTitleLen <= 60
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {metaTitleLen}/60 chars
                </span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => {
                  markDirty();
                  setMetaTitle(e.target.value);
                }}
                placeholder="Custom browser tab and search title (recommended 50–60 chars)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Meta Description
                </label>
                <span
                  className={`text-[11px] font-semibold ${
                    metaDescLen === 0
                      ? "text-slate-400"
                      : metaDescLen <= 160
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {metaDescLen}/160 chars
                </span>
              </div>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => {
                  markDirty();
                  setMetaDescription(e.target.value);
                }}
                placeholder="Google search results snippet (recommended 120–160 chars)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            {/* SERP Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Google Search Preview
              </div>
              <div className="text-xs text-emerald-700 truncate">
                https://ignouadmission.edukyu.com/blogs/{slug || "your-article-slug"}
              </div>
              <div className="text-base font-semibold text-blue-700 leading-snug truncate">
                {previewMetaTitle}
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {previewMetaDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata, Featured Image, Status */}
        <div className="col-span-4 md:col-span-8 lg:col-span-4 space-y-6 min-w-0">
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
                onChange={(e) => {
                  markDirty();
                  setStatus(e.target.value as "published" | "draft");
                }}
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
                onChange={(e) => {
                  markDirty();
                  setCategory(e.target.value);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm outline-none focus:border-[#009FE3]"
              >
                {categoryOptions.map((cat) => (
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
                onChange={(e) => {
                  markDirty();
                  setAuthor(e.target.value);
                }}
                placeholder="e.g. IGNOU EduKyu Editorial Team"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Read Time
                </label>
                <button
                  type="button"
                  onClick={() => {
                    markDirty();
                    if (autoReadTime) {
                      setReadTime(computedReadTime);
                      setAutoReadTime(false);
                    } else {
                      setAutoReadTime(true);
                    }
                  }}
                  className="text-[11px] font-semibold text-[#009FE3] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{autoReadTime ? "Override manually" : "Use Auto-calc"}</span>
                </button>
              </div>
              {autoReadTime ? (
                <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-[#009FE3]" />
                    {computedReadTime}
                  </span>
                  <span className="text-[11px] text-slate-400">Auto-calculated</span>
                </div>
              ) : (
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => {
                    markDirty();
                    setReadTime(e.target.value);
                  }}
                  placeholder="e.g. 5 min read"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] outline-none text-xs sm:text-sm text-slate-900"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Display Order (Optional)
              </label>
              <input
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => {
                  markDirty();
                  setDisplayOrder(e.target.value);
                }}
                placeholder="Lower number shows first (e.g. 1)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            {/* Tags Pill Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTagsFromInput(tagInput);
                    }
                  }}
                  placeholder="Add tag & press Enter"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:border-[#009FE3] outline-none text-xs sm:text-sm text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => addTagsFromInput(tagInput)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
              {tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-[11px] font-semibold"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-sky-600 hover:text-rose-600 cursor-pointer"
                        aria-label={`Remove ${tag}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <ImageUploader
              value={coverImage}
              onChange={(url) => {
                markDirty();
                setCoverImage(url);
              }}
              label="Article Cover Image"
              helper="Recommended size: 1200x630 (JPG, PNG, WebP, GIF)"
            />
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#009FE3]" />
                <span className="text-sm font-extrabold text-slate-900">Article Preview</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold uppercase">
                  {status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-200 cursor-pointer"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-sky-50 text-[#009FE3] font-bold">
                  {category}
                </span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {effectiveReadTime}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {title.trim() || "Untitled Article"}
              </h1>

              <div className="text-xs text-slate-500 pb-4 border-b border-slate-100">
                By <strong className="text-slate-800">{author.trim() || "Editorial Team"}</strong>
              </div>

              {coverImage && (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <Image
                    src={coverImage}
                    alt={title || "Cover preview"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {excerpt.trim() && (
                <div className="p-4 rounded-2xl bg-sky-50/70 border-l-4 border-[#009FE3] text-slate-700 text-sm italic">
                  {excerpt}
                </div>
              )}

              <div
                className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-a:text-[#009FE3]"
                dangerouslySetInnerHTML={{
                  __html: sanitizePublicHtml(
                    content || "<p class=\"text-slate-400\">No article body yet.</p>"
                  ),
                }}
              />

              {tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
