"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Subcategory } from "@prisma/client";
import { useRef } from "react";
import { toast } from "sonner";
import { actionUpdateSubcategory } from "../../../../actions/category";
import { useCategories } from "../context-categories";

export default function FormMove({
  subcategory,
  onSubmit,
}: { subcategory: Subcategory; onSubmit: () => void }) {
  const { categories } = useCategories();
  const refForm = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={refForm}
      className="h-fit space-y-2 block pl-1.5"
      action={(formData) => {
        actionUpdateSubcategory(formData)
          .then(() => {
            onSubmit();
          })
          .catch((error) => {
            toast.error(
              error instanceof Error ? error.message : "Unknown error",
            );
          });
      }}
    >
      <Select
        name="categoryId"
        defaultValue={subcategory.categoryId}
        open
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(() => {
              refForm.current?.requestSubmit();
            }, 0);
          }
        }}
      >
        <SelectTrigger size="sm" className="w-full">
          <SelectValue placeholder="Select a category" />
          <div className="text-xs absolute top-[-0.5rem] left-2.5 bg-sidebar text-muted-foreground">
            {subcategory.name}
          </div>
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input type="hidden" name="id" value={subcategory.id} />
    </form>
  );
}
