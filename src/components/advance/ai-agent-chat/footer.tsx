import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat-input";
import { ExpandableChatFooter } from "@/components/ui/expandable-chat";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CornerDownLeft, PlusSquareIcon, Square } from "lucide-react";
import ChatCtrl from "./ctrl";
import { useChatStore } from "./store";

export default function ChatFooter() {
  const input = useChatStore((s) => s.input);
  const loading = useChatStore((s) => s.loading);
  const setInput = useChatStore((s) => s.actions.setInput);
  const { submit, stop, reset } = useChatStore((s) => s.actions);

  return (
    <ExpandableChatFooter>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
      >
        <ChatInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxRows={3}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Type your message..."
          className="min-h-12 resize-none rounded-lg bg-background dark:bg-background border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center gap-4 p-3 pt-0">
          <ChatCtrl />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="ml-auto"
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={() => {
                  reset();
                }}
              >
                <PlusSquareIcon />
                New Chat
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Clear chat history and start a new conversation
            </TooltipContent>
          </Tooltip>
          {!loading ? (
            <Button type="submit" size="sm" className="gap-1.5">
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                stop();
              }}
            >
              <Square className="size-3.5" />
              Stop
            </Button>
          )}
        </div>
      </form>
    </ExpandableChatFooter>
  );
}
