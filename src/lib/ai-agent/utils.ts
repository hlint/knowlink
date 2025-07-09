import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { Tool } from "./types/tool";

export function parsePrompt(prompt: string, params: Record<string, unknown>) {
  return prompt.replace(/\{([^{}]+)\}/g, (match, p1) =>
    params[p1] ? JSON.stringify(params[p1]) : match,
  );
}

export const DIVIDER = "__DIVIDER__";
export function parseLlmResultWithDivider<T>(
  result: string,
  jsonSchema: z.ZodSchema<T>,
) {
  const [text, json] = result.split(DIVIDER);
  return [text.trim(), jsonSchema.parse(betterJsonParse(json))] as const;
}

export function objectAssign<T extends object>(target: T, source: Partial<T>) {
  Object.assign(target, source);
  return target;
}

export function getToolDetails<Schema extends z.ZodSchema>(tool: Tool<Schema>) {
  return {
    name: tool.name,
    description: tool.description,
    parameters: zodToJsonSchema(tool.schema),
  };
}

export function betterJsonParse(jsonStr: string) {
  const match = jsonStr.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object found in string");
  return JSON.parse(match[0]);
}

export function getElementsAfter<T>(arr: T[], element: T) {
  const index = arr.indexOf(element);
  return arr.slice(index + 1);
}
