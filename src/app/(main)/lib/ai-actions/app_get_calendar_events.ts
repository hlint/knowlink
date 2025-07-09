import type { Tool } from "@/lib/ai-agent/types/tool";
import { formatTime } from "@/lib/time";
import { z } from "zod";
import { fetcherGetCalendarEvents } from "../../fetchers/event-calendar";

const schema = z.object({
  tool_name: z.literal("app_get_calendar_events").optional(),
});

export const appGetCalendarEventsTool: Tool<typeof schema> = {
  name: "app_get_calendar_events",
  description:
    "Get the user's all calendar events information immediately, including events, start time, end time, location, and description.",
  schema,
  execute: async (_input) => {
    const data = await fetcherGetCalendarEvents();
    return data.map((event) => ({
      ...event,
      start: formatTime(event.start),
      end: formatTime(event.end),
    }));
  },
};
