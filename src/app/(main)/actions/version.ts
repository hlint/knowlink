"use server";
import { checkUserAdmin } from "@/dal-server-action";
import { prisma } from "@/lib/prisma";

export async function actionCreateNoteVersion({
  noteId,
  content,
  message,
}: {
  noteId: string;
  content?: string;
  message?: string;
}) {
  await checkUserAdmin();
  const note = await prisma.note.findUnique({
    where: { id: noteId },
  });
  if (!note) return;
  const versionCount = await prisma.noteVersion.count({
    where: { noteId },
  });
  const version = await prisma.noteVersion.create({
    data: {
      noteId,
      content: content ?? note.content,
      message: message,
      version: versionCount + 1,
    },
  });
  return version;
}

export async function actionDeleteNoteVersion(versionId: string) {
  await checkUserAdmin();
  await prisma.noteVersion.delete({
    where: { id: versionId },
  });
}
