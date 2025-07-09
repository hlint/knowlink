import type { z } from "zod";

export interface Tool<Schema extends z.ZodSchema = z.ZodSchema> {
  name: string;
  description: string;
  schema: Schema;
  execute: (input: z.infer<Schema>) => Promise<unknown>;
}
