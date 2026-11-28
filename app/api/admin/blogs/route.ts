import { NextRequest, NextResponse } from "next/server";
import { getBlogs, saveBlog, BlogValidationError } from "@/lib/admin-data";
import { getAdminFromRequest } from "@/lib/auth";
import { Blog } from "@/lib/types";
import { slugify } from "@/lib/slug";

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const blogs = await getBlogs();
    return NextResponse.json({ success: true, blogs });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
    const saved = await saveBlog({ ...body, slug: normalizedSlug });
    return NextResponse.json({ success: true, blog: saved });
  } catch (e: unknown) {
    if (e instanceof BlogValidationError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save blog" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
