"use client";

import React, { useState, Suspense } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  adminEmail?: string;
  adminName?: string;
}

export function AdminLayoutWrapper({
  children,
  title,
  subtitle,
  adminEmail,
  adminName,
}: AdminLayoutWrapperProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      <Suspense fallback={<aside className="hidden md:block w-72 bg-[#0b2545] shrink-0" />}>
        <AdminSidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          adminEmail={adminEmail}
          adminName={adminName}
        />
      </Suspense>
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
          title={title}
          subtitle={subtitle}
          adminName={adminName}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
