import { fetcherGetConfig } from "@/app/(main)/fetchers/configs";
import type { Tool } from "../types/tool";
import { imageGenerationTool } from "./image_generation";
import { imageSearchTool } from "./image_search";
import { llmTool } from "./llm";
import { memoTool } from "./memo";
import { randomNumbersTool } from "./random_numbers";
import { webExtractTool } from "./web_extract";
import { webSearchTool } from "./web_search";

export async function getDefaultTools() {
  return [
    (await fetcherGetConfig("tavilyApiKey")) ? webSearchTool : null,
    imageGenerationTool,
    webExtractTool,
    randomNumbersTool,
    (await fetcherGetConfig("pexelsApiKey")) ? imageSearchTool : null,
    memoTool,
    llmTool,
  ].filter(Boolean) as unknown as Tool[];
}
