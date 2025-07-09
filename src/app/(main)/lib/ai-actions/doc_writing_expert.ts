import type { Tool } from "@/lib/ai-agent/types/tool";
import { z } from "zod";
import { getContentFromDoc } from "../note-process";

const schema = z.object({
  info: z
    .string()
    .describe(
      "The information to create a document from. It can be a title, a description, an instruction, a complete article, etc.",
    ),
});

export const docWritingExpertTool: Tool<typeof schema> = {
  name: "doc_writing_expert",
  description:
    "This tool generates a well-structured and content-rich document based on the provided information. Return a structured document with title and content. It cannot access the database, internet, or any other external resources.",
  schema,
  execute: async (input) => {
    const { info } = schema.parse(input);
    const output = await getContentFromDoc(info);
    return output;
  },
};
