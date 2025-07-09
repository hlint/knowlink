"use client";
import type { CategoryWithSubs } from "../../../fetchers/category";
import CategoryItem from "./category-item";
import { CategoriesProvider } from "./context-categories";

export default function Categories({
  categories,
}: { categories: CategoryWithSubs[] }) {
  return (
    <CategoriesProvider categories={categories}>
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          subcategories={category.Subcategory}
        />
      ))}
    </CategoriesProvider>
  );
}
