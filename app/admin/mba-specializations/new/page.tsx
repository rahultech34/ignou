import React from "react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { ProgramForm } from "@/components/admin/ProgramForm";

export default function NewMBASpecializationPage() {
  return (
    <AdminLayoutWrapper
      title="Create MBA Specialization"
      subtitle="Add a new distance MBA concentration or postgraduate management diploma."
    >
      <ProgramForm type="mba" />
    </AdminLayoutWrapper>
  );
}
