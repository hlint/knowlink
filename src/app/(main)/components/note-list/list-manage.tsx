"use client";

import { useNoteListStore } from "@/app/(main)/components/note-list/note-list-store";
import SelectSubcategory from "@/app/(main)/components/select-subcategory";
import revalidatePathClient from "@/app/actions";
import { useConfirm } from "@/components/advance/alert-provider";
import { useProgressAction } from "@/components/advance/progress-bar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useId } from "react";
import { toast } from "sonner";

export default function ListManage({
  isRecycleBin = false,
}: {
  isRecycleBin?: boolean;
}) {
  const id1 = useId();
  const id2 = useId();
  const {
    toggleEditMode,
    toggleSelectAllNotes,
    deleteSelectedNotes,
    moveSelectedNotes,
  } = useNoteListStore((s) => s.actions);
  const { selectedNoteIds, editMode, notes, subcategory } = useNoteListStore();
  const confirm = useConfirm();
  const progress = useProgressAction();
  const isSelectedSome = selectedNoteIds.length > 0;
  const switchEditMode = (
    <div className="flex flex-row gap-2 items-center">
      <Switch id={id1} checked={editMode} onCheckedChange={toggleEditMode} />
      <Label htmlFor={id1}>Batch Management</Label>
    </div>
  );
  const buttonReloadList = (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        progress(async () => {
          await revalidatePathClient("/");
        });
      }}
    >
      Reload List
    </Button>
  );
  const selectAll = (
    <div className="flex flex-row gap-2 items-center">
      <Checkbox
        id={id2}
        checked={selectedNoteIds.length === notes.length}
        onCheckedChange={toggleSelectAllNotes}
      />
      <Label htmlFor={id2}>Select All</Label>
    </div>
  );
  const selectSubcategory = (
    <div className="flex-1 max-w-[256px]">
      <SelectSubcategory
        placeholder={isRecycleBin ? "Restore to..." : "Move to..."}
        value={subcategory?.id}
        disabled={!selectedNoteIds || selectedNoteIds.length === 0}
        onChange={(value) => {
          moveSelectedNotes(value).catch((error) => {
            toast.error("Failed to move notes", {
              description:
                error instanceof Error ? error.message : "Unknown error",
            });
          });
        }}
      />
    </div>
  );
  const buttonDelete = (
    <Button
      variant="destructive"
      size="sm"
      disabled={!isSelectedSome}
      className=""
      onClick={async () => {
        const confirmed = await confirm({
          title: "Delete Notes",
          body: "Are you sure you want to delete the selected notes?",
        });
        if (confirmed) {
          deleteSelectedNotes(isRecycleBin).catch((error) => {
            toast.error("Failed to delete notes", {
              description:
                error instanceof Error ? error.message : "Unknown error",
            });
          });
        }
      }}
    >
      Delete
    </Button>
  );
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 sm:items-center bg-background py-0">
      <div className="flex flex-row gap-4 sm:gap-4 items-center justify-between min-h-[32px]">
        {switchEditMode}
        {editMode && <>{selectAll}</>}
        {!editMode && buttonReloadList}
      </div>
      {editMode && (
        <div className="flex flex-row gap-4 sm:gap-4 items-center justify-between sm:justify-start flex-1">
          {selectSubcategory}
          {buttonDelete}
        </div>
      )}
    </div>
  );
}
