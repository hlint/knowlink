import { createZustandStoreProvider } from "@/lib/create-store";

const initialState: {
  subcategoryId: string | null;
  subcategoryName: string | null;
  searchOnly: boolean;
} = {
  subcategoryId: null,
  subcategoryName: null,
  searchOnly: false,
};

export const { useStore, StoreProvider } = createZustandStoreProvider(
  initialState,
  () => {
    return {
      actions: {},
    };
  },
);
