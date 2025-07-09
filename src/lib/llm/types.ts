import { z } from "zod";

export const LlmDialogSchema = z.array(
  z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
  }),
);

export type LlmDialog = z.infer<typeof LlmDialogSchema>;
