"use client";

import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ExpandableChatBody } from "@/components/ui/expandable-chat";
import type { Message } from "@/lib/ai-agent/types/message";
import { useMemo } from "react";
import ChatMessage from "./message";
import { useChatStore } from "./store";
import ChatSuggestions from "./suggestions";
import Thought from "./thought";

export default function ChatBody() {
  const dialog = useChatStore((s) => s.context.dialog);
  const groupedDialog = useMemo(() => {
    const results: (Message | Message[])[] = [];
    for (const m of dialog) {
      const isThought = !["assistant", "user"].includes(m.role);
      if (isThought) {
        const lastUnit = results.at(-1);
        if (Array.isArray(lastUnit)) {
          lastUnit.push(m);
        } else {
          results.push([m]);
        }
      } else {
        results.push(m);
      }
    }
    return results;
  }, [dialog]);
  return (
    <ExpandableChatBody>
      <ChatMessageList>
        {groupedDialog.map((messageOrThought) =>
          Array.isArray(messageOrThought) ? (
            <Thought key={messageOrThought[0].id} messages={messageOrThought} />
          ) : (
            <ChatMessage key={messageOrThought.id} message={messageOrThought} />
          ),
        )}
        <ChatSuggestions />
      </ChatMessageList>
    </ExpandableChatBody>
  );
}
