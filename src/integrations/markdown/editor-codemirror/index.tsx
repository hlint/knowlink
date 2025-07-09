"use client";
import { aiEnhancer } from "@yuri2/codemirror-ai-enhancer";
import "@yuri2/codemirror-ai-enhancer/styles.css";
import useTheme from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { keymap } from "@codemirror/view";
import { basicSetup } from "@uiw/codemirror-extensions-basic-setup";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { debounce } from "radashi";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { aiEnhancerConfig } from "./features/ai-enhancer-config";
import styles from "./styles.module.css";

export function useRefCtrl() {
  const refCtrl = useRef<{
    setInnerValue: (markdown: string) => void;
  }>(null);
  return refCtrl;
}

export default function EditorCodemirror({
  value,
  defaultValue,
  onChange,
  className,
  onChangeDebounceDelay = 0,
  enableAiEnhancer = false,
  language = "markdown",
  theme = "auto",
  refCtrl,
}: {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  language?: Parameters<typeof loadLanguage>[0];
  theme?: "dark" | "light" | "auto";
  onChangeDebounceDelay?: number;
  enableAiEnhancer?: boolean;
  refCtrl?: RefObject<{
    setInnerValue: (markdown: string) => void;
  } | null>;
}) {
  const { resolvedTheme } = useTheme();
  const [content, setContent] = useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const refOnChange = useRef(onChange);
  refOnChange.current = onChange;
  const handleChangeFixed = useMemo(() => {
    const delay = onChangeDebounceDelay ?? 0;
    const handleChange = (text: string) => {
      refOnChange.current?.(text);
    };
    return delay > 0 ? debounce({ delay }, handleChange) : handleChange;
  }, [onChangeDebounceDelay]);
  const themeUsed = useMemo(() => {
    if (theme === "auto") {
      return resolvedTheme === "dark" ? "dark" : "light";
    }
    return theme;
  }, [theme, resolvedTheme]);
  useEffect(() => {
    if (!refCtrl) return;
    refCtrl.current = {
      setInnerValue: (text) => {
        setContent(text);
      },
    };
    return () => {
      refCtrl.current = null;
    };
  }, [refCtrl]);
  return (
    <CodeMirror
      value={isControlled ? value : content}
      onChange={(text) => {
        if (!isControlled) {
          setContent(text);
        }
        handleChangeFixed(text);
      }}
      className={cn(styles.editor, className)}
      extensions={[
        basicSetup({
          foldGutter: false,
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: true,
        }),
        EditorView.lineWrapping,
        keymap.of(defaultKeymap.concat(indentWithTab)),
        themeUsed === "dark" ? vscodeDark : vscodeLight,
        loadLanguage(language)!,
        enableAiEnhancer ? aiEnhancer(aiEnhancerConfig) : [],
      ]}
    />
  );
}
