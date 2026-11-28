import React from "react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { BlogForm } from "@/components/admin/BlogForm";
import { getCurrentAdmin } from "@/lib/auth";
import { getDatabaseStatus } from "@/lib/admin-data";

export default async function NewBlogPage() {
  const [admin, database] = await Promise.all([
    getCurrentAdmin(),
    getDatabaseStatus(),
  ]);

  return (
    <AdminLayoutWrapper
      title="Write New Article"
      subtitle="Publish admission alerts, term-end exam schedules, and IGNOU student guides."
      adminEmail={admin?.email}
      adminName={admin?.name}
      storageStatus={{
        connected: database.connected,
        provider: database.provider,
      }}
    >
      <BlogForm />
    </AdminLayoutWrapper>
  );
}
