import type { Tool } from "@/lib/ai-agent/types/tool";
import { z } from "zod";
import { fetcherGetNoteDetails } from "../../fetchers/note-list";

const schema = z.object({
  note_ids: z.array(z.string()).min(1).describe("The note ids to get details."),
});

export const appGetNoteDetailsTool: Tool<typeof schema> = {
  name: "app_get_note_details",
  description:
    "Get note details by note ids. Return the note details with title, link, content, icon, subcategoryId, pending, deleted, confidential.",
  schema,
  execute: async (input) => {
    const { note_ids } = schema.parse(input);
    const data = await fetcherGetNoteDetails(note_ids);
    return data;
  },
};
