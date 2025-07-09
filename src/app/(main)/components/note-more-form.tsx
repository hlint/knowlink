"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { MoreVerticalIcon } from "lucide-react";
import type { NoteLite } from "../schema/note";
import NoteMenuPanel from "./note-menu-panel";

export default function NoteMoreForm({
  note,
  className,
  iconClassName,
  align = "end",
  onDelete,
}: {
  note: NoteLite;
  className?: string;
  iconClassName?: string;
  align?: "start" | "end";
  onDelete?: () => void;
}) {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="iconSm"
            variant="ghost"
            className={cn("", className)}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MoreVerticalIcon className={cn("size-4", iconClassName)} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align={align}
          side="bottom"
          className="p-0 w-fit"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <NoteMenuPanel note={note} onDelete={onDelete} />
        </PopoverContent>
      </Popover>
    </>
  );
}
