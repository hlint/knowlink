import { useEffect } from "react";
import { useRefValue } from "./use-ref-value";

export default function usePageFocus(onFocus: () => void) {
  const refOnFocus = useRefValue(onFocus);
  useEffect(() => {
    const listener = () => refOnFocus.current?.();
    window.addEventListener("focus", listener);
    return () => {
      window.removeEventListener("focus", listener);
    };
  }, [refOnFocus]);
}
