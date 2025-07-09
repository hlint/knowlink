"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Illustration } from "@prisma/client";
import { Loader2, SparklesIcon } from "lucide-react";
import Image from "next/image";
import defaultImg from "./img.jpg";

export default function IllustrationRenderer({
  illustration,
  busy,
  onRequestUpdate,
}: {
  illustration: Illustration | null;
  busy: boolean;
  onRequestUpdate: () => void;
}) {
  return (
    <div className="relative w-full rounded-md aspect-[4/1] bg-accent/50">
      {illustration && (
        <Image
          src={illustration?.src || defaultImg}
          alt="subcategory illustration"
          width={1600}
          height={400}
          quality={100}
          className={cn("rounded-md w-full")}
        />
      )}
      <ButtonUpdateIllustration busy={busy} onRequestUpdate={onRequestUpdate} />
    </div>
  );
}

function ButtonUpdateIllustration({
  busy,
  onRequestUpdate,
}: { onRequestUpdate: () => void; busy: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("absolute top-2 right-2 z-1 ", !busy && "hover-show")}
          onClick={() => {
            if (!busy) {
              onRequestUpdate();
            }
          }}
        >
          {busy ? <Loader2 className="animate-spin" /> : <SparklesIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        {busy
          ? "Generating illustration..."
          : "Generate a illustration for this page"}
      </TooltipContent>
    </Tooltip>
  );
}
