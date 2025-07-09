"use client";

import AiAgentChat from "@/components/advance/ai-agent-chat";
import { useAfterSubmit } from "./use-after-submit";

export default function Chatbox() {
  const afterSubmit = useAfterSubmit();
  return <AiAgentChat expandable type="app" afterSubmit={afterSubmit} />;
}
