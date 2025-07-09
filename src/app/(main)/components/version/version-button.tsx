"use client";

import { Badge } from "@/components/ui/badge";
import { useNoteVersionStore } from "./store";

export default function VersionButton() {
  const versionCount = useNoteVersionStore((s) => s.versionCount);
  const { setValues } = useNoteVersionStore((s) => s.actions);
  return (
    <Badge variant="secondary" asChild className="cursor-pointer">
      <button
        type="button"
        onClick={() => setValues({ modalOpen: true, isCreateMode: true })}
      >
        {versionCount} versions
      </button>
    </Badge>
  );
}
