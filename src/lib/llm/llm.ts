import { fetcherGetConfig } from "@/app/(main)/fetchers/configs";
import OpenAI from "openai";
import { random } from "radashi";
import type { LlmDialog } from "./types";

export async function callLlm({
  dialog,
  onStream = () => {},
}: {
  dialog: LlmDialog;
  onStream?: (content: string) => void | Promise<void>;
}) {
  const apiKey = await fetcherGetConfig("openaiApiKey");
  const baseURL = await fetcherGetConfig("openaiBaseUrl");
  const client = new OpenAI({
    apiKey,
    baseURL,
  });
  const extraOptionsForPollinations = {
    seed: random(1, 1000000),
    private: true,
    // biome-ignore lint/complexity/noBannedTypes: unexpected options
  } as {};
  const response = await client.chat.completions.create(
    {
      model: await fetcherGetConfig("openaiModel"),
      messages: dialog,
      stream: true,
      ...extraOptionsForPollinations,
    },
    apiKey
      ? {}
      : {
          headers: {
            Authorization: "", // Pollinations will throw an error for "Bearer "
          },
        },
  );
  let content = "";
  for await (const chunk of response) {
    content += chunk.choices[0]?.delta.content ?? "";
    await onStream(content);
  }
  return content;
}
