"use client";
import { Textarea } from "@/components/ui/textarea";
import { debounce } from "radashi";
import { useState } from "react";
import { actionSetAiInstructionsContent } from "./actions";
import { useSettingsContext } from "./context";
import { defaultInstructions } from "./default_instructions";

const handleSave = debounce({ delay: 200 }, async (content: string) => {
  await actionSetAiInstructionsContent(content);
});

export default function TabAiInstruction() {
  const { aiInstructions } = useSettingsContext();
  const [instructions, setInstructions] = useState(aiInstructions);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 max-w-screen-lg">
      <div className="prose prose-sm max-w-none">
        <p>
          This is the additional AI instructions for the AI agent. You can edit
          the instructions here.
        </p>
        <p>
          Don't know how to start? Click{" "}
          <button
            type="button"
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => {
              setInstructions(defaultInstructions);
              handleSave(defaultInstructions);
            }}
          >
            here
          </button>{" "}
          to load the built-in instructions.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Textarea
          value={instructions}
          onChange={(e) => {
            setInstructions(e.target.value);
            handleSave(e.target.value);
          }}
          minRows={6}
          maxRows={20}
          className="resize-none"
          placeholder="Enter your AI instructions here..."
        />
      </div>
    </div>
  );
}
