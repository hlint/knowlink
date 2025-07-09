import "server-only";
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  SESSION_SECRET: z.string().min(8).default("CHANGE_ME"),
});

export const env = () => EnvSchema.parse(process.env);
