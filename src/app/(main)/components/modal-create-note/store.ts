import { createZustandStore } from "@/lib/create-zustand-store";

const initialState: {
  open: boolean;
  subcategoryId: string | null;
  subcategoryName: string | null;
} = {
  open: false,
  subcategoryId: null,
  subcategoryName: null,
};

export const useModalCreateNoteStore = createZustandStore(
  initialState,
  (set) => ({
    actions: {
      openModalCreateNote: (
        subcategoryId: string | null,
        subcategoryName: string | null,
      ) => set({ open: true, subcategoryId, subcategoryName }),
      close: () => set({ open: false }),
    },
  }),
);
