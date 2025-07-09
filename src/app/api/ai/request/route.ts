import { callLlm } from "@/lib/llm/llm";
import { generateSseResponse } from "@/lib/utils.server";
import { z } from "zod";

export async function POST(request: Request) {
  const { prompt } = z
    .object({
      prompt: z.string(),
    })
    .parse(await request.json());
  return generateSseResponse(async (textWriter) => {
    await callLlm({
      dialog: [
        {
          role: "user",
          content: prompt,
        },
      ],
      onStream: (text) => {
        textWriter(JSON.stringify({ text }));
      },
    });
  });
}
