"use client";
import { useMainLayoutStore } from "@/app/(main)/(pages)/(layout)/store";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { Category, Subcategory } from "@prisma/client";
import { ChevronRight, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { actionUpdateSubcategory } from "../../../../actions/category";
import { FormNewSubcategory } from "../create-subcategory";
import SubcategoryItem from "../subcategory-item";
import CategoryMenu from "./category-menu";
import FormRename from "./form-rename";

export default function CategoryItem({
  category,
  subcategories,
}: { category: Category; subcategories: Subcategory[] }) {
  const [openCategory, setOpenCategory] = useQueryState("open_category");
  const activeCategoryId = useMainLayoutStore((s) => s.activeCategoryId);
  const [isDropping, setIsDropping] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const formRename = (
    <FormRename category={category} onClose={() => setIsEditing(false)} />
  );
  const label = (
    <div
      // biome-ignore lint/a11y/useSemanticElements: <explanation>
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "F2") {
          e.preventDefault();
          setIsEditing(true);
        }
      }}
    >
      <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <span className="truncate grow">{category.name}</span>
        </ContextMenuTrigger>
        <CategoryMenu
          category={category}
          onRename={() => {
            setIsEditing(true);
            setOpenCategory(category.id);
          }}
        />
      </ContextMenu>
      <Button
        variant="ghost"
        size="iconSm"
        className="hover-show ml-auto"
        onClick={(e) => {
          e.stopPropagation();
          setOpenCategory(category.id);
          setIsCreating(true);
        }}
      >
        <PlusIcon />
      </Button>
    </div>
  );
  return (
    <Collapsible
      asChild
      open={openCategory === category.id}
      onOpenChange={(open) => {
        if (open) {
          setOpenCategory(category.id);
        } else {
          setOpenCategory(null);
        }
      }}
      className={cn("group/collapsible", isDropping && "bg-foreground/5")}
      onDragOver={(e) => {
        e.preventDefault();
        const isDropAction = e.dataTransfer.types.includes("move-subcategory");
        setIsDropping(isDropAction);
        e.dataTransfer.dropEffect = isDropAction ? "move" : "none";
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDropping(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDropping(false);
        const subcategoryId = e.dataTransfer.getData("move-subcategory");
        if (
          !subcategoryId ||
          subcategories.some((subcategory) => subcategory.id === subcategoryId)
        ) {
          return;
        }
        const formData = new FormData();
        formData.append("id", subcategoryId);
        formData.append("categoryId", category.id);
        actionUpdateSubcategory(formData);
      }}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            asChild
            isActive={activeCategoryId === category.id}
          >
            {isEditing ? formRename : label}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {isCreating && (
          <FormNewSubcategory
            categoryId={category.id}
            onSubmit={() => setIsCreating(false)}
          />
        )}
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 pr-0 mt-1">
            {subcategories.map((subcategory) => (
              <SubcategoryItem key={subcategory.id} subcategory={subcategory} />
            ))}
            {subcategories.length === 0 && (
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      No subcategories
                    </span>
                  </div>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
