import createReactContextProvider from "@/lib/create-react-context-provider";
import type { Configs } from "../../schema/configs";

export const { Provider: SettingsProvider, useContext: useSettingsContext } =
  createReactContextProvider({
    aiInstructions: "",
    configs: {} as Configs,
  });
