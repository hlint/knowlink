"use client";

import Illustration from "@/app/(main)/components/illustration";
import ClientOnly from "@/components/advance/client-only";
import { Skeleton } from "@/components/ui/skeleton";
import useRootLayout from "@/hooks/use-root-layout";
import { useMemo } from "react";
import img_afternoon from "./img_afternoon.jpg";
import img_evening from "./img_evening.jpg";
import img_morning from "./img_morning.jpg";
import img_night from "./img_night.jpg";

export default function Greetings() {
  const { session } = useRootLayout();
  return (
    <ClientOnly
      fallback={<Skeleton className="aspect-[4/1] w-full rounded-md" />}
    >
      <GoodTime username={session.username} />
    </ClientOnly>
  );
}

function GoodTime({ username }: { username: string }) {
  const now = new Date();
  const hour = now.getHours();
  const message = useMemo(() => {
    const messages = {
      morning: {
        image: img_morning,
        text1: "Good morning",
        text2: "Dawn breaks with gentle light, a new day's promise bright",
      },
      afternoon: {
        image: img_afternoon,
        text1: "Good afternoon",
        text2: "Sunlight dances through the trees, carried by a gentle breeze",
      },
      evening: {
        image: img_evening,
        text1: "Good evening",
        text2:
          "Twilight whispers in the air, as day gives way to evening's care",
      },
      night: {
        image: img_night,
        text1: "Good night",
        text2: "Stars above in silent grace, guide you to a peaceful place",
      },
    };
    if (hour < 5) return messages.night;
    if (hour < 12) return messages.morning;
    if (hour < 17) return messages.afternoon;
    if (hour < 21) return messages.evening;
    return messages.night;
  }, [hour]);
  return (
    <div className="relative overflow-hidden rounded-md">
      <Illustration name={`${message.text1}-${message.text2}`} />
      <div className="absolute bottom-0 left-0 right-0 space-y-1 bg-gradient-to-t from-black/80 to-transparent p-4">
        <h3 className="text-2xl font-semibold text-white truncate">
          {message.text1}, {username}
        </h3>
        <p className="text-sm text-white truncate">{message.text2}</p>
      </div>
    </div>
  );
}
