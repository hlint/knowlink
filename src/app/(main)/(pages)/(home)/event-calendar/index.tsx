import { fetcherGetCalendarEvents } from "../../../fetchers/event-calendar";
import EventCalendarClient from "./client";

export default async function EventCalendar() {
  const events = await fetcherGetCalendarEvents(true);
  return (
    <div>
      <EventCalendarClient events={events} />
    </div>
  );
}
