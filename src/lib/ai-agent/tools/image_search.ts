import { fetcherGetConfig } from "@/app/(main)/fetchers/configs";
import { createClient } from "pexels";
import { z } from "zod";
import type { Tool } from "../types/tool";

const schema = z.object({
  keywords: z
    .string()
    .min(1)
    .max(100)
    .describe(
      "Keywords to search for like 'Akita Inu', English keywords only.",
    ),
});

export const imageSearchTool: Tool<typeof schema> = {
  name: "image_search",
  description:
    "Searches for universal images (nature, cities, business, lifestyle...); not suitable for precise searches of individuals, such as a specific person, a particular phone model, or a specific logo.",
  schema,
  execute: async (input) => {
    const { keywords } = schema.parse(input);
    const results = await imageSearchPexelsApi(keywords);
    return results;
  },
};

// https://www.pexels.com/api/documentation/?language=javascript
async function imageSearchPexelsApi(keywords: string) {
  const client = createClient(await fetcherGetConfig("pexelsApiKey"));
  const results = await client.photos.search({
    query: keywords,
    per_page: 16,
    orientation: "landscape",
  });
  if (client.typeCheckers.isError(results)) {
    throw new Error(results.error);
  }
  return results.photos.map((t) => ({
    src: t.src.landscape,
    srcSmall: t.src.small,
    alt: t.alt ?? "",
  }));
}
