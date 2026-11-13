import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/admin-data";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d";

    const analytics = await getAnalyticsData(period);

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error: any) {
    console.error("[api/admin/analytics] GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch analytics" }, { status: 500 });
  }
}
