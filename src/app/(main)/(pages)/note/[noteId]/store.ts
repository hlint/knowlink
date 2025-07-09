import { createZustandStore } from "@/lib/create-store";
import type { Note } from "@prisma/client";
import type { Category } from "@prisma/client";
import type { Subcategory } from "@prisma/client";

type PageNoteStore = {
  note: Note | null;
  category: Category | null;
  subcategory: Subcategory | null;
  codeMode: boolean;
};

const initialState: PageNoteStore = {
  note: null,
  category: null,
  subcategory: null,
  codeMode: false,
};

export const usePageNoteStore = createZustandStore(initialState, (set) => ({
  actions: {
    setValues: (values: Partial<PageNoteStore>) => {
      set((d) => {
        Object.assign(d, values);
      });
    },
  },
}));
