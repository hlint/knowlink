import type { Tool } from "@/lib/ai-agent/types/tool";
import { parseTime } from "@/lib/time";
import { z } from "zod";
import {
  actionCreateCalendarEvent,
  actionUpdateCalendarEvent,
} from "../../(pages)/tools/event-calendar/actions";

const schema = z.union([
  z.object({
    action: z.literal("create"),
    event: z.object({
      title: z.string().describe("The title of the event"),
      start: z
        .string()
        .describe("The start time of the event, formatted as [Time Format]")
        .transform((v) => parseTime(v)),
      end: z
        .string()
        .describe("The end time of the event, formatted as [Time Format]")
        .transform((v) => parseTime(v)),
      allDay: z.boolean().describe("Whether the event is all day").optional(),
      color: z
        .enum(["sky", "amber", "violet", "rose", "emerald", "orange"])
        .describe("Visualize the event color in the calendar.")
        .optional(),
      location: z.string().describe("The location of the event").optional(),
      description: z
        .string()
        .describe("The description of the event")
        .optional(),
    }),
  }),
  z.object({
    action: z.literal("update"),
    id: z.string().describe("The id of the event"),
    event: z.object({
      title: z.string().describe("The title of the event").optional(),
      start: z
        .string()
        .describe("The start time of the event, formatted as [Time Format]")
        .transform((v) => parseTime(v))
        .optional(),
      end: z
        .string()
        .describe("The end time of the event, formatted as [Time Format]")
        .transform((v) => parseTime(v))
        .optional(),
      allDay: z.boolean().describe("Whether the event is all day").optional(),
      color: z
        .enum(["sky", "amber", "violet", "rose", "emerald", "orange"])
        .describe("Visualize the event color in the calendar.")
        .optional(),
      location: z.string().describe("The location of the event").optional(),
      description: z
        .string()
        .describe("The description of the event")
        .optional(),
    }),
  }),
]);

// export const TIME_FORMAT = "yyyy-MM-dd HH:mm zzz";
export const appUpsertCalendarEventTool: Tool<typeof schema> = {
  name: "app_upsert_calendar_event",
  description: `Upsert a calendar event. 

[Time Format]
- For start and end time: 'yyyy-MM-dd HH:mm zzzz'.
- Example1: 2025-01-01 09:00 GMT-07:30
- Example2: 2025-01-01 13:45 GMT+08:00

`,
  schema,
  execute: async (input) => {
    const params = schema.parse(input);
    if (params.action === "create") {
      return actionCreateCalendarEvent(params.event);
    }
    if (params.action === "update") {
      return actionUpdateCalendarEvent(params.id, params.event);
    }
  },
};
