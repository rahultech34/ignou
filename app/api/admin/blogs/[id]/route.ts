import { NextRequest, NextResponse } from "next/server";
import { getBlogById, saveBlog, deleteBlog, BlogValidationError } from "@/lib/admin-data";
import { getAdminFromRequest } from "@/lib/auth";
import { Blog } from "@/lib/types";
import { slugify } from "@/lib/slug";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const blog = await getBlogById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, blog });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = (await request.json()) as Blog;
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Article title is required." }, { status: 400 });
    }
    const normalizedSlug = slugify(body.slug || body.title);
    if (!normalizedSlug) {
      return NextResponse.json(
        { error: "A valid URL slug (using letters, numbers, or hyphens) is required." },
        { status: 400 }
      );
    }
    const saved = await saveBlog({ ...body, id, slug: normalizedSlug });
    return NextResponse.json({ success: true, blog: saved });
  } catch (e: unknown) {
    if (e instanceof BlogValidationError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteBlog(id);
    if (!deleted) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete blog" },
      { status: 500 }
    );
  }
}
