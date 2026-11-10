import { NextRequest, NextResponse } from "next/server";
import { getBlogs, saveBlog } from "@/lib/admin-data";
import { Blog } from "@/lib/types";

export async function GET() {
  try {
    const blogs = await getBlogs();
    return NextResponse.json({ success: true, blogs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Blog;
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const saved = await saveBlog(body);
    return NextResponse.json({ success: true, blog: saved });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to save blog" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
