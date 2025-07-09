"use client";
import NoteIcon from "@/app/(main)/components/note-icon";
import { useNoteListStore } from "@/app/(main)/components/note-list/note-list-store";
import type { NoteLite } from "@/app/(main)/schema/note";
import { useProgressNavigate } from "@/components/advance/progress-bar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRef } from "react";
import { actionIncrementViewedCount } from "../../actions/note";
import NoteMenuPanel from "../note-menu-panel";

export default function NoteItem({ note }: { note: NoteLite }) {
  const selectedNoteIds = useNoteListStore((s) => s.selectedNoteIds);
  const previewNote = useNoteListStore((s) => s.previewNote);
  const editMode = useNoteListStore((s) => s.editMode);
  const refPreviewTimer = useRef<NodeJS.Timeout | null>(null);
  const { toggleSelectNote, fetchPreviewNoteById } = useNoteListStore(
    (s) => s.actions,
  );
  const title = note.title || "Untitled";
  const navigate = useProgressNavigate();
  const isSelected = selectedNoteIds.includes(note.id);

  const trigger = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      tabIndex={0}
      // biome-ignore lint/a11y/useSemanticElements: <explanation>
      role="button"
      onClick={() => {
        if (editMode) {
          toggleSelectNote(note.id);
        } else {
          actionIncrementViewedCount(note.id);
          navigate(`/note/${note.id}`);
        }
      }}
      onMouseEnter={() => {
        if (refPreviewTimer.current) {
          clearTimeout(refPreviewTimer.current);
        }
        refPreviewTimer.current = setTimeout(() => {
          fetchPreviewNoteById(note.id);
        }, 300);
      }}
      onMouseLeave={() => {
        if (refPreviewTimer.current) {
          clearTimeout(refPreviewTimer.current);
        }
      }}
      className={cn(
        "flex flex-row text-left h-hit items-stretch justify-start p-2 rounded-md gap-3 hover:bg-foreground/5 transition-all duration-300 relative cursor-pointer select-none",
        !editMode && previewNote?.id === note.id && "bg-foreground/5",
        isSelected && "bg-foreground/5",
      )}
    >
      {editMode && (
        <Checkbox
          checked={isSelected}
          className="size-4 bg-background absolute top-0 left-0 z-10"
        />
      )}
      <NoteIcon note={note} />
      <div className="flex flex-col justify-between shrink-0 flex-1 overflow-hidden">
        <div className="flex flex-row gap-2 items-start">
          <h2
            className={cn(
              "font-bold p-0 text-sm flex-1",
              note.link && "line-clamp-1",
              !note.link && "line-clamp-2",
            )}
          >
            {title}
          </h2>
        </div>
        {note.link && (
          <Button
            variant="link"
            asChild
            onContextMenu={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (editMode) {
                e.preventDefault();
              } else {
                actionIncrementViewedCount(note.id);
              }
            }}
            className={cn(
              "truncate p-0 block h-fit w-fit max-w-full text-muted-foreground",
              editMode && "pointer-events-none",
            )}
          >
            <a href={note.link} target="_blank" rel="noreferrer">
              <span>{note.link.replace(/^https?:\/\//, "")}</span>
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{trigger}</ContextMenuTrigger>
      <ContextMenuContent>
        <NoteMenuPanel note={note} />
      </ContextMenuContent>
    </ContextMenu>
  );
}
