"use client";
import { useMainLayoutStore } from "@/app/(main)/(pages)/(layout)/store";
import { useLayoutEffect } from "react";

export function HomeEffect() {
  const setMainLayoutValues = useMainLayoutStore((s) => s.actions.setValues);
  useLayoutEffect(() => {
    setMainLayoutValues({
      pageType: "home",
      breadcrumbItems: [{ name: "Home" }],
    });
    return () => {
      setMainLayoutValues({
        pageType: "null",
        breadcrumbItems: [],
      });
    };
  }, [setMainLayoutValues]);
  return null;
}
