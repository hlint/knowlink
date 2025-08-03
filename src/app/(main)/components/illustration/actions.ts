"use server";

import { checkUserAdmin } from "@/dal-server-action";
import { prisma } from "@/lib/prisma";
import { generateIllustration } from "./generate-illustration";

export async function actionUpdateIllustration(name: string, details = "") {
  await checkUserAdmin();
  const illustration = await prisma.illustration.upsert({
    where: { name },
    update: { pending: true },
    create: { name, pending: true },
  });
  (async () => {
    const url = await generateIllustration(name, details);
    await prisma.illustration.update({
      where: { name },
      data: { src: url, pending: false },
    });
  })().catch(async () => {
    await prisma.illustration.update({
      where: { name },
      data: { pending: false },
    });
  });
  return illustration;
}

export async function actionGetIllustration(name: string, details = "") {
  await checkUserAdmin();
  const illustration = await prisma.illustration.findFirst({
    where: { name },
  });
  if (!illustration) {
    return await actionUpdateIllustration(name, details);
  }
  return illustration;
}
