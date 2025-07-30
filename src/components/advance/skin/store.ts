import { createZustandStore } from "@/lib/create-zustand-store";

const useSkinStore = createZustandStore({ skin: "" }, (set) => ({
  actions: {
    setSkin: (skin: string) => {
      set({ skin });
    },
  },
}));

export default useSkinStore;
