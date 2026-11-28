"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  CheckCircle2,
  Link as LinkIcon,
  FolderOpen,
  AlertTriangle,
} from "lucide-react";
import {
  MediaLibraryModal,
  ALLOWED_IMAGE_ACCEPT,
  validateImageFile,
} from "./MediaLibraryModal";
import { sanitizeSafeUrl } from "@/lib/sanitize";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helper?: string;
}

export function ImageUploader({
  value,
  onChange,
  label = "Featured Image",
  helper = "JPG, PNG, WebP, GIF up to 10MB",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const imageLoadError = Boolean(value) && failedUrl === value;

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
        setError(data.error || "Upload failed");
        setUploading(false);
        return;
      }

      onChange(data.url);
      setFailedUrl(null);
      setUploading(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
      setUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    void uploadFile(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void uploadFile(file);
    }
  };

  const handleRemove = () => {
    setError(null);
    setFailedUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (replaceInputRef.current) replaceInputRef.current.value = "";
    onChange("");
  };

  const handleManualUrlChange = (raw: string) => {
    setError(null);
    onChange(raw);
    if (raw.trim() && !sanitizeSafeUrl(raw)) {
      setError("Enter a valid https://, http://, or /uploads/... image URL.");
    }
  };

  const isLocalUpload = value.startsWith("/uploads/");

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            className="text-xs text-slate-600 hover:text-[#009FE3] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Media Library</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setManualInput(!manualInput);
            }}
            className="text-xs text-[#009FE3] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            {manualInput ? (
              <>
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload file</span>
              </>
            ) : (
              <>
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Paste image URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {manualInput ? (
        <div className="space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => handleManualUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg or /uploads/..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
          />
          <p className="text-[11px] text-slate-400">
            Direct CDN, external https:// image link, or /uploads/... path.
          </p>
        </div>
      ) : (
        <div className="relative">
          {value ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
              <div className="relative h-48 sm:h-56 w-full flex items-center justify-center bg-slate-100">
                {imageLoadError ? (
                  <div className="flex flex-col items-center justify-center p-4 text-center text-amber-700">
                    <AlertTriangle className="w-8 h-8 mb-2 text-amber-500" />
                    <p className="text-xs font-bold">Unable to preview image</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 max-w-[240px]">
                      Check the image URL or upload a replacement image.
                    </p>
                  </div>
                ) : (
                  <Image
                    src={value}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                    unoptimized
                    onError={() => setFailedUrl(value)}
                  />
                )}
              </div>

              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
                <label className="px-3 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-100 cursor-pointer transition-all">
                  <span>{uploading ? "Uploading..." : "Replace"}</span>
                  <input
                    ref={replaceInputRef}
                    type="file"
                    accept={ALLOWED_IMAGE_ACCEPT}
                    disabled={uploading}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setLibraryOpen(true)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold shadow-md hover:bg-slate-700 cursor-pointer transition-all"
                >
                  Library
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-md transition-all cursor-pointer"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-600">
                <span className="truncate max-w-[220px] font-mono text-[11px]">{value}</span>
                {imageLoadError ? (
                  <span className="flex items-center gap-1 text-amber-600 font-bold text-[11px] shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Broken URL</span>
                  </span>
                ) : isLocalUpload ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px] shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Uploaded</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sky-600 font-bold text-[11px] shrink-0">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>External URL</span>
                  </span>
                )}
              </div>
            </div>
          ) : (
            <label
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
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
                onChange={handleFileUpload}
                className="hidden"
              />

              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="w-8 h-8 border-3 border-[#009FE3]/20 border-t-[#009FE3] rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-700">Uploading image to server...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#009FE3] flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    Click to browse or drop an image here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">{helper}</p>
                </div>
              )}
            </label>
          )}
        </div>
      )}

      {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}

      <MediaLibraryModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={(url) => {
          setError(null);
          setManualInput(false);
          onChange(url);
        }}
        title="Select Cover Image"
      />
    </div>
  );
}
