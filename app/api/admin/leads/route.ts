import { NextRequest, NextResponse } from "next/server";
import { getLeads, updateLead, deleteLead, getLeadStats } from "@/lib/admin-data";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const course = searchParams.get("course") || undefined;
    const status = searchParams.get("status") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 250;
    const isExport = searchParams.get("export") === "csv";

    const [leads, stats] = await Promise.all([
      getLeads({ search, course, status, limit }),
      getLeadStats(),
    ]);

    if (isExport) {
      const headers = [
        "Lead ID",
        "Student Name",
        "Mobile",
        "Email",
        "Course / Programme",
        "City",
        "State",
        "CRM Sync",
        "Lead Status",
        "Submitted At",
      ];
      const rows = leads.map((l) => [
        `"${(l.id || "").replace(/"/g, '""')}"`,
        `"${(l.name || "").replace(/"/g, '""')}"`,
        `"${(l.mobile || "").replace(/"/g, '""')}"`,
        `"${(l.email || "").replace(/"/g, '""')}"`,
        `"${(l.course || l.programme || "").replace(/"/g, '""')}"`,
        `"${(l.city || "").replace(/"/g, '""')}"`,
        `"${(l.state || "").replace(/"/g, '""')}"`,
        `"${(l.crm_status || "pending").replace(/"/g, '""')}"`,
        `"${(l.status || "new").replace(/"/g, '""')}"`,
        `"${(l.created_at_iso || l.created_at || "").replace(/"/g, '""')}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="ignou-student-leads-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      leads,
      stats,
    });
  } catch (error: any) {
    console.error("[api/admin/leads] GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch leads" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    const updates: any = {};
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    updates.updated_at = new Date().toISOString();
    updates.updated_by = admin.name || admin.email;

    const ok = await updateLead(id, updates);
    if (!ok) {
      return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Lead updated successfully" });
  } catch (error: any) {
    console.error("[api/admin/leads] PATCH error:", error);
    return NextResponse.json({ error: error.message || "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    const ok = await deleteLead(id);
    if (!ok) {
      return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Lead deleted successfully" });
  } catch (error: any) {
    console.error("[api/admin/leads] DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete lead" }, { status: 500 });
  }
}
