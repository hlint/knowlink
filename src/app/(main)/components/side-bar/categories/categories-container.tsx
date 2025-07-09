import { fetcherGetCategories } from "@/app/(main)/fetchers/category";
import { cloneDeep } from "radashi";
import Categories from "./categories";

export default async function CategoriesContainer() {
  const categories = await fetcherGetCategories();
  return <Categories categories={cloneDeep(categories)} />;
}
