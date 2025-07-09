import { useLayoutEffect } from "react";
import { useMainLayoutStore } from "../(layout)/store";

export default function useAccountLayoutEffect() {
  const setValues = useMainLayoutStore((s) => s.actions.setValues);
  useLayoutEffect(() => {
    setValues({
      pageType: "account",
      breadcrumbItems: [{ name: "Account" }],
    });
    return () => {
      setValues({
        pageType: "null",
        breadcrumbItems: [],
      });
    };
  }, [setValues]);
}
