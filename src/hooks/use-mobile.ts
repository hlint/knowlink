import * as React from "react";
import { useLayoutEffect } from "react";
import useRootLayout from "./use-root-layout";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const { defaultIsMobile } = useRootLayout();
  const [isMobile, setIsMobile] = React.useState<boolean>(defaultIsMobile);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

export function useListenMobile() {
  const isMobile = useIsMobile();
  useLayoutEffect(() => {
    if (isMobile) {
      document.body.classList.add("is-mobile");
    } else {
      document.body.classList.remove("is-mobile");
    }
  }, [isMobile]);
}
