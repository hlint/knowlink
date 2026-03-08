import { fetcherGetCalendarEvents } from "../../../fetchers/event-calendar";
import EventCalendarPageClient from "./client";

export const metadata = {
  title: "Event Calendar | Knowlink",
};

export default async function EventCalendarPage() {
  const events = await fetcherGetCalendarEvents();
  return (
    <div className="flex w-full max-w-screen-lg flex-1 flex-col gap-4 p-4">
      <EventCalendarPageClient events={events} />
    </div>
  );
}
