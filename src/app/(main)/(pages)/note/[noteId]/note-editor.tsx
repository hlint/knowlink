"use client";
import { usePageNoteStore } from "@/app/(main)/(pages)/note/[noteId]/store";
import NoteMoreForm from "@/app/(main)/components/note-more-form";
import revalidatePathClient from "@/app/actions";
import { useProgressNavigate } from "@/components/advance/progress-bar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import EditorCodemirror from "@/integrations/markdown/editor-codemirror";
import { useRefCtrl as useRefCtrlCodemirror } from "@/integrations/markdown/editor-codemirror";
import EditorCrepe from "@/integrations/markdown/editor-crepe";
import { useRefCtrl as useRefCtrlCrepe } from "@/integrations/markdown/editor-crepe/editor";
import MarkdownPreview from "@/integrations/markdown/markdown-preview";
import type { Note } from "@prisma/client";
import { useUpdateEffect } from "ahooks";
import { CodeIcon } from "lucide-react";
import { debounce } from "radashi";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { actionUpdateNote } from "../../../actions/note";
import NoteInfo from "./note-info";

const actionUpdateNoteDebounced = debounce(
  {
    delay: 1000,
    leading: true,
  },
  actionUpdateNote,
);

export default function NoteEditor({
  note,
  illustrationComponent,
}: { note: Note; illustrationComponent: ReactNode }) {
  return (
    <div className="note-body flex w-full max-w-screen-lg flex-1 flex-col gap-0 p-4">
      {illustrationComponent}
      <MetaEditor note={note} />
      <NoteInfo note={note} />
      <ContentEditor note={note} />
    </div>
  );
}

function ContentEditor({ note }: { note: Note }) {
  const refCtrlCrepe = useRefCtrlCrepe();
  const refCtrlCodemirror = useRefCtrlCodemirror();
  const codeMode = usePageNoteStore((s) => s.codeMode);
  useEffect(() => {
    if (refCtrlCrepe.current) {
      refCtrlCrepe.current.setMarkdown(note.content);
    }
    if (refCtrlCodemirror.current) {
      refCtrlCodemirror.current.setInnerValue(note.content);
    }
  }, [note.content, refCtrlCrepe, refCtrlCodemirror]);
  const handleChange = useCallback(
    (content: string) => {
      actionUpdateNote({
        id: note.id,
        content,
        noRevalidate: true,
      }).catch((error) => {
        toast.error(error instanceof Error ? error.message : "Unknown error");
      });
    },
    [note.id],
  );
  useUpdateEffect(() => {
    revalidatePathClient();
  }, [codeMode]);
  if (codeMode) {
    return (
      <>
        <EditorCodemirror
          className="px-0 sm:px-16 mt-2"
          defaultValue={note.content}
          onChange={handleChange}
          onChangeDebounceDelay={500}
          refCtrl={refCtrlCodemirror}
          enableAiEnhancer
        />
        <MarkdownPreview text={note.content} className="hidden" />
      </>
    );
  }
  return (
    <EditorCrepe
      refCtrl={refCtrlCrepe}
      defaultValue={note.content}
      onChange={handleChange}
      onChangeDebounceDelay={500}
    />
  );
}

function MetaEditor({ note }: { note: Note }) {
  const [title, setTitle] = useState(note.title);
  const navigate = useProgressNavigate();
  const codeMode = usePageNoteStore((s) => s.codeMode);
  const setValues = usePageNoteStore((s) => s.actions.setValues);
  useEffect(() => {
    setTitle(note.title);
  }, [note.title]);
  return (
    <div className="px-0 sm:px-20 sm:pt-2 space-y-0">
      <div className="flex items-start gap-1 relative">
        {/* biome-ignore lint/a11y/useHeadingContent: <explanation> */}
        <h1
          className="pointer-events-none absolute top-0 left-0 opacity-0"
          aria-hidden
        >
          {note.title}
        </h1>
        <Textarea
          className="px-0 text-2xl md:text-4xl dark:bg-transparent border-0 resize-none rounded-none focus-visible:ring-0"
          minRows={1}
          placeholder="Title"
          value={title}
          onChange={(e) => {
            const newTitle = (e.target as HTMLTextAreaElement).value;
            setTitle(newTitle);
            actionUpdateNoteDebounced({
              id: note.id,
              title: newTitle,
            });
          }}
        />
        <div className="relative top-1 sm:top-1 flex items-center gap-2">
          <Button
            size="iconSm"
            variant={codeMode ? "default" : "ghost"}
            onClick={() => {
              setValues({
                codeMode: !codeMode,
              });
            }}
          >
            <CodeIcon className={"size-4"} />
          </Button>

          <NoteMoreForm
            note={note}
            onDelete={() => {
              navigate("/quick-access/recycle-bin", true);
            }}
          />
        </div>
      </div>
      {note.link ? (
        <a
          href={note.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-4 hover:underline line-clamp-2 break-all"
        >
          {note.link}
        </a>
      ) : null}
    </div>
  );
}
