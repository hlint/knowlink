"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { actionCreateSubcategory } from "../../../actions/category";

export function ButtonCreateSubcategory({
  onClick,
}: { categoryId: string; onClick: () => void }) {
  return (
    <DropdownMenuItem onClick={onClick}>
      <Plus /> Subcategory
    </DropdownMenuItem>
  );
}

export function FormNewSubcategory({
  categoryId,
  onSubmit,
}: { categoryId: string; onSubmit: () => void }) {
  const refInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTimeout(() => {
      refInput.current?.focus();
    }, 200);
  }, []);
  return (
    <form
      className="space-y-2 px-4 my-2"
      onBlur={(e) => {
        const form = e.currentTarget;
        form?.requestSubmit();
      }}
      action={(formData) => {
        actionCreateSubcategory(formData)
          .then(onSubmit)
          .catch((error) => {
            toast.error(
              error instanceof Error ? error.message : "Unknown error",
            );
          });
      }}
    >
      <Input
        placeholder="New Subcategory"
        autoFocus
        name="name"
        ref={refInput}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      <input type="hidden" name="categoryId" value={categoryId} />
    </form>
  );
}
