import NoteIllustration from "@/app/(main)/components/note-illustration";
import Toc from "@/components/advance/toc";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { omit } from "radashi";
import { cache } from "react";
import { NoteEffect } from "./effect";
import ModalProcessing from "./modal-processing";
import NoteEditor from "./note-editor";
import NotePending from "./note-pending";

const getNote = cache(async (noteId: string) => {
  return await prisma.note.findUnique({
    where: { id: noteId },
    include: {
      subcategory: {
        include: {
          category: true,
        },
      },
    },
  });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ noteId: string }>;
}): Promise<Metadata> {
  const note = await getNote((await params).noteId);
  return {
    title: `${note?.title || "Untitled"} | Knowlink`,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const result = await getNote((await params).noteId);
  const note = result ? omit(result, ["subcategory"]) : null;
  const subcategory = result?.subcategory
    ? omit(result.subcategory, ["category"])
    : null;
  const category = result?.subcategory?.category || null;
  return (
    <>
      <NoteEffect note={note} subcategory={subcategory} category={category} />
      <div className="flex flex-1 flex-row gap-4 ">
        {note ? (
          <>
            {note.pending ? (
              <NotePending
                note={note}
                illustrationComponent={
                  <NoteIllustration title={note.title} className="sm:px-18" />
                }
              />
            ) : (
              <NoteEditor
                note={note}
                illustrationComponent={
                  <NoteIllustration title={note.title} className="sm:px-18" />
                }
              />
            )}
            <Toc
              className="pr-[100px] w-[380px]"
              selector=".note-body"
              blacklistSelector=".milkdown-slash-menu"
            />
          </>
        ) : (
          <NotFound />
        )}
      </div>
      <ModalProcessing
        noteId={note?.id ?? ""}
        shouldOpen={note?.pending ?? false}
      />
    </>
  );
}

function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center gap-4 p-4">
      <div className="prose pb-20">
        <h1>Not Found</h1>
        <p>The note you are looking for does not exist.</p>
      </div>
    </div>
  );
}
