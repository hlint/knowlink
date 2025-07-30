import path from "node:path";
import { format } from "date-fns";
import fs from "fs-extra";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  const dbFilePath = path.join(process.cwd(), "runtime", "sqlite.db");
  const file = await fs.readFile(dbFilePath);

  const headers: Record<string, string> = {
    "Content-Type": "application/octet-stream",
    "Content-Length": file.length.toString(),
    "Cache-Control": "no-cache",
    "Content-Disposition": `attachment; filename=knowlink.${format(new Date(), "MM-dd")}.db`,
  };

  return new NextResponse(file, { headers });
}
