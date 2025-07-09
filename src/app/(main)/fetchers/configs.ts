import { prisma } from "@/lib/prisma";
import {
  type Configs,
  ConfigsSchema,
  getDefaultConfigs,
} from "../schema/configs";
import { fetcherGetEntryByName } from "./miscs";

export async function fetcherGetAiInstructions() {
  const aiInstructions = await fetcherGetEntryByName("ai_instructions");
  return aiInstructions?.content ?? "";
}

export async function fetcherGetConfigs() {
  const configItems = await prisma.entry.findMany({
    where: {
      type: "config",
    },
  });
  const defaultConfigs: Configs = getDefaultConfigs();
  const configs = configItems.reduce((acc, item) => {
    acc[item.name as keyof Configs] = item.content;
    return acc;
  }, defaultConfigs);
  return ConfigsSchema.parse(configs);
}

export async function fetcherGetConfig(name: keyof Configs) {
  const configItem = await prisma.entry.findFirst({
    where: {
      name,
      type: "config",
    },
  });
  const defaultConfigs: Configs = getDefaultConfigs();
  return configItem?.content ?? defaultConfigs[name];
}
