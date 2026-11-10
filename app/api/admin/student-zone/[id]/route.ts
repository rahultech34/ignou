import { NextRequest, NextResponse } from "next/server";
import { getStudentResourceById, saveStudentResource, deleteStudentResource } from "@/lib/admin-data";
import { StudentResource } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resource = await getStudentResourceById(id);
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, resource });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch resource" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as StudentResource;
    const saved = await saveStudentResource({ ...body, id });
    return NextResponse.json({ success: true, resource: saved });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update resource" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteStudentResource(id);
    if (!deleted) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Resource deleted successfully" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to delete resource" }, { status: 500 });
  }
}
