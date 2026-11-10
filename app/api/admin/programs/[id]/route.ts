import { NextRequest, NextResponse } from "next/server";
import { getProgramById, saveProgram, deleteProgram } from "@/lib/admin-data";
import { Program } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const program = await getProgramById(id);
    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, program });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch program" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Program;
    const saved = await saveProgram({ ...body, id });
    return NextResponse.json({ success: true, program: saved });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update program" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteProgram(id);
    if (!deleted) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Program deleted successfully" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to delete program" }, { status: 500 });
  }
}
