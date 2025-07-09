"use client";
import { useMainLayoutStore } from "@/app/(main)/(pages)/(layout)/store";
import { useLayoutEffect } from "react";
import type { CategoryWithSubs } from "../../fetchers/category";

export function LayoutEffect({
  categories,
}: { categories: CategoryWithSubs[] }) {
  const setValues = useMainLayoutStore((s) => s.actions.setValues);
  useLayoutEffect(() => {
    setValues({
      categories,
    });
  }, [categories, setValues]);
  return null;
}
