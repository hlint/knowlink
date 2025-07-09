"use client";
import { useConfirm } from "@/components/advance/alert-provider";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import type { Category } from "@prisma/client";
import { Pencil, Trash2 } from "lucide-react";
import { actionDeleteCategory } from "../../../../actions/category";

export default function CategoryMenu({
  category,
  onRename,
}: { category: Category; onRename: () => void }) {
  const confirm = useConfirm();
  return (
    <ContextMenuContent>
      <ContextMenuItem onClick={onRename}>
        <Pencil className="text-muted-foreground" />
        <span>Rename</span>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        onClick={async () => {
          const confirmed = await confirm({
            title: "Delete category",
            body: "Are you sure you want to delete this category?",
          });
          if (!confirmed) return;
          actionDeleteCategory(category.id);
        }}
      >
        <Trash2 className="text-muted-foreground" />
        <span>Delete</span>
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
