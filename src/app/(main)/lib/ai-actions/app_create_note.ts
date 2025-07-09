import type { Tool } from "@/lib/ai-agent/types/tool";
import { z } from "zod";
import { actionCreateNote } from "../../actions/create-note";

const schema = z.object({
  from_url: z
    .string()
    .url()
    .optional()
    .describe("The URL from which to create a note."),
  from_info: z
    .string()
    .optional()
    .describe(
      "The information to create a note from. It can be a title, a description, an instruction, a complete article, etc.",
    ),
  subcategory_id: z
    .string()
    .nullable()
    .describe(
      "The subcategory id to create a note in. Null only if no applicable subcategory.",
    ),
});

export const appCreateNoteTool: Tool<typeof schema> = {
  name: "app_create_note",
  description:
    "Create a new note from a url or instruction(the system will call doc_writing_expert internally). Return the created note.",
  schema,
  execute: async (input) => {
    const { subcategory_id, from_info, from_url } = schema.parse(input);
    const created_note = await actionCreateNote({
      subcategoryId: subcategory_id,
      info: from_url || from_info,
      wait: true,
    });
    return {
      created_note,
    };
  },
};
