"use client";
import {
  type CalendarEvent,
  getEventColorClasses,
} from "@/components/advance/event-calendar";
import { ProgressBarLink } from "@/components/advance/progress-bar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format, isBefore } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function EventCalendarClient({
  events,
}: {
  events: CalendarEvent[];
}) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="size-5" /> Recent Events
          <ButtonMore />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-start gap-4">
        <Calendar
          mode="multiple"
          selected={events.map((e) => e.start)}
          onSelect={() => {}}
          className="hidden sm:block"
        />
        <div className="flex flex-col gap-2 flex-1 min-h-[100px] max-h-[266px] items-stretch overflow-auto hover-show-scroller">
          {events.map((event) => (
            <EventCalendarContent key={event.id} event={event} />
          ))}
          {events.length === 0 && <NoEvent />}
        </div>
      </CardContent>
    </Card>
  );
}

function EventCalendarContent({ event }: { event: CalendarEvent }) {
  const isPast = isBefore(event.start, new Date());
  return (
    <button
      type="button"
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 flex px-1 text-left font-medium backdrop-blur-md transition outline-none select-none focus-visible:ring-[3px] sm:px-2 rounded-md min-w-0",
        getEventColorClasses(event.color),
        isPast && "line-through",
      )}
    >
      <span className="truncate">
        <span className="truncate font-normal opacity-70 sm:text-[11px] mr-1">
          {format(event.start, event.allDay ? "MMM d" : "MMM d, h:mm a")}{" "}
        </span>
        {event.title}
      </span>
    </button>
  );
}

function ButtonMore() {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="ml-auto"
      asChild
    >
      <ProgressBarLink href="/tools/event-calendar">More</ProgressBarLink>
    </Button>
  );
}

function NoEvent() {
  return (
    <div className="">
      <p className="text-sm text-muted-foreground">No recent event.</p>
    </div>
  );
}
