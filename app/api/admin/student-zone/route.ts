import { NextRequest, NextResponse } from "next/server";
import { getStudentResources, saveStudentResource } from "@/lib/admin-data";
import { StudentResource } from "@/lib/types";

export async function GET() {
  try {
    const resources = await getStudentResources();
    return NextResponse.json({ success: true, resources });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch student resources" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as StudentResource;
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const saved = await saveStudentResource(body);
    return NextResponse.json({ success: true, resource: saved });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to save student resource" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
