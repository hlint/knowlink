import DiffViewer from "@/components/advance/diff-viewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import fetchEventSource from "@/lib/fetch-event-source";
import { GitCommitIcon, Loader2Icon, SparklesIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useNoteVersionStore } from "./store";

export function CreateVersionButton() {
  const { setIsCreateMode } = useNoteVersionStore((s) => s.actions);
  return (
    <TimelineItem
      step={0}
      className="cursor-pointer"
      onClick={() => {
        setIsCreateMode(true);
      }}
    >
      <TimelineHeader>
        <TimelineSeparator />
        <TimelineTitle className="-mt-0.5">Current</TimelineTitle>
        <TimelineIndicator />
      </TimelineHeader>
      <TimelineContent>Create a new version</TimelineContent>
    </TimelineItem>
  );
}

export function CreateVersionBody() {
  const { createVersion } = useNoteVersionStore((s) => s.actions);
  const currentNoteContent = useNoteVersionStore((s) => s.currentNoteContent);
  const latestVersionContent = useNoteVersionStore(
    (s) => s.latestVersionContent,
  );
  const isSame = latestVersionContent === currentNoteContent;
  const handleSubmit = async (formData: FormData) => {
    const message = formData.get("message") as string;
    await createVersion(message);
  };
  return (
    <div className="flex flex-col gap-4 h-full">
      <form
        aria-disabled={isSame}
        onSubmit={(e) => {
          if (isSame) {
            e.preventDefault();
          }
        }}
        action={handleSubmit}
        className="flex flex-row items-center gap-4"
      >
        <MessageInput
          isSame={isSame}
          latestVersionContent={latestVersionContent}
          currentNoteContent={currentNoteContent}
        />
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Button type="submit" disabled={isSame}>
              <GitCommitIcon /> Commit
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Create a new version based on the current content(from left side
              to right side).
            </p>
          </TooltipContent>
        </Tooltip>
      </form>
      <DiffViewer
        className="grow overflow-auto text-xs"
        oldValue={latestVersionContent}
        newValue={currentNoteContent}
        leftTitle="Latest Version"
        rightTitle="Current"
      />
    </div>
  );
}

function MessageInput({
  isSame,
  latestVersionContent,
  currentNoteContent,
}: {
  isSame: boolean;
  latestVersionContent: string;
  currentNoteContent: string;
}) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleGenerateMessage = async () => {
    setIsLoading(true);
    await fetchEventSource("/api/ai/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Generate a commit message for the changes.
1. The message should be extremely short, no more than 12 words.
2. The message should be concise and clear.
3. The message should be in the format of "Add/Update/Delete/Fix/Refactor/...".

<PREVIOUS_VERSION>${latestVersionContent}</PREVIOUS_VERSION>

<CURRENT_VERSION>${currentNoteContent}</CURRENT_VERSION>`,
        stream: true,
      }),
      onmessage: (event) => {
        setMessage(z.object({ text: z.string() }).parse(event.data).text);
      },
    }).catch(() => {
      toast.error("Failed to connect to AI, please try again later.");
    });
    setIsLoading(false);
  };
  return (
    <div className="relative grow">
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <button
            className="cursor-pointer text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 start-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSame || isLoading}
            type="button"
            onClick={handleGenerateMessage}
          >
            {isLoading ? (
              <Loader2Icon size={16} className="animate-spin" />
            ) : (
              <SparklesIcon size={16} />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Generate commit message</p>
        </TooltipContent>
      </Tooltip>

      <Input
        autoFocus
        disabled={isSame}
        type="text"
        name="message"
        placeholder={isSame ? "No changes" : "Version Message"}
        className="ps-9 pe-9"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="cursor-pointer text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSame}
        type="button"
        onClick={() => setMessage("")}
      >
        <XIcon size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
