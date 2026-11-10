"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { Program } from "@/lib/types";

function EditPGProgramContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/programs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProgram(data.program || null);
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
        title="Loading PG Program..."
        subtitle="Retrieving syllabus and fee data"
      >
        <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
          <span className="w-8 h-8 border-3 border-[#009FE3]/20 border-t-[#009FE3] rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading details...</p>
        </div>
      </AdminLayoutWrapper>
    );
  }

  if (!program) {
    return (
      <AdminLayoutWrapper
        title="Program Not Found"
        subtitle="Could not find the requested PG program"
      >
        <div className="p-12 text-center">
          <p className="text-slate-500 text-sm">The requested PG offering does not exist.</p>
        </div>
      </AdminLayoutWrapper>
    );
  }

  return (
    <AdminLayoutWrapper
      title={`Edit: ${program.title}`}
      subtitle={`Manage ${program.code} postgraduate syllabus, fees, and admission criteria.`}
    >
      <ProgramForm type="pg" initialData={program} isEdit={true} />
    </AdminLayoutWrapper>
  );
}

export default function EditPGProgramPage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <span className="w-8 h-8 border-3 border-[#009FE3]/20 border-t-[#009FE3] rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading program editor...</p>
          </div>
        </div>
      }
    >
      <EditPGProgramContent params={props.params} />
    </Suspense>
  );
}
