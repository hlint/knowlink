import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";
import { isAfter } from "date-fns";
import { fetcherGetCategories } from "../../../fetchers/category";

export type QuickAccessCounts = Awaited<
  ReturnType<typeof fetcherGetQuickAccessItemsCounts>
>;
export async function fetcherGetQuickAccessItemsCounts() {
  const categories = await fetcherGetCategories();
  const notes = await prisma.note.findMany({
    select: {
      id: true,
      subcategoryId: true,
      deleted: true,
      updatedAt: true,
    },
  });
  const counts = {
    all: 0,
    unsorted: 0,
    recent: 0,
    recycle: 0,
    categories: categories.length,
    subcategories: categories.reduce(
      (acc, category) => acc + category.Subcategory.length,
      0,
    ),
    notes: notes.length,
  };
  for (const note of notes) {
    if (note.deleted) {
      counts.recycle++;
      continue;
    }
    if (!note.subcategoryId) {
      counts.unsorted++;
    }
    if (isAfter(note.updatedAt, subDays(new Date(), 3))) {
      counts.recent++;
    }
    counts.all++;
  }
  return counts;
}
