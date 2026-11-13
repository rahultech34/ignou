"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  GraduationCap,
  Image as ImageIcon,
  Settings,
  User,
  LogOut,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  X,
  Award,
  LifeBuoy,
  Globe,
  Layers,
  Users,
  BarChart3,
  TrendingUp,
} from "lucide-react";

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  adminEmail?: string;
  adminName?: string;
}

export function AdminSidebar({
  mobileOpen,
  setMobileOpen,
  adminEmail = "admin@edukyu.com",
  adminName = "Edukyu Admin",
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [ugExpanded, setUgExpanded] = useState(pathname.startsWith("/admin/ug-programs"));
  const [pgExpanded, setPgExpanded] = useState(pathname.startsWith("/admin/pg-programs"));
  const [mbaExpanded, setMbaExpanded] = useState(pathname.startsWith("/admin/mba-specializations"));
  const [studentZoneExpanded, setStudentZoneExpanded] = useState(pathname.startsWith("/admin/student-zone"));
  const [blogsExpanded, setBlogsExpanded] = useState(pathname.startsWith("/admin/blogs"));
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error(e);
      setIsLoggingOut(false);
    }
  };

  const isActive = (path: string, exact = true) => {
    return exact ? pathname === path : pathname.startsWith(path);
  };

  const navLinkClass = (active: boolean) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
      active
        ? "bg-[#009FE3] text-white shadow-md shadow-[#009FE3]/20"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  const subNavLinkClass = (active: boolean) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
      active
        ? "bg-[#009FE3]/10 text-[#009FE3] font-bold"
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          {/* Edukyu Logo */}
          <div className="h-6 w-auto shrink-0 flex items-center">
            <Image
              src="/edukyu-logo.png"
              alt="EduKyu Logo"
              width={80}
              height={24}
              className="h-6 w-auto object-contain"
              priority
            />
          </div>

          <span className="text-slate-300">|</span>

          {/* IGNOU CMS Label */}
          <div>
            <div className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-none flex items-center gap-1">
              IGNOU <span className="text-[#009FE3]">CMS</span>
            </div>
            <div className="text-[9px] text-slate-400 font-medium">Admin Console</div>
          </div>
        </Link>

        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4">
        {/* SECTION: Overview & CRM */}
        <div className="space-y-1">
          <div className="px-3.5 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Overview & CRM
          </div>

          {/* Dashboard */}
          <Link
            href="/admin/dashboard"
            onClick={() => setMobileOpen(false)}
            className={navLinkClass(isActive("/admin/dashboard"))}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </div>
          </Link>

          {/* Leads CRM */}
          <Link
            href="/admin/leads"
            onClick={() => setMobileOpen(false)}
            className={navLinkClass(isActive("/admin/leads"))}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 shrink-0 text-sky-600" />
              <span>Admission Leads</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isActive("/admin/leads") ? "bg-white/20 text-white" : "bg-sky-50 text-[#009FE3]"
            }`}>
              CRM
            </span>
          </Link>

          {/* Analytics */}
          <Link
            href="/admin/analytics"
            onClick={() => setMobileOpen(false)}
            className={navLinkClass(isActive("/admin/analytics"))}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 shrink-0 text-indigo-600" />
              <span>Analytics</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isActive("/admin/analytics") ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700"
            }`}>
              Live
            </span>
          </Link>
        </div>

        {/* SECTION: Academic Programs */}
        <div className="space-y-1">
          <div className="px-3.5 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Academic Programs
          </div>

          {/* UG Programs Dropdown */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setUgExpanded(!ugExpanded)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive("/admin/ug-programs", false)
                  ? "text-[#009FE3] bg-[#009FE3]/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 shrink-0 text-sky-600" />
                <span>UG Programs</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  ugExpanded ? "rotate-180 text-[#009FE3]" : ""
                }`}
              />
            </button>

            {ugExpanded && (
              <div className="pl-6 space-y-1 pt-0.5">
                <Link
                  href="/admin/ug-programs"
                  onClick={() => setMobileOpen(false)}
                  className={subNavLinkClass(pathname === "/admin/ug-programs")}
                >
                  <span>All UG Programs</span>
                </Link>
                <Link
                  href="/admin/ug-programs/new"
                  onClick={() => setMobileOpen(false)}
                  className={subNavLinkClass(pathname === "/admin/ug-programs/new")}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add New UG</span>
                </Link>
              </div>
            )}
          </div>

          {/* PG Programs Dropdown */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setPgExpanded(!pgExpanded)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive("/admin/pg-programs", false)
                  ? "text-[#009FE3] bg-[#009FE3]/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 shrink-0 text-indigo-600" />
                <span>PG Programs</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  pgExpanded ? "rotate-180 text-[#009FE3]" : ""
                }`}
              />
            </button>

            {pgExpanded && (
              <div className="pl-6 space-y-1 pt-0.5">
                <Link
                  href="/admin/pg-programs"
                  onClick={() => setMobileOpen(false)}
                  className={subNavLinkClass(pathname === "/admin/pg-programs")}
                >
                  <span>All PG Programs</span>
                </Link>
                <Link
                  href="/admin/pg-programs/new"
                  onClick={() => setMobileOpen(false)}
                  className={subNavLinkClass(pathname === "/admin/pg-programs/new")}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add New PG</span>
                </Link>
              </div>
            )}
          </div>

          {/* MBA Specializations Dropdown */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setMbaExpanded(!mbaExpanded)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive("/admin/mba-specializations", false)
                  ? "text-[#009FE3] bg-[#009FE3]/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 shrink-0 text-amber-600" />
                <span>MBA Specializations</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mbaExpanded ? "rotate-180 text-[#009FE3]" : ""
                }`}
              />
            </button>

            {mbaExpanded && (
              <div className="pl-6 space-y-1 pt-0.5">
                <Link
                  href="/admin/mba-specializations"
                  onClick={() => setMobileOpen(false)}
                  className={subNavLinkClass(pathname === "/admin/mba-specializations")}
                >
                  <span>All Specializations</span>
                </Link>
                <Link
                  href="/admin/mba-specializations/new"
                  onClick={() => setMobileOpen(false)}
                  className={subNavLinkClass(pathname === "/admin/mba-specializations/new")}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Specialization</span>
                </Link>
              </div>
            )}
          </div>

          {/* Student Zone Dropdown */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setStudentZoneExpanded(!studentZoneExpanded)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive("/admin/student-zone", false)
                  ? "text-[#009FE3] bg-[#009FE3]/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <LifeBuoy className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Student Zone</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  studentZoneExpanded ? "rotate-180 text-[#009FE3]" : ""
                }`}
              />
            </button>

            {studentZoneExpanded && (
              <div className="pl-6 space-y-1 pt-0.5">
                <Link
                  href="/admin/student-zone"
                  onClick={() => setMobileOpen(false)}
                  className={subNavLinkClass(pathname === "/admin/student-zone")}
                >
                  <span>All Student Resources</span>
                </Link>
                <Link
                  href="/admin/student-zone/new"
                  onClick={() => setMobileOpen(false)}
                  className={subNavLinkClass(pathname === "/admin/student-zone/new")}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add New Resource</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* SECTION: Content & Media */}
        <div className="space-y-1">
          <div className="px-3.5 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Content & Media
          </div>

          {/* Home Page Content Manager */}
          <Link
            href="/admin/home-page"
            onClick={() => setMobileOpen(false)}
            className={navLinkClass(isActive("/admin/home-page"))}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 shrink-0 text-sky-600" />
              <span>Home Page Editor</span>
            </div>
          </Link>

          {/* Blogs Dropdown */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setBlogsExpanded(!blogsExpanded)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive("/admin/blogs", false)
                  ? "text-[#009FE3] bg-[#009FE3]/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Blogs & Articles</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  blogsExpanded ? "rotate-180 text-[#009FE3]" : ""
                }`}
              />
            </button>

            {blogsExpanded && (
              <div className="pl-6 space-y-1 pt-0.5">
                <Link
                  href="/admin/blogs"
                  onClick={() => setMobileOpen(false)}
                  className={subNavLinkClass(pathname === "/admin/blogs")}
                >
                  <span>All Articles</span>
                </Link>
                <Link
                  href="/admin/blogs/new"
                  onClick={() => setMobileOpen(false)}
                  className={subNavLinkClass(pathname === "/admin/blogs/new")}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Write New Article</span>
                </Link>
              </div>
            )}
          </div>

          {/* Media Library */}
          <Link
            href="/admin/media"
            onClick={() => setMobileOpen(false)}
            className={navLinkClass(isActive("/admin/media"))}
          >
            <div className="flex items-center gap-3">
              <ImageIcon className="w-4 h-4 shrink-0 text-purple-600" />
              <span>Media Library</span>
            </div>
          </Link>
        </div>

        {/* SECTION: Administration */}
        <div className="space-y-1">
          <div className="px-3.5 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Administration
          </div>

          {/* User Management */}
          <Link
            href="/admin/users"
            onClick={() => setMobileOpen(false)}
            className={navLinkClass(isActive("/admin/users"))}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 shrink-0 text-purple-600" />
              <span>User & Team Access</span>
            </div>
          </Link>

          {/* Settings */}
          <Link
            href="/admin/settings"
            onClick={() => setMobileOpen(false)}
            className={navLinkClass(isActive("/admin/settings"))}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 shrink-0 text-slate-600" />
              <span>Site Settings</span>
            </div>
          </Link>

          {/* Profile & Password */}
          <Link
            href="/admin/profile"
            onClick={() => setMobileOpen(false)}
            className={navLinkClass(isActive("/admin/profile"))}
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 shrink-0 text-slate-600" />
              <span>Profile & Password</span>
            </div>
          </Link>
        </div>

        {/* View Public Website */}
        <div className="pt-2 border-t border-slate-100">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-[#009FE3] hover:bg-sky-50 transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* User Footer / Logout */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#009FE3] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-slate-900 truncate">{adminName}</div>
              <div className="text-[10px] text-slate-500 truncate">{adminEmail}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Log Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Off-canvas Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
