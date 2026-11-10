"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Copy,
  Check,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { MediaItem } from "@/lib/types";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (res.ok) {
        setMedia(data.media || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: "success", text: "Media uploaded successfully!" });
        fetchMedia();
      } else {
        setFeedback({
          type: "error",
          text: data.error || "Failed to upload media.",
        });
      }
    } catch (e: any) {
      setFeedback({
        type: "error",
        text: e.message || "Network error while uploading.",
      });
    } finally {
      setUploading(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMedia(media.filter((m) => m.id !== id));
        setFeedback({ type: "success", text: "Media deleted successfully." });
      } else {
        setFeedback({ type: "error", text: "Failed to delete media item." });
      }
    } catch (e) {
      setFeedback({ type: "error", text: "Network error while deleting." });
    } finally {
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <AdminLayoutWrapper
      title="Media & Assets Library"
      subtitle="Upload and manage course banners, prospectus PDFs, faculty images, and university logos."
    >
      <div className="space-y-6">
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

        {/* Upload Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
          <label className="border-2 border-dashed border-slate-300 hover:border-[#009FE3] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-sky-50/30">
            <input
              type="file"
              accept="image/*,application/pdf"
              disabled={uploading}
              onChange={handleUpload}
              className="hidden"
            />

            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <span className="w-8 h-8 border-3 border-[#009FE3]/20 border-t-[#009FE3] rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-700">Uploading media to server...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#009FE3] flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Upload New Asset or Prospectus Document
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PNG, JPG, WebP, GIF, SVG, and PDF (Max 10MB)
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Media Grid */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Uploaded Files ({media.length})
            </h3>
            <span className="text-xs text-slate-400">Stored locally in /public/uploads/</span>
          </div>

          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <span className="w-8 h-8 border-3 border-[#009FE3]/20 border-t-[#009FE3] rounded-full animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Loading library items...</p>
            </div>
          ) : media.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#009FE3] flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">No media uploaded yet</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Upload image banners and brochures above to use them across course catalogs and blogs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {media.map((item) => {
                const isImage = item.mimeType?.startsWith("image/");
                return (
                  <div
                    key={item.id}
                    className="group border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="relative h-40 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                      {isImage ? (
                        <Image
                          src={item.url}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          unoptimized
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <FileText className="w-10 h-10 text-[#009FE3]" />
                          <span className="text-[11px] font-bold uppercase">
                            {item.name.split(".").pop()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-white border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                        <span>{formatFileSize(item.size)}</span>
                        <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                      </div>

                      <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleCopy(item.url, item.id)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                            copiedId === item.id
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          }`}
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Copied URL</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy URL</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete File"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
