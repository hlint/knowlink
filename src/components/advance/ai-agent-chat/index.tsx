"use client";

import { ExpandableChat } from "@/components/ui/expandable-chat";
import { Bot } from "lucide-react";
import ChatBody from "./body";
import ChatFooter from "./footer";
import ChatHeader from "./header";
import { type AfterSubmit, StoreProvider } from "./store";

export default function AiAgentChat({
  expandable = false,
  ...initialValues
}: {
  expandable?: boolean;
  type?: string;
  afterSubmit?: AfterSubmit;
}) {
  const chatBox = (
    <>
      <ChatHeader />
      <ChatBody />
      <ChatFooter />
    </>
  );
  return (
    <StoreProvider {...initialValues}>
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
