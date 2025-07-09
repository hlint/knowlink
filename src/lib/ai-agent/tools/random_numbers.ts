import { random } from "radashi";
import { z } from "zod";
import type { Tool } from "../types/tool";

const schema = z.object({
  min: z.number().describe("The minimum number.").default(1),
  max: z.number().describe("The maximum number.").default(100),
  count: z
    .number()
    .describe("The number of random numbers to generate.")
    .default(1),
});

export const randomNumbersTool: Tool<typeof schema> = {
  name: "random_numbers",
  description: "Generate random numbers.",
  schema,
  execute: async (input) => {
    const { min, max, count } = schema.parse(input);
    const numbers = Array.from({ length: count }, () => random(min, max));
    return numbers;
  },
};
