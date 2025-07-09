"use server";

import { checkUserAdmin } from "@/dal-server-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function actionGetVersionCount(noteId: string) {
  await checkUserAdmin();
  const count = await prisma.noteVersion.count({
    where: { noteId },
  });
  return count;
}

export type VersionListItem = Awaited<
  ReturnType<typeof actionGetVersionList>
>[number];
export async function actionGetVersionList(noteId: string) {
  await checkUserAdmin();
  const versions = await prisma.noteVersion.findMany({
    where: { noteId },
    select: {
      id: true,
      createdAt: true,
      version: true,
      message: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return versions;
}

export async function actionGetVersionContent(versionId: string) {
  await checkUserAdmin();
  const version = await prisma.noteVersion.findUnique({
    where: { id: versionId },
  });
  return version?.content ?? "";
}

export async function actionCheckoutVersion(versionId: string) {
  await checkUserAdmin();
  const version = await prisma.noteVersion.findUnique({
    where: { id: versionId },
  });
  if (!version) {
    throw new Error("Version not found");
  }
  await prisma.note.update({
    where: { id: version.noteId },
    data: { content: version.content },
  });
  revalidatePath("/");
}
