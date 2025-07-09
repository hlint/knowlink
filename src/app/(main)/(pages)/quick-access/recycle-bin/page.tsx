import ListPageContent from "@/app/(main)/components/note-list/page-content";
import { fetcherGetRecycleBinNotes } from "@/app/(main)/fetchers/note-list";

export const metadata = {
  title: "Recycle Bin | Knowlink",
};

export default async function RecycleBinPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;
  const notes = await fetcherGetRecycleBinNotes(query);
  return (
    <ListPageContent
      notes={notes}
      pageType="recycle-bin"
      illustrationName="Recycling bin in the office"
    />
  );
}
