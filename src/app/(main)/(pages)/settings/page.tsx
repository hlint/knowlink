import {
  fetcherGetAiInstructions,
  fetcherGetConfigs,
} from "@/app/(main)/fetchers/configs";
import IllustrationComponent from "../../components/illustration";
import SettingsPageClient from "./client";

export const metadata = {
  title: "Settings | Knowlink",
};

export default async function SettingsPage() {
  const aiInstructions = await fetcherGetAiInstructions();
  const configs = await fetcherGetConfigs();
  return (
    <div className="flex w-full max-w-screen-lg flex-1 flex-col gap-4 p-4">
      <IllustrationComponent name="Settings, options, tools" />
      <SettingsPageClient aiInstructions={aiInstructions} configs={configs} />
    </div>
  );
}
