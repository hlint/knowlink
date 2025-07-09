"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatabaseIcon, ServerIcon, SparkleIcon, SunIcon } from "lucide-react";
import type { Configs } from "../../schema/configs";
import { SettingsProvider } from "./context";
import TabAiInstruction from "./tab-ai-instruction";
import TabAppearance from "./tab-appearance";
import TabData from "./tab-data";
import TabServices from "./tab-services";
import useSettingsLayoutEffect from "./use-layout-effect";

export default function SettingsPageClient({
  aiInstructions,
  configs,
}: {
  aiInstructions: string;
  configs: Configs;
}) {
  useSettingsLayoutEffect();
  return (
    <SettingsProvider aiInstructions={aiInstructions} configs={configs}>
      <Tabs defaultValue="tab-1" className="">
        <TabsList className="gap-1 bg-transparent [&_svg]:hidden sm:[&_svg]:block">
          <TabButton value="tab-1">
            <SunIcon size={16} aria-hidden="true" />
            Theme
          </TabButton>
          <TabButton value="tab-2">
            <ServerIcon size={16} aria-hidden="true" />
            Services
          </TabButton>
          <TabButton value="tab-3">
            <SparkleIcon size={16} aria-hidden="true" />
            AI Instructions
          </TabButton>
          <TabButton value="tab-4">
            <DatabaseIcon size={16} aria-hidden="true" />
            Data
          </TabButton>
        </TabsList>
        <div className="grow text-start">
          <TabsContent value="tab-1">
            <TabAppearance />
          </TabsContent>
          <TabsContent value="tab-2">
            <TabServices />
          </TabsContent>
          <TabsContent value="tab-3">
            <TabAiInstruction />
          </TabsContent>
          <TabsContent value="tab-4">
            <TabData />
          </TabsContent>
        </div>
      </Tabs>
    </SettingsProvider>
  );
}

function TabButton({
  children,
  value,
}: { children: React.ReactNode; value: string }) {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
    >
      {children}
    </TabsTrigger>
  );
}
