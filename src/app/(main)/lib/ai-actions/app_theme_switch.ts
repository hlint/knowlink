import type { Tool } from "@/lib/ai-agent/types/tool";
import { z } from "zod";
import type { ClientEffect } from "./types";

const schema = z.object({
  theme: z.enum(["light", "dark", "system"]),
});

export const appThemeSwitchTool: Tool<typeof schema> = {
  name: "app_theme_switch",
  description: "Switch the theme of the app. Effect immediately applied.",
  schema,
  execute: async (input) => {
    const { theme } = schema.parse(input);
    const clientEffect: ClientEffect = {
      type: "client_effect",
      name: "app_theme_switch",
      params: { theme },
      state: "sent",
    };
    return { clientEffect };
  },
};
