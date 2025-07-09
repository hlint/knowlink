import { prisma } from "@/lib/prisma";
import * as emoji from "node-emoji";
import { cache } from "react";

export type CategoryWithSubs = Awaited<
  ReturnType<typeof fetcherGetCategories>
>[number];
export const fetcherGetCategories = cache(async () => {
  const categories = await prisma.category.findMany({
    include: {
      Subcategory: {
        include: {
          _count: {
            select: {
              Note: {
                where: {
                  deleted: false,
                },
              },
            },
          },
        },
      },
    },
  });
  categories.sort((a, b) => nameFix(a.name).localeCompare(nameFix(b.name)));
  for (const category of categories) {
    category.Subcategory.sort((a, b) =>
      nameFix(a.name).localeCompare(nameFix(b.name)),
    );
  }
  return categories;
});

export const fetcherGetSubcategory = cache(async (subcategoryId: string) => {
  return await prisma.subcategory.findUnique({
    where: { id: subcategoryId },
    include: {
      category: true,
    },
  });
});

function nameFix(name: string) {
  return emoji.strip(name.trim());
}
