"use client";

import type { Category } from "@prisma/client";
import { createContext, useContext } from "react";

export const ContextCategories = createContext<{
  categories: Category[];
}>({ categories: [] });

export function useCategories() {
  return useContext(ContextCategories);
}

export function CategoriesProvider({
  children,
  categories,
}: { children: React.ReactNode; categories: Category[] }) {
  return (
    <ContextCategories.Provider value={{ categories }}>
      {children}
    </ContextCategories.Provider>
  );
}
