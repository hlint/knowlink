import type { Tool } from "@/lib/ai-agent/types/tool";
import { z } from "zod";
import { fetcherGetNotesBySearchForAi } from "../../fetchers/note-list";

const schema = z.object({
  query: z
    .string()
    .default("")
    .describe(
      "The query to search for. Use keywords rather than full sentences. Keep it empty if no query is needed.",
    ),
  subcategoryId: z
    .union([
      z.string().describe("Get notes by subcategory id"),
      z.null().describe("Get all unsorted notes"),
      z.literal(true).describe("Get all notes"),
    ])
    .default(true)
    .describe("Restrict the note list to a specific condition."),
});

export const appGetNoteListTool: Tool<typeof schema> = {
  name: "app_get_note_list",
  description:
    "Get the note list by query. Return the note list with id, title, link, subcategory.",
  schema,
  execute: async (input) => {
    const { query, subcategoryId } = schema.parse(input);
    const data = await fetcherGetNotesBySearchForAi({ query, subcategoryId });
    return data;
  },
};
