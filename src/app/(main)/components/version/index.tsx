"use client";

import { useLayoutEffect } from "react";
import VersionModal from "./modal";
import { useNoteVersionStore } from "./store";
import VersionButton from "./version-button";

export default function NoteVersionComponent({ noteId }: { noteId: string }) {
  const { setValues, reload } = useNoteVersionStore((s) => s.actions);
  useLayoutEffect(() => {
    setValues({ noteId });
    reload();
  }, [setValues, reload, noteId]);
  return (
    <>
      <VersionButton />
      <VersionModal />
    </>
  );
}
