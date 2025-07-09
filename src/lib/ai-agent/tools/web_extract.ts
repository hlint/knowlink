import { parseMarkdown } from "@/lib/parse-html";
import { scrapeHtml } from "@/lib/utils.server";
import { z } from "zod";
import type { Tool } from "../types/tool";

const schema = z.object({
  urls: z
    .array(z.string().url())
    .min(1)
    .describe(
      "Urls to extract information from. url must start with http or https",
    ),
});

export const webExtractTool: Tool<typeof schema> = {
  name: "web_extract",
  description:
    "Extract information from specific URLs and return the detailed content of each page as a list of objects. The number of URLs is limited to 8.",
  schema,
  execute: async (input) => {
    const { urls } = schema.parse(input);
    const results = await extractWithNativeParser(urls);
    return results;
  },
};

async function extractWithNativeParser(urls: string[]) {
  const results = await Promise.all(
    urls.map(async (url) => {
      const html = await scrapeHtml(url);
      const content = parseMarkdown(html);
      return {
        url,
        content,
      };
    }),
  );
  return results;
}
