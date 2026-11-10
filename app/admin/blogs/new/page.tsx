import React from "react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { BlogForm } from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  return (
    <AdminLayoutWrapper
      title="Write New Article"
      subtitle="Publish admission alerts, term-end exam schedules, and IGNOU student guides."
    >
      <BlogForm />
    </AdminLayoutWrapper>
  );
}
