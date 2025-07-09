import { fetcherGetEntryByName } from "@/app/(main)/fetchers/miscs";

export async function fetcherGetScratchpad() {
  const scratchpad = await fetcherGetEntryByName("scratchpad");
  return scratchpad;
}
