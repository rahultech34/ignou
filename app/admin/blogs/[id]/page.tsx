"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { BlogForm } from "@/components/admin/BlogForm";
import { Blog } from "@/lib/types";

function EditBlogContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBlog(data.blog || null);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <AdminLayoutWrapper
        title="Loading Article..."
        subtitle="Retrieving content and metadata"
      >
        <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
          <span className="w-8 h-8 border-3 border-[#009FE3]/20 border-t-[#009FE3] rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading details...</p>
        </div>
      </AdminLayoutWrapper>
    );
  }

  if (!blog) {
    return (
      <AdminLayoutWrapper
        title="Article Not Found"
        subtitle="Could not find the requested blog post"
      >
        <div className="p-12 text-center">
          <p className="text-slate-500 text-sm">The requested article does not exist.</p>
        </div>
      </AdminLayoutWrapper>
    );
  }

  return (
    <AdminLayoutWrapper
      title={`Edit: ${blog.title}`}
      subtitle="Update article content, metadata, featured image, and tags."
    >
      <BlogForm initialData={blog} isEdit={true} />
    </AdminLayoutWrapper>
  );
}

export default function EditBlogPage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <span className="w-8 h-8 border-3 border-[#009FE3]/20 border-t-[#009FE3] rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading article editor...</p>
          </div>
        </div>
      }
    >
      <EditBlogContent params={props.params} />
    </Suspense>
  );
}
