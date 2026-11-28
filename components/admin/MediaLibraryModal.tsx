"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  X,
  UploadCloud,
  Search,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { MediaItem } from "@/lib/types";
import { sanitizeSafeUrl } from "@/lib/sanitize";

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const ALLOWED_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif";

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
    return "Invalid file type. Only JPG, PNG, WebP, and GIF images are allowed.";
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "File exceeds 10MB limit. Please choose a smaller image.";
  }
  return null;
}

interface MediaLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export function MediaLibraryModal({
  open,
  onClose,
  onSelect,
  title = "Insert or Select Image",
}: MediaLibraryModalProps) {
  if (!open) return null;
  return <MediaLibraryModalContent onClose={onClose} onSelect={onSelect} title={title} />;
}

function MediaLibraryModalContent({
  onClose,
  onSelect,
  title,
}: Omit<MediaLibraryModalProps, "open">) {
  const [activeTab, setActiveTab] = useState<"library" | "upload" | "url">("library");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/media")
      .then(async (res) => ({ ok: res.ok, data: await res.json() }))
      .then(({ ok, data }) => {
        if (!active) return;
        if (ok) {
          const items = (data.media || []) as MediaItem[];
          const imageOnly = items.filter(
            (m) =>
              m.mimeType?.startsWith("image/") ||
              /\.(jpg|jpeg|png|webp|gif)$/i.test(m.url)
          );
          setMedia(imageOnly);
        } else {
          setError(data.error || "Failed to load media library.");
        }
      })
      .catch(() => {
        if (active) setError("Network error while loading media library.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const uploadFile = async (file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed.");
        setUploading(false);
        return;
      }

      if (data.media) {
        setMedia((prev) => [data.media, ...prev]);
      }
      setUploading(false);
      onSelect(data.url);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload image.");
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (file) {
      void uploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void uploadFile(file);
    }
  };

  const handleUrlSubmit = () => {
    const safeUrl = sanitizeSafeUrl(urlInput);
    if (!safeUrl) {
      setError("Invalid image URL. Only https://, http://, or /uploads/... paths are allowed.");
      return;
    }
    setError(null);
    onSelect(safeUrl);
    setUrlInput("");
    onClose();
  };

  const filteredMedia = media.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#009FE3] flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">{title}</h3>
              <p className="text-[11px] text-slate-500">
                Choose from uploaded assets, upload a new image, or paste a safe URL.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50/70">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setActiveTab("library");
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "library"
                ? "bg-[#009FE3] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            Media Library ({media.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setActiveTab("upload");
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "upload"
                ? "bg-[#009FE3] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            Upload New
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setActiveTab("url");
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "url"
                ? "bg-[#009FE3] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            Paste Image URL
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "library" && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search uploaded images..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
                />
              </div>

              {loading ? (
                <div className="py-12 text-center flex flex-col items-center gap-2">
                  <span className="w-7 h-7 border-3 border-[#009FE3]/20 border-t-[#009FE3] rounded-full animate-spin" />
                  <span className="text-xs text-slate-500">Loading media library...</span>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                  <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">
                    {media.length === 0 ? "No uploaded images yet." : "No matching images found."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className="mt-3 px-3.5 py-1.5 rounded-lg bg-[#009FE3] text-white text-xs font-bold cursor-pointer"
                  >
                    Upload Image
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredMedia.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelect(item.url);
                        onClose();
                      }}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 hover:border-[#009FE3] bg-slate-50 text-left transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#009FE3]"
                    >
                      <div className="relative aspect-video w-full bg-slate-100">
                        <Image
                          src={item.url}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          unoptimized
                        />
                      </div>
                      <div className="p-2 bg-white border-t border-slate-100">
                        <p className="text-[11px] font-semibold text-slate-700 truncate">
                          {item.name}
                        </p>
                      </div>
                      <span className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-[#009FE3] text-white rounded-full p-1 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "upload" && (
            <label
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isDragging) setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-[#009FE3] bg-sky-50/70"
                  : "border-slate-300 hover:border-[#009FE3] bg-slate-50/50 hover:bg-sky-50/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_IMAGE_ACCEPT}
                disabled={uploading}
                onChange={handleFileChange}
                className="hidden"
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="w-8 h-8 border-3 border-[#009FE3]/20 border-t-[#009FE3] rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-700">Uploading image...</p>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#009FE3] flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    Click to browse or drop an image here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    JPG, PNG, WebP, GIF up to 10MB
                  </p>
                </>
              )}
            </label>
          )}

          {activeTab === "url" && (
            <div className="space-y-3 max-w-lg mx-auto py-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Image URL
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleUrlSubmit();
                      }
                    }}
                    placeholder="https://example.com/banner.webp or /uploads/..."
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  className="px-4 py-2.5 rounded-xl bg-[#009FE3] hover:bg-[#0086bf] text-white text-xs font-bold cursor-pointer shrink-0"
                >
                  Use Image
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Only https://, http://, or relative /uploads/... paths are accepted.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
