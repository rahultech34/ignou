"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  ExternalLink,
  LogOut,
} from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  onToggleMobile: () => void;
  title: string;
  subtitle?: string;
  adminName?: string;
  storageStatus?: {
    connected: boolean;
    provider: string;
  } | null;
}

export function AdminHeader({
  onToggleMobile,
  title,
  subtitle,
  adminName = "Administrator",
  storageStatus,
}: AdminHeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-5 lg:px-10 flex items-center justify-between gap-3">
      {/* Left: Mobile/Tablet hamburger & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobile}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-slate-500 hidden sm:block truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Status badge & Actions */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Real-time Storage / Database Status Indicator */}
        {storageStatus ? (
          <div
            title={storageStatus.provider}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${
              storageStatus.connected
                ? "bg-emerald-50 border-emerald-200/80 text-emerald-700"
                : "bg-amber-50 border-amber-200/80 text-amber-700"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                storageStatus.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span>{storageStatus.connected ? "Firestore Synced" : "Local File Store"}</span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Checking Storage...</span>
          </div>
        )}

        {/* Live Site Link */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-semibold transition-colors shadow-2xs hover:bg-slate-50"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        {/* Profile Avatar & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <Link
            href="/admin/profile"
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#009FE3] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-bold text-slate-700 hidden sm:inline">
              {adminName}
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            title="Log Out of Admin Portal"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{loggingOut ? "Signing out..." : "Log Out"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
