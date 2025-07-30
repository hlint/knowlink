"use client";
import EditorCodemirror from "@/integrations/markdown/editor-codemirror";
import { debounce } from "radashi";
import { useState } from "react";
import { actionSetAssistantPrompt, actionSetWritingPrompt } from "./actions";
import { useSettingsContext } from "./context";
import { defaultAssistantPrompt } from "./default-assistant-prompt";
import { defaultWritingPrompt } from "./default-writing-prompt";

const handleSaveAssistantPrompt = debounce(
  { delay: 200 },
  async (content: string) => {
    await actionSetAssistantPrompt(content);
  },
);

const handleSaveWritingPrompt = debounce(
  { delay: 200 },
  async (content: string) => {
    await actionSetWritingPrompt(content);
  },
);

export default function TabAiInstruction() {
  const { assistantPrompt, writingPrompt } = useSettingsContext();
  const [assistantPromptState, setAssistantPrompt] = useState(assistantPrompt);
  const [writingPromptState, setWritingPrompt] = useState(writingPrompt);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 max-w-screen-lg">
      <div className="prose prose-sm max-w-none">
        <h2>Assistant Prompt</h2>
        <p>
          Customize the AI agent's behavior by editing the prompt below. This
          prompt will be used to guide the AI's responses and actions.
        </p>
        <p>
          Need help getting started? Click{" "}
          <button
            type="button"
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => {
              setAssistantPrompt(defaultAssistantPrompt);
              handleSaveAssistantPrompt(defaultAssistantPrompt);
            }}
          >
            here
          </button>{" "}
          to load the default prompt template.
        </p>
        <div className="max-h-[500px] overflow-y-auto">
          <EditorCodemirror
            value={assistantPromptState}
            onChange={(content) => {
              setAssistantPrompt(content);
              handleSaveAssistantPrompt(content);
            }}
            enableAiEnhancer
          />
        </div>
        <hr />
        <h2>Writing Prompt</h2>
        <p>
          Configure the AI writing assistant's style and approach by editing the
          prompt below. This prompt will influence how the AI generates and
          improves your content.
        </p>
        <p>
          Need help getting started? Click{" "}
          <button
            type="button"
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => {
              setWritingPrompt(defaultWritingPrompt);
              handleSaveWritingPrompt(defaultWritingPrompt);
            }}
          >
            here
          </button>{" "}
          to load the default prompt template.
        </p>
        <div className="max-h-[500px] overflow-y-auto">
          <EditorCodemirror
            value={writingPromptState}
            onChange={(content) => {
              setWritingPrompt(content);
              handleSaveWritingPrompt(content);
            }}
            enableAiEnhancer
          />
        </div>
      </div>
    </div>
  );
}
