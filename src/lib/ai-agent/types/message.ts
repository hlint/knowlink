import { z } from "zod";
import { ActionSchema, OutputExtraActionSchema } from "./action";

const GeneralMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "system"]),
  content: z.string(),
  status: z.enum(["pending", "success", "error"]),
  data: z.any(),
});

const AssistantMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["assistant"]),
  content: z.string(),
  status: z.enum(["pending", "success", "error"]),
  data: OutputExtraActionSchema.optional(),
});

const ToolMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["tool"]),
  content: z.string(),
  status: z.enum(["pending", "success", "error"]),
  data: z.object({
    tool_name: z.string(),
    input: z.any(),
    output: z.any(),
  }),
});

export type ToolMessage = z.infer<typeof ToolMessageSchema>;

const ThinkingMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["thinking"]),
  content: z.string(),
  status: z.enum(["pending", "success", "error"]),
  round: z.number(),
  data: ActionSchema.optional(),
});

export const MessageSchema = z.union([
  GeneralMessageSchema,
  AssistantMessageSchema,
  ToolMessageSchema,
  ThinkingMessageSchema,
]);

export type Message = z.infer<typeof MessageSchema>;
