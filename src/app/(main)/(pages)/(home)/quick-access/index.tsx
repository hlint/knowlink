import QuickAccessClient from "./client";
import { fetcherGetQuickAccessItemsCounts } from "./fetchers";

export default async function QuickAccess() {
  const counts = await fetcherGetQuickAccessItemsCounts();
  return <QuickAccessClient counts={counts} />;
}
