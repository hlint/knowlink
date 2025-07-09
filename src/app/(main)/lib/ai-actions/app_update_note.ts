import type { Tool } from "@/lib/ai-agent/types/tool";
import { z } from "zod";
import { actionUpdateNote } from "../../actions/note";
import type { ClientEffect } from "./types";

const schema = z.object({
  id: z.string().min(1).describe("The note id to update."),
  data: z.object({
    title: z.string().optional().describe("The title to update."),
    content: z.string().optional().describe("The content to update."),
    icon: z
      .string()
      .optional()
      .describe(
        "The icon to update. It should be a valid square image url. If you want to remove the icon, keep it to empty string.",
      ),
    link: z
      .string()
      .optional()
      .describe(
        "The link to update. It should be a valid url for bookmarking only. If this is not a bookmark, keep it to empty string.",
      ),
    subcategory_id: z
      .string()
      .nullable()
      .optional()
      .describe("The subcategory id to update."),
  }),
  open_content_diff_viewer: z
    .boolean()
    .optional()
    .describe(
      "Whether to open the content diff viewer. Set to true if you updated the content of the note that user is currently viewing.",
    ),
});

export const appUpdateNoteTool: Tool<typeof schema> = {
  name: "app_update_note",
  description: "Update the note by note id and data.",
  schema,
  execute: async (input) => {
    const { id, data, open_content_diff_viewer } = schema.parse(input);
    await actionUpdateNote({
      id,
      ...data,
      noRevalidate: true,
      AutoSnapshot: true,
    });
    if (open_content_diff_viewer) {
      const clientEffect: ClientEffect = {
        type: "client_effect",
        name: "app_open_content_diff_viewer",
        params: { id },
        state: "sent",
      };
      return { clientEffect };
    }
    return {};
  },
};
