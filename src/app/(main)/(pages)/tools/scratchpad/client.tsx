"use client";
import { useMainLayoutStore } from "@/app/(main)/(pages)/(layout)/store";
import EditorCrepe from "@/integrations/markdown/editor-crepe";
import type { Entry } from "@prisma/client";
import { PencilIcon } from "lucide-react";
import { useLayoutEffect } from "react";
import { actionSetScratchpadContent } from "./actions";

export default function ScratchpadPageClient({
  scratchpad,
}: {
  scratchpad: Entry | null;
}) {
  const setValues = useMainLayoutStore((s) => s.actions.setValues);
  useLayoutEffect(() => {
    setValues({
      pageType: "scratchpad",
      breadcrumbItems: [
        { name: "Tools" },
        { name: "Scratchpad", icon: <PencilIcon className="size-4" /> },
      ],
    });
    return () => {
      setValues({
        pageType: "null",
        breadcrumbItems: [],
      });
    };
  }, [setValues]);
  return (
    <>
      <EditorCrepe
        defaultValue={scratchpad?.content || ""}
        onChange={(content) => {
          actionSetScratchpadContent(content);
        }}
      />
    </>
  );
}
