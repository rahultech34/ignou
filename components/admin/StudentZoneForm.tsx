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
  ExternalLink,
  LifeBuoy,
  Globe,
  FileDown,
  ListOrdered,
} from "lucide-react";
import { StudentResource } from "@/lib/types";

interface StudentZoneFormProps {
  initialData?: StudentResource | null;
  isEdit?: boolean;
}

const CATEGORIES = [
  "Exams",
  "Assignments",
  "Results",
  "Admissions",
  "Study Material",
  "Datesheet",
] as const;

export function StudentZoneForm({
  initialData,
  isEdit = false,
}: StudentZoneFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [category, setCategory] = useState<StudentResource["category"]>(
    initialData?.category || "Exams"
  );
  const [badge, setBadge] = useState(initialData?.badge || "Active Portal");
  const [description, setDescription] = useState(initialData?.description || "");
  const [linkText, setLinkText] = useState(
    initialData?.linkText || "Open Official Portal"
  );
  const [linkUrl, setLinkUrl] = useState(
    initialData?.linkUrl || "https://ignou.ac.in"
  );
  const [status, setStatus] = useState<"published" | "draft">(
    initialData?.status || "published"
  );
  const [instructions, setInstructions] = useState<string[]>(
    initialData?.instructions && initialData.instructions.length > 0
      ? initialData.instructions
      : [
          "Visit the official IGNOU student support link.",
          "Enter your 9 or 10-digit IGNOU Enrollment Number.",
          "Select your registered program code (e.g. BCA, MBA, BAG).",
          "Click Submit to check your status or download the document.",
        ]
  );

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit && !slug) {
      setSlug(slugify(val));
    }
  };

  const handleAddStep = () => {
    setInstructions([...instructions, ""]);
  };

  const handleUpdateStep = (index: number, val: string) => {
    const updated = [...instructions];
    updated[index] = val;
    setInstructions(updated);
  };

  const handleRemoveStep = (index: number) => {
    setInstructions(instructions.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSaving(true);

    if (!title.trim()) {
      setFeedback({ type: "error", text: "Resource title is required." });
      setSaving(false);
      return;
    }

    if (!linkUrl.trim()) {
      setFeedback({ type: "error", text: "Portal URL is required." });
      setSaving(false);
      return;
    }

    const payload: Partial<StudentResource> = {
      title: title.trim(),
      slug: slug || slugify(title),
      category,
      badge,
      description,
      linkText,
      linkUrl,
      instructions: instructions.filter((i) => i.trim().length > 0),
      status,
    };

    try {
      const url =
        isEdit && initialData
          ? `/api/admin/student-zone/${initialData.id}`
          : "/api/admin/student-zone";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback({
          type: "error",
          text: data.error || "Failed to save student resource.",
        });
        setSaving(false);
        return;
      }

      setFeedback({
        type: "success",
        text: "Student resource saved successfully!",
      });
      setSaving(false);

      setTimeout(() => {
        router.push("/admin/student-zone");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err.message || "Network error. Please try again.",
      });
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/student-zone"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {isEdit ? `Edit: ${initialData?.title}` : "New Student Zone Item"}
            </h2>
            <p className="text-xs text-slate-500">
              Configure official portal URLs, downloads, and instructions for IGNOU learners.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/student-zone"
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
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? "Update Resource" : "Create Resource"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main Form Fields */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Resource Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. IGNOU Hall Ticket & Admit Card Download"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
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
              Badge Tag
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. Live June 2026-27, Active, Important"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Portal / Target URL <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              required
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://hall_ticket.ignou.ac.in"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm font-mono text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Action Button Text
            </label>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Download Hall Ticket, Check Status, etc."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Description & Notes
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief explanation on how students use this portal..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
          />
        </div>

        {/* Step-by-Step Instructions */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Step-by-Step Student Instructions
              </h4>
              <p className="text-xs text-slate-500">
                Numbered guidelines shown to students before accessing the link.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddStep}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-[#009FE3] hover:bg-sky-100 font-bold text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Step</span>
            </button>
          </div>

          <div className="space-y-3">
            {instructions.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 text-center text-xs text-slate-400 font-bold">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleUpdateStep(idx, e.target.value)}
                  placeholder={`Step ${idx + 1}...`}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 outline-none text-xs sm:text-sm text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveStep(idx)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
