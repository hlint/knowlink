import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import DialogBody, { DialogBodyLoading } from "./dialog-body";
import { useNoteVersionStore } from "./store";

export default function VersionModal() {
  const modalOpen = useNoteVersionStore((s) => s.modalOpen);
  const versionListLoading = useNoteVersionStore((s) => s.versionListLoading);
  const { reload, setValues } = useNoteVersionStore((s) => s.actions);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    reload();
  }, [reload, modalOpen]);
  return (
    <Dialog
      open={modalOpen}
      onOpenChange={(open) => setValues({ modalOpen: open })}
    >
      <DialogContent className="md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Note History</DialogTitle>
        </DialogHeader>
        {versionListLoading ? <DialogBodyLoading /> : <DialogBody />}
      </DialogContent>
    </Dialog>
  );
}
