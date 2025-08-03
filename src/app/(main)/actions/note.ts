"use server";
import { checkUserAdmin } from "@/dal-server-action";
import { prisma } from "@/lib/prisma";
import { subHours } from "date-fns";
import { revalidatePath } from "next/cache";
import { actionCreateNoteVersion } from "./version";

export async function actionUpdateNote({
  id,
  title,
  link,
  subcategoryId,
  confidential,
  pinned,
  content,
  icon,
  deleted,
  noRevalidate = false,
  AutoSnapshot = false,
}: {
  id: string;
  title?: string;
  link?: string;
  subcategoryId?: string;
  confidential?: boolean;
  pinned?: boolean;
  content?: string;
  icon?: string;
  deleted?: boolean;
  noRevalidate?: boolean;
  AutoSnapshot?: boolean;
}) {
  await checkUserAdmin();
  if (content !== undefined) {
    if (AutoSnapshot) {
      await actionCreateNoteVersion({
        noteId: id,
        message: "Auto Snapshot",
      });
    } else {
      // check if there is a recent version. if not, create a new version.
      const recentVersion = await prisma.noteVersion.findFirst({
        where: {
          noteId: id,
          createdAt: {
            gte: subHours(new Date(), 2),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (!recentVersion) {
        await actionCreateNoteVersion({
          noteId: id,
          message: "Auto Snapshot",
        });
      }
    }
  }

  await prisma.note.update({
    where: { id },
    data: {
      title,
      link,
      subcategoryId,
      confidential,
      pinned,
      content,
      icon,
      deleted,
    },
  });
  if (!noRevalidate) {
    revalidatePath("/");
  }
}

export async function actionDeleteNote(noteId: string, permanently = false) {
  await checkUserAdmin();
  if (permanently) {
    await prisma.note.delete({
      where: { id: noteId },
    });
  } else {
    await prisma.note.update({
      where: { id: noteId },
      data: {
        subcategoryId: null,
        deleted: true,
        deletedAt: new Date(),
      },
    });
  }
  revalidatePath("/");
}

export async function actionIncrementViewedCount(noteId: string) {
  await checkUserAdmin();
  await prisma.note.update({
    where: { id: noteId },
    data: {
      viewedCount: { increment: 1 },
    },
  });
}

export async function actionCheckNoteReady(noteId: string) {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
  });
  if (!note) {
    return false;
  }
  revalidatePath("/");
  return note.pending === false;
}
