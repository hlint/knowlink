"use client";

import type { Illustration } from "@prisma/client";
import * as emoji from "node-emoji";
import { useEffect, useRef, useState } from "react";
import { actionGetIllustration, actionUpdateIllustration } from "./actions";
import IllustrationRenderer from "./renderer";

export default function IllustrationComponent({
  name,
  details = "",
}: {
  name: string;
  details?: string;
}) {
  const [illustration, setIllustration] = useState<Illustration | null>(null);
  const [busy, setBusy] = useState(false);
  const refDetails = useRef(details);
  refDetails.current = details;
  const nameFixed = emoji.strip(name.trim());
  const pending = illustration?.pending;
  useEffect(() => {
    actionGetIllustration(nameFixed, refDetails.current).then(setIllustration);
  }, [nameFixed]);
  useEffect(() => {
    if (!pending) return;
    const interval = setInterval(() => {
      actionGetIllustration(nameFixed, refDetails.current).then(
        setIllustration,
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [nameFixed, pending]);
  return (
    <IllustrationRenderer
      illustration={illustration}
      busy={busy || !!illustration?.pending}
      onRequestUpdate={() => {
        setBusy(true);
        actionUpdateIllustration(nameFixed)
          .then(setIllustration)
          .finally(() => {
            setBusy(false);
          });
      }}
    />
  );
}
