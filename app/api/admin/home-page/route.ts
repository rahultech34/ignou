import { NextRequest, NextResponse } from "next/server";
import { getHomePageData, saveHomePageData } from "@/lib/admin-data";

export async function GET() {
  try {
    const data = await getHomePageData();
    return NextResponse.json({ success: true, data, homePage: data });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Failed to fetch home page data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();
    const body = text ? JSON.parse(text) : {};
    const updated = await saveHomePageData(body);
    return NextResponse.json({ success: true, data: updated, homePage: updated });
  } catch (e: any) {
    console.error("[api/home-page] Error saving:", e);
    return NextResponse.json(
      { error: e.message || "Failed to save home page data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
