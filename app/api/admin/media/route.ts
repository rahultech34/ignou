import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getMediaList } from "@/lib/admin-data";

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const media = await getMediaList();
    return NextResponse.json({ media });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
