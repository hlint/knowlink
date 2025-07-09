import { Skeleton } from "@/components/ui/skeleton";
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import { formatDistance } from "date-fns";
import VersionBodyDiff from "./checkout-version";
import { CreateVersionBody, CreateVersionButton } from "./create-version";
import { useNoteVersionStore } from "./store";
import VersionItem from "./version-item";

const containerClassName =
  "w-full h-screen max-h-[calc(100vh-18rem)] flex flex-row gap-6 items-stretch";

export default function DialogBody() {
  const isCreateMode = useNoteVersionStore((s) => s.isCreateMode);
  const noteCreatedAt = useNoteVersionStore((s) => s.noteCreatedAt);
  const versionList = useNoteVersionStore((s) => s.versionList);
  const currentVersionId = useNoteVersionStore((s) => s.currentVersionId);
  const currentVersionIndex = versionList.findIndex(
    (v) => v.id === currentVersionId,
  );
  return (
    <div className={containerClassName}>
      <div className="overflow-auto w-[200px] shrink-0 sm:block hidden">
        <Timeline
          value={isCreateMode ? 0 : currentVersionIndex + 1}
          className=""
        >
          <CreateVersionButton />
          {versionList.map((v, index) => (
            <VersionItem key={v.id} v={v} index={index + 1} />
          ))}
          <TimelineItem step={versionList.length + 1}>
            <TimelineHeader>
              <TimelineSeparator />
              <TimelineTitle className="-mt-0.5">Note Created</TimelineTitle>
              <TimelineIndicator />
            </TimelineHeader>
            <TimelineContent>
              {formatDistance(noteCreatedAt, new Date())} ago
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>
      <div className="grow overflow-auto text-sm">
        <VersionBody />
      </div>
    </div>
  );
}

export function DialogBodyLoading() {
  return (
    <div className={containerClassName}>
      <Skeleton className="w-[200px] sm:block hidden" />
      <div className="grow flex flex-col gap-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}

function VersionBody() {
  const versionBodyLoading = useNoteVersionStore((s) => s.versionBodyLoading);
  const isCreateMode = useNoteVersionStore((s) => s.isCreateMode);
  if (versionBodyLoading) {
    return (
      <div className="grow flex flex-col gap-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-40" />
      </div>
    );
  }
  return isCreateMode ? <CreateVersionBody /> : <VersionBodyDiff />;
}
