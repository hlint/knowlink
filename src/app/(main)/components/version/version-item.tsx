import {
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import { formatDistance } from "date-fns";
import type { VersionListItem } from "./actions";
import { useNoteVersionStore } from "./store";

export default function VersionItem({
  v,
  index,
}: { v: VersionListItem; index: number }) {
  const { setCurrentVersionContent } = useNoteVersionStore((s) => s.actions);
  const message = v.message || "No message";
  return (
    <TimelineItem
      step={index}
      className="cursor-pointer"
      onClick={() => {
        setCurrentVersionContent(v.id);
      }}
    >
      <TimelineHeader>
        <TimelineSeparator />
        <TimelineTitle className="-mt-0.5">{message}</TimelineTitle>
        <TimelineIndicator />
      </TimelineHeader>
      <TimelineContent>
        {" "}
        {formatDistance(v.createdAt, new Date())} ago
      </TimelineContent>
    </TimelineItem>
  );
}
