"use client";
import { SkinSelector } from "@/components/advance/skin/skin-selector";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useTheme from "@/hooks/use-theme";

export default function TabAppearance() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="prose prose-sm p-4 max-w-none">
      <h2>Color Scheme</h2>
      <div className="flex flex-1 flex-row gap-4">
        <RadioGroup
          id="theme"
          value={theme}
          onValueChange={setTheme}
          className="flex flex-row gap-4s"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="t1" />
            <Label htmlFor="t1">Light</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="t2" />
            <Label htmlFor="t2">Dark</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="t3" />
            <Label htmlFor="t3">System</Label>
          </div>
        </RadioGroup>
      </div>
      <h2>Palette</h2>
      <SkinSelector />
    </div>
  );
}
