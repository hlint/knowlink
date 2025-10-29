"use client";

import { useTryLoadImage } from "@/hooks/use-try-load-image";
import { cn } from "@/lib/utils";
import { LockKeyholeIcon } from "lucide-react";

const DEFAULT_CLASSNAME =
  "size-11 rounded-md shrink-0 relative overflow-hidden";

interface NoteProps {
  title?: string;
  icon?: string;
  confidential?: boolean;
}

export default function NoteIcon({
  note,
  className,
  hideLocked,
}: {
  note: NoteProps;
  className?: string;
  hideLocked?: boolean;
}) {
  const { imgLoaded, tried } = useTryLoadImage(note.icon || "");
  return (
    <div className={cn(DEFAULT_CLASSNAME, "bg-gray-100", className)}>
      {tried ? (
        imgLoaded ? (
          <Image note={note} />
        ) : (
          <Fallback note={note} />
        )
      ) : null}
      {note.confidential && !hideLocked && <MarkLocked />}
    </div>
  );
}

function Fallback({ note }: { note: NoteProps }) {
  return (
    <div
      data-note-icon={note.icon}
      className={cn(
        DEFAULT_CLASSNAME,
        "bg-foreground/90 flex items-center justify-center text-xl text-background w-full h-full",
      )}
    >
      {note.title?.[0]?.toUpperCase() || "#"}
    </div>
  );
}

function Image({ note }: { note: NoteProps }) {
  if (!note.icon) {
    return null;
  }
  return (
    <img
      src={note.icon}
      alt={note.title || "icon"}
      className={cn("object-cover w-full h-full")}
    />
  );
}

function MarkLocked() {
  return (
    <LockKeyholeIcon className="absolute bottom-0 right-0 size-5 invert bg-background p-0.5 rounded-sm" />
  );
}
