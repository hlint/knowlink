"use client";
import { useMainLayoutStore } from "@/app/(main)/(pages)/(layout)/store";
import { ProgressBarLink } from "@/components/advance/progress-bar";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useUrlBuilder from "@/hooks/use-url-builder";
import type { Subcategory } from "@prisma/client";
import { useState } from "react";
import FormMove from "./form-move";
import FormRename from "./form-rename";
import SubcategoryMenu from "./subcategory-menu";

export default function SubcategoryItem({
  subcategory,
}: { subcategory: Subcategory }) {
  const activeSubcategoryId = useMainLayoutStore((s) => s.activeSubcategoryId);
  const urlBuilder = useUrlBuilder();
  const [isRenaming, setIsRenaming] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const { setOpenMobile } = useSidebar();
  const label = (
    <ContextMenu>
      <ContextMenuTrigger>
        <SidebarMenuSubButton
          draggable
          asChild
          isActive={activeSubcategoryId === subcategory.id}
          onDragStart={(e) => {
            e.dataTransfer.setData("move-subcategory", subcategory.id);
          }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "F2") {
              e.preventDefault();
              setIsRenaming(true);
            }
          }}
          onClick={() => setOpenMobile(false)}
        >
          <ProgressBarLink
            href={urlBuilder(`/sub/${subcategory.id}`, {
              open_category: subcategory.categoryId,
            })}
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="button"
          >
            <span className="truncate">{subcategory.name}</span>
          </ProgressBarLink>
        </SidebarMenuSubButton>
      </ContextMenuTrigger>
      <SubcategoryMenu
        subcategory={subcategory}
        onRename={() => setIsRenaming(true)}
        onMove={() => setIsMoving(true)}
      />
    </ContextMenu>
  );
  return (
    <SidebarMenuSubItem>
      {isRenaming && (
        <FormRename
          subcategory={subcategory}
          onSubmit={() => setIsRenaming(false)}
        />
      )}
      {isMoving && (
        <FormMove
          subcategory={subcategory}
          onSubmit={() => setIsMoving(false)}
        />
      )}
      {!isRenaming && !isMoving && label}
    </SidebarMenuSubItem>
  );
}
