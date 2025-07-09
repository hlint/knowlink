import type { Tool } from "@/lib/ai-agent/types/tool";
import { objectToFormData } from "@/lib/format";
import { z } from "zod";
import {
  actionCreateCategory,
  actionCreateSubcategory,
  actionDeleteCategory,
  actionDeleteSubcategory,
  actionUpdateCategory,
  actionUpdateSubcategory,
} from "../../actions/category";
import { fetcherGetCategories } from "../../fetchers/category";

const schema = z.object({
  actions: z
    .array(
      z.union([
        z.object({
          type: z.literal("create_category"),
          data: z.object({
            name: z.string(),
            subcategories_name: z.array(z.string().min(1)),
          }),
        }),
        z.object({
          type: z.literal("update_category"),
          id: z.string(),
          data: z.object({
            name: z.string(),
          }),
        }),
        z.object({
          type: z.literal("delete_category"),
          id: z.string(),
        }),
        z.object({
          type: z.literal("create_subcategory"),
          data: z.object({
            name: z.string(),
            categoryId: z.string(),
          }),
        }),
        z.object({
          type: z.literal("update_subcategory"),
          id: z.string(),
          data: z.object({
            name: z.string().optional(),
            categoryId: z.string().optional(),
          }),
        }),
        z.object({
          type: z.literal("delete_subcategory"),
          id: z.string(),
        }),
      ]),
    )
    .describe(
      "The actions to perform, each command will be executed in sequence. All delete actions are cascading and irreversible.",
    ),
});

export const appWriteCategoriesTool: Tool<typeof schema> = {
  name: "app_write_categories",
  description:
    "Operate the user's knowledge base categories, including creating, updating, and deleting categories and subcategories.",
  schema,
  execute: async (input) => {
    const { actions } = schema.parse(input);
    let hasError = false;
    try {
      for (const action of actions) {
        switch (action.type) {
          case "create_category": {
            const category = await actionCreateCategory(
              objectToFormData({
                name: action.data.name,
              }),
            );
            for (const subcategory_name of action.data.subcategories_name) {
              await actionCreateSubcategory(
                objectToFormData({
                  name: subcategory_name,
                  categoryId: category!.id,
                }),
              );
            }
            break;
          }
          case "update_category": {
            await actionUpdateCategory(
              objectToFormData({
                id: action.id,
                name: action.data.name,
              }),
            );
            break;
          }
          case "delete_category": {
            await actionDeleteCategory(action.id);
            break;
          }
          case "create_subcategory": {
            await actionCreateSubcategory(
              objectToFormData({
                name: action.data.name,
                categoryId: action.data.categoryId,
              }),
            );
            break;
          }
          case "update_subcategory": {
            await actionUpdateSubcategory(
              objectToFormData({
                id: action.id,
                name: action.data.name,
                categoryId: action.data.categoryId,
              }),
            );
            break;
          }
          case "delete_subcategory": {
            await actionDeleteSubcategory(action.id);
            break;
          }
        }
      }
    } catch (error) {
      console.error(error);
      hasError = true;
    }
    return {
      hasError,
      categories_after: await fetcherGetCategories(),
    };
  },
};
