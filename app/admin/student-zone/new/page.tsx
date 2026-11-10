import React from "react";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { StudentZoneForm } from "@/components/admin/StudentZoneForm";

export default function NewStudentZoneItemPage() {
  return (
    <AdminLayoutWrapper
      title="Create Student Resource"
      subtitle="Publish a portal link, hall ticket download, or assignment submission guidelines."
    >
      <StudentZoneForm />
    </AdminLayoutWrapper>
  );
}
