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
  Users,
  BarChart3,
  TrendingUp,
  Phone,
  Mail,
  Shield,
  PlusCircle,
  Eye,
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
    totalLeads: 0,
    todayLeads: 0,
    convertedLeads: 0,
    recentLeads: [],
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

  const totalPrograms = (stats.totalUg || 0) + (stats.totalPg || 0) + (stats.totalMba || 0);

  return (
    <AdminLayoutWrapper
      title="IGNOU Admin Console"
      subtitle="Unified control center for admissions CRM, academic catalog, website analytics, and CMS."
      adminEmail={admin.email}
      adminName={admin.name}
    >
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#0b2545] via-[#00609C] to-[#009FE3] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>IGNOU Admissions Session 2026-27 Active</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {admin.name}
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
              Track real-time student enquiries, monitor website performance, update course fees & syllabus, and manage counselors.
            </p>
          </div>
        </div>

        {/* Primary KPI Metrics: CRM + Catalog + Analytics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Student Leads */}
          <Link
            href="/admin/leads"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#009FE3]/50 hover:shadow-md transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Enquiries</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{stats.totalLeads ?? 0}</span>
              {(stats.todayLeads ?? 0) > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  +{stats.todayLeads} Today
                </span>
              )}
            </div>
            <div className="text-[11px] font-semibold text-[#009FE3] flex items-center gap-1 group-hover:underline">
              <span>Manage in CRM</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* Enrolled Students */}
          <Link
            href="/admin/leads?status=enrolled"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Enrolled</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{stats.convertedLeads ?? 0}</div>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 group-hover:underline">
              <span>View converted leads</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* Academic Catalog Programs */}
          <Link
            href="/admin/ug-programs"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-500/50 hover:shadow-md transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Catalog</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{totalPrograms}</div>
            <div className="text-[11px] font-semibold text-slate-500">
              {stats.totalUg} UG · {stats.totalPg} PG · {stats.totalMba} MBA
            </div>
          </Link>

          {/* Published Articles & News */}
          <Link
            href="/admin/blogs"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-500/50 hover:shadow-md transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Articles & News</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{stats.totalBlogs}</div>
            <div className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 group-hover:underline">
              <span>Manage articles</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>

        {/* Quick Actions Hub */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Actions</h3>
            <span className="text-xs text-slate-400">Fast shortcuts for daily tasks</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              href="/admin/leads"
              className="p-3.5 rounded-xl border border-slate-200/70 hover:border-[#009FE3] hover:bg-sky-50/50 transition-all text-center space-y-1.5"
            >
              <Users className="w-5 h-5 mx-auto text-[#009FE3]" />
              <div className="text-xs font-bold text-slate-800">Leads CRM</div>
              <div className="text-[10px] text-slate-400">Review Inquiries</div>
            </Link>

            <Link
              href="/admin/analytics"
              className="p-3.5 rounded-xl border border-slate-200/70 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-center space-y-1.5"
            >
              <BarChart3 className="w-5 h-5 mx-auto text-indigo-600" />
              <div className="text-xs font-bold text-slate-800">Analytics</div>
              <div className="text-[10px] text-slate-400">Traffic & Funnel</div>
            </Link>

            <Link
              href="/admin/ug-programs/new"
              className="p-3.5 rounded-xl border border-slate-200/70 hover:border-sky-500 hover:bg-sky-50/50 transition-all text-center space-y-1.5"
            >
              <PlusCircle className="w-5 h-5 mx-auto text-sky-600" />
              <div className="text-xs font-bold text-slate-800">New UG Degree</div>
              <div className="text-[10px] text-slate-400">Add BCA, B.Com...</div>
            </Link>

            <Link
              href="/admin/pg-programs/new"
              className="p-3.5 rounded-xl border border-slate-200/70 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-center space-y-1.5"
            >
              <PlusCircle className="w-5 h-5 mx-auto text-emerald-600" />
              <div className="text-xs font-bold text-slate-800">New PG Degree</div>
              <div className="text-[10px] text-slate-400">Add MCA, M.Com...</div>
            </Link>

            <Link
              href="/admin/blogs/new"
              className="p-3.5 rounded-xl border border-slate-200/70 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-center space-y-1.5"
            >
              <FileText className="w-5 h-5 mx-auto text-amber-600" />
              <div className="text-xs font-bold text-slate-800">Write Article</div>
              <div className="text-[10px] text-slate-400">SEO & News Post</div>
            </Link>

            <Link
              href="/admin/users"
              className="p-3.5 rounded-xl border border-slate-200/70 hover:border-purple-500 hover:bg-purple-50/50 transition-all text-center space-y-1.5"
            >
              <Shield className="w-5 h-5 mx-auto text-purple-600" />
              <div className="text-xs font-bold text-slate-800">Team & Users</div>
              <div className="text-[10px] text-slate-400">Manage Counselors</div>
            </Link>
          </div>
        </div>

        {/* Recent Inquiries Feed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#009FE3]" />
                <span>Recent Student Inquiries</span>
              </h3>
              <p className="text-xs text-slate-500">Latest admission leads submitted by students</p>
            </div>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#009FE3] hover:underline"
            >
              <span>View All Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentLeads && stats.recentLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3">Course</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{lead.name || "Student"}</td>
                      <td className="py-2.5 px-3 text-slate-600">{lead.mobile}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-slate-700 truncate max-w-[180px] inline-block">
                          {lead.course || lead.programme || "General"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold capitalize bg-sky-50 text-[#009FE3]">
                          {lead.status || "New"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Link
                          href="/admin/leads"
                          className="text-[#009FE3] font-bold hover:underline inline-flex items-center gap-1"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No recent leads recorded yet.
            </div>
          )}
        </div>

        {/* Two-Column Lower Section: Recent CMS Activity (8 cols) + System Status (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Activity List (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Recent Academic & Article Updates</span>
              </h3>
              <span className="text-xs text-slate-400">Live Changes</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Loading recent updates...
              </div>
            ) : stats.recentActivity.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No recent activity recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {stats.recentActivity.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/60 rounded-xl px-2 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#009FE3] flex items-center justify-center shrink-0">
                        {item.type === "ug" || item.type === "pg" ? (
                          <GraduationCap className="w-4 h-4" />
                        ) : item.type === "mba" ? (
                          <Briefcase className="w-4 h-4" />
                        ) : item.type === "blog" ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <LifeBuoy className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <Link
                          href={item.href}
                          className="text-xs font-bold text-slate-900 hover:text-[#009FE3] transition-colors truncate block"
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
                <li>• /admin/leads (Live Admission CRM)</li>
                <li>• /admin/analytics (Traffic & Funnel)</li>
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
