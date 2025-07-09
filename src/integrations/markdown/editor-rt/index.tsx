"use client";
// https://github.com/imzbf/md-editor-rt
import "md-editor-rt/lib/style.css";
import "@yuri2/codemirror-ai-enhancer/styles.css";
import "@vavt/rt-extension/lib/asset/style.css";
import "./config"; // global config
import { useIsMobile } from "@/hooks/use-mobile";
import useTheme from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { Emoji } from "@vavt/rt-extension";
import { type ExposeParam, MdEditor, type ToolbarNames } from "md-editor-rt";
import { useEffect, useMemo, useRef } from "react";
import { ToolbarFileUpload } from "./def-tools/file-upload";
import customTheme from "./themes/custom.module.css";
import { handleDrop, handleUploadFiles } from "./utils";

export default function EditorRt({
  value,
  onChange,
  onSave,
  className,
}: {
  value?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  className?: string;
}) {
  const refEditor = useRef<ExposeParam>(null);
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();
  const defToolbars = useMemo(() => {
    return [
      <Emoji key="Emoji" title="Emoji" />,
      <ToolbarFileUpload key="FileUpload" refEditor={refEditor} />,
    ];
  }, []);
  const toolbars: ToolbarNames[] = useMemo(() => {
    if (isMobile) {
      return [
        "bold",
        "unorderedList",
        1,
        "-",
        "revoke",
        "next",
        "=",
        "previewOnly",
      ];
    }
    return [
      "bold",
      "underline",
      "strikeThrough",
      "quote",
      "unorderedList",
      0,
      "-",
      "image",
      1,
      "table",
      "mermaid",
      "-",
      "revoke",
      "next",
      "=",
      "pageFullscreen",
      "preview",
      "previewOnly",
      "catalog",
    ];
  }, [isMobile]);
  useEffect(() => {
    const editor = refEditor.current;
    if (!editor) return;
    if (isMobile) {
      editor.togglePreview(false);
      editor.toggleCatalog(false);
    } else {
      editor.togglePreview(true);
      editor.toggleCatalog(true);
    }
  }, [isMobile]);
  return (
    <MdEditor
      ref={refEditor}
      value={value}
      onChange={onChange}
      onSave={onSave}
      language="en-US"
      theme={resolvedTheme}
      toolbars={toolbars}
      className={cn(customTheme.editor, className)}
      autoDetectCode
      catalogLayout="flat"
      onUploadImg={handleUploadFiles}
      showCodeRowNumber
      defToolbars={defToolbars}
      onDrop={(e) => {
        e.preventDefault();
        const files = e?.dataTransfer?.files;
        if (!files) return;
        handleDrop({ refEditor, files: Array.from(files) });
      }}
    />
  );
}
