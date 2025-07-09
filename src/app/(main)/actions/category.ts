"use server";

import { checkUserAdmin } from "@/dal-server-action";
import { prisma } from "@/lib/prisma";
import { shortId } from "@/lib/string";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { recommendSubcategory } from "../lib/note-process";

export async function actionCreateCategory(formData: FormData) {
  await checkUserAdmin();
  const name = formData.get("name");
  const schema = z.object({
    name: z.string().min(1),
  });
  const result = schema.safeParse({ name });
  if (!result.success) {
    return;
  }
  const category = await prisma.category.create({
    data: { id: shortId(), name: result.data.name },
  });
  revalidatePath("/");
  return category;
}

export async function actionDeleteCategory(id: string) {
  await checkUserAdmin();
  const subcategories = await prisma.subcategory.findMany({
    where: { categoryId: id },
  });
  for (const subcategory of subcategories) {
    await actionDeleteSubcategory(subcategory.id);
  }
  await prisma.category.delete({
    where: { id },
  });
  revalidatePath("/");
}

export async function actionUpdateCategory(formData: FormData) {
  await checkUserAdmin();
  const name = formData.get("name");
  const id = formData.get("id");
  const schema = z.object({
    name: z.string().min(1),
    id: z.string().min(1),
  });
  const result = schema.safeParse({ name, id });
  if (!result.success) {
    return;
  }
  await prisma.category.update({
    where: { id: result.data.id },
    data: { name: result.data.name },
  });
  revalidatePath("/");
}

export async function actionCreateSubcategory(formData: FormData) {
  await checkUserAdmin();
  const name = formData.get("name");
  const categoryId = formData.get("categoryId");
  const schema = z.object({
    name: z.string().min(1),
    categoryId: z.string().min(1),
  });
  const result = schema.safeParse({ name, categoryId });
  if (!result.success) {
    return;
  }
  await prisma.subcategory.create({
    data: {
      id: shortId(),
      name: result.data.name,
      categoryId: result.data.categoryId,
    },
  });
  revalidatePath("/");
}

export async function actionDeleteSubcategory(id: string) {
  await checkUserAdmin();
  await prisma.note.updateMany({
    where: { subcategoryId: id },
    data: { subcategoryId: null, deleted: true, deletedAt: new Date() },
  });
  await prisma.subcategory.delete({
    where: { id },
  });
  revalidatePath("/");
}

export async function actionUpdateSubcategory(formData: FormData) {
  await checkUserAdmin();
  const schema = z.object({
    id: z.string().min(1),
    name: z.string().min(1).optional(),
    categoryId: z.string().min(1).optional(),
  });
  const result = schema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return;
  }
  await prisma.subcategory.update({
    where: { id: result.data.id },
    data: { name: result.data.name, categoryId: result.data.categoryId },
  });
  revalidatePath("/");
}

export async function actionRecommendSubcategory(noteId: string) {
  await checkUserAdmin();
  const subcategoryIds = await recommendSubcategory(noteId);
  return subcategoryIds;
}
