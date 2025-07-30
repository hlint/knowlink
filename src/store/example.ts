import { createZustandStore } from "@/lib/create-zustand-store";

export const useExampleStore = createZustandStore({ count: 0 }, (set) => ({
  actions: {
    add: () => {
      set((d) => d.count++);
    },
  },
}));
