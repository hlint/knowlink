"use client";

import { ExpandableChat } from "@/components/ui/expandable-chat";
import { Bot } from "lucide-react";
import { useLayoutEffect } from "react";
import ChatBody from "./body";
import ChatFooter from "./footer";
import ChatHeader from "./header";
import { type AfterSubmit, StoreProvider, useChatStore } from "./store";

export default function AiAgentChat({
  expandable = false,
  ...configs
}: {
  expandable?: boolean;
  type?: string;
  afterSubmit?: AfterSubmit;
}) {
  const chatBox = (
    <>
      <ConfigsSetter {...configs} />
      <ChatHeader />
      <ChatBody />
      <ChatFooter />
    </>
  );
  return (
    <StoreProvider>
      {expandable ? (
        <ExpandableChat
          size="lg"
          position="bottom-right"
          icon={<Bot className="size-6" />}
        >
          {chatBox}
        </ExpandableChat>
      ) : (
        <div className="flex flex-col overflow-hidden w-full h-full">
          {chatBox}
        </div>
      )}
    </StoreProvider>
  );
}

function ConfigsSetter({
  type,
  afterSubmit,
}: {
  type?: string;
  afterSubmit?: AfterSubmit;
}) {
  const { set } = useChatStore((s) => s.actions);
  useLayoutEffect(() => {
    set((d) => {
      if (type) d.type = type;
      if (afterSubmit) d.afterSubmit = afterSubmit;
    });
  }, [type, afterSubmit, set]);
  return null;
}
