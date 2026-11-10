import React from "react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { ProgramForm } from "@/components/admin/ProgramForm";

export default function NewPGProgramPage() {
  return (
    <AdminLayoutWrapper
      title="Create Postgraduate (PG) Program"
      subtitle="Add a new distance Master degree to IGNOU academic offerings."
    >
      <ProgramForm type="pg" />
    </AdminLayoutWrapper>
  );
}
