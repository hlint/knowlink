import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useRootLayout from "@/hooks/use-root-layout";
import { cn } from "@/lib/utils";
import { countTokens } from "gpt-tokenizer";
import { BrainIcon, BugIcon } from "lucide-react";
import { useChatStore } from "./store";

export default function ChatCtrl() {
  const { llmInputTokenLimit } = useRootLayout();
  const input = useChatStore((s) => s.input);
  const dialogContextTokens = useChatStore((s) =>
    countTokens(JSON.stringify(s.context.dialog)),
  );
  const inputTokens = countTokens(input);
  const showThinking = useChatStore((s) => s.showThinking);
  const debugMode = useChatStore((s) => s.debugMode);
  const { toggleShowThinking, toggleDebugMode } = useChatStore(
    (s) => s.actions,
  );
  return (
    <div className="flex gap-1 items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={showThinking ? "default" : "ghost"}
            size="iconSm"
            type="button"
            onClick={toggleShowThinking}
          >
            <BrainIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Show thinking</TooltipContent>
      </Tooltip>
      {showThinking && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={debugMode ? "default" : "ghost"}
              size="iconSm"
              type="button"
              onClick={toggleDebugMode}
            >
              <BugIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Debug Mode</TooltipContent>
        </Tooltip>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            type="button"
            variant="ghost"
            className={cn(
              "px-1 py-0 h-fit rounded-sm",
              (dialogContextTokens + inputTokens) / llmInputTokenLimit > 1
                ? "text-orange-700"
                : "",
            )}
          >
            {Math.round(
              ((dialogContextTokens + inputTokens) / llmInputTokenLimit) * 100,
            )}
            %
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Context Token Usage: {dialogContextTokens + inputTokens} /{" "}
          {llmInputTokenLimit}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
