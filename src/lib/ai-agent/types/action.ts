import { z } from "zod";

export const CallToolsActionSchema = z.object({
  type: z.literal("call_tools"),
  actions: z.array(
    z.object({
      tool_name: z.string().describe("Name of the tool"),
      summary: z
        .string()
        .describe(
          "A one-sentence summary of the tool invocation action. Do not include specific parameters here; parameters should be provided in the input field.",
        ),
      input: z
        .record(z.any())
        .optional()
        .describe(
          "Input(parameters) for the tool, following the tool's schema",
        ),
    }),
  ),
});

export const OutputActionSchema = z.object({
  type: z.literal("output_content"),
  output_instruction: z
    .string()
    .describe(
      "Instructions for how the output node should present the content. The instruction should be concise, as the output node can access all context. Use an instructive tone, for example: 'Combine the search results and the note content to provide a comprehensive answer.'",
    ),
});
export const ActionSchema = z.union([
  CallToolsActionSchema,
  OutputActionSchema,
]);

export const OutputExtraActionSchema = z.object({
  type: z.literal("output_extra_action"),
  suggested_inputs: z
    .array(z.string())
    .max(3)
    .describe("Predict possible user inputs (up to 3)"),
});
