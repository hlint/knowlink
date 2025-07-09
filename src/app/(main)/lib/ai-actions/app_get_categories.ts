import type { Tool } from "@/lib/ai-agent/types/tool";
import { z } from "zod";
import { fetcherGetCategories } from "../../fetchers/category";

const schema = z.object({
  tool_name: z.literal("app_get_categories").optional(),
});

export const appGetCategoriesTool: Tool<typeof schema> = {
  name: "app_get_categories",
  description:
    "Get the user's knowledge base category information immediately, including primary categories, subcategories, and the number of notes under each subcategory.",
  schema,
  execute: async () => {
    const data = await fetcherGetCategories();
    return data;
  },
};
