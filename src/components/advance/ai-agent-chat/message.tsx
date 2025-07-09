import { Button } from "@/components/ui/button";
import { ChatBubbleAvatar } from "@/components/ui/chat-bubble";
import { ChatBubble, ChatBubbleMessage } from "@/components/ui/chat-bubble";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MarkdownPreview from "@/integrations/markdown/markdown-preview";
import type { Message } from "@/lib/ai-agent/types/message";
import { cn } from "@/lib/utils";
import {
  CopyIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useChatStore } from "./store";

export default function ChatMessage({ message }: { message: Message }) {
  const debugMode = useChatStore((s) => s.debugMode);
  const isUser = message.role === "user";
  return (
    <ChatBubble
      key={message.id}
      variant={message.role === "user" ? "sent" : "received"}
    >
      <ChatBubbleAvatar
        className="h-8 w-8 shrink-0"
        src={isUser ? "/avatar-human.jpg" : "/avatar-bot.jpg"}
        fallback={isUser ? "US" : "AI"}
      />
      <ChatBubbleMessage variant={isUser ? "sent" : "received"}>
        <MarkdownPreview
          text={[message.content].filter((t) => t.trim()).join("\n\n") || "..."}
          className={cn("min-w-20")}
        />
      </ChatBubbleMessage>
      {message.role === "user" && (
        <UserMessageMoreButton
          id={message.id}
          content={message.content}
          data={debugMode && message.data}
        />
      )}
      {message.role === "assistant" && (
        <OutputMessageMoreButton
          content={message.content}
          data={debugMode && message.data}
        />
      )}
    </ChatBubble>
  );
}

function UserMessageMoreButton({
  id,
  content,
  data,
}: { id: string; content: string; data?: unknown }) {
  const loading = useChatStore((s) => s.loading);
  const { editUserMessage, deleteUserMessage } = useChatStore((s) => s.actions);
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="iconSm" variant="ghost" className="hover-show">
          <MoreHorizontalIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col w-48 gap-2 [&>button]:justify-start">
        <ButtonCopy content={content} onCopy={() => setOpen(false)} />
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => {
            editUserMessage(id);
            setOpen(false);
          }}
        >
          <PencilIcon />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => {
            deleteUserMessage(id);
            setOpen(false);
          }}
        >
          <TrashIcon />
          Delete
        </Button>
        {data ? (
          <MarkdownPreview
            text={`\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``}
            className={cn("min-w-20")}
          />
        ) : null}
      </PopoverContent>
    </Popover>
  );
}

function OutputMessageMoreButton({
  content,
  data,
}: { content: string; data?: unknown }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="iconSm" variant="ghost" className="hover-show">
          <MoreHorizontalIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2 w-48 [&>button]:justify-start">
        <ButtonCopy content={content} onCopy={() => setOpen(false)} />
        {data ? (
          <MarkdownPreview
            text={`\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``}
            className={cn("min-w-20")}
          />
        ) : null}
      </PopoverContent>
    </Popover>
  );
}

function ButtonCopy({
  content,
  onCopy,
}: { content: string; onCopy: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        navigator.clipboard.writeText(content);
        toast.success("Copied to clipboard");
        onCopy();
      }}
    >
      <CopyIcon />
      Copy
    </Button>
  );
}
