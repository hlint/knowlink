import { fetcherGetConfig } from "@/app/(main)/fetchers/configs";
import { callLlm } from "@/lib/llm/llm";
import { tavily } from "@tavily/core";
import { z } from "zod";
import type { Tool } from "../types/tool";

const schema = z.object({
  query: z
    .string()
    .describe(
      "A concise and clear query for searching. Supports natural language.",
    ),
  topic: z
    .enum(["general", "news", "finance"])
    .describe("The topic of the search."),
  timeRange: z
    .enum(["all", "one day", "one week", "one month", "one year"])
    .describe("The time range of the search."),
});

export const webSearchTool: Tool<typeof schema> = {
  name: "web_search",
  description:
    "Search the web for information. Return relevant websites with brief descriptions and a summary.",
  schema,
  execute: async (input) => {
    const { query, topic, timeRange } = input;
    const client = tavily({ apiKey: await fetcherGetConfig("tavilyApiKey") });
    const timeRangeMap = {
      all: undefined,
      "one day": "day",
      "one week": "week",
      "one month": "month",
      "one year": "year",
    } as const;
    const results = await client.search(query, {
      topic: topic,
      searchDepth: "advanced",
      maxResults: 10,
      timeRange: timeRangeMap[timeRange],
      includeAnswer: true,
    });
    return results;
  },
};

export const webSearchToolWithSummary: Tool<typeof schema> = {
  name: "web_search_with_summary",
  description:
    "Search the web for information. Get the summary of the search results only.",
  schema,
  execute: async (input) => {
    const { query, topic, timeRange } = schema.parse(input);
    const client = tavily({ apiKey: await fetcherGetConfig("tavilyApiKey") });
    const timeRangeMap = {
      all: undefined,
      "one day": "day",
      "one week": "week",
      "one month": "month",
      "one year": "year",
    } as const;
    const results = await client.search(query, {
      topic: topic,
      searchDepth: "advanced",
      maxResults: 10,
      timeRange: timeRangeMap[timeRange],
      includeAnswer: true,
    });
    const summary = await callLlm({
      dialog: [
        {
          role: "system",
          content: `You are a helpful assistant that summarizes web search results. The summary should be detailed and to the point.
Add a list of reference links at the end, listing all the links that support these results like this:
Reference Links:
- [Title](https://link1.com)
- [Title](https://link2.com)
- [Title](https://link3.com)
`,
        },
        {
          role: "user",
          content: `
Query: ${query}
Topic: ${topic}
Time Range: ${timeRange}
Results: ${JSON.stringify(results)}
`,
        },
      ],
    });

    return summary;
  },
};
