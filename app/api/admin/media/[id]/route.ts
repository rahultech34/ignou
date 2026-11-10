import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { deleteMediaItem } from "@/lib/admin-data";
import path from "path";
import fs from "fs/promises";

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
    const deleted = await deleteMediaItem(id);

    // Also attempt to delete file on disk
    try {
      const filePath = path.join(process.cwd(), "public", "uploads", id);
      await fs.unlink(filePath);
    } catch (e) {
      // Ignore if file doesn't exist
    }

    if (deleted) {
      return NextResponse.json({ success: true, message: "Media deleted" });
    }
    return NextResponse.json({ error: "Media item not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
