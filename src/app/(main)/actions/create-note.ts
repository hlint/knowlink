"use server";

import { checkUserAdmin } from "@/dal-server-action";
import { prisma } from "@/lib/prisma";
import { shortId } from "@/lib/string";
import { scrapeHtml } from "@/lib/utils.server";
import { revalidatePath } from "next/cache";
import { omit } from "radashi";
import {
  classify,
  generateIcon,
  getContentFromDoc,
  getContentFromHtml,
  getFavicon,
} from "../lib/note-process";
import { actionCreateNoteVersion } from "./version";

export async function actionCreateNote({
  subcategoryId,
  info,
  wait = false,
}: {
  subcategoryId: string | null;
  info?: string;
  wait?: boolean;
}) {
  await checkUserAdmin();
  if (!info) {
    return createEmptyNote({
      subcategoryId,
    });
  }
  if (info.startsWith("http")) {
    return createNoteFromUrl({
      url: info,
      subcategoryId,
      wait,
    });
  }
  return createNoteFromDoc({
    doc: info,
    subcategoryId,
    wait,
  });
}

async function createNoteFromUrl({
  url,
  subcategoryId,
  wait = false,
}: {
  url: string;
  subcategoryId: string | null;
  wait?: boolean;
}) {
  const id = shortId();
  await prisma.note.create({
    data: {
      id,
      subcategoryId,
      title: "New Bookmark",
      link: url,
      icon: "",
      content: "Processing...",
      pending: true,
    },
  });
  const process = async () => {
    await processNoteFromUrl({
      id,
      url,
      defaultTitle: "New Bookmark",
      defaultContent: "Processing...",
      defaultSubcategoryId: subcategoryId,
    });
    await actionCreateNoteVersion({
      noteId: id,
      message: "Initial",
    });
  };
  if (wait) {
    await process();
  } else {
    process();
  }
  const created_note = await prisma.note.findUnique({
    where: { id },
  });
  return created_note!;
}

async function createNoteFromDoc({
  doc,
  subcategoryId,
  wait = false,
}: {
  doc: string;
  subcategoryId: string | null;
  wait?: boolean;
}) {
  const id = shortId();
  await prisma.note.create({
    data: {
      id,
      subcategoryId,
      title: "New Note",
      content: "Processing...",
      pending: true,
    },
  });

  const process = async () => {
    try {
      const data = {
        title: "New Note",
        icon: "",
        content: "Processing...",
        pending: false,
        subcategoryId,
      };
      await Promise.all([
        (async () => {
          data.icon = await generateIcon(doc);
        })(),
        (async () => {
          if (subcategoryId) {
            return;
          }
          data.subcategoryId = await classify(doc);
        })(),
        (async () => {
          const { title, content } = await getContentFromDoc(doc);
          data.title = title;
          data.content = content;
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
        message: "Initial",
      });
    } catch (error) {
      console.error(error);
      prisma.note.update({
        where: { id },
        data: { pending: false },
      });
    }
  };
  if (wait) {
    await process();
  } else {
    process();
  }
  const created_note = await prisma.note.findUnique({
    where: { id },
  });
  return created_note!;
}

async function createEmptyNote({
  subcategoryId,
}: {
  subcategoryId: string | null;
}) {
  const id = shortId();
  const note = await prisma.note.create({
    data: {
      id,
      subcategoryId,
      title: "New Note",
    },
  });
  return note;
}

export async function actionPullNoteWithUrl(noteId: string) {
  await checkUserAdmin();
  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
    },
  });
  if (!note?.link) return;
  await actionCreateNoteVersion({
    noteId,
    message: "Auto Snapshot",
  });
  await processNoteFromUrl({
    id: noteId,
    url: note.link,
    defaultTitle: note.title,
    defaultContent: note.content,
    defaultSubcategoryId: note.subcategoryId,
  });

  revalidatePath("/");
}

async function processNoteFromUrl({
  id,
  url,
  defaultTitle,
  defaultContent,
  defaultSubcategoryId,
}: {
  id: string;
  url: string;
  defaultTitle: string;
  defaultContent: string;
  defaultSubcategoryId: string | null;
}) {
  try {
    const data = {
      title: defaultTitle,
      icon: "",
      content: defaultContent,
      pending: false,
      subcategoryId: defaultSubcategoryId,
    };
    const html = await scrapeHtml(url, { saveImagesToLocal: true });
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
        if (defaultSubcategoryId) {
          return;
        }
        const subcategoryId = await classify(html);
        data.subcategoryId = subcategoryId;
      })(),
    ]).catch((error) => {
      console.warn(error);
    });
    await prisma.note.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.warn(error);
    prisma.note.update({
      where: { id },
      data: { pending: false },
    });
  }
}

export async function actionCloneNote(noteId: string) {
  await checkUserAdmin();
  const note = await prisma.note.findUnique({
    where: { id: noteId },
  });
  if (!note) return;
  const versions = await prisma.noteVersion.findMany({
    where: { noteId },
  });
  const newNote = await prisma.note.create({
    data: {
      ...omit(note, [
        "id",
        "createdAt",
        "updatedAt",
        "deletedAt",
        "deleted",
        "pending",
      ]),
      id: shortId(),
    },
  });
  for (const version of versions) {
    await prisma.noteVersion.create({
      data: { ...version, noteId: newNote.id },
    });
  }
  revalidatePath("/");
}
