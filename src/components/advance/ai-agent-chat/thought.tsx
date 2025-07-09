import { ChatBubbleAvatar } from "@/components/ui/chat-bubble";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { ChatBubbleMessage } from "@/components/ui/chat-bubble";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MarkdownPreview from "@/integrations/markdown/markdown-preview";
import type { Message } from "@/lib/ai-agent/types/message";
import { cn } from "@/lib/utils";
import { AlertCircleIcon, CheckIcon, EyeIcon, Loader2Icon } from "lucide-react";
import { useChatStore } from "./store";

export default function Thought({ messages }: { messages: Message[] }) {
  const showThinking = useChatStore((s) => s.showThinking);
  const debugMode = useChatStore((s) => s.debugMode);
  if (!showThinking) {
    return null;
  }
  return (
    <ChatBubble variant={"received"}>
      <ChatBubbleAvatar
        className="h-8 w-8 shrink-0"
        src={"/avatar-bot.jpg"}
        fallback={"AI"}
      />
      <ChatBubbleMessage variant={"received"}>
        <div className="flex flex-col gap-2">
          {messages.map((m) => (
            <div key={m.id} className="flex items-center gap-2">
              <Status status={m.status} />
              <Content message={m} />
              {debugMode && <Details message={m} />}
            </div>
          ))}
        </div>
      </ChatBubbleMessage>
    </ChatBubble>
  );
}

function Status({ status }: { status: Message["status"] }) {
  if (status === "pending") {
    return <Loader2Icon className="size-4 animate-spin" />;
  }
  if (status === "success") {
    return <CheckIcon className="size-4" />;
  }
  return <AlertCircleIcon className="size-4" />;
}

function Content({ message }: { message: Message }) {
  let content = message.content;
  if (message.role === "thinking") {
    content = `Thinking (Round ${message.round})`;
  }
  return <span className="text-sm truncate flex-1">{content}</span>;
}

function Details({ message }: { message: Message }) {
  const preview = (
    <MarkdownPreview
      text={[
        message.content,
        message.data
          ? `\`\`\`json\n${JSON.stringify(message.data, null, 2)}\n\`\`\``
          : "",
      ]
        .filter((t) => t.trim())
        .join("\n\n")}
      className={cn(
        "min-w-20 max-w-[300px] max-h-[400px] overflow-auto hover-show-scroller",
      )}
    />
  );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <EyeIcon className="size-4 text-muted-foreground hover:text-primary cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent>{preview}</PopoverContent>
    </Popover>
  );
}
