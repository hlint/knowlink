import {
  fetcherGetAssistantPrompt,
  fetcherGetConfigs,
  fetcherGetWritingPrompt,
} from "@/app/(main)/fetchers/configs";
import SettingsPageClient from "./client";

export const metadata = {
  title: "Settings | Knowlink",
};

export default async function SettingsPage() {
  const assistantPrompt = await fetcherGetAssistantPrompt();
  const writingPrompt = await fetcherGetWritingPrompt();
  const configs = await fetcherGetConfigs();
  return (
    <div className="flex w-full max-w-screen-lg flex-1 flex-col gap-4 p-4">
      <SettingsPageClient
        assistantPrompt={assistantPrompt}
        writingPrompt={writingPrompt}
        configs={configs}
      />
    </div>
  );
}
