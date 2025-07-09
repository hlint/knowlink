import ListPageContent from "@/app/(main)/components/note-list/page-content";
import { fetcherGetAllNotes } from "../../../fetchers/note-list";

export const metadata = {
  title: "All Notes | Knowlink",
};

export default async function UnclassifiedNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;
  const notes = await fetcherGetAllNotes(query);
  return (
    <ListPageContent
      notes={notes}
      pageType="all-notes"
      illustrationName="Bookshelf, books neatly arranged within"
    />
  );
}
