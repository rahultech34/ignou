"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { Lead } from "@/lib/types";
import {
  Users,
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Trash2,
  Eye,
  RefreshCw,
  Sparkles,
  GraduationCap,
  X,
  Send,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New Leads", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "contacted", label: "Contacted", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "in-progress", label: "In Progress", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { value: "enrolled", label: "Enrolled", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "closed", label: "Closed", color: "bg-slate-100 text-slate-700 border-slate-200" },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    newLeads: 0,
    contacted: 0,
    inProgress: 0,
    enrolled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [leadNotes, setLeadNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (selectedCourse !== "all") params.append("course", selectedCourse);

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (e) {
      console.error("Error fetching leads:", e);
    } finally {
      setLoading(false);
    }
  }, [search, selectedStatus, selectedCourse]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      setUpdatingId(leadId);
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus as any } : l))
        );
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead((prev) => prev ? { ...prev, status: newStatus as any } : null);
        }
      }
    } catch (e) {
      console.error("Failed to update status:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    try {
      setSavingNotes(true);
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedLead.id, notes: leadNotes }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id ? { ...l, notes: leadNotes } : l))
        );
        setSelectedLead((prev) => (prev ? { ...prev, notes: leadNotes } : null));
      }
    } catch (e) {
      console.error("Failed to save notes:", e);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this enquiry record?")) return;
    try {
      const res = await fetch(`/api/admin/leads?id=${leadId}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
        if (selectedLead?.id === leadId) setSelectedLead(null);
      }
    } catch (e) {
      console.error("Failed to delete lead:", e);
    }
  };

  const handleExportCSV = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.append("search", search.trim());
    if (selectedStatus !== "all") params.append("status", selectedStatus);
    if (selectedCourse !== "all") params.append("course", selectedCourse);
    params.append("export", "csv");
    window.location.href = `/api/admin/leads?${params.toString()}`;
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "contacted":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Contacted</span>;
      case "in-progress":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">In Progress</span>;
      case "enrolled":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Enrolled</span>;
      case "closed":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Closed</span>;
      case "new":
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">New</span>;
    }
  };

  return (
    <AdminLayoutWrapper
      title="Leads & Admission CRM"
      description="Track student enquiries, update counseling progress, sync with EduKyu CRM, and export records."
    >
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.total}</div>
              <div className="text-xs font-semibold text-slate-500">Total Enquiries</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.today}</div>
              <div className="text-xs font-semibold text-slate-500">Today&apos;s New Inquiries</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.contacted}</div>
              <div className="text-xs font-semibold text-slate-500">Contacted / In Progress</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.enrolled}</div>
              <div className="text-xs font-semibold text-slate-500">Enrolled Students</div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, mobile, email, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#009FE3]/20 focus:border-[#009FE3]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Course Filter Dropdown */}
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#009FE3]/20"
            >
              <option value="all">All Courses / Programs</option>
              <option value="BCA">BCA (Bachelor of Computer Applications)</option>
              <option value="B.Com">B.Com (Bachelor of Commerce)</option>
              <option value="BA">BA (Bachelor of Arts)</option>
              <option value="MCA">MCA (Master of Computer Applications)</option>
              <option value="MBA">MBA (Master of Business Administration)</option>
              <option value="M.Com">M.Com (Master of Commerce)</option>
              <option value="MA">MA (Master of Arts)</option>
              <option value="B.Sc">B.Sc (Bachelor of Science)</option>
            </select>

            {/* Actions: Refresh & Export */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchLeads()}
                title="Refresh leads list"
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>

              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
            {STATUS_OPTIONS.map((st) => (
              <button
                key={st.value}
                onClick={() => setSelectedStatus(st.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedStatus === st.value
                    ? "bg-[#009FE3] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#009FE3]" />
              <p className="text-sm font-semibold">Loading student enquiries...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-base font-bold text-slate-800">No student enquiries found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search keywords or status filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Course Enquired</th>
                    <th className="py-3 px-4">CRM Status</th>
                    <th className="py-3 px-4">Counseling Status</th>
                    <th className="py-3 px-4">Enquiry Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => {
                    const dateDisplay = lead.created_at_iso || lead.created_at
                      ? new Date(lead.created_at_iso || lead.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Recent";

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Student Name & Email */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#009FE3]/10 text-[#009FE3] font-bold flex items-center justify-center text-xs shrink-0">
                              {(lead.name || "S").charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate">{lead.name || "Anonymous Student"}</div>
                              <div className="text-xs text-slate-500 flex items-center gap-1 truncate">
                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{lead.email || "No email"}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <a
                              href={`tel:${lead.mobile}`}
                              className="hover:text-[#009FE3] hover:underline"
                            >
                              {lead.mobile}
                            </a>
                            <a
                              href={`https://wa.me/91${lead.mobile.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Chat on WhatsApp"
                              className="text-emerald-500 hover:text-emerald-600 ml-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>
                          {(lead.city || lead.state) && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{lead.city || lead.state}</span>
                            </div>
                          )}
                        </td>

                        {/* Course */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 max-w-[200px] truncate">
                            <GraduationCap className="w-3.5 h-3.5 text-[#009FE3] shrink-0" />
                            <span className="truncate">{lead.course || lead.programme || "General Admission"}</span>
                          </span>
                        </td>

                        {/* CRM Sync Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {lead.crm_status === "synced" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span>Synced (CRM)</span>
                            </span>
                          ) : lead.crm_status === "failed" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <AlertCircle className="w-3 h-3 text-rose-500" />
                              <span>Failed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-500" />
                              <span>Local / Pending</span>
                            </span>
                          )}
                        </td>

                        {/* Counseling Status Dropdown */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={lead.status || "new"}
                            disabled={updatingId === lead.id}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#009FE3]"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="in-progress">In Progress</option>
                            <option value="enrolled">Enrolled</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                          {dateDisplay}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setLeadNotes(lead.notes || "");
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                              title="View full lead details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete lead record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#009FE3]/10 text-[#009FE3] flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedLead.name}</h3>
                    <p className="text-xs text-slate-500">Enquiry #{selectedLead.id.slice(0, 12)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 font-medium">Mobile Number</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedLead.mobile}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 font-medium">Email Address</div>
                  <div className="font-bold text-slate-900 mt-0.5 truncate">{selectedLead.email}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 font-medium">Course Requested</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedLead.course || selectedLead.programme || "N/A"}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 font-medium">City / State</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedLead.city || selectedLead.state || "Delhi"}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 font-medium">Source / Referral</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedLead.source_name || "Website Direct"}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 font-medium">CRM Status</div>
                  <div className="font-bold text-slate-900 mt-0.5 capitalize">{selectedLead.crm_status || "Pending"}</div>
                </div>
              </div>

              {selectedLead.page_url && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs">
                  <div className="text-slate-400 font-medium">Captured from URL</div>
                  <div className="font-medium text-slate-800 break-all mt-0.5">{selectedLead.page_url}</div>
                </div>
              )}

              {/* Counselor Internal Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Counselor Notes / Follow-up Details</label>
                <textarea
                  rows={3}
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  placeholder="e.g. Student called at 2 PM, interested in BCA distance learning, fee structure sent on WhatsApp..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#009FE3]/20 focus:border-[#009FE3]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedLead.mobile}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/91${selectedLead.mobile.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#009FE3] text-white hover:bg-[#008bc7] shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{savingNotes ? "Saving..." : "Save Notes"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}

