import { createZustandStore } from "@/lib/create-store";
import type { CategoryWithSubs } from "../../fetchers/category";

type MainLayoutStore = {
  pageType:
    | "null"
    | "home"
    | "note"
    | "subcategory"
    | "scratchpad"
    | "all-notes"
    | "unsorted-notes"
    | "recent-notes"
    | "recycle-bin"
    | "event-calendar"
    | "settings"
    | "account";
  categories: CategoryWithSubs[];
  openCategoryId: string | null;
  activeSubcategoryId: string | null;
  activeCategoryId: string | null;
  breadcrumbItems: {
    name: string;
    icon?: React.ReactNode;
    href?: string;
  }[];
};

const initialState: MainLayoutStore = {
  pageType: "null",
  categories: [],
  openCategoryId: null,
  activeSubcategoryId: null,
  activeCategoryId: null,
  breadcrumbItems: [],
};

export const useMainLayoutStore = createZustandStore(initialState, (set) => ({
  actions: {
    setValues: (values: Partial<MainLayoutStore>) => {
      set((d) => {
        Object.assign(d, values);
      });
    },
  },
}));
