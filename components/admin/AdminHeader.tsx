"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  ExternalLink,
  LogOut,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  onToggleMobile: () => void;
  title: string;
  subtitle?: string;
  adminName?: string;
}

export function AdminHeader({
  onToggleMobile,
  title,
  subtitle,
  adminName = "Administrator",
}: AdminHeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      setLoggingOut(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobile}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 md:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-slate-500 hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Status badge & Actions */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Real-time Storage / Database Synced Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Storage Synced</span>
        </div>

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
