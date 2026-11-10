"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  LifeBuoy,
  FileCheck,
  Globe,
  Layers,
  FileText,
  Download,
} from "lucide-react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { StudentResource } from "@/lib/types";

export function StudentZoneListPage() {
  const [items, setItems] = useState<StudentResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/student-zone");
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
      }
    } catch (e) {
      console.error("Error fetching student zone items:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/student-zone/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter((i) => i.id !== id));
        setFeedback({ type: "success", text: "Resource deleted successfully." });
      } else {
        setFeedback({ type: "error", text: "Failed to delete item." });
      }
    } catch (e) {
      setFeedback({ type: "error", text: "Network error while deleting." });
    } finally {
      setDeleting(false);
      setDeleteId(null);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleTogglePublish = async (item: StudentResource) => {
    const nextStatus = item.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/student-zone/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, status: nextStatus }),
      });
      if (res.ok) {
        setItems(items.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i)));
        setFeedback({
          type: "success",
          text: `Resource "${item.title}" ${
            nextStatus === "published" ? "published" : "moved to drafts"
          }.`,
        });
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (e) {
      setFeedback({ type: "error", text: "Failed to update status." });
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === "all" ? true : item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" ? true : item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminLayoutWrapper
      title="Student Zone & Support Resources"
      subtitle="Manage IGNOU student portals, hall ticket links, grade cards, assignment submission, and eGyanKosh links."
    >
      <div className="space-y-6">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-slate-900">
              Student Resources ({items.length})
            </span>
          </div>

          <Link
            href="/admin/student-zone/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#009FE3] hover:bg-[#0086bf] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#009FE3]/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Student Resource</span>
          </Link>
        </div>

        {feedback && (
          <div
            className={`p-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search resources by title, service name, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold outline-none focus:border-[#009FE3]"
            >
              <option value="all">All Categories</option>
              <option value="Exams">Exams & Hall Ticket</option>
              <option value="Assignments">Assignments</option>
              <option value="Results">Results & Grade Card</option>
              <option value="Admissions">Admissions Portal</option>
              <option value="Study Material">Study Material</option>
              <option value="Datesheet">Datesheet</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold outline-none focus:border-[#009FE3]"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>

        {/* Resources Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <span className="w-8 h-8 border-3 border-[#009FE3]/20 border-t-[#009FE3] rounded-full animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Loading student resources...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#009FE3] flex items-center justify-center">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">No resources found</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Add Hall Ticket links, assignment portals, or syllabus downloads for IGNOU learners.
              </p>
              <Link
                href="/admin/student-zone/new"
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#009FE3] text-white text-xs font-bold shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Resource</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="px-5 py-3.5">Title & Resource URL</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Badge</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Quick Steps</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4 max-w-xs sm:max-w-md">
                        <Link
                          href={`/admin/student-zone/${item.id}`}
                          className="font-bold text-slate-900 hover:text-[#009FE3] block truncate"
                        >
                          {item.title}
                        </Link>
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#009FE3] hover:underline font-mono truncate block mt-0.5"
                        >
                          {item.linkUrl}
                        </a>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {item.category}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {item.badge ? (
                          <span className="px-2 py-0.5 rounded-full bg-sky-50 text-[#009FE3] border border-sky-200 text-[10px] font-bold">
                            {item.badge}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(item)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                            item.status === "published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          <span className="capitalize">{item.status}</span>
                        </button>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-slate-500 text-xs">
                        {item.instructions?.length || 0} Steps
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={item.linkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Open Link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          <Link
                            href={`/admin/student-zone/${item.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#009FE3] hover:bg-sky-50 transition-colors"
                            title="Edit Resource"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteId(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete this resource?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              This action will remove the link and guidance steps from the IGNOU Student Zone.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-colors cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayoutWrapper>
  );
}
