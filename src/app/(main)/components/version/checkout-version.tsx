import DiffViewer from "@/components/advance/diff-viewer";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RotateCcw, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { actionCheckoutVersion } from "./actions";
import { useNoteVersionStore } from "./store";

export default function CheckoutVersion() {
  const { deleteVersion, setValues } = useNoteVersionStore((s) => s.actions);
  const currentVersionContent = useNoteVersionStore(
    (s) => s.currentVersionContent,
  );
  const currentNoteContent = useNoteVersionStore((s) => s.currentNoteContent);
  const versionList = useNoteVersionStore((s) => s.versionList);
  const currentVersionId = useNoteVersionStore((s) => s.currentVersionId);
  const currentVersion = versionList.find((v) => v.id === currentVersionId);
  if (!currentVersion)
    return (
      <div className="flex flex-col gap-4 h-full">
        <p>No version selected.</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-row items-center gap-4">
        <p className="text-sm text-muted-foreground mr-auto">
          {currentVersion?.createdAt.toLocaleString()}
        </p>
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              onClick={() => {
                setValues({
                  modalOpen: false,
                });
                actionCheckoutVersion(currentVersionId).catch(() => {
                  toast.error("Failed to checkout version");
                });
              }}
            >
              <RotateCcw /> Checkout
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Overwrite the current content with the selected version(from left
              side to right side).
            </p>
          </TooltipContent>
        </Tooltip>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            deleteVersion(currentVersionId);
          }}
        >
          <Trash2Icon /> Delete
        </Button>
      </div>
      <DiffViewer
        className="grow overflow-auto text-xs"
        oldValue={currentNoteContent}
        newValue={currentVersionContent}
        leftTitle="Current"
        rightTitle={`${currentVersion?.message || "No message"}`}
      />
    </div>
  );
}
