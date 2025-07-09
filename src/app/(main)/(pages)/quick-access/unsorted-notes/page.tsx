import ListPageContent from "@/app/(main)/components/note-list/page-content";
import { fetcherGetUnclassifiedNotes } from "@/app/(main)/fetchers/note-list";

export const metadata = {
  title: "Unclassified Notes | Knowlink",
};

export default async function UnsortedNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;
  const notes = await fetcherGetUnclassifiedNotes(query);
  return (
    <ListPageContent
      notes={notes}
      pageType="unsorted-notes"
      illustrationName="A collection of documents scattered in a study"
    />
  );
}
