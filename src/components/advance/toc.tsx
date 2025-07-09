"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Toc({
  className = "",
  selector = "",
  blacklistSelector = "",
}: { className?: string; selector?: string; blacklistSelector?: string }) {
  const [headings, setHeadings] = useState<Element[]>([]);
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const selectorBuilder = (s: string) =>
        Array.from({
          length: 6,
        })
          .map((_, i) => `${s} h${i + 1}`)
          .join(", ");
      const headingElements = document.querySelectorAll(
        selectorBuilder(selector),
      );
      const blacklistElements = document.querySelectorAll(
        selectorBuilder(blacklistSelector),
      );
      setHeadings(
        Array.from(headingElements).filter(
          (t) => !Array.from(blacklistElements).includes(t),
        ),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [selector, blacklistSelector]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setCurrent(headings.indexOf(entry.target as Element));
            break;
          }
        }
      },
      { rootMargin: "-100px 0px 0px 0px", threshold: 0 },
    );

    for (const heading of headings) {
      observer.observe(heading);
    }

    return () => observer.disconnect();
  }, [headings]);
  return (
    <div
      className={cn(
        "hidden xl:flex sticky top-16 mt-4 z-10 w-[240px] shrink-0 h-fit flex-col gap-1",
        className,
      )}
    >
      {headings.map((el, index) => (
        <TocItem
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          text={el.textContent?.trim() || "Untitled"}
          level={Number(el.tagName[1])}
          el={el}
          active={index === current}
        />
      ))}
    </div>
  );
}

function TocItem({
  text,
  level,
  active,
  el,
}: {
  text: string;
  level: number;
  active: boolean;
  el: Element;
}) {
  return (
    <button
      type="button"
      style={{
        marginLeft: `${(level - 1) * 12}px`,
      }}
      className={cn(
        "text-sm text-start cursor-pointer hover:underline truncate",
        active
          ? "text-foreground font-bold"
          : "text-muted-foreground font-normal",
      )}
      onClick={() => {
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }}
    >
      {text}
    </button>
  );
}
