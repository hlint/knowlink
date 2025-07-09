"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { toast } from "sonner";
import { actionCreateCategory } from "../../../actions/category";

export function ButtonCreateCategory() {
  const { setCreateCategory } = useQueryCreateCategory();
  return (
    <Button
      variant="ghost"
      size="iconSm"
      className="ml-auto hover-show"
      onClick={() => setCreateCategory(true)}
    >
      <Plus />
    </Button>
  );
}

export function FormNewCategory() {
  const { createCategory, setCreateCategory } = useQueryCreateCategory();
  if (!createCategory) return null;
  return (
    <form
      className="space-y-2"
      onBlur={(e) => {
        const form = e.currentTarget;
        form?.requestSubmit();
      }}
      action={(formData) => {
        actionCreateCategory(formData)
          .then(() => {
            setCreateCategory(false);
          })
          .catch((error) => {
            toast.error(
              error instanceof Error ? error.message : "Unknown error",
            );
          });
      }}
    >
      <Input placeholder="New Category" autoFocus name="name" />
    </form>
  );
}

function useQueryCreateCategory() {
  const [createCategory, setCreateCategory] = useQueryState(
    "create_category",
    parseAsBoolean.withDefault(false),
  );
  return { createCategory, setCreateCategory };
}
