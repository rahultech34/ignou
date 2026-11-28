"use client";

import React, { useState, useEffect, Suspense } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
  adminEmail?: string;
  adminName?: string;
  storageStatus?: {
    connected: boolean;
    provider: string;
  } | null;
}

export function AdminLayoutWrapper({
  children,
  title,
  subtitle,
  description,
  adminEmail,
  adminName,
  storageStatus: initialStorageStatus,
}: AdminLayoutWrapperProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fetchedAdmin, setFetchedAdmin] = useState<{ email?: string; name?: string }>({});
  const [fetchedStorage, setFetchedStorage] = useState<{
    connected: boolean;
    provider: string;
  } | null>(null);

  useEffect(() => {
    if (adminEmail && adminName && initialStorageStatus) return;
    let active = true;
    fetch("/api/admin/auth/me")
      .then(async (res) => ({ ok: res.ok, data: await res.json() }))
      .then(({ ok, data }) => {
        if (!active || !ok) return;
        if (data.admin) {
          setFetchedAdmin({ email: data.admin.email, name: data.admin.name });
        }
        if (data.database) {
          setFetchedStorage({
            connected: Boolean(data.database.connected),
            provider: data.database.provider || "Local File Store",
          });
        }
      })
      .catch(() => {
        // Ignore transient errors
      });
    return () => {
      active = false;
    };
  }, [adminEmail, adminName, initialStorageStatus]);

  const resolvedEmail = adminEmail || fetchedAdmin.email;
  const resolvedName = adminName || fetchedAdmin.name;
  const resolvedStorage = initialStorageStatus || fetchedStorage;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900">
      <Suspense fallback={<aside className="hidden lg:block w-64 bg-[#0b2545] shrink-0" />}>
        <AdminSidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          adminEmail={resolvedEmail}
          adminName={resolvedName}
        />
      </Suspense>
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
          title={title}
          subtitle={subtitle || description}
          adminName={resolvedName}
          storageStatus={resolvedStorage}
        />
        <main className="flex-1 px-5 py-5 lg:px-10 lg:py-8 max-w-[1807px] w-full mx-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
