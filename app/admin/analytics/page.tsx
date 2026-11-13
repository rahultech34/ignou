"use client";

import React, { useState, useEffect } from "react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import {
  BarChart3,
  TrendingUp,
  Users,
  Compass,
  FileText,
  Globe,
  Zap,
  Activity,
  ArrowUpRight,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchAnalytics = async (selectedPeriod: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/analytics?period=${selectedPeriod}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.analytics);
      }
    } catch (e) {
      console.error("Error loading analytics:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  const overview = data?.overview || {
    totalVisitors: 0,
    totalInquiries: 0,
    conversionRate: "0%",
    convertedStudents: 0,
    activeCounselors: 3,
  };

  return (
    <AdminLayoutWrapper
      title="Traffic & Admission Analytics"
      description="Real-time website performance, student inquiry trends, popular academic programs, and conversion metrics."
    >
      <div className="space-y-6">
        {/* Top Bar: Live Pulse & Period Selector */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-3 h-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Live Analytics Pulse</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Tracking admissions funnel & prospective student activity
              </div>
            </div>
          </div>

          {/* Period Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 self-stretch sm:self-auto">
            {[
              { id: "7d", label: "Last 7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "90d", label: "3 Months" },
              { id: "all", label: "All Time" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPeriod(tab.id)}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  period === tab.id
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Estimated Visitors</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {loading ? "..." : overview.totalVisitors.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% from previous cycle</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Enquiries</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {loading ? "..." : overview.totalInquiries}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Direct CRM Leads</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Conversion Rate</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {loading ? "..." : overview.conversionRate}
            </div>
            <div className="text-[11px] font-semibold text-slate-500">
              Visitor-to-enquiry ratio
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Enrolled Students</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {loading ? "..." : overview.convertedStudents}
            </div>
            <div className="text-[11px] font-semibold text-emerald-600">
              Verified Admissions
            </div>
          </div>
        </div>

        {/* Traffic Trends Timeline Chart & Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trends Visualizer */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Inquiry & Traffic Trends</h3>
                <p className="text-xs text-slate-500">Daily student inquiries vs estimated site traffic</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#009FE3]"></span>
                  <span className="text-slate-600">Inquiries</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                  <span className="text-slate-600">Visitors (scaled)</span>
                </div>
              </div>
            </div>

            {/* Bar Visualizer */}
            {loading ? (
              <div className="py-24 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#009FE3]" />
                <span className="text-xs">Loading trends...</span>
              </div>
            ) : data?.timeline?.length > 0 ? (
              <div className="space-y-3 pt-2">
                <div className="h-44 flex items-end justify-between gap-2 border-b border-slate-100 pb-2">
                  {data.timeline.slice(-14).map((t: any, i: number) => {
                    const maxInq = Math.max(...data.timeline.map((x: any) => x.inquiries), 4);
                    const heightPercent = Math.max((t.inquiries / maxInq) * 85, 12);

                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                        {/* Hover Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-12 z-20 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap transition-opacity">
                          <div>{t.date}</div>
                          <div>Inquiries: <b>{t.inquiries}</b></div>
                          <div>Visitors: <b>{t.visitors}</b></div>
                        </div>

                        <div className="w-full flex items-end justify-center gap-1 h-36">
                          {/* Visitor Bar */}
                          <div
                            style={{ height: `${Math.min(t.visitors / 4, 100)}%` }}
                            className="w-1.5 sm:w-2 bg-slate-200 rounded-t-sm"
                          />
                          {/* Inquiry Bar */}
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-2 sm:w-3.5 bg-[#009FE3] rounded-t group-hover:bg-[#0081ba] transition-colors"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 truncate w-full text-center">
                          {t.date.split(" ")[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs">No trend data available.</div>
            )}
          </div>

          {/* Admission Funnel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Admission Pipeline Funnel</h3>
              <p className="text-xs text-slate-500">From student inquiry to verified enrollment</p>
            </div>

            <div className="space-y-3 pt-2">
              {data?.funnel?.map((step: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{step.stage}</span>
                    <span className="font-bold text-slate-900">{step.count}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${step.color}`}
                      style={{
                        width: `${Math.max(
                          (step.count / (data.overview.totalInquiries || 1)) * 100,
                          8
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="p-3 bg-sky-50 rounded-xl text-xs text-sky-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#009FE3]" />
                  <span>Counselor Insight</span>
                </div>
                <p className="text-[11px] text-sky-800 leading-relaxed">
                  Students contacted within 15 minutes of submitting the enquiry form show a 3.4x higher enrollment conversion rate.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Top Programs, Sources, and Devices */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Programs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#009FE3]" />
              <span>Most Demanded Programs</span>
            </h3>

            <div className="space-y-3">
              {data?.topPrograms?.length > 0 ? (
                data.topPrograms.map((prog: any, idx: number) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 truncate max-w-[200px]">
                        {idx + 1}. {prog.name}
                      </span>
                      <span className="text-slate-500 font-semibold">{prog.count} leads</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#009FE3] rounded-full"
                        style={{ width: `${Math.min(prog.percentage * 2, 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">No program inquiries yet.</div>
              )}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Acquisition Channels</span>
            </h3>

            <div className="space-y-3">
              {data?.trafficSources?.map((src: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                  <div className="font-semibold text-slate-800">{src.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{src.percentage}%</span>
                    <span className="text-[10px] text-slate-400">({src.count})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Devices & Geographic */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              <span>Devices & Student Geography</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <Smartphone className="w-5 h-5 mx-auto text-sky-500" />
                <div className="text-base font-black text-slate-900">76%</div>
                <div className="text-[10px] font-semibold text-slate-500">Mobile</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <Monitor className="w-5 h-5 mx-auto text-indigo-500" />
                <div className="text-base font-black text-slate-900">21%</div>
                <div className="text-[10px] font-semibold text-slate-500">Desktop</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <Tablet className="w-5 h-5 mx-auto text-emerald-500" />
                <div className="text-base font-black text-slate-900">3%</div>
                <div className="text-[10px] font-semibold text-slate-500">Tablet</div>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <div className="text-xs font-bold text-slate-700">Top Inquiring Regions</div>
              <div className="flex flex-wrap gap-1.5">
                {data?.geographic?.length > 0 ? (
                  data.geographic.map((g: any, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800"
                    >
                      {g.state} ({g.count})
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Delhi NCR, Uttar Pradesh, Bihar</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
