"use client";
import { actionCheckNoteReady } from "@/app/(main)/actions/note";
import MarkdownPreview from "@/integrations/markdown/markdown-preview";
import type { Note } from "@prisma/client";
import { type ReactNode, useEffect } from "react";
import NoteMoreForm from "../../../components/note-more-form";
import NoteInfo from "./note-info";

export default function NotePending({
  note,
  illustrationComponent,
}: { note: Note; illustrationComponent: ReactNode }) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (note.pending) {
        actionCheckNoteReady(note.id);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [note.id, note.pending]);
  return (
    <div className="note-body flex w-full max-w-screen-lg flex-1 flex-col gap-4 p-4 animate-pulse">
      {illustrationComponent}
      <MetaPreview note={note} />
      <NoteInfo note={note} />
      <MarkdownPreview text={note.content} className="sm:px-20 sm:py-4" />
    </div>
  );
}

function MetaPreview({ note }: { note: Note }) {
  return (
    <div className="px-0 sm:px-20 space-y-0">
      <div className="flex items-start gap-1 relative">
        <h1 className="px-0 flex-1 text-2xl md:text-4xl">
          {note.title || "Untitled"}
        </h1>
        <NoteMoreForm note={note} className="relative top-1 sm:top-1" />
      </div>
      {note.link ? (
        <a
          href={note.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-4 hover:underline line-clamp-2 break-all"
        >
          {note.link}
        </a>
      ) : null}
    </div>
  );
}
