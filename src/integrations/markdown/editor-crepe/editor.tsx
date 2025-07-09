"use client";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/nord.css";
import "./styles.css";
import { useRefValue } from "@/hooks/use-ref-value";
import useTheme from "@/hooks/use-theme";
// import { uploadFile } from "@/lib/file.client";
import { cn } from "@/lib/utils";
import { Crepe } from "@milkdown/crepe";
import { editorViewCtx, parserCtx } from "@milkdown/kit/core";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { upload, uploadConfig } from "@milkdown/kit/plugin/upload";
import { type Node as ProseNode, Slice } from "@milkdown/kit/prose/model";
import { Selection } from "@milkdown/kit/prose/state";
import { remarkPreserveEmptyLinePlugin } from "@milkdown/preset-commonmark";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { debounce, throttle } from "radashi";
import {
  type FC,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { toast } from "sonner";
import { uploadWidgetFactory } from "./upload-widget-factory";
import { callUploadFiles } from "./upload/call-upload-files";
import { filesUploader } from "./upload/files-uploader";
import { iconUpload } from "./upload/icon";
import { convertToCompactList } from "./utils";

interface MilkdownProps {
  defaultValue?: string;
  onChange?: (markdown: string) => void;
  onTocChange?: (toc: { text: string; level: number; domId: string }[]) => void;
  className?: string;
  onChangeDebounceDelay?: number;
  refCtrl?: RefObject<{
    getCrepe: () => Crepe;
    setMarkdown: (markdown: string) => void;
  } | null>;
}

export function useRefCtrl() {
  const refCtrl = useRef<{
    getCrepe: () => Crepe;
    setMarkdown: (markdown: string) => void;
  }>(null);
  return refCtrl;
}

const EditorCrepe: FC<MilkdownProps> = ({
  onChange = () => {},
  onTocChange = () => {},
  refCtrl,
  defaultValue = "",
  className,
  onChangeDebounceDelay = 500,
}) => {
  const crepeRef = useRef<Crepe>(null);
  const { resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === "dark";
  const divRef = useRef<HTMLDivElement>(null);
  const loading = useRef(false);
  const refDefaultContent = useRef<string>(defaultValue);
  const refOnChange = useRefValue(onChange);
  const refOnTocChange = useRefValue(onTocChange);
  const setMarkdown = useCallback((markdown: string) => {
    const crepe = crepeRef.current;
    if (!crepe) return;
    crepe.editor.action((ctx) => {
      const view = ctx.get(editorViewCtx);
      const parser = ctx.get(parserCtx);
      const doc = parser(markdown);
      if (!doc) return;
      const state = view.state;
      const selection = state.selection;
      const { from } = selection;
      let tr = state.tr;
      tr = tr.replace(0, state.doc.content.size, new Slice(doc.content, 0, 0));
      const newDocSize = tr.doc.content.size;
      const safeFrom = Math.min(from, newDocSize);
      tr = tr.setSelection(Selection.near(tr.doc.resolve(safeFrom)));
      view.dispatch(tr);
    });
  }, []);
  const getCrepe = useCallback(() => {
    return crepeRef.current!;
  }, []);
  useEffect(() => {
    if (!refCtrl) return;
    refCtrl.current = {
      getCrepe,
      setMarkdown,
    };
    return () => {
      refCtrl.current = null;
    };
  }, [getCrepe, setMarkdown, refCtrl]);
  useLayoutEffect(() => {
    if (!divRef.current || loading.current) return;

    loading.current = true;
    const crepe = new Crepe({
      root: divRef.current,
      defaultValue: refDefaultContent.current,
      features: {
        [Crepe.Feature.ImageBlock]: false,
      },
      featureConfigs: {
        [Crepe.Feature.CodeMirror]: {
          theme: darkMode ? vscodeLight : vscodeDark,
        },
        [Crepe.Feature.LinkTooltip]: {
          onCopyLink: () => {
            toast.success("Link copied");
          },
        },
        // [Crepe.Feature.ImageBlock]: {
        //   async onUpload(file) {
        //     const res = await uploadFile(file);
        //     return res.url;
        //   },
        // },
        [Crepe.Feature.BlockEdit]: {
          callUploadFiles,
          slashMenuUploadFilesIcon: iconUpload,
          slashMenuUploadFilesLabel: "Upload Files",
          // biome-ignore lint/suspicious/noExplicitAny: Hack to implement the upload files feature
        } as any,
      },
    });
    const handleTocChange = throttle(
      { interval: 200, trailing: true },
      (doc: ProseNode) => {
        const toc: { text: string; level: number; domId: string }[] = [];
        doc.descendants((node) => {
          if (node.type.name === "heading" && node.attrs.level) {
            toc.push({
              text: node.textContent,
              level: node.attrs.level,
              domId: node.textContent.toLowerCase().replace(/ /g, "-"),
            });
          }
        });
        refOnTocChange.current(toc);
      },
    );
    crepe.editor.remove(remarkPreserveEmptyLinePlugin);
    crepe.editor
      .config((ctx) => {
        ctx.get(listenerCtx).markdownUpdated(
          debounce({ delay: onChangeDebounceDelay }, (_, markdown) => {
            refOnChange.current(convertToCompactList(markdown));
          }),
        );
        ctx.get(listenerCtx).mounted((ctx) => {
          const doc = ctx.get(editorViewCtx).state.doc;
          handleTocChange(doc);
        });
        ctx.get(listenerCtx).updated((_, doc) => {
          handleTocChange(doc);
        });
        ctx.update(uploadConfig.key, (prev) => ({
          ...prev,
          uploader: filesUploader,
          enableHtmlFileUploader: true,
          uploadWidgetFactory,
        }));
      })
      .use(upload)
      .use(listener);

    crepe.create().then(() => {
      (crepeRef as RefObject<Crepe>).current = crepe;
      loading.current = false;
    });
    return () => {
      if (loading.current) return;
      crepe.destroy();
    };
    // Should keep dependencies unmutable to avoid re-creating the editor
  }, [darkMode, refOnChange, refOnTocChange, onChangeDebounceDelay]);

  return (
    <div
      className={cn(
        "crepe flex h-full flex-1 flex-col",
        "custom-crepe-editor",
        className,
      )}
      ref={divRef}
    />
  );
};

export default EditorCrepe;
