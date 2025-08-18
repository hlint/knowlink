"use client";

import type { NoteLite } from "@/app/(main)/schema/note";
import { useInView } from "react-intersection-observer";
import NoteItem from "./note-item";

export default function NoteItemWrapper({ note }: { note: NoteLite }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref}>
      {inView ? (
        <NoteItem note={note} />
      ) : (
        <div className="p-2">
          <div className="size-11" />
        </div>
      )}
    </div>
  );
}
