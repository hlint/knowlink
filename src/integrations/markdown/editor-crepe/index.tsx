"use client";
import type { ComponentProps } from "react";
import { ErrorBoundary } from "react-error-boundary";
import EditorCrepeRaw from "./editor";

export default function EditorCrepe(
  props: ComponentProps<typeof EditorCrepeRaw>,
) {
  return (
    <ErrorBoundary
      fallback={
        <div className="prose prose-sm">
          <h2>Error loading editor</h2>
          <p>It may be caused by the following reasons:</p>
          <ul>
            <li>The editor is not supported in your browser.</li>
            <li>Unsupported content detected.</li>
            <li>Content is too large.</li>
          </ul>
        </div>
      }
    >
      <EditorCrepeRaw {...props} />
    </ErrorBoundary>
  );
}
