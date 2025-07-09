import { z } from "zod";

const pattern = z.string();

export const ConfigsSchema = z.object({
  webClipperAccessKey: pattern,
  llmInputTokenLimit: pattern,
  openaiApiKey: pattern,
  openaiBaseUrl: pattern,
  openaiModel: pattern,
  tavilyApiKey: pattern,
  pexelsApiKey: pattern,
});

export type Configs = z.infer<typeof ConfigsSchema>;

export function getDefaultConfigs(): Configs {
  return {
    webClipperAccessKey: "CHANGE_ME",
    llmInputTokenLimit: "20000",
    openaiApiKey: "",
    openaiBaseUrl: "https://text.pollinations.ai/openai",
    openaiModel: "",
    tavilyApiKey: "",
    pexelsApiKey: "",
  };
}
