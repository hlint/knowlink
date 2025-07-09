"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ModalProcessing({
  noteId,
  shouldOpen,
}: {
  noteId: string;
  shouldOpen: boolean;
}) {
  const [open, setOpen] = useState(shouldOpen);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setOpen(shouldOpen);
  }, [shouldOpen, noteId]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Loader2 className="animate-spin size-5" />
            AI Processing
          </DialogTitle>
          <DialogDescription>
            AI is processing the note, please wait for a moment.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
