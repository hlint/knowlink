import { saveFile } from "@/integrations/file-storage";
import { type NextRequest, NextResponse } from "next/server";
const MAX_FILE_SIZE = 1024 * 1024 * 32; // 32MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }
    const fileSaved = await saveFile(file);
    return NextResponse.json(fileSaved);
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}
