import { actionCreateNoteVersion } from "@/app/(main)/actions/version";
import { fetcherGetConfig } from "@/app/(main)/fetchers/configs";
import { classify, getContentFromHtml } from "@/app/(main)/lib/note-process";
import { getFavicon } from "@/app/(main)/lib/note-process";
import { prisma } from "@/lib/prisma";
import { shortId } from "@/lib/string";
import { scrapeHtml } from "@/lib/utils.server";
import type { Note } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// For CORS
export async function OPTIONS(_request: NextRequest) {
  return NextResponse.json({ message: "OK" }, { headers, status: 200 });
}

// check if the note is already created
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const result = z
    .object({
      url: z.string().url(),
      access_key: z.string().min(1),
    })
    .safeParse({
      url: searchParams.get("url"),
      access_key: searchParams.get("access_key"),
    });
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid request data", details: result.error.errors },
      { status: 400, headers },
    );
  }
  const { url, access_key } = result.data;
  if (access_key !== (await fetcherGetConfig("webClipperAccessKey"))) {
    return NextResponse.json(
      { error: "Invalid access key" },
      { status: 401, headers },
    );
  }
  const note = await prisma.note.findFirst({
    where: {
      link: url,
      deleted: false,
    },
  });
  if (note) {
    return NextResponse.json(
      { isExisting: true, noteId: note.id },
      { headers },
    );
  }
  return NextResponse.json({ isExisting: false }, { headers });
}

// create note
export async function POST(request: NextRequest) {
  const data = await request.json();
  const result = z
    .object({
      url: z.string().url(),
      access_key: z.string().min(1),
      html: z.string().min(1),
    })
    .safeParse(data);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid request data", details: result.error.errors },
      { status: 400, headers },
    );
  }
  const { url, access_key, html: htmlProvided } = result.data;
  if (access_key !== (await fetcherGetConfig("webClipperAccessKey"))) {
    return NextResponse.json(
      { error: "Invalid access key" },
      { status: 401, headers },
    );
  }
  const html = await scrapeHtml(url, {
    providedHtml: htmlProvided,
    saveImagesToLocal: true,
  });
  const id = shortId();
  await prisma.note.create({
    data: {
      id,
      title: "New Bookmark",
      link: url,
      icon: "",
      content: "Processing...",
      pending: true,
    },
  });
  (async () => {
    const data: Partial<Note> = {
      title: "New Bookmark",
      icon: "",
      subcategoryId: null,
      content: "Processing...",
      pending: false,
    };
    await Promise.all([
      (async () => {
        data.icon = await getFavicon(url);
      })(),
      (async () => {
        const { title, content } = await getContentFromHtml(html);
        data.title = title;
        data.content = content;
      })(),
      (async () => {
        const subcategoryId = await classify(html);
        data.subcategoryId = subcategoryId;
      })(),
    ]).catch((error) => {
      console.error(error);
    });
    await prisma.note.update({
      where: { id },
      data,
    });
    await actionCreateNoteVersion({
      noteId: id,
      message: "Auto Snapshot",
    });
  })().catch((error) => {
    console.error(error);
    prisma.note.update({
      where: { id },
      data: { pending: false },
    });
  });
  return NextResponse.json({ id }, { headers });
}
