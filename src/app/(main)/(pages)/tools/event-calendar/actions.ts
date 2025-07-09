"use server";

import type { CalendarEvent } from "@/components/advance/event-calendar";
import { checkUserAdmin } from "@/dal-server-action";
import { prisma } from "@/lib/prisma";
import { shortId } from "@/lib/string";

export async function actionCreateCalendarEvent(
  event: Omit<CalendarEvent, "id">,
) {
  await checkUserAdmin();
  const createdEvent = await prisma.calendarEvent.create({
    data: { ...event, id: shortId() },
  });
  return createdEvent;
}

export async function actionUpdateCalendarEvent(
  id: string,
  event: Partial<CalendarEvent>,
) {
  await checkUserAdmin();
  const updatedEvent = await prisma.calendarEvent.update({
    where: { id },
    data: { ...event },
  });
  return updatedEvent;
}

export async function actionDeleteCalendarEvent(id: string) {
  await checkUserAdmin();
  await prisma.calendarEvent.delete({
    where: { id },
  });
}
