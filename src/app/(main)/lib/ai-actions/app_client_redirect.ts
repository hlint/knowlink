import type { Tool } from "@/lib/ai-agent/types/tool";
import { z } from "zod";
import type { ClientEffect } from "./types";

const schema = z.object({
  url: z
    .string()
    .describe(
      "Both internal links (without origin) and external links are allowed.",
    ),
});

export const appClientRedirectTool: Tool<typeof schema> = {
  name: "app_client_redirect",
  description: `Redirect(or open in new tab) the client to the given url.
Mainly used when user wants to read details of a note or subcategory.`,
  schema,
  execute: async (input) => {
    const { url } = schema.parse(input);
    const clientEffect: ClientEffect = {
      type: "client_effect",
      name: "app_client_redirect",
      params: { url },
      state: "sent",
    };
    return { clientEffect };
  },
};
