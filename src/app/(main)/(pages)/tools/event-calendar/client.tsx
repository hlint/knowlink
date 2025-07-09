"use client";
import { useMainLayoutStore } from "@/app/(main)/(pages)/(layout)/store";
import { EventCalendar } from "@/components/advance/event-calendar";
import type { CalendarEvent } from "@prisma/client";
import { CalendarIcon } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { toast } from "sonner";
import {
  actionCreateCalendarEvent,
  actionDeleteCalendarEvent,
  actionUpdateCalendarEvent,
} from "./actions";

export default function EventCalendarPageClient({
  events,
}: {
  events: CalendarEvent[];
}) {
  const setLayoutValues = useMainLayoutStore((s) => s.actions.setValues);
  const [internalEvents, setInternalEvents] = useState<CalendarEvent[]>(events);
  useLayoutEffect(() => {
    setInternalEvents(events);
  }, [events]);
  useLayoutEffect(() => {
    setLayoutValues({
      pageType: "event-calendar",
      breadcrumbItems: [
        { name: "Tools" },
        { name: "Event Calendar", icon: <CalendarIcon className="size-4" /> },
      ],
    });
    return () => {
      setLayoutValues({
        pageType: "null",
        breadcrumbItems: [],
      });
    };
  }, [setLayoutValues]);
  return (
    <div className="w-full p-0">
      <EventCalendar
        className=""
        events={internalEvents}
        onEventAdd={(event) => {
          actionCreateCalendarEvent(event)
            .then((event) => {
              setInternalEvents((prev) => [...prev, event]);
            })
            .catch((error) => {
              console.error(error);
              toast.error("Failed to create event");
            });
        }}
        onEventUpdate={(event) => {
          actionUpdateCalendarEvent(event.id, event)
            .then((event) => {
              setInternalEvents((prev) =>
                prev.map((e) => (e.id === event.id ? event : e)),
              );
            })
            .catch((error) => {
              console.error(error);
              toast.error("Failed to update event");
            });
        }}
        onEventDelete={(id) => {
          actionDeleteCalendarEvent(id)
            .then(() => {
              setInternalEvents((prev) => prev.filter((e) => e.id !== id));
            })
            .catch((error) => {
              console.error(error);
              toast.error("Failed to delete event");
            });
        }}
      />
    </div>
  );
}
