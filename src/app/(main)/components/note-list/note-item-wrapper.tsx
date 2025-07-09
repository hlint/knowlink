"use client";

import type { NoteLite } from "@/app/(main)/schema/note";
import { useRef } from "react";
import { useInViewport } from "react-in-viewport";
import NoteItem from "./note-item";

export default function NoteItemWrapper({ note }: { note: NoteLite }) {
  const refWrapper = useRef<HTMLDivElement>(null);
  const { inViewport } = useInViewport(refWrapper);
  return (
    <div ref={refWrapper}>
      {inViewport ? (
        <NoteItem note={note} />
      ) : (
        <div className="p-2">
          <div className="size-11" />
        </div>
      )}
    </div>
  );
}
