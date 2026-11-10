import { NextResponse } from "next/server";
import { getDashboardStats, getDatabaseStatus } from "@/lib/admin-data";

export async function GET() {
  try {
    const [stats, database] = await Promise.all([
      getDashboardStats(),
      getDatabaseStatus(),
    ]);
    return NextResponse.json({ success: true, stats, database });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to load stats" }, { status: 500 });
  }
}
