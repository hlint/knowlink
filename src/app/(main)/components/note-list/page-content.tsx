import type { Category, Subcategory } from "@prisma/client";
import type { ReactNode } from "react";
import type { NoteLite } from "../../schema/note";
import IllustrationComponent from "../illustration";
import ListManage from "./list-manage";
import NoteList from "./note-list";
import NotePreview from "./note-preview";
import { NoteListEffect, type PageType } from "./page-effects";
import SearchCreate from "./search-create";

export default function ListPageContent({
  category = null,
  subcategory = null,
  notes,
  pageType,
  fallback = null,
  illustrationName,
}: {
  category?: Category | null;
  subcategory?: Subcategory | null;
  notes: NoteLite[];
  pageType: PageType;
  fallback?: ReactNode | null;
  illustrationName: string;
}) {
  return (
    <>
      <NoteListEffect
        subcategory={subcategory}
        category={category}
        notes={notes}
        pageType={pageType}
      />
      <div className="flex flex-1 flex-col gap-4 p-4">
        {fallback || (
          <div className="mx-auto flex w-full flex-1 flex-row gap-12">
            <div className="flex flex-col gap-4 sm:gap-4 flex-1 max-w-screen-lg">
              <IllustrationComponent name={illustrationName} />
              <SearchCreate
                subcategoryId={subcategory?.id ?? null}
                subcategoryName={subcategory?.name ?? null}
              />
              <ListManage isRecycleBin={pageType === "recycle-bin"} />
              <NoteList notes={notes} />
            </div>
            <NotePreview />
          </div>
        )}
      </div>
    </>
  );
}
