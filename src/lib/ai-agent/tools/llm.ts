import { callLlm } from "@/lib/llm/llm";
import { z } from "zod";
import type { Tool } from "../types/tool";

const schema = z.object({
  prompt: z
    .string()
    .describe(
      "The prompt to guide the LLM to generate text. Example: 'Generate a short story about a cat.'",
    ),
  context: z
    .string()
    .describe(
      "The context that the LLM instance should know, since it cannot access any other information.",
    ),
});

export const llmTool: Tool<typeof schema> = {
  name: "llm",
  description: "Call a LLM instance to generate text.",
  schema,
  execute: async (input) => {
    const { prompt, context } = schema.parse(input);
    const result = await callLlm({
      dialog: [
        {
          role: "system",
          content: `You are a helpful assistant.
CONTEXT is provided by the user, and may be useful for you to generate text.
<CONTEXT>${context}</CONTEXT>`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    return result;
  },
};
