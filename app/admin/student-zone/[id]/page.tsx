"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { StudentZoneForm } from "@/components/admin/StudentZoneForm";
import { StudentResource } from "@/lib/types";

function EditStudentZoneContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [item, setItem] = useState<StudentResource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/student-zone/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data.item || null);
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
        title="Loading Resource..."
        subtitle="Retrieving student portal information"
      >
        <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
          <span className="w-8 h-8 border-3 border-[#009FE3]/20 border-t-[#009FE3] rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading details...</p>
        </div>
      </AdminLayoutWrapper>
    );
  }

  if (!item) {
    return (
      <AdminLayoutWrapper
        title="Resource Not Found"
        subtitle="Could not find the requested student item"
      >
        <div className="p-12 text-center">
          <p className="text-slate-500 text-sm">The requested student resource does not exist.</p>
        </div>
      </AdminLayoutWrapper>
    );
  }

  return (
    <AdminLayoutWrapper
      title={`Edit: ${item.title}`}
      subtitle="Modify portal link, category, badge, and student guidelines."
    >
      <StudentZoneForm initialData={item} isEdit={true} />
    </AdminLayoutWrapper>
  );
}

export default function EditStudentZoneItemPage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <span className="w-8 h-8 border-3 border-[#009FE3]/20 border-t-[#009FE3] rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading resource editor...</p>
          </div>
        </div>
      }
    >
      <EditStudentZoneContent params={props.params} />
    </Suspense>
  );
}
