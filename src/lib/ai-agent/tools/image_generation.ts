import { generateImage } from "@/lib/ai-image-generation";
// https://image.pollinations.ai/models
// Model gptimage needs token. Use 'gptimage' for precise rendering of text or charts.
import { z } from "zod";
import type { Tool } from "../types/tool";

const schema = z.object({
  description: z
    .string()
    .describe(
      "Description (in English) of the image to generate, consider the artistic dimensions: composition, color palette, artistic style, texture, lighting, mood, etc.",
    ),
  model: z
    .enum(["flux", "turbo"])
    .default("flux")
    .describe(
      "The model to use for image generation. Use 'turbo' for male or female, use 'flux' for general content.",
    ),
  aspectRatio: z
    .enum(["16:9", "9:16", "1:1", "custom"])
    .default("16:9")
    .describe(
      "Use '16:9' for landscapes and wide scenes, '9:16' for portraits and vertical content, and '1:1' for icons and avatars. Use 'custom' to generate an image with a custom size.",
    ),
  custom_size: z
    .object({
      width: z.number().min(100).max(10000).describe("The width of the image."),
      height: z
        .number()
        .min(100)
        .max(10000)
        .describe("The height of the image."),
    })
    .nullable()
    .default(null),
});

export const imageGenerationTool: Tool<typeof schema> = {
  name: "image_generation",
  description:
    "Generate an image from a description, return the URL of the image. Due to the rate limit of the model, DO NOT generate more than 1 image at a time.",
  schema,
  execute: async (input) => {
    const { description, model, aspectRatio, custom_size } =
      schema.parse(input);
    const sizes = {
      "16:9": {
        width: 1280,
        height: 720,
      },
      "9:16": {
        width: 720,
        height: 1280,
      },
      "1:1": {
        width: 1024,
        height: 1024,
      },
    } as const;
    const size =
      aspectRatio === "custom"
        ? {
            width: custom_size!.width,
            height: custom_size!.height,
          }
        : sizes[aspectRatio];
    const fileSaved = await generateImage({
      description,
      model,
      size,
    });
    return { image_url: fileSaved.url };
  },
};
