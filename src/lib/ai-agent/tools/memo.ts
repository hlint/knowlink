import { z } from "zod";
import type { Tool } from "../types/tool";

const schema = z.object({
  content: z.string().describe("The content of the memo."),
});

export const memoTool: Tool<typeof schema> = {
  name: "memo",
  description:
    "Write a memo for yourself. Useful when you need to remember something for a long time. No output is needed.",
  schema,
  execute: async () => {
    return null;
  },
};
