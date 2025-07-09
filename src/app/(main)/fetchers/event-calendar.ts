import { prisma } from "@/lib/prisma";
import { addDays, subDays } from "date-fns";

export async function fetcherGetCalendarEvents(recent?: boolean) {
  const after = recent ? subDays(new Date(), 3) : undefined;
  const before = recent ? addDays(new Date(), 7) : undefined;
  const events = await prisma.calendarEvent.findMany({
    where: {
      start: {
        gte: after,
        lte: before,
      },
    },
    orderBy: {
      start: "asc",
    },
  });
  return events;
}
