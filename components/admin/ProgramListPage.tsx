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
  GraduationCap,
  BookOpen,
  Briefcase,
  Download,
} from "lucide-react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { Program } from "@/lib/types";

interface ProgramListPageProps {
  type: "ug" | "pg" | "mba";
}

export function ProgramListPage({ type }: ProgramListPageProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const title =
    type === "ug"
      ? "Undergraduate (UG) Programs"
      : type === "pg"
      ? "Postgraduate (PG) Programs"
      : "MBA Specializations";

  const newUrl =
    type === "ug"
      ? "/admin/ug-programs/new"
      : type === "pg"
      ? "/admin/pg-programs/new"
      : "/admin/mba-specializations/new";

  const editBaseUrl =
    type === "ug"
      ? "/admin/ug-programs"
      : type === "pg"
      ? "/admin/pg-programs"
      : "/admin/mba-specializations";

  const publicBaseUrl =
    type === "ug" ? "/programs" : type === "pg" ? "/programs" : "/programs";

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/programs?type=${type}`);
      const data = await res.json();
      if (res.ok) {
        setPrograms(data.programs || []);
      }
    } catch (e) {
      console.error("Error fetching programs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [type]);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/programs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPrograms(programs.filter((p) => p.id !== id));
        setFeedback({ type: "success", text: "Program deleted successfully." });
      } else {
        setFeedback({ type: "error", text: "Failed to delete program." });
      }
    } catch (e) {
      setFeedback({ type: "error", text: "Network error while deleting." });
    } finally {
      setDeleting(false);
      setDeleteId(null);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleTogglePublish = async (program: Program) => {
    const nextStatus = program.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/programs/${program.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...program, status: nextStatus }),
      });
      if (res.ok) {
        setPrograms(
          programs.map((p) => (p.id === program.id ? { ...p, status: nextStatus } : p))
        );
        setFeedback({
          type: "success",
          text: `Program "${program.title}" ${
            nextStatus === "published" ? "published" : "moved to drafts"
          }.`,
        });
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (e) {
      setFeedback({ type: "error", text: "Failed to update status." });
    }
  };

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(programs, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `ignou-${type}-programs.json`);
    dlAnchorElem.click();
  };

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.level.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" ? true : p.status === statusFilter;
    const matchesMode = modeFilter === "all" ? true : p.mode === modeFilter;
    return matchesSearch && matchesStatus && matchesMode;
  });

  return (
    <AdminLayoutWrapper
      title={title}
      subtitle={`Manage IGNOU ${type.toUpperCase()} degree curricula, admission eligibility, fees, and semesters.`}
    >
      <div className="space-y-6">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-slate-900">
              All {type.toUpperCase()} Offerings ({programs.length})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export JSON</span>
            </button>

            <Link
              href={newUrl}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#009FE3] hover:bg-[#0086bf] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#009FE3]/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New {type.toUpperCase()} Program</span>
            </Link>
          </div>
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

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${type.toUpperCase()} programs by code (e.g. BCA, MBA, BAG), title, or slug...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold outline-none focus:border-[#009FE3]"
            >
              <option value="all">All Modes</option>
              <option value="Distance & Online">Distance & Online</option>
              <option value="Distance">Distance ODL</option>
              <option value="Online">Online OL</option>
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

        {/* Programs Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <span className="w-8 h-8 border-3 border-[#009FE3]/20 border-t-[#009FE3] rounded-full animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Loading programs from IGNOU catalog...</p>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#009FE3] flex items-center justify-center">
                {type === "ug" ? (
                  <GraduationCap className="w-6 h-6" />
                ) : type === "pg" ? (
                  <BookOpen className="w-6 h-6" />
                ) : (
                  <Briefcase className="w-6 h-6" />
                )}
              </div>
              <h4 className="text-base font-bold text-slate-900">No {type.toUpperCase()} programs found</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Add your degree offerings to automatically display them across the EduKyu x IGNOU website.
              </p>
              <Link
                href={newUrl}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#009FE3] text-white text-xs font-bold shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Program</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="pl-5 pr-2 py-3.5 w-10">
                      <input
                        type="checkbox"
                        checked={
                          filteredPrograms.length > 0 &&
                          selectedIds.length === filteredPrograms.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(filteredPrograms.map((p) => p.id));
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                        className="rounded border-slate-300 text-[#009FE3] focus:ring-[#009FE3] cursor-pointer"
                        title="Select All"
                      />
                    </th>
                    <th className="px-4 py-3.5">Code & Program Title</th>
                    <th className="px-5 py-3.5">Mode</th>
                    <th className="px-5 py-3.5">Duration</th>
                    <th className="px-5 py-3.5">Fee</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Semesters</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPrograms.map((prog) => (
                    <tr
                      key={prog.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        selectedIds.includes(prog.id) ? "bg-sky-50/30" : ""
                      }`}
                    >
                      <td className="pl-5 pr-2 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(prog.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds([...selectedIds, prog.id]);
                            } else {
                              setSelectedIds(selectedIds.filter((id) => id !== prog.id));
                            }
                          }}
                          className="rounded border-slate-300 text-[#009FE3] focus:ring-[#009FE3] cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-4 max-w-xs sm:max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#0b2545] text-white">
                            {prog.code}
                          </span>
                          <Link
                            href={`${editBaseUrl}/${prog.id}`}
                            className="font-bold text-slate-900 hover:text-[#009FE3] truncate block"
                          >
                            {prog.title}
                          </Link>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono truncate block mt-1">
                          /{prog.slug}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {prog.mode}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-slate-500 text-xs">
                        {prog.duration}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-slate-700 font-medium text-xs">
                        {prog.fee}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(prog)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                            prog.status === "published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              prog.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          <span className="capitalize">{prog.status}</span>
                        </button>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-slate-500 text-xs">
                        {prog.curriculum?.length || 0} Semesters
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`#`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Preview Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`${editBaseUrl}/${prog.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#009FE3] hover:bg-sky-50 transition-colors"
                            title="Edit Program"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteId(prog.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Program"
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
            <h3 className="text-lg font-bold text-slate-900">Delete this program?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              This will permanently remove the program curriculum, eligibility details, and fees from the IGNOU portal store.
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
