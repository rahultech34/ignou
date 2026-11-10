"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UploadCloud, X, CheckCircle2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

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
  helper = "PNG, JPG, WebP up to 10MB",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      setUploading(false);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setManualInput(!manualInput)}
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

      {manualInput ? (
        <div className="space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
          />
          <p className="text-[11px] text-slate-400">Direct CDN or external image link.</p>
        </div>
      ) : (
        <div className="relative">
          {value ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
              <div className="relative h-48 sm:h-56 w-full">
                <Image
                  src={value}
                  alt="Upload preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <label className="px-3.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-100 cursor-pointer transition-all">
                  <span>Replace Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-md transition-all cursor-pointer"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="truncate max-w-[280px] font-mono text-[11px]">{value}</span>
                <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Uploaded</span>
                </span>
              </div>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-300 hover:border-[#009FE3] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-sky-50/30">
              <input
                type="file"
                accept="image/*"
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

      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    </div>
  );
}
