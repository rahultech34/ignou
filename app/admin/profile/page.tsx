"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  Mail,
  Key,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Save,
  ArrowRight,
} from "lucide-react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { AdminUser } from "@/lib/types";

export default function AdminProfilePage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser>({
    id: "admin-1",
    name: "Edukyu Admin",
    email: "admin@edukyu.com",
    role: "superadmin",
  });

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [passFeedback, setPassFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Logout state
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.admin) setAdmin(data.admin);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error(e);
      setLoggingOut(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassFeedback(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassFeedback({
        type: "error",
        text: "Please fill in all password fields.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassFeedback({
        type: "error",
        text: "New password and confirm password do not match.",
      });
      return;
    }

    if (newPassword.length < 6) {
      setPassFeedback({
        type: "error",
        text: "New password must be at least 6 characters long.",
      });
      return;
    }

    setChangingPass(true);

    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPassFeedback({
          type: "error",
          text: data.error || "Failed to update password.",
        });
        setChangingPass(false);
        return;
      }

      setPassFeedback({
        type: "success",
        text: "Admin password successfully updated! Please remember your new password.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setChangingPass(false);
      setTimeout(() => setPassFeedback(null), 5000);
    } catch (err: any) {
      setPassFeedback({
        type: "error",
        text: err.message || "Network error. Please try again.",
      });
      setChangingPass(false);
    }
  };

  return (
    <AdminLayoutWrapper
      title="Admin Profile & Security"
      subtitle="View credentials, change password, and manage active session."
      adminEmail={admin.email}
      adminName={admin.name}
    >
      <div className="max-w-4xl space-y-8">
        {/* Account Details Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#009FE3] to-[#0b2545] text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
                {admin.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{admin.name}</h3>
                <p className="text-xs text-slate-500">{admin.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-[#009FE3] border border-sky-200 text-[11px] font-bold">
                  <Shield className="w-3 h-3" />
                  <span className="capitalize">{admin.role} Role</span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {loggingOut ? (
                  <>
                    <span className="w-4 h-4 border-2 border-rose-400 border-t-rose-700 rounded-full animate-spin" />
                    <span>Signing Out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Log Out of Portal</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Email Address</span>
              <span className="font-bold text-slate-900">{admin.email}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">System Role</span>
              <span className="font-bold text-slate-900 capitalize">{admin.role} Role</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Catalog Permissions</span>
              <span className="font-bold text-emerald-600">Full IGNOU Portal Read & Write Access</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Session Security</span>
              <span className="font-bold text-slate-900">Signed HTTP-Only JWT Cookie</span>
            </div>
          </div>
        </div>

        {/* Change Admin Password Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#009FE3] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Change Admin Password
              </h3>
              <p className="text-xs text-slate-500">
                Update the login password for account <span className="font-semibold text-slate-700">{admin.email}</span>.
              </p>
            </div>
          </div>

          {passFeedback && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 ${
                passFeedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {passFeedback.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{passFeedback.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-5 max-w-2xl">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password (e.g. admin123)"
                  className="w-full px-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Password must be a minimum of 6 characters. Once changed, all future logins will require the new password.
            </p>

            <div className="pt-2">
              <button
                type="submit"
                disabled={changingPass}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009FE3] hover:bg-[#0086bf] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#009FE3]/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {changingPass ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
