import { defaultWritingPrompt } from "@/app/(main)/(pages)/settings/default-writing-prompt";
import { fetcherGetWritingPrompt } from "@/app/(main)/fetchers/configs";
import { callLlm } from "@/lib/llm/llm";

export default async function aiDocWriting({
  doc,
}: {
  doc: string;
}) {
  const writingPrompt = await fetcherGetWritingPrompt();
  const response = await callLlm({
    dialog: [
      {
        role: "system",
        content: writingPrompt.trim() || defaultWritingPrompt,
      },
      { role: "user", content: `<USERDOCUMENT>${doc}</USERDOCUMENT>` },
    ],
  });
  return response;
}
