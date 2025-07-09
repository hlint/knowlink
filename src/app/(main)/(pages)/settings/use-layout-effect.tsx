import { useLayoutEffect } from "react";
import { useMainLayoutStore } from "../(layout)/store";

export default function useSettingsLayoutEffect() {
  const setValues = useMainLayoutStore((s) => s.actions.setValues);
  useLayoutEffect(() => {
    setValues({
      pageType: "settings",
      breadcrumbItems: [{ name: "Settings" }],
    });
    return () => {
      setValues({
        pageType: "null",
        breadcrumbItems: [],
      });
    };
  }, [setValues]);
}
