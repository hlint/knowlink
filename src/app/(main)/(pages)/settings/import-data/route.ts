import path from "node:path";
import { checkUserAdmin } from "@/dal-server-action";
import fs from "fs-extra";
import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const MAX_FILE_SIZE = 1024 * 1024 * 32; // 32MB

export async function POST(request: NextRequest) {
  try {
    // 检查用户权限
    await checkUserAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }

    if (!file.name.endsWith(".db")) {
      return NextResponse.json(
        { error: "Only .db files are allowed" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dbFilePath = path.join(process.cwd(), "runtime", "sqlite.db");
    await fs.writeFile(dbFilePath, buffer);

    revalidatePath("/settings");
    return NextResponse.json({
      success: true,
      message: "Database imported successfully",
      size: file.size,
    });
  } catch (error) {
    console.error("Import data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
