"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import styles from "./styles.module.css";

export default function DiffViewer({
  className,
  ...props
}: ComponentProps<typeof ReactDiffViewer> & { className?: string }) {
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();
  return (
    <div className={cn(styles.wrapper, className)}>
      <ReactDiffViewer
        useDarkTheme={resolvedTheme === "dark"}
        splitView={!isMobile}
        compareMethod={DiffMethod.WORDS}
        disableWordDiff={false}
        {...props}
      />
    </div>
  );
}
