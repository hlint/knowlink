import IllustrationComponent from "@/app/(main)/components/illustration";
import ScratchpadPageClient from "./client";
import { fetcherGetScratchpad } from "./fetchers";

export const metadata = {
  title: "Scratchpad | Knowlink",
};

export default async function ScratchpadPage() {
  const scratchpad = await fetcherGetScratchpad();
  return (
    <div className="flex w-full max-w-screen-lg flex-1 flex-col gap-4 p-4">
      <IllustrationComponent name="A scratchpad on a desk" />
      <ScratchpadPageClient scratchpad={scratchpad} />
    </div>
  );
}
