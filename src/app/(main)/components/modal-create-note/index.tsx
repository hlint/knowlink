"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormCreateNote from "./form";
import { useModalCreateNoteStore } from "./store";

export default function ModalCreateNote() {
  const { actions, open, subcategoryId, subcategoryName } =
    useModalCreateNoteStore();
  return (
    <Dialog open={open} onOpenChange={actions.close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          {subcategoryName ? (
            <DialogDescription>
              Create a new note in{" "}
              <span className="font-semibold">{subcategoryName}</span>
            </DialogDescription>
          ) : (
            <DialogDescription>
              Create a new note with{" "}
              <span className="font-semibold">AI auto-classification</span>.
            </DialogDescription>
          )}
        </DialogHeader>
        <FormCreateNote subcategoryId={subcategoryId} onClose={actions.close} />
      </DialogContent>
    </Dialog>
  );
}
