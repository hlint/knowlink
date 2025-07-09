import { createZustandStore } from "@/lib/create-store";

type AppStore = {
  placeholder: string;
};

const initialState: AppStore = {
  placeholder: "",
};

export const useAppStore = createZustandStore(initialState, (set) => ({
  actions: {
    setValues: (values: Partial<AppStore>) => {
      set((d) => {
        Object.assign(d, values);
      });
    },
  },
}));
