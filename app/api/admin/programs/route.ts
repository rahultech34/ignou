import { NextRequest, NextResponse } from "next/server";
import { getPrograms, saveProgram } from "@/lib/admin-data";
import { Program } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as "ug" | "pg" | "mba" | null;
    const programs = await getPrograms(type || undefined);
    return NextResponse.json({ success: true, programs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch programs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Program;
    if (!body.title || !body.type) {
      return NextResponse.json({ error: "Title and type are required" }, { status: 400 });
    }
    const saved = await saveProgram(body);
    return NextResponse.json({ success: true, program: saved });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to save program" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
