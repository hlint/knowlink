"use client";

import { useNoteListStore } from "@/app/(main)/components/note-list/note-list-store";
import { ProgressBarLink } from "@/components/advance/progress-bar";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import MarkdownPreview from "@/integrations/markdown/markdown-preview";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useMainLayoutStore } from "../../(pages)/(layout)/store";
import NoteIllustration from "../note-illustration";

export default function NotePreview() {
  const note = useNoteListStore((s) => s.previewNote);
  const fetchingPreviewNote = useNoteListStore((s) => s.fetchingPreviewNote);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "hover-show-scroller shrink-0 w-[380px] hidden xl:block sticky top-14 h-[calc(100vh-128px)] overflow-auto transition-opacity duration-300",
        note?.pending && "animate-pulse",
        fetchingPreviewNote && "opacity-30",
      )}
    >
      {note ? (
        <>
          <div className="flex flex-col gap-4 mb-4">
            <CategoryNav subcategoryId={note.subcategoryId} />
            <NoteIllustration title={note.title} />
            <h1 className="text-2xl font-bold line-clamp-2">{note.title}</h1>
            {note.link ? (
              <a
                href={note.link}
                className="text-primary underline-offset-4 hover:underline line-clamp-2 break-all"
              >
                {note.link}
              </a>
            ) : null}
          </div>
          <MarkdownPreview text={note.content} />
        </>
      ) : null}
    </motion.div>
  );
}

function CategoryNav({ subcategoryId }: { subcategoryId: string | null }) {
  const isSubcategoryPage = useMainLayoutStore(
    (s) => s.pageType === "subcategory",
  );
  const categories = useMainLayoutStore((s) => s.categories);
  const [category, subcategory] = useMemo(() => {
    if (!subcategoryId) return [null, null];
    for (const category of categories) {
      const subcategory = category.Subcategory.find(
        (s) => s.id === subcategoryId,
      );
      if (subcategory) return [category, subcategory];
    }
    return [null, null];
  }, [subcategoryId, categories]);
  if (isSubcategoryPage || !subcategoryId || !category || !subcategory)
    return null;
  return (
    <Breadcrumb className="">
      <BreadcrumbList className="">
        <BreadcrumbPage className="text-muted-foreground">
          {category.name}
        </BreadcrumbPage>
        <BreadcrumbSeparator />
        <BreadcrumbLink asChild>
          <ProgressBarLink href={`/sub/${subcategory.id}`}>
            {subcategory.name}
          </ProgressBarLink>
        </BreadcrumbLink>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
