"use client";

import { useLayoutEffect, useState } from "react";
import useSkinStore from "./store";
import { getSkinStyles } from "./utils/get-skin-styles";

export function SkinStyle({ defaultSkin }: { defaultSkin: string }) {
  const [currentSkin] = useState(defaultSkin);
  const storeSkin = useSkinStore((s) => s.skin);
  const setSkin = useSkinStore((s) => s.actions.setSkin);
  useLayoutEffect(() => {
    setSkin(defaultSkin);
  }, [defaultSkin, setSkin]);
  return (
    <style id="skin-style">{getSkinStyles(storeSkin || currentSkin)}</style>
  );
}
