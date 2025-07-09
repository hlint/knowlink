import { Button } from "@/components/ui/button";
import {
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { useChatStore } from "./store";

export default function ChatSuggestions() {
  const { setInput, submit } = useChatStore((s) => s.actions);
  const loading = useChatStore((s) => s.loading);
  const suggested_inputs = useChatStore((s) => {
    const m = s.context.dialog.at(-1);
    if (m?.role === "assistant" && m.status === "success") {
      return m.data?.suggested_inputs;
    }
    return null;
  });
  if (!suggested_inputs || suggested_inputs.length === 0) return null;
  const suggestions = (
    <div className="flex flex-col gap-2 items-end">
      {(suggested_inputs as string[]).map((input) => (
        <Button
          variant="outline"
          size="sm"
          className="whitespace-normal h-fit p-2"
          key={input}
          disabled={loading}
          onClick={() => {
            setInput(input);
            submit();
          }}
        >
          {input}
        </Button>
      ))}
    </div>
  );
  return (
    <ChatBubble variant="sent">
      <ChatBubbleAvatar
        className="h-8 w-8 shrink-0"
        src="/avatar-human.jpg"
        fallback="US"
      />
      <ChatBubbleMessage className="bg-transparent pt-0">
        {suggestions}
      </ChatBubbleMessage>
    </ChatBubble>
  );
}
