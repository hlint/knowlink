import ListPageContent from "@/app/(main)/components/note-list/page-content";
import { fetcherGetSubcategory } from "@/app/(main)/fetchers/category";
import { fetcherGetNotesBySubcategoryId } from "@/app/(main)/fetchers/note-list";
import type { Metadata } from "next";
import { omit } from "radashi";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subcategoryId: string }>;
}): Promise<Metadata> {
  const subcategory = await fetcherGetSubcategory((await params).subcategoryId);
  return {
    title: `${subcategory ? subcategory?.name || "Untitled" : "Not Found"} | Knowlink`,
  };
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ subcategoryId: string }>;
  searchParams: Promise<{ query: string }>;
}) {
  const subcategoryId = (await params).subcategoryId;
  const { query } = await searchParams;
  const subcategory = await fetcherGetSubcategory(subcategoryId);
  const notes = await fetcherGetNotesBySubcategoryId(subcategoryId, query);
  return (
    <ListPageContent
      notes={notes}
      pageType="subcategory"
      subcategory={subcategory ? omit(subcategory, ["category"]) : null}
      category={subcategory?.category ?? null}
      fallback={subcategory ? undefined : <NotFound />}
      illustrationName={`Category: ${subcategory?.category?.name} / ${subcategory?.name}`}
    />
  );
}

function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center gap-4 p-4">
      <div className="prose pb-20">
        <h1>Not Found</h1>
        <p>The subcategory you are looking for does not exist.</p>
      </div>
    </div>
  );
}
