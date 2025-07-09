"use client";
import { useMainLayoutStore } from "@/app/(main)/(pages)/(layout)/store";
import { usePageNoteStore } from "@/app/(main)/(pages)/note/[noteId]/store";
import NoteIcon from "@/app/(main)/components/note-icon";
import type { Category, Note, Subcategory } from "@prisma/client";
import { useLayoutEffect } from "react";

export function NoteEffect({
  category,
  subcategory,
  note,
}: {
  category: Category | null;
  subcategory: Subcategory | null;
  note: Note | null;
}) {
  const setMainLayoutValues = useMainLayoutStore((s) => s.actions.setValues);
  const setPageNoteValues = usePageNoteStore((s) => s.actions.setValues);
  useLayoutEffect(() => {
    setMainLayoutValues({
      pageType: "note",
    });
    setPageNoteValues({
      note,
      subcategory,
      category,
    });
    const breadcrumbItems = [];
    if (category) {
      breadcrumbItems.push({
        name: category.name,
      });
    }
    if (subcategory) {
      breadcrumbItems.push({
        name: subcategory.name,
        href: `/sub/${subcategory.id}${category ? `?open_category=${category.id}` : ""}`,
      });
    } else if (note?.deleted) {
      breadcrumbItems.push({
        name: "Recycle Bin",
        href: "/quick-access/recycle-bin",
      });
    } else {
      breadcrumbItems.push({
        name: "Unsorted Notes",
        href: "/quick-access/unsorted-notes",
      });
    }
    if (note) {
      breadcrumbItems.push({
        name: note.title || "Untitled",
        icon: <NoteIcon note={note} className="size-4 rounded-sm" />,
      });
    }
    setMainLayoutValues({
      breadcrumbItems,
      activeCategoryId: category?.id || null,
      activeSubcategoryId: subcategory?.id || null,
    });
    return () => {
      setMainLayoutValues({
        pageType: "null",
        activeCategoryId: null,
        activeSubcategoryId: null,
        breadcrumbItems: [],
      });
    };
  }, [category, subcategory, note, setMainLayoutValues, setPageNoteValues]);
  return null;
}
