import { RootLayoutContext } from "@/components/app/rootLayout/rootLayout";
import { useContext } from "react";

export default function useRootLayout() {
  const context = useContext(RootLayoutContext);
  if (!context) {
    throw new Error("useRootLayout must be used within a RootLayoutContext");
  }
  return context;
}
