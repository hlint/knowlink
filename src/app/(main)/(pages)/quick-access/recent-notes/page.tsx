import ListPageContent from "@/app/(main)/components/note-list/page-content";
import { fetcherGetRecentlyViewedNotes } from "@/app/(main)/fetchers/note-list";

export const metadata = {
  title: "Recently Viewed | Knowlink",
};

export default async function RecentlyViewedPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;
  const notes = await fetcherGetRecentlyViewedNotes(query);
  return (
    <ListPageContent
      notes={notes}
      pageType="recent-notes"
      illustrationName="A collection of documents neatly arranged on a desk"
    />
  );
}
