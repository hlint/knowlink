import ListPageContent from "@/app/(main)/components/note-list/page-content";
import { fetcherGetPinnedNotes } from "@/app/(main)/fetchers/note-list";

export const metadata = {
  title: "Pinned Notes | Knowlink",
};

export default async function PinnedNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;
  const notes = await fetcherGetPinnedNotes(query);
  return (
    <ListPageContent
      notes={notes}
      pageType="pinned-notes"
      illustrationName="Important documents pinned to a cork board with colorful thumbtacks"
    />
  );
}
