"use client";
import { useNoteListStore } from "@/app/(main)/components/note-list/note-list-store";
import type { Category, Subcategory } from "@prisma/client";
import {
  ClockIcon,
  InboxIcon,
  NotebookIcon,
  PinIcon,
  TrashIcon,
} from "lucide-react";
import { useLayoutEffect } from "react";
import { useMainLayoutStore } from "../../(pages)/(layout)/store";
import type { NoteLite } from "../../schema/note";

export type PageType =
  | "subcategory"
  | "unsorted-notes"
  | "recent-notes"
  | "recycle-bin"
  | "all-notes"
  | "pinned-notes";

export function NoteListEffect({
  category,
  subcategory,
  notes,
  pageType,
}: {
  category: Category | null;
  subcategory: Subcategory | null;
  notes: NoteLite[];
  pageType: PageType;
}) {
  const setMainLayoutValues = useMainLayoutStore((s) => s.actions.setValues);
  const setNoteListValues = useNoteListStore((s) => s.actions.setValues);
  useLayoutEffect(() => {
    setMainLayoutValues({
      pageType,
    });
    setNoteListValues({
      category,
      subcategory,
      notes,
      editMode: false,
      selectedNoteIds: [],
    });
    if (category && subcategory) {
      setMainLayoutValues({
        activeCategoryId: category.id,
        activeSubcategoryId: subcategory.id,
        breadcrumbItems: [
          {
            name: category.name,
          },
          {
            name: subcategory.name,
          },
        ],
      });
    } else {
      setMainLayoutValues({
        activeCategoryId: null,
        activeSubcategoryId: null,
        breadcrumbItems:
          pageType === "subcategory"
            ? [{ name: "Category Not Found" }]
            : [
                {
                  name: "Quick Access",
                },
                {
                  name: (
                    {
                      "unsorted-notes": "Unsorted Notes",
                      "recent-notes": "Recent Notes",
                      "recycle-bin": "Recycle Bin",
                      "all-notes": "All Notes",
                      "pinned-notes": "Pinned Notes",
                    } as const
                  )[pageType],
                  icon: (
                    {
                      "unsorted-notes": <InboxIcon className="size-4" />,
                      "recent-notes": <ClockIcon className="size-4" />,
                      "recycle-bin": <TrashIcon className="size-4" />,
                      "all-notes": <NotebookIcon className="size-4" />,
                      "pinned-notes": <PinIcon className="size-4" />,
                    } as const
                  )[pageType],
                },
              ],
      });
    }
    return () => {
      setMainLayoutValues({
        pageType: "null",
        activeCategoryId: null,
        activeSubcategoryId: null,
        breadcrumbItems: [],
      });
      setNoteListValues({
        previewNote: null,
      });
    };
  }, [
    category,
    subcategory,
    notes,
    setMainLayoutValues,
    setNoteListValues,
    pageType,
  ]);
  return null;
}
