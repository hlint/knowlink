"use server";

import { checkUserAdmin } from "@/dal-server-action";
import { prisma } from "@/lib/prisma";

export async function actionSetEntryByName(name: string, content: string) {
  await checkUserAdmin();
  await prisma.entry.upsert({
    where: {
      name,
    },
    update: {
      content,
    },
    create: {
      name,
      content,
    },
  });
}
