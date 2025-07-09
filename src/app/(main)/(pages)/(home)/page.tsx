import { HomeEffect } from "./effect";
import EventCalendar from "./event-calendar";
import Greetings from "./greetings";
import QuickAccess from "./quick-access";
import SearchCreate from "./search-create";

export default function MainPage() {
  return (
    <div className="max-w-screen-lg flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
      <HomeEffect />
      <Greetings />
      <SearchCreate />
      <QuickAccess />
      <EventCalendar />
    </div>
  );
}
