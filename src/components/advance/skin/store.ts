import { createZustandStore } from "@/lib/create-store";

const useSkinStore = createZustandStore({ skin: "" }, (set) => ({
  actions: {
    setSkin: (skin: string) => {
      set({ skin });
    },
  },
}));

export default useSkinStore;
