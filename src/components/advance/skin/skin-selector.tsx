"use client";
import { Button } from "@/components/ui/button";
import useTheme from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { skins } from "./skins";
import { useSkin } from "./use-skin";
import { colorFormatter } from "./utils/color-converter";

export function SkinSelector() {
  const { skin: skinName, setSkin } = useSkin();
  const { resolvedTheme } = useTheme();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {skins.map((t) => (
        <SkinItem
          key={t.name}
          skin={t}
          selected={skinName === t.name}
          mode={resolvedTheme}
          onClick={() => setSkin(t.name)}
        />
      ))}
    </div>
  );
}

function SkinItem({
  skin,
  selected,
  mode,
  onClick,
}: {
  skin: (typeof skins)[number];
  selected: boolean;
  mode: "light" | "dark";
  onClick: () => void;
}) {
  const themeStyles = skin.cssVars[mode];
  const bgColor = colorFormatter(themeStyles.primary, "hsl", "4");
  return (
    <Button
      className={cn(
        "flex w-full h-full items-center justify-start relative transition-colors duration-200 bg-primary/10",
        "px-4 py-3",
        selected ? "ring-2 ring-primary/50 shadow-md" : "",
      )}
      variant="ghost"
      style={{
        backgroundColor: bgColor
          .replace("hsl", "hsla")
          .replace(/\s+/g, ", ")
          .replace(")", ", 0.10)"),
        color: themeStyles.foreground,
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-2.5 text-center">
        <div className="flex gap-1">
          <ColorBox color={themeStyles.primary} />
          <ColorBox color={themeStyles.secondary} />
          <ColorBox color={themeStyles.accent} />
        </div>
        <span className="capitalize px-1 leading-tight">{skin.title}</span>
      </div>
    </Button>
  );
}

const ColorBox = ({ color }: { color: string }) => {
  return (
    <div
      className="w-3 h-3 border border-black/80 dark:border-white/80"
      style={{ backgroundColor: color }}
    />
  );
};
