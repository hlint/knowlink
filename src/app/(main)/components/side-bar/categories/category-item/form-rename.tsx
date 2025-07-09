"use client";
import { Input } from "@/components/ui/input";
import type { Category } from "@prisma/client";
import { toast } from "sonner";
import { actionUpdateCategory } from "../../../../actions/category";

export default function FormRename({
  category,
  onClose,
}: { category: Category; onClose: () => void }) {
  return (
    <form
      action={(formData) => {
        actionUpdateCategory(formData)
          .then(() => {
            onClose();
          })
          .catch((error) => {
            toast.error(
              error instanceof Error ? error.message : "Unknown error",
            );
          });
      }}
    >
      <Input
        type="text"
        name="name"
        defaultValue={category.name}
        required
        autoFocus
        className="w-full h-8 focus-visible:ring-0"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            onClose();
          }
        }}
        onBlur={(e) => {
          const form = e.currentTarget.form;
          form?.requestSubmit();
        }}
      />
      <input type="hidden" name="id" value={category.id} />
    </form>
  );
}
