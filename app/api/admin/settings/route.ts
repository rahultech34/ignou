import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings } from "@/lib/admin-data";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings, data: settings });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();
    const body = text ? JSON.parse(text) : {};
    const updated = await saveSiteSettings(body);
    return NextResponse.json({ success: true, settings: updated, data: updated });
  } catch (e: unknown) {
    console.error("[api/settings] Error saving:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
