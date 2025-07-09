"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Trash2 } from "lucide-react";
import { debounce } from "radashi";
import { useId, useState } from "react";
import { actionCloneNote, actionPullNoteWithUrl } from "../actions/create-note";
import { actionDeleteNote, actionUpdateNote } from "../actions/note";
import type { NoteLite } from "../schema/note";
import SelectSubcategory from "./select-subcategory";

export default function NoteMenuPanel({
  note,
  onDelete,
}: {
  note: NoteLite;
  onDelete?: () => void;
}) {
  const idInputLink = useId();
  const idInputSubcategory = useId();
  const idInputPrivate = useId();
  const [pulling, setPulling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [cloning, setCloning] = useState(false);
  return (
    <div className="space-y-4 p-4 w-60">
      <div className="grid max-w-sm items-center gap-1.5">
        <Label htmlFor={idInputSubcategory}>
          {note.deleted ? "Restore to" : "Subcategory"}
        </Label>
        <SelectSubcategory
          id={idInputSubcategory}
          noteId={note.id}
          defaultValue={note.subcategoryId || undefined}
          onChange={(subcategoryId) => {
            actionUpdateNoteDebounced({
              id: note.id,
              subcategoryId,
              deleted: false,
            });
          }}
        />
      </div>
      <div className="grid max-w-sm items-center gap-1.5">
        <Label htmlFor={idInputLink}>Link</Label>
        <Input
          id={idInputLink}
          defaultValue={note.link}
          placeholder="https://"
          className="w-full"
          onChange={(e) => {
            const link = (e.target as HTMLInputElement).value;
            actionUpdateNoteDebounced({ id: note.id, link });
          }}
        />
      </div>
      <div className="flex max-w-sm items-center gap-1.5">
        <Switch
          id={idInputPrivate}
          defaultChecked={note.confidential}
          onCheckedChange={(checked) => {
            actionUpdateNoteDebounced({
              id: note.id,
              confidential: checked,
            });
          }}
        />
        <Label htmlFor={idInputPrivate}>Private (No AI access)</Label>
      </div>{" "}
      <div className="flex flex-row gap-2">
        {note.link && (
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                disabled={pulling}
                onClick={() => {
                  setPulling(true);
                  actionPullNoteWithUrl(note.id).finally(() => {
                    setPulling(false);
                  });
                }}
              >
                {pulling && <Loader2 className="animate-spin" />} Pull
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Pull the note from the link. It will overwrite the current note.
            </TooltipContent>
          </Tooltip>
        )}
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={cloning}
              onClick={() => {
                setCloning(true);
                actionCloneNote(note.id).finally(() => {
                  setCloning(false);
                });
              }}
            >
              {cloning && <Loader2 className="animate-spin" />} Clone
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Create a new note with the same content.
          </TooltipContent>
        </Tooltip>

        <Button
          size="sm"
          className="ml-auto"
          variant={deleting ? "destructive" : "ghost"}
          disabled={deleting}
          onClick={() => {
            setDeleting(true);
            actionDeleteNote(note.id, note.deleted).finally(() => {
              setDeleting(false);
              onDelete?.();
            });
          }}
        >
          {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
        </Button>
      </div>
    </div>
  );
}

const actionUpdateNoteDebounced = debounce(
  {
    delay: 500,
    leading: true,
  },
  actionUpdateNote,
);
