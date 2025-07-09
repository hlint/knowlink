import { prisma } from "@/lib/prisma";

export async function fetcherGetEntryByName(name: string) {
  const record = await prisma.entry.findUnique({
    where: {
      name,
    },
  });
  return record;
}

export async function fetcherGetScratchpad() {
  const scratchpad = await fetcherGetEntryByName("scratchpad");
  return scratchpad;
}
