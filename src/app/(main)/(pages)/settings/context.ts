import createReactContextProvider from "@/lib/create-react-context-provider";
import type { Configs } from "../../schema/configs";

export const { Provider: SettingsProvider, useContext: useSettingsContext } =
  createReactContextProvider({
    assistantPrompt: "",
    writingPrompt: "",
    configs: {} as Configs,
  });
