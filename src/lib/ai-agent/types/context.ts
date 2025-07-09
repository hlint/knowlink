import { z } from "zod";
import { MessageSchema } from "./message";

export const ContextSchema = z.object({
  state: z
    .enum(["idle", "thinking", "outputting", "executing", "error"])
    .default("idle"),
  dialog: z.array(MessageSchema).default([]),
});

export type Context = z.infer<typeof ContextSchema>;
