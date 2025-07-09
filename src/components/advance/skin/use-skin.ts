import useSkinStore from "@/components/advance/skin/store";
import Cookies from "js-cookie";
import { useCallback } from "react";

export function useSkin() {
  const skin = useSkinStore((s) => s.skin);
  const setSkin = useSkinStore((s) => s.actions.setSkin);
  const setSkinFixed = useCallback(
    (newSkin: string) => {
      setSkin(newSkin);
      Cookies.set("app_skin", newSkin, {
        expires: 365,
      });
    },
    [setSkin],
  );
  return { skin, setSkin: setSkinFixed };
}
