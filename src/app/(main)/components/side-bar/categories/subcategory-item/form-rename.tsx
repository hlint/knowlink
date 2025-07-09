"use client";
import { Input } from "@/components/ui/input";
import type { Subcategory } from "@prisma/client";
import { toast } from "sonner";
import { actionUpdateSubcategory } from "../../../../actions/category";

export default function FormRename({
  subcategory,
  onSubmit,
}: { subcategory: Subcategory; onSubmit: () => void }) {
  return (
    <form
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
      onBlur={(e) => {
        const form = e.currentTarget;
        form?.requestSubmit();
      }}
    >
      <Input
        type="text"
        name="name"
        defaultValue={subcategory.name}
        required
        autoFocus
        className="w-full h-full focus-visible:ring-0"
      />
      <input type="hidden" name="id" value={subcategory.id} />
    </form>
  );
}
