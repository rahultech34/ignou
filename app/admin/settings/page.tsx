"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, AlertCircle, Shield, Globe, Phone, Mail, MapPin } from "lucide-react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    portalName: "EduKyu IGNOU Admissions Portal",
    supportPhone: "1800-11-2345",
    supportEmail: "ignou-support@edukyu.com",
    campusAddress: "Maidan Garhi, New Delhi, Delhi 110068",
    admissionSession: "July 2026-27 Session",
    socialLinks: {
      facebook: "https://facebook.com/edukyu",
      twitter: "https://twitter.com/edukyu",
      youtube: "https://youtube.com/@edukyu",
      linkedin: "https://linkedin.com/company/edukyu",
    },
    updatedAt: "2026-10-26T00:00:00.000Z",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const json = await res.json();
          if (json.settings) {
            setSettings(json.settings);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      let json: any = null;
      try {
        const text = await res.text();
        json = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        console.warn("Settings response parse warning:", parseErr);
      }

      if (!res.ok) {
        setFeedback({
          type: "error",
          text: json?.error || "Failed to update portal settings.",
        });
        setSaving(false);
        return;
      }

      setFeedback({ type: "success", text: "Settings saved successfully!" });
      setSaving(false);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err.message || "Failed to save settings.",
      });
      setSaving(false);
    }
  };

  return (
    <AdminLayoutWrapper
      title="Global Portal Settings"
      subtitle="Configure site-wide admissions metadata, contact info, helpline, and branding."
    >
      <div className="max-w-4xl space-y-6">
        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Settings className="w-5 h-5 text-[#009FE3]" />
            <h3 className="text-base font-bold text-slate-900">General Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Portal Brand Name
              </label>
              <input
                type="text"
                value={settings.portalName}
                onChange={(e) =>
                  setSettings({ ...settings, portalName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Current Academic Session
              </label>
              <input
                type="text"
                value={settings.admissionSession}
                onChange={(e) =>
                  setSettings({ ...settings, admissionSession: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Helpline Toll Free Phone</span>
              </label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) =>
                  setSettings({ ...settings, supportPhone: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Support Email Address</span>
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) =>
                  setSettings({ ...settings, supportEmail: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Campus / Headquarters Address</span>
            </label>
            <input
              type="text"
              value={settings.campusAddress}
              onChange={(e) =>
                setSettings({ ...settings, campusAddress: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#009FE3] focus:ring-2 focus:ring-[#009FE3]/10 outline-none text-xs sm:text-sm text-slate-900"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009FE3] hover:bg-[#0086bf] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#009FE3]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Settings..." : "Save Settings"}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayoutWrapper>
  );
}
