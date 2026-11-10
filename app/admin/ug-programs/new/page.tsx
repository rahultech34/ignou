import React from "react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { ProgramForm } from "@/components/admin/ProgramForm";

export default function NewUGProgramPage() {
  return (
    <AdminLayoutWrapper
      title="Create Undergraduate (UG) Program"
      subtitle="Add a new distance Bachelor degree to IGNOU academic offerings."
    >
      <ProgramForm type="ug" />
    </AdminLayoutWrapper>
  );
}
