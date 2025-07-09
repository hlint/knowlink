import { ExpandableChatHeader } from "@/components/ui/expandable-chat";
import { cn } from "@/lib/utils";
import { useChatStore } from "./store";

export default function ChatHeader() {
  const loading = useChatStore((s) => s.loading);
  const state = useChatStore((s) => s.context.state);
  const stateLabel = (() => {
    switch (state) {
      case "thinking":
        return "AI is thinking...";
      case "outputting":
        return "AI is writing...";
      case "executing":
        return "AI is executing...";
      case "error":
        return "Error occurred in the last task";
      default:
        return "Ready to respond";
    }
  })();
  return (
    <ExpandableChatHeader className="flex-row items-center">
      <div className="px-2 flex-1 flex items-center gap-4 overflow-hidden">
        <h1 className="text-xl font-semibold">Chat with AI ✨</h1>
        <p
          className={cn(
            "text-sm text-muted-foreground truncate",
            loading && "animate-pulse",
          )}
        >
          {stateLabel}
        </p>
      </div>
    </ExpandableChatHeader>
  );
}
