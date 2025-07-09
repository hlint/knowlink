import Cookies from "js-cookie";
import { useTheme as useNextTheme } from "next-themes";
import { useCallback, useEffect } from "react";
import useRootLayout from "./use-root-layout";

type Theme = "light" | "dark" | "system";
const cookieName1 = "app_theme";
const cookieName2 = "app_theme_resolved";

export default function useTheme() {
  // load defaultTheme from SSR layout context
  const { defaultTheme, defaultThemeResolved } = useRootLayout();
  const { theme, resolvedTheme, setTheme } = useNextTheme();
  const setThemeFixed = useCallback(
    (theme: Theme) => {
      setTheme(theme);
      // save cookie for SSR
      Cookies.set(cookieName1, theme, {
        expires: 365,
      });
    },
    [setTheme],
  );
  return {
    theme: (theme ?? defaultTheme) as Theme,
    resolvedTheme: (resolvedTheme ?? defaultThemeResolved) as "light" | "dark",
    setTheme: setThemeFixed,
  };
}

export function useListenThemeResolved() {
  const { resolvedTheme } = useNextTheme();
  useEffect(() => {
    if (resolvedTheme) {
      Cookies.set(cookieName2, resolvedTheme, {
        expires: 365,
      });
    }
  }, [resolvedTheme]);
}
