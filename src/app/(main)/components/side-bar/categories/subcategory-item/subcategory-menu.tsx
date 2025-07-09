"use client";
import { useConfirm } from "@/components/advance/alert-provider";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import type { Subcategory } from "@prisma/client";
import { MoveVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { actionDeleteSubcategory } from "../../../../actions/category";
import { useModalCreateNoteStore } from "../../../modal-create-note/store";

export default function SubcategoryMenu({
  subcategory,
  onRename,
  onMove,
}: { subcategory: Subcategory; onRename: () => void; onMove: () => void }) {
  const confirm = useConfirm();
  const { openModalCreateNote } = useModalCreateNoteStore(
    (state) => state.actions,
  );
  return (
    <ContextMenuContent>
      <ContextMenuItem
        onClick={() => {
          openModalCreateNote(subcategory.id, subcategory.name);
        }}
      >
        <Plus className="text-muted-foreground" />
        <span>New Note</span>
      </ContextMenuItem>
      <ContextMenuItem onClick={onRename}>
        <Pencil className="text-muted-foreground" />
        <span>Rename</span>
      </ContextMenuItem>
      <ContextMenuItem onClick={onMove}>
        <MoveVertical className="text-muted-foreground" />
        <span>Move to...</span>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        onClick={async () => {
          const confirmed = await confirm({
            title: "Delete subcategory",
            body: "Are you sure you want to delete this subcategory?",
          });
          if (!confirmed) return;
          actionDeleteSubcategory(subcategory.id);
        }}
      >
        <Trash2 className="text-muted-foreground" />
        <span>Delete</span>
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
