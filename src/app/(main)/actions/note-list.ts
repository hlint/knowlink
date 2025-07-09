"use server";

import { checkUserAdmin } from "@/dal-server-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function actionGetNotePreview(noteId: string) {
  await checkUserAdmin();
  const note = await prisma.note.findUnique({
    where: { id: noteId },
  });
  return note;
}

export async function actionDeleteNotes(
  noteIds: string[],
  permanently = false,
) {
  await checkUserAdmin();
  if (permanently) {
    await prisma.note.deleteMany({
      where: { id: { in: noteIds } },
    });
  } else {
    await prisma.note.updateMany({
      where: { id: { in: noteIds } },
      data: { subcategoryId: null, deleted: true, deletedAt: new Date() },
    });
  }
  revalidatePath("/");
}

export async function actionMoveNotes(
  noteIds: string[],
  subcategoryId: string,
) {
  await checkUserAdmin();
  await prisma.note.updateMany({
    where: { id: { in: noteIds } },
    data: { subcategoryId, deleted: false, deletedAt: null },
  });
  revalidatePath("/");
}
