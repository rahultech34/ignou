"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  FileText,
  LifeBuoy,
  Image as ImageIcon,
  ArrowRight,
  Clock,
  Database,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { DashboardStats, AdminUser } from "@/lib/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUg: 0,
    totalPg: 0,
    totalMba: 0,
    totalBlogs: 0,
    totalStudentResources: 0,
    totalMedia: 0,
    recentActivity: [],
  });
  const [admin, setAdmin] = useState<AdminUser>({
    id: "admin-1",
    name: "Edukyu Admin",
    email: "admin@edukyu.com",
    role: "superadmin",
  });
  const [dbInfo, setDbInfo] = useState<{
    connected: boolean;
    provider: string;
    projectId: string;
    databaseId: string;
  }>({
    connected: true,
    provider: "Google Cloud Firestore",
    projectId: "ignou-fe1a9",
    databaseId: "default",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, meRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/auth/me"),
        ]);
        if (statsRes.ok) {
          const sData = await statsRes.json();
          setStats(sData.stats);
          if (sData.database) {
            setDbInfo(sData.database);
          }
        }
        if (meRes.ok) {
          const mData = await meRes.json();
          setAdmin(mData.admin);
        }
      } catch (e) {
        console.error("Dashboard error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const statCards = [
    {
      title: "UG Programs",
      value: stats.totalUg,
      subtitle: "BCA, B.Com, BA, B.Sc & more",
      icon: GraduationCap,
      href: "/admin/ug-programs",
      bgColor: "bg-sky-50",
      textColor: "text-[#009FE3]",
    },
    {
      title: "PG Programs",
      value: stats.totalPg,
      subtitle: "MCA, M.Com, MA, M.Sc degrees",
      icon: BookOpen,
      href: "/admin/pg-programs",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      title: "MBA Specializations",
      value: stats.totalMba,
      subtitle: "Finance, Marketing, HR, Ops",
      icon: Briefcase,
      href: "/admin/mba-specializations",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      title: "Articles & News",
      value: stats.totalBlogs,
      subtitle: "Guides, Datesheet & Alerts",
      icon: FileText,
      href: "/admin/blogs",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Student Resources",
      value: stats.totalStudentResources,
      subtitle: "Hall Tickets, eGyanKosh, Portals",
      icon: LifeBuoy,
      href: "/admin/student-zone",
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
    },
    {
      title: "Media Library",
      value: stats.totalMedia,
      subtitle: "Assets & Uploaded Documents",
      icon: ImageIcon,
      href: "/admin/media",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <AdminLayoutWrapper
      title="IGNOU Admin Dashboard"
      subtitle="Overview of academic catalog, student resources, news articles, and active CMS items."
      adminEmail={admin.email}
      adminName={admin.name}
    >
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#0b2545] to-[#009FE3] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold mb-3 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>IGNOU Admissions Session 2026-27 Live</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {admin.name}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-sky-100 leading-relaxed">
              Manage degrees, semester syllabus, fees, student guidance portals, and published news from this unified portal.
            </p>
          </div>
        </div>

        {/* 6 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                href={card.href}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`p-3 rounded-xl ${card.bgColor} ${card.textColor}`}>
                      <Icon className="w-6 h-6" />
                    </span>
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-700 flex items-center gap-1 transition-colors">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {loading ? "..." : card.value}
                    </div>
                    <div className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-wider">
                      {card.title}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-slate-500">
                  {card.subtitle}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Two-Column Grid: Recent Content Activity & System Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Recent Content Activity (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recently Updated Content</h3>
                <p className="text-xs text-slate-500">Latest modifications across programs and articles</p>
              </div>
              <Link
                href="/admin/blogs"
                className="text-xs font-bold text-[#009FE3] hover:underline"
              >
                View all blogs →
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Loading recent updates...
              </div>
            ) : stats.recentActivity.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No recent activity recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {stats.recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          item.type === "blog"
                            ? "bg-blue-100 text-blue-800"
                            : item.type === "ug"
                            ? "bg-sky-100 text-sky-800"
                            : item.type === "pg"
                            ? "bg-indigo-100 text-indigo-800"
                            : item.type === "mba"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-teal-100 text-teal-800"
                        }`}
                      >
                        {item.type}
                      </span>
                      <div className="truncate">
                        <Link
                          href={item.href}
                          className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#009FE3] truncate block"
                        >
                          {item.title}
                        </Link>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          item.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {item.status}
                      </span>

                      <Link
                        href={item.href}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Edit Item"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System & Database Status Box (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#009FE3]" />
                  <span>Cloud Database</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live</span>
                </span>
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span className="text-slate-500">Engine</span>
                  <span className="font-semibold text-slate-900">{dbInfo.provider}</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span className="text-slate-500">Project ID</span>
                  <span className="font-mono text-slate-900 font-semibold">{dbInfo.projectId}</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span className="text-slate-500">Database & Region</span>
                  <span className="font-mono text-slate-700 text-[11px]">{dbInfo.databaseId} (asia-south1)</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span className="text-slate-500">Sync Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Real-Time Cloud Sync</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Local Fallback Cache</span>
                  <span className="font-mono text-slate-900 text-[11px]">Active (zero-downtime)</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-indigo-50/60 rounded-2xl p-6 border border-sky-100 text-xs">
              <h4 className="font-bold text-[#009FE3] text-sm mb-2">Public Portal Sync</h4>
              <p className="text-slate-600 leading-relaxed">
                When you publish articles, student resources, or degree offerings, changes persist instantly without requiring server rebuilds:
              </p>
              <ul className="mt-3 space-y-1.5 font-mono text-[11px] text-slate-800">
                <li>• /admin/ug-programs (BCA, B.Com, BAG...)</li>
                <li>• /admin/pg-programs (MCA, M.Com, MAH...)</li>
                <li>• /admin/mba-specializations</li>
                <li>• /admin/student-zone (Hall Ticket, Exam)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
