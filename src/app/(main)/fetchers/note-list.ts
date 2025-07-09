import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";
import Fuse from "fuse.js";
import { omit } from "radashi";
import type { NoteLite } from "../schema/note";

export async function fetcherGetNoteDetails(noteIds: string[]) {
  const notes = await prisma.note.findMany({
    where: { id: { in: noteIds }, confidential: false, deleted: false },
    include: {
      subcategory: true,
    },
  });
  return notes;
}

export async function fetcherGetNotesBySearchForAi({
  query = "",
  subcategoryId = true,
}: {
  query?: string;
  subcategoryId?: string | null | true;
}) {
  const notes = await prisma.note.findMany({
    where: {
      deleted: false,
      confidential: false,
      ...(subcategoryId === true
        ? {}
        : { subcategoryId: subcategoryId ?? null }),
    },
    select: {
      id: true,
      title: true,
      link: true,
      content: true,
      subcategory: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  });
  return fuseSearch(notes, query);
}

export async function fetcherGetAllNotes(query = "") {
  const notes = await prisma.note.findMany({
    where: {
      deleted: false,
    },
    select: {
      id: true,
      title: true,
      icon: true,
      link: true,
      content: true,
      subcategoryId: true,
      pending: true,
      deleted: true,
      confidential: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return fuseSearch(notes, query);
}

export async function fetcherGetNotesBySubcategoryId(
  subcategoryId: string | null,
  query = "",
) {
  const notes = await prisma.note.findMany({
    where: {
      deleted: false,
      subcategoryId,
    },
    select: {
      id: true,
      title: true,
      icon: true,
      link: true,
      content: true,
      subcategoryId: true,
      pending: true,
      deleted: true,
      confidential: true,
    },
    orderBy: {
      title: "asc",
    },
  });
  return fuseSearch(notes, query);
}

export async function fetcherGetRecentlyViewedNotes(query = "") {
  const notes = await prisma.note.findMany({
    where: {
      deleted: false,
      updatedAt: {
        gt: subDays(new Date(), 3),
      },
    },
    select: {
      id: true,
      title: true,
      icon: true,
      link: true,
      content: true,
      subcategoryId: true,
      pending: true,
      deleted: true,
      confidential: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return fuseSearch(notes, query);
}

export async function fetcherGetUnclassifiedNotes(query = "") {
  const notes = await prisma.note.findMany({
    where: {
      deleted: false,
      subcategoryId: null,
    },
    select: {
      id: true,
      title: true,
      icon: true,
      link: true,
      content: true,
      subcategoryId: true,
      pending: true,
      deleted: true,
      confidential: true,
    },
    orderBy: {
      title: "asc",
    },
  });
  return fuseSearch(notes, query);
}

export async function fetcherGetRecycleBinNotes(query = "") {
  const notes = await prisma.note.findMany({
    where: {
      deleted: true,
    },
    select: {
      id: true,
      title: true,
      icon: true,
      link: true,
      content: true,
      subcategoryId: true,
      pending: true,
      deleted: true,
      confidential: true,
    },
    orderBy: {
      deletedAt: "desc",
    },
  });
  return fuseSearch(notes, query);
}

function fuseSearch<T extends Partial<NoteLite>>(
  notes: (T & { content: string })[],
  query: string,
) {
  const queryTrim = query.trim();
  if (!queryTrim) {
    return notes.map((note) => omit(note, ["content"]));
  }
  const fuse = new Fuse(notes, {
    includeScore: true,
    ignoreLocation: true,
    useExtendedSearch: true,
    threshold: 0.2,
    keys: [
      {
        name: "title",
        weight: 1,
      },
      {
        name: "link",
        weight: 0.9,
      },
      {
        name: "content",
        weight: 0.6,
      },
    ],
  });
  return fuse.search(queryTrim).map((result) => omit(result.item, ["content"]));
}
