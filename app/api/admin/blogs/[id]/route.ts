import { NextRequest, NextResponse } from "next/server";
import { getBlogById, saveBlog, deleteBlog } from "@/lib/admin-data";
import { Blog } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await getBlogById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, blog });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Blog;
    const saved = await saveBlog({ ...body, id });
    return NextResponse.json({ success: true, blog: saved });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteBlog(id);
    if (!deleted) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to delete blog" }, { status: 500 });
  }
}
