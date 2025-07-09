// A route to serve the uploaded file
import { fileStorage } from "@/integrations/file-storage";
import { notFound } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const file = await fileStorage.get(id);
  if (!file) {
    return notFound();
  }

  const headers: Record<string, string> = {
    "Content-Type": file.type,
    "Content-Length": file.size.toString(),
    "Cache-Control": "public, immutable, max-age=31536000",
  };

  // Only set Content-Disposition as attachment for non-viewable files
  if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
    headers["Content-Disposition"] = `attachment; filename=${file.name}`;
  }
  return new NextResponse(file.stream(), { headers });
}
